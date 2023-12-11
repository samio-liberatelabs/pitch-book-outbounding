from bs4 import BeautifulSoup
import pandas as pd

with open('rand.html', 'r') as f:
    contents = f.read()

soup = BeautifulSoup(contents, 'lxml')

entities = soup.find_all('div', class_='custom-cell-format__fixed-entity')

first_column = [entity.text.strip() for entity in entities]

contents = soup.find_all('div', class_='cell-editable__content')

other_columns = {}
for content in contents:
    column_index = int(content.parent['data-column-index']) + 1
    row_index = int(content.parent['data-row-index'])
    text = content.text.strip()

    if column_index not in other_columns:
        other_columns[column_index] = [None] * len(first_column)

    other_columns[column_index][row_index] = text

df = pd.DataFrame({0: first_column})

for column_index in sorted(other_columns.keys()):
    df[column_index] = other_columns[column_index]

df.to_excel('pitchbook-data.xlsx', index=False)