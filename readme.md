*JIRA Application*


A web-based application for fetching and displaying JIRA reports with customizable filters and dynamic table views. Built with Python (Flask), JavaScript, and Bootstrap.

Features
Fetch JIRA data using JIRA APIs.
Filter data by projects, assignees, statuses, and custom fields.
Dynamically display data in a responsive, sortable table.
Customize visible table columns using checkboxes.
Lightweight and easy to deploy.
Table of Contents
Features
Getting Started
Installation
Usage
Environment Variables
Contributing
License
Getting Started
Follow these instructions to set up and run the JIRA application on your local machine.

Installation
Clone the Repository

bash
Copy
git clone https://github.com/your-username/jira-application.git
cd jira-application
Set Up a Virtual Environment

bash
Copy
python -m venv venv
source venv/bin/activate   # macOS/Linux
venv\Scripts\activate      # Windows
Install Dependencies

bash
Copy
pip install -r requirements.txt
Set Up Environment Variables

Create a .env file in the project root directory.
Add the following variables:
plaintext
Copy
JIRA_BASE_URL=https://your-jira-instance.atlassian.net
JIRA_API_TOKEN=your_api_token
JIRA_EMAIL=your_email@example.com
Run the Application

bash
Copy
flask run
Access the Application

Open your browser and go to: http://localhost:5000
Usage
Select Report Type:

Choose from predefined report types: All Issues in Project, Assigned to Me, Open Issues, or Custom Filters.
Apply Filters:

Use dropdown menus to filter by Project, Assignee, and Status.
Customize Table View:

Use checkboxes to show or hide specific columns in the table.
Load Reports:

Click the Load Reports button to fetch and display JIRA data.
Environment Variables
The application requires the following environment variables to connect to your JIRA instance:

Variable	Description
JIRA_BASE_URL	Base URL of your JIRA instance.
JIRA_API_TOKEN	API token for authentication.
JIRA_EMAIL	Email associated with your JIRA account.
Note: You can generate the API token from your JIRA account settings.

File Structure
plaintext
Copy
jira-application/
├── static/
│   ├── css/                # Custom CSS files
│   ├── js/                 # JavaScript files
├── templates/
│   ├── base.html           # Base layout
│   ├── index.html          # Main page
├── .env                    # Environment variables
├── app.py                  # Application entry point
├── requirements.txt        # Python dependencies
├── README.md               # Project documentation
Technologies Used
Backend: Flask (Python)
Frontend: HTML, CSS (Bootstrap 5.3.0), JavaScript
API: JIRA REST API
Database: None (uses API calls directly)
Contributing
Contributions are welcome! Follow these steps to contribute:

Fork the repository.
Create a new branch.
bash
Copy
git checkout -b feature-name
Commit your changes.
bash
Copy
git commit -m "Add feature-name"
Push the changes to your branch.
bash
Copy
git push origin feature-name
Create a Pull Request.
License
This project is licensed under the MIT License. See the LICENSE file for details.

Contact
For questions or support, feel free to reach out:

Email: your-email@example.com
GitHub: your-username
Let me know if you'd like to customize this further! 😊
