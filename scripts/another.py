import csv
import json
from datetime import datetime

# List to store the converted data
data = []

# Read data from CSV file
with open('data.csv', mode='r', newline='', encoding='utf-8') as file:
    reader = csv.DictReader(file)
    for row in reader:
        # Convert Unix timestamp to datetime object
        transaction_time = datetime.utcfromtimestamp(int(row['Transaction ID'])).strftime('%Y-%m-%d %H:%M:%S')
        
        # Format total price with commas for thousands separators
        total_price = '{:,.0f}g'.format(int(row['Total Price'].strip('g').replace(',', '')))
        
        # Calculate item price (total price divided by item quantity)
        item_price = '{:,.0f}g'.format(int(row['Total Price'].strip('g').replace(',', '')) / int(row['Item Quantity']))
        
        # Append each row as a dictionary to the data list
        data.append({
            'Seller': row['Seller'],
            'Buyer': row['Buyer'],
            'Item Number': int(row['Item Number']),
            'Transaction Time': transaction_time,
            'Item Quantity': int(row['Item Quantity']),
            'Item Price': item_price,
            'Total Price': total_price,
            'Guild Name': row['Guild Name'],
            'Item Name': row['Item Name'],
            'Item Level': row['Item Level'],
            'Quality': row['Quality'],
            'Type': row['Type'],
            'Trait': row['Trait'],
            'Type2': row['Type2']
        })

# Sort data based on 'Transaction Time' in descending order
data.sort(key=lambda x: datetime.strptime(x['Transaction Time'], '%Y-%m-%d %H:%M:%S'), reverse=True)

# Write data to JSON file
with open('sellerdata.json', 'w') as json_file:
    json.dump(data, json_file, indent=4)

print("Data converted to JSON successfully.")
