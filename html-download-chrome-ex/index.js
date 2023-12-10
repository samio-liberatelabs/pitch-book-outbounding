const magicButtonElement = document.getElementById('magicButton');

magicButtonElement.addEventListener('click', () => {
    const checkElement = document.querySelector('.js-check');
    checkElement.innerHTML = 'Scraping started!';

    startScraping();
})

function startScraping() {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        const activeTab = tabs[0];
        tabUrl = activeTab.url;
        console.log(tabUrl);

        let result;
        try {
            [{ result }] = await chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                function: () => document.documentElement.innerHTML,
            });
        } catch (e) {
            return;
        }

        // Create a Blob with the HTML content
        const blob = new Blob([result], { type: 'text/html' });

        // Create a link element
        const link = document.createElement('a');

        // Set the href attribute of the link to the Blob object
        link.href = URL.createObjectURL(blob);

        // Set the download attribute to the desired file name
        link.download = 'rand.html';

        // Append the link to the document
        document.body.appendChild(link);

        // Trigger a click on the link to start the download
        link.click();

        // Remove the link from the document
        document.body.removeChild(link);
    });
}
