const columns = {
    key: { label: "Issue Key", get: issue => issue.key },
    summary: { label: "Summary", get: issue => issue.fields.summary },
    status: { label: "Status", get: issue => issue.fields.status ? issue.fields.status.name : "" },
    assignee: { label: "Assignee", get: issue => issue.fields.assignee ? issue.fields.assignee.displayName : "Unassigned" },
    duedate: { label: "Due Date", get: issue => issue.fields.duedate || "" },
    created: { label: "Created", get: issue => issue.fields.created ? new Date(issue.fields.created).toLocaleString() : "" },
    updated: { label: "Updated", get: issue => issue.fields.updated ? new Date(issue.fields.updated).toLocaleString() : "" },
    priority: { label: "Priority", get: issue => issue.fields.priority ? issue.fields.priority.name : "" },
    reporter: { label: "Reporter", get: issue => issue.fields.reporter ? issue.fields.reporter.displayName : "" },
    resolution: { label: "Resolution", get: issue => issue.fields.resolution ? issue.fields.resolution.name : "" }
};

function getSelectedColumns() {
    return Array.from(document.querySelectorAll('.col-toggle:checked')).map(cb => cb.value);
}

function renderTableHead(selectedCols) {
    const headRow = document.getElementById('tableHead');
    headRow.innerHTML = '';
    selectedCols.forEach(col => {
        const th = document.createElement('th');
        th.textContent = columns[col].label;
        headRow.appendChild(th);
    });
}

function renderTableBody(issues, selectedCols) {
    const tbody = document.querySelector('#reportsTable tbody');
    tbody.innerHTML = '';
    issues.forEach(issue => {
        const row = document.createElement('tr');
        selectedCols.forEach(col => {
            const td = document.createElement('td');
            td.textContent = columns[col].get(issue);
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
}


function test() {
    console.log("Test function called");
    return populateProjects();
    
}
async function populateProjects() {
    const res = await fetch('/api/projects');
    const projects = await res.json();
    const projectSelect = document.getElementById('project');
    projectSelect.innerHTML = '';
    projects.forEach(p => {
        projectSelect.innerHTML += `<option value="${p.key}">${p.name}</option>`;
    });
    await populateIssueTypes();
    await populateAssignees();
}
async function populateStatuses() {
    const statusSelect = document.getElementById('status');
    const res = await fetch('http://localhost:5000/api/statuses');
    const statuses = await res.json();
    statusSelect.innerHTML = '<option value="">Any</option>';
    statuses.forEach(s => {
        statusSelect.innerHTML += `<option value="${s.name}">${s.name}</option>`;
    });
}

async function populateIssueTypes() {
    const projectKey = document.getElementById('project').value;
    if (!projectKey) return;
    const res = await fetch(`/api/issuetypes?project=${projectKey}`);
    const types = await res.json();
    const issueTypeSelect = document.getElementById('issueType');
    issueTypeSelect.innerHTML = '';
    types.forEach(type => {
        issueTypeSelect.innerHTML += `<option value="${type.id}">${type.name}</option>`;
    });
}
async function populatePriorities() {
    const res = await fetch('/api/priorities');
    const priorities = await res.json();
    const prioritySelect = document.getElementById('priority');
    prioritySelect.innerHTML = '';
    priorities.forEach(p => {
        prioritySelect.innerHTML += `<option value="${p.name}">${p.name}</option>`;
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

        // Show/hide custom filters
        const reportType = document.getElementById('reportType');
        const customFilters = document.getElementById('customFilters');
        reportType.onchange = function() {
            if (reportType.value === 'custom') {
                customFilters.style.display = '';
            } else {
                customFilters.style.display = 'none';
            }
        };

        // Column toggling
        document.querySelectorAll('.col-toggle').forEach(cb => {
            cb.onchange = () => {
                const table = document.getElementById('reportsTable');
                if (table.style.display !== 'none') {
                    renderTableHead(getSelectedColumns());
                    renderTableBody(window.lastIssues || [], getSelectedColumns());
                }
            };
        });

        // Load reports
        document.getElementById('loadReports').onclick = async function() {
            const table = document.getElementById('reportsTable');
            const message = document.getElementById('message');
            const selectedCols = getSelectedColumns();

            // Build JQL based on selection
            let jql = '';
            if (reportType.value === 'project') {
                jql = 'project=SUP'; // Replace SUP with your project key or use a variable if needed
            } else if (reportType.value === 'assigned') {
                jql = 'assignee=currentUser()';
            } else if (reportType.value === 'open') {
                jql = 'project=SUP AND statusCategory!=Done'; // Replace SUP as needed
            } else if (reportType.value === 'custom') {
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

            message.textContent = 'Loading...';
            table.style.display = 'none';

            try {
                const response = await fetch('/api/search?jql=' + encodeURIComponent(jql));
                if (!response.ok) throw new Error('Failed to fetch data');
                const data = await response.json();
                if (!data.issues || data.issues.length === 0) {
                    message.textContent = 'No reports found.';
                    table.style.display = 'none';
                    return;
                }
                window.lastIssues = data.issues; // Store for column toggling
                renderTableHead(selectedCols);
                renderTableBody(data.issues, selectedCols);
                table.style.display = '';
                message.textContent = '';
            } catch (err) {
                message.textContent = 'Error loading reports.';
                table.style.display = 'none';
            }
        };
    })


;
