import os
import requests
from requests.auth import HTTPBasicAuth
from dotenv import load_dotenv 

# Load environment variables from .env
load_dotenv(dotenv_path='.venv/.env')

JIRA_URL = os.getenv('JIRA_URL') + f'search?jql=project="{os.getenv("JIRA_PROJECT_KEY")}"'
JIRA_USERNAME = os.getenv('JIRA_USERNAME')
JIRA_API_TOKEN = os.getenv('JIRA_API_TOKEN')

auth = HTTPBasicAuth(JIRA_USERNAME, JIRA_API_TOKEN)
headers = {
    "Accept": "application/json"
    
}
def Get_issues():
    response = requests.get(JIRA_URL, headers=headers, auth=auth)
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()  # Raise an error for bad responses


