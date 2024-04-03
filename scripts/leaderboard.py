import csv
import json
from datetime import datetime
import os

# Get the directory of the current script
current_directory = os.path.dirname(os.path.abspath(__file__))

# Change the working directory to the script directory
os.chdir(current_directory)

# Define the path to the CSV file
csv_file_path = os.path.join(current_directory, 'data.csv')

# Define time periods
time_periods = ['week', 'month', '90days', 'lifetime']

def get_most_recent_timestamp(data):
    # Sort the data by timestamp in descending order
    sorted_data = sorted(data, key=lambda x: int(x['Transaction ID']), reverse=True)
    # Extract the timestamp of the most recent transaction
    most_recent_timestamp = sorted_data[0]['Transaction ID']
    return most_recent_timestamp

def is_within_time_period(row, reference_timestamp, time_period):
    # Convert Unix timestamp to datetime object
    transaction_time = datetime.utcfromtimestamp(int(row['Transaction ID'])).strftime('%Y-%m-%d %H:%M:%S')
    
    # Convert reference timestamp to integer
    reference_timestamp = int(reference_timestamp)
    
    # Calculate time difference
    now = datetime.utcfromtimestamp(reference_timestamp)
    transaction_date = datetime.strptime(transaction_time, '%Y-%m-%d %H:%M:%S')
    time_difference = now - transaction_date
    
    # Check if the transaction is within the specified time period
    if time_period == 'week':
        return time_difference.days <= 7
    elif time_period == 'month':
        return time_difference.days <= 30
    elif time_period == '90days':
        return time_difference.days <= 90
    elif time_period == 'lifetime':
        return True  # All transactions are included in the lifetime period

# Read data from CSV file
with open(csv_file_path, mode='r', newline='', encoding='utf-8') as file:
    reader = csv.DictReader(file)
    data = list(reader)
    most_recent_timestamp = get_most_recent_timestamp(data)

    for time_period in time_periods:
        # Filter data based on time period
        filtered_data = [row for row in data if is_within_time_period(row, most_recent_timestamp, time_period)]
        
        # Calculate total price and sales tax for each seller in the filtered data
        seller_totals = {}
        for row in filtered_data:
            seller = row['Seller']
            total_price = int(row['Total Price'].strip('g').replace(',', ''))
            sales_tax = round(total_price * 0.035)
            if seller not in seller_totals:
                seller_totals[seller] = {'totalPrice': 0, 'salesTax': 0}
            seller_totals[seller]['totalPrice'] += total_price
            seller_totals[seller]['salesTax'] += sales_tax

        # Sort sellers by total price in descending order
        sorted_sellers = sorted(seller_totals.items(), key=lambda x: x[1]['totalPrice'], reverse=True)

        # Convert to JSON format with commas in large numbers
        data_json = json.dumps([{"name": seller, "totalPrice": "{:,}".format(details['totalPrice']), "salesTax": "{:,}".format(details['salesTax'])} for seller, details in sorted_sellers], indent=4)

        # Write to JSON file
        with open(f'{time_period}_seller_totals.json', 'w') as json_file:
            json_file.write(data_json)

print("Seller totals written to JSON files successfully.")
