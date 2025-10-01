import os
import requests
from bs4 import BeautifulSoup
import time

def download_image(url, folder_path, filename):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            file_path = os.path.join(folder_path, filename)
            with open(file_path, 'wb') as f:
                f.write(response.content)
            print(f'Successfully downloaded {filename}')
        else:
            print(f'Failed to download {filename}: Status code {response.status_code}')
    except Exception as e:
        print(f'Error downloading {filename}: {str(e)}')

def main():
    # Create images directory if it doesn't exist
    images_path = os.path.join('frontend', 'assets', 'images')
    os.makedirs(images_path, exist_ok=True)

    # Define the source website URL
    base_url = 'https://websitedemos.net/book-store-04'

    # Try to fetch the main page
    try:
        response = requests.get(base_url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find all image elements
            images = soup.find_all('img')
            
            # Download each image
            for img in images:
                src = img.get('src')
                if src and (src.endswith('.jpg') or src.endswith('.png')):
                    filename = src.split('/')[-1]
                    download_image(src, images_path, filename)
                    time.sleep(1)  # Be nice to the server
            
            print('Image download completed!')
        else:
            print(f'Failed to access website: Status code {response.status_code}')
    except Exception as e:
        print(f'Error accessing website: {str(e)}')

if __name__ == '__main__':
    main()