async function populateProjects() {
    const projectSelect = document.getElementById('project'); // Get the <select> element
    try {
        const res = await fetch('api/projects'); // Fetch the projects from the API

        if (res.ok) {
            const data = await res.json(); // Parse the response as JSON
            const projects = data.values; // Access the array of projects from the `values` property

            projectSelect.innerHTML = '<option value="">Any</option>'; // Add a default "Any" option

            // Loop through the projects and add them as <option> elements
            projects.forEach(project => {
                const option = document.createElement('option');
                option.value = project.key; // Set the value attribute (e.g., "SUP")
                option.textContent = project.name; // Set the display text (e.g., "Support")
                projectSelect.appendChild(option); // Append the <option> to the <select>
            });

            if (projects.length === 0) {
                // Handle case where no projects are returned
                projectSelect.innerHTML = '<option value="">No projects available</option>';
            }
        } else {
            console.error('Failed API call with status:', res.status); // Debug the status code
            projectSelect.innerHTML = '<option value="">Failed to call API</option>'; // Show error message
        }
    } catch (error) {
        console.error('Error while fetching projects:', error); // Log the error to the console
        projectSelect.innerHTML = '<option value="">Error fetching projects</option>'; // Show error message
    }
}

async function populateStatuses() {
    const statusSelect = document.getElementById('status');
    const res = await fetch('/api/status');
    const statuses = await res.json();
    statusSelect.innerHTML = '<option value="">Any</option>';
    statuses.forEach(s => {
        statusSelect.innerHTML += `<option value="${s.name}">${s.name}</option>`;
    });
}

async function populateAssignees() {
    const projectKey = document.getElementById('project').value;
    const assigneeSelect = document.getElementById('assignee');
    if (!projectKey) {
        assigneeSelect.innerHTML = '<option value="">Any</option>';
        return;
    }
    const res = await fetch(`/api/assignees?project=${projectKey}`);
    const users = await res.json();
    assigneeSelect.innerHTML = '<option value="">Any</option><option value="currentUser()">Me</option><option value="unassigned">Unassigned</option>';
    users.forEach(u => {
        assigneeSelect.innerHTML += `<option value="${u.accountId}">${u.displayName}</option>`;
    });
}
    document.addEventListener('DOMContentLoaded', () => {
    populateProjects();
    populateStatuses();
    document.getElementById('project').onchange = populateAssignees;

    document.getElementById('loadReports').onclick = async function() {
        const table = document.getElementById('reportsTable');
        const thead = table.querySelector('thead');
        const tbody = table.querySelector('tbody');
        const message = document.getElementById('message');
        tbody.innerHTML = '';
        thead.innerHTML = '';
        message.textContent = 'Loading...';

        let jql = '';
        const reportType = document.getElementById('reportType').value;

        if (reportType === 'project') {
            jql = 'project=SUP'; // You may want to let the user pick the project here
        } else if (reportType === 'assigned') {
            jql = 'assignee=currentUser()';
        } else if (reportType === 'open') {
            jql = 'project=SUP AND statusCategory!=Done';
        } else if (reportType === 'custom') {
            // Build JQL from dropdowns
            const project = document.getElementById('project').value;
            const assignee = document.getElementById('assignee').value;
            const status = document.getElementById('status').value;
            let jqlParts = [];
            if (project) jqlParts.push(`project=${project}`);
            if (assignee) {
                if (assignee === "unassigned") {
                    jqlParts.push('assignee is EMPTY');
                } else {
                    jqlParts.push(`assignee=${assignee}`);
                }
            }
            if (status) jqlParts.push(`status="${status}"`);
            jql = jqlParts.join(' AND ');
            if (!jql) {
                message.textContent = 'Please select at least one filter.';
                table.style.display = 'none';
                return;
            }
        }

        try {
            // Fetch data from API
            const response = await fetch('/api/search?jql=' + encodeURIComponent(jql));
            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();
            if (!data.issues || data.issues.length === 0) {
                message.textContent = 'No issues match the selected filters. Please refine your criteria.';
                table.style.display = 'none';
                return;
            }

            // Populate table headers (Bootstrap classes added)
            thead.innerHTML = `
                <tr class="table-dark">
                    <th scope="col">Issue Key</th>
                    <th scope="col">Summary</th>
                    <th scope="col">Status</th>
                    <th scope="col">Assignee</th>
                </tr>
            `;

            // Populate table rows
            data.issues.forEach(issue => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${issue.key || 'N/A'}</td>
                    <td>${issue.fields.summary || 'No Summary'}</td>
                    <td>
                        <span class="badge ${
                            issue.fields.status?.name === 'Resolved' ? 'bg-success' : 
                            issue.fields.status?.name === 'In Progress' ? 'bg-warning' : 
                            issue.fields.status?.name === 'Blocked' ? 'bg-danger' : 'bg-secondary'
                        }">
                            ${issue.fields.status ? issue.fields.status.name : 'No Status'}
                        </span>
                    </td>
                    <td>${issue.fields.assignee ? issue.fields.assignee.displayName : 'Unassigned'}</td>
                `;
                tbody.appendChild(row);
            });

            // Ensure the table is displayed with Bootstrap formatting
            table.className = 'table table-striped table-hover table-bordered align-middle';
            table.style.display = 'table';
            message.textContent = '';
        } catch (err) {
            message.textContent = 'Error loading reports.';
            table.style.display = 'none';
        }
    };
});