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
    row['Transaction Time'] = transaction_time  # Add a new column for transaction time
    
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

    for row in data:
        # Calculate item price
        total_price = float(row['Total Price'].rstrip('g'))  # Remove 'g' and convert to float
        item_quantity = int(row['Item Quantity'])
        item_price = total_price / item_quantity
        if item_price >= 1000:
            row['Item Price'] = '{:,.0f}'.format(item_price) + 'g'  # Format with commas
        else:
            row['Item Price'] = '{:d}'.format(int(item_price)) + 'g'

        # Calculate sales tax
        sales_tax = round(total_price * 0.035)
        row['Sales Tax'] = '{:,.0f}'.format(sales_tax) + 'g'  # Format with commas

        # Format Total Price with commas
        total_price_float = float(total_price)
        if total_price_float >= 1000:
            row['Total Price'] = '{:,.0f}'.format(total_price_float) + 'g'  # Format with commas
        else:
            row['Total Price'] = '{:d}'.format(int(total_price_float)) + 'g'

    for time_period in time_periods:
        # Filter data based on time period
        filtered_data = [row for row in data if is_within_time_period(row, most_recent_timestamp, time_period)]

        # Write filtered data to JSON file
        with open(f'{time_period}.json', 'w') as json_file:
            json.dump(filtered_data, json_file, indent=4)

print("Data written to JSON files successfully.")
