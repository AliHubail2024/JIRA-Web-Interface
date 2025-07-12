# **JIRA Application**

A web-based application for fetching and displaying JIRA reports with customizable filters and dynamic table views. Built with Python (Flask), JavaScript, and Bootstrap.

---

## **Features**

- Fetch JIRA data using JIRA APIs.
- Filter data by projects, assignees, statuses, and custom fields.
- Dynamically display data in a responsive, sortable table.
- Customize visible table columns using checkboxes.
- Lightweight and easy to deploy.

---

## **Table of Contents**

- [Features](#features)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## **Getting Started**

Follow these instructions to set up and run the JIRA application on your local machine.

---

## **Installation**

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/jira-application.git
   cd jira-application

2. **Set Up a Virtual Environment**


    ```bash
    python -m venv venv
    source venv/bin/activate   # macOS/Linux
    venv\Scripts\activate      # Windows
    
3. **Install Dependencies**  

    * Create a .env file in the project root directory.
    * Add the following variables
    
4. **Set Up Environment Variables**

    ```plaintext
    JIRA_BASE_URL=https://your-jira-instance.atlassian.net
    JIRA_API_TOKEN=your_api_token
    JIRA_EMAIL=your_email@example.com
    
5. **Run the Application**

    ```bash
    flask run
    
