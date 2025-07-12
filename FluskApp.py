from flask import Flask, render_template
from jira_service import *
from flask import request, jsonify
import urllib.parse

# Import necessary modules
# from flask import Flask, render_template, request, jsonify
# Create the Flask application
app = Flask(__name__)


# Define a route for the login page
@app.route('/login')
def login():
    # Here you would typically handle the login logic, like checking credentials
    # For now, we just render the login template
    # You can also pass any necessary data to the template
    # For example, you might want to pass a message or an error
    # return render_template('login.html', message="Please log in")
    # For now, we just render the login template
    # You can also pass any necessary data to the template
    # For example, you might want to pass a message or an error
    # return render_template('login.html', message="Please log in")
    # For now, we just render the login template
    
    return render_template('login.html')    



# Define a route for the home page
@app.route('/')
def index():
    return render_template('index.html')

# Define another route
@app.route('/Reports')
def Reports():
    return render_template('reports.html')

# Add this route for the Create Issue page
@app.route('/CreateIssue')
def create_issue_Page():
    return render_template('CreateIssue.html')

# Define a route for the dashboard
@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/test')
def test():
    return render_template('test.html')

# Define a route for the logout page
@app.route('/logout')
def logout():
    # Here you would typically handle the logout logic, like clearing session data
    return render_template('logout.html')


# API section

@app.route("/api/projects")
def fetch_project_list():
    projects_list=get_projects()
    if projects_list:
        return jsonify(projects_list),200
    return jsonify({"error:" : "Failed to get the project list"}),500






@app.route('/api/currentuser', methods=['GET'])
def fetch_Current_user_info():
    """
    Get details of the authenticated user from Jira.
    """
    user_info = get_Current_user_info()
    if user_info:
        return jsonify(user_info), 200
    return jsonify({"error": "Failed to fetch user info"}), 500


@app.route('/api/issues', methods=['GET'])
def fetch_issues():
    """
    Get all issues assigned to the authenticated Jira user.
    """
    issues = get_issues()
    if issues:
        return jsonify(issues), 200
    return jsonify({"error": "Failed to fetch issues"}), 500




@app.route('/api/search', methods=['GET'])
def fetch_issueslist_jql():
    """
    Fetch a list of issues from JIRA based on the provided JQL query passed as a query parameter.
    """
    try:
        # Get the JQL from the query parameters
        jql = request.args.get('jql')
        if not jql:
            return jsonify({"error": "Missing JQL query parameter."}), 400

        # Decode the JQL (if it was URL-encoded)
        decoded_jql = urllib.parse.unquote(jql)
        print(f"Received JQL: {decoded_jql}")  # Debugging log

        # Fetch issues from JIRA
        issuelist = get_issuelist_jql(decoded_jql)

        # Check if issues were retrieved successfully
        if issuelist:
            return jsonify(issuelist), 200

        # If no issues or an error occurred
        return jsonify({"error": "Failed to fetch issues for the given JQL."}), 404

    except Exception as e:
        # Handle unexpected errors
        return jsonify({"error": "An unexpected error occurred.", "details": str(e)}), 500



@app.route('/api/issues', methods=['POST'])
def create_new_issue():
    """
    Create a new Jira issue.
    Request body example:
    {
        "project_key": "PROJ",
        "summary": "Issue summary",
        "description": "Issue description",
        "issue_type": "Bug"
    }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body is missing"}), 400

        required_fields = ["project_key", "summary", "description", "issue_type"]
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

        issue = create_issue(data)
        if issue:
            return jsonify(issue), 201
        return jsonify({"error": "Failed to create issue"}), 500
    except Exception as e:
        return jsonify({"error": "An error occurred while creating the issue", "details": str(e)}), 500


@app.route('/api/assignees', methods=['GET'])
def fetch_assignable_users():
    """
    Get assignable users for a specific Jira project.
    Query parameter example: ?project=PROJ
    """
    project_key = request.args.get('project')
    if not project_key:
        return jsonify({"error": "Missing project key in query parameters"}), 400

    users = get_assignable_users(project_key)
    if users:
        return jsonify(users), 200
    return jsonify({"error": "Failed to fetch assignable users"}), 500






# Run the application
if __name__ == '__main__':
    app.run(debug=True)