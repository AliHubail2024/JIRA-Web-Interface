const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config({ path: '.venv/.env' });

const app = express();
app.use(cors());
app.use(express.json());

// Helper function to call Jira API
async function callJiraApi(endpoint) {
    const jiraUrl = process.env.JIRA_URL + endpoint;
    const authString = Buffer.from(`${process.env.JIRA_USERNAME}:${process.env.JIRA_API_TOKEN}`).toString('base64');
    const response = await fetch(jiraUrl, {
        headers: {
            'Authorization': `Basic ${authString}`,
            'Accept': 'application/json'
        }
    });
    if (!response.ok) throw new Error(`Jira API error: ${response.status} ${response.statusText}`);
    return response.json();
}

// API endpoints

// Get the project list
app.get('/api/projects', async (req, res) => {
    try {
        const data = await callJiraApi('project/search');
        res.json(data.values || []);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects', details: error.message });
    }
});



// Get the user in project
app.get('/api/assignees', async (req, res) => {
    try {
        const projectKey = req.query.project;
        if (!projectKey) return res.status(400).json({ error: 'Missing project key' });
        const data = await callJiraApi(`user/assignable/search?project=${projectKey}`);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch assignees', details: error.message });
    }
});


// get the status list
app.get('/api/statuses', async (req, res) => {
    try {
        const data = await callJiraApi('status');
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch statuses', details: error.message });
    }
});


// Get list of issues by JQL
// Example JQL: project = "SUP" AND status = "Open"
app.get('/api/search', async (req, res) => {
    try {
        const jql = req.query.jql;
        console.log('JQL:', jql);
        if (!jql) return res.status(400).json({ error: 'Missing JQL query parameter.' });
        const data = await callJiraApi(`search?jql=${encodeURIComponent(jql)}`);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch Jira issues by JQL', details: error.message });
    }
});

app.post('/api/create-issue', async (req, res) => {
    try {
        const { project, summary, description, assignee, issueType, priority } = req.body;
        const jiraUrl = process.env.JIRA_URL + 'issue';
        const authString = Buffer.from(`${process.env.JIRA_USERNAME}:${process.env.JIRA_API_TOKEN}`).toString('base64');
        const payload = {
            fields: {
                project: { key: project },
                summary,
                description,
                issuetype: { id: issueType },
                priority: { name: priority }
            }
        };
        if (assignee) {
            payload.fields.assignee = { id: assignee };
        }
        const response = await fetch(jiraUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${authString}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!response.ok) {
            return res.status(response.status).json({ error: data.errorMessages ? data.errorMessages.join(', ') : 'Failed to create issue' });
        }
        res.json({ key: data.key });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create issue', details: error.message });
    }
});

// Get issue types for a project
app.get('/api/issuetypes', async (req, res) => {
    try {
        const projectKey = req.query.project;
        if (!projectKey) return res.status(400).json({ error: 'Missing project key' });
        const data = await callJiraApi(`project/${projectKey}`);
        res.json(data.issueTypes || data.issueTypes || data.issueTypes || []);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch issue types', details: error.message });
    }
});

app.get('/api/priorities', async (req, res) => {
    try {
        const data = await callJiraApi('priority');
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch priorities', details: error.message });
    }
});

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});