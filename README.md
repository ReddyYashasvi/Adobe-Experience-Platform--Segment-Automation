# AEP-Segment-Automation
Automated fetching and updating of Adobe Experience Platform (AEP) segment definitions using Jupyter Notebooks for OAuth 2.0 authentication and Google Sheets creation, and Google Apps Script for periodic updates. Enhanced data accuracy, accessibility, and reporting, supporting informed decision-making.


## Prerequisites

1. **Download and Install Jupyter Notebooks**
   - Follow the instructions to install Jupyter Notebooks from [Jupyter's official website](https://jupyter.org/install).

## Setup

2. **Install Packages**
   ```sh
   pip install ipykernel
   pip install requests
   pip install Authlib
   pip install pandas
   pip install pyarrow

3. Create a file called config.ini and enter you credentials 


Fill in the client_id and client_secret in the sample.ini file:
   [oauths2s]
client_id = AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
client_secret = AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

4. Run the Python Script (path 2 gsheets)
This script handles the OAuth 2.0 authentication, fetches segment definitions from the Adobe Experience Platform, and creates a Google Sheet with the data.


     Code Description

     The Python script handles the following tasks:

     Loads configuration settings from a config.ini file.
     Authenticates with the Adobe Experience Platform using OAuth 2.0.
     Fetches segment definitions from the Adobe Experience Platform API.
     Processes and saves the API response.
     Filters the data and creates a DataFrame with specified columns.
     Authenticates with Google Sheets using OAuth 2.0.
     Creates or opens a Google Sheet named "Segment Definitions" and sends it to whose email is in the code 
     ** Remember to change the email to your email address under "# Creates or opens the Google Sheet " for access to the Google Sheet **
     Clears existing content in the sheet and writes the filtered data to it.


5. Transition to Google Apps Script
After setting up the Jupyter Notebooks portion, the next step involves using Google Apps Script to automate the update of the Google Sheet with the segment definitions. The Google Apps Script will be responsible for fetching updated data and appending it to the Google Sheet on a scheduled basis.

Google Apps Script Setup

Access the 'Segment Defintions' sheet through your email
Click on Extensions in the toolbar > AppScripts
In AppScripts, click the '+' next to file to add a new script
Copy the content of your Google Apps Script code and paste it into the script editor.
 
     Code Description


     The Google Apps Script portion of this project automates the updating of the Google Sheet with the latest segment definitions. The       script performs the following tasks:

     Authenticates with Adobe Experience Platform using OAuth 2.0.
     Fetches segment definitions from the API.
     Handles pagination to ensure all segment definitions are fetched.
     Appends the fetched data to the existing Google Sheet on a scheduled basis.



 







