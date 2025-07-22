import os
import requests
from requests.auth import HTTPBasicAuth
from dotenv import load_dotenv
import urllib.parse

# Load environment variables from .env
load_dotenv(dotenv_path='.venv/.env')

# Jira credentials and base URL
JIRA_BASE_URL = os.getenv('JIRA_URL')
JIRA_USERNAME = os.getenv('JIRA_USERNAME')
JIRA_API_TOKEN = os.getenv('JIRA_API_TOKEN')

# Ensure the environment variables are loaded properly
if not JIRA_BASE_URL or not JIRA_USERNAME or not JIRA_API_TOKEN:
    raise ValueError("Missing Jira configuration in environment variables")

# Headers for Jira REST API requests
HEADERS = {
    "Content-Type": "application/json",
}

# HTTP Basic Auth
AUTH = HTTPBasicAuth(JIRA_USERNAME, JIRA_API_TOKEN)

# Helper function to call Jira API
def call_jira_api(endpoint):
    """
    Generic function to call the Jira API.
    :param endpoint: API endpoint to call (e.g., 'user/assignable/search?project=KEY').
    :return: JSON response or None if the request fails.
    """
    url = f"{JIRA_BASE_URL}{endpoint}"
    print(url)
    try:
        response = requests.get(url, headers=HEADERS, auth=AUTH)
        response.raise_for_status()  # Raise an HTTPError for bad responses (4xx and 5xx)
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error calling Jira API: {str(e)}")
        return None



# to get the project list
def get_projects():
    """
    Fetch the list of jira projects
    :return:JSON reponse contain the project list 
    """
    endpoint = "project/search"
    return call_jira_api(endpoint)

# Get the user in project
def get_assignable_users(project_key):
    """
    Fetch the list of assignable users for a given Jira project.
    :param project_key: The key of the Jira project (e.g., 'PROJ').
    :return: List of users or None if the request fails.
    """
    endpoint = f"user/assignable/search?project={project_key}"
    return call_jira_api(endpoint)

# get the status list
def get_status_list():
    """
    Fetch the list of the status
    """
    endpoint = "status"
    return call_jira_api(endpoint)

# Function to fetch issues using JQL
def get_issuelist_jql(jql):
    """
    Fetch issues from JIRA using JQL.
    :param jql: JIRA Query Language string.
    :return: JSON response with the list of issues.
    """
    endpoint = f"search?jql={urllib.parse.quote(jql)}"  # URL-encode the JQL query
    return call_jira_api(endpoint)


def get_issues():
    """
    Fetch all issues assigned to the authenticated user.
    :return: JSON response containing issues or None if the request fails.
    """
    endpoint = "search"
    return call_jira_api(endpoint)


# To get the Current user 
def get_Current_user_info():
    """
    Fetch details of the authenticated user.
    :return: JSON response containing user info or None if the request fails.
    """
    endpoint = "myself"
    return call_jira_api(endpoint)

# To Crea new Issue in jira
def create_issue(data):
    """
    Create a new issue in Jira.
    :param data: JSON payload containing issue details.
    :return: JSON response of the created issue or None if the request fails.
    """
    url = f"{JIRA_BASE_URL}/rest/api/3/issue"
    payload = {
        "fields": {
            "project": {"key": data.get("project_key")},
            "summary": data.get("summary"),
            "description": data.get("description"),
            "issuetype": {"name": data.get("issue_type")},
        }
    }
    try:
        response = requests.post(url, headers=HEADERS, auth=AUTH, json=payload)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error creating issue: {str(e)}")
        return None
