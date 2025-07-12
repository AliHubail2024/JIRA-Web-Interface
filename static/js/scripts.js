// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    console.log("Script is loaded and DOM is ready!");

    // Example: Add a click event listener to the "View Assignees" button
    const viewAssigneesButton = document.querySelector(".btn-primary");
    if (viewAssigneesButton) {
        viewAssigneesButton.addEventListener("click", (event) => {
            console.log("View Assignees button clicked!");
            // You can add more functionality here, such as animations or API calls
        });
    }

    // Example: Fetch data from an API endpoint and display it
    async function fetchAssignees(projectKey) {
        try {
            const response = await fetch(`/api/assignees?project=${projectKey}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Fetched assignees:", data);
            displayAssignees(data);
        } catch (error) {
            console.error("Error fetching assignees:", error.message);
            alert("Failed to fetch assignees. Please try again later.");
        }
    }

    // Example: Display fetched assignees in a list
    function displayAssignees(assignees) {
        const assigneeList = document.getElementById("assignee-list");
        if (assigneeList) {
            assigneeList.innerHTML = ""; // Clear the list before adding items
            assignees.forEach((assignee) => {
                const listItem = document.createElement("li");
                listItem.textContent = assignee.displayName || "Unknown Assignee";
                assigneeList.appendChild(listItem);
            });
        }
    }

    // Example: Trigger API call when a project key is submitted
    const projectForm = document.getElementById("project-form");
    if (projectForm) {
        projectForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const projectKey = document.getElementById("project-key").value.trim();
            if (projectKey) {
                console.log(`Fetching assignees for project: ${projectKey}`);
                fetchAssignees(projectKey);
            } else {
                alert("Please enter a project key.");
            }
        });
    }
});