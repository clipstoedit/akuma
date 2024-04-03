import csv
import requests
from bs4 import BeautifulSoup
import os

# Define the base URL
base_url = "https://esoicons.uesp.net"

# Define the URL template
url_template = "https://mwmodding.uesp.net/esolog/itemLink.php?itemid={}&summary&"

# Define the directory to save images
image_directory = "item_images"

# Create the directory if it doesn't exist
os.makedirs(image_directory, exist_ok=True)

# Function to scrape image URL from the page
def scrape_image_url(item_number):
    url = url_template.format(item_number)
    print("Scraping URL:", url)
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, "html.parser")
        icon_url = soup.find("img", id="esoil_rawdata_iconimage")
        if icon_url:
            image_src = icon_url.get("src").lstrip('/')  # Remove leading slashes from the URL
            image_url = image_src if image_src.startswith("http") else "https://" + image_src
            print("Image URL found:", image_url)
            return image_url
    print("No image URL found.")
    return None


# Get the directory of the current script
current_directory = os.path.dirname(os.path.abspath(__file__))

# Change the working directory to the script directory
os.chdir(current_directory)

# Define the path to the CSV file
csv_file_path = os.path.join(current_directory, 'data.csv')

# Define a set to store processed item numbers
processed_items = set()

# Read data from CSV file
with open(csv_file_path, mode='r', newline='', encoding='utf-8') as file:
    reader = csv.DictReader(file)
    for row in reader:
        item_number = row["Item Number"]
        # Skip if item number has already been processed
        if item_number in processed_items:
            print(f"Skipping duplicate item number {item_number}")
            continue
        image_url = scrape_image_url(item_number)
        if image_url:
            # Ensure the directory exists
            os.makedirs(image_directory, exist_ok=True)
            # Download and save the image
            image_response = requests.get(image_url)
            if image_response.status_code == 200:
                image_extension = os.path.splitext(image_url)[1]  # Get the file extension from the URL
                image_path = os.path.join(image_directory, f"{item_number}{image_extension}")
                with open(image_path, "wb") as img_file:
                    img_file.write(image_response.content)
                print(f"Image downloaded for item number {item_number}")
                # Add item number to processed set
                processed_items.add(item_number)
        else:
            print(f"No image found for item number {item_number}")
