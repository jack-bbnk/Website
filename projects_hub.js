const container = document.querySelector('.projects_container');
let allProjects = []; 

async function loadProjectsList() {
    try {
        const response = await fetch('projects/projects_list.json');
        allProjects = await response.json();
        
        renderCards(allProjects); 
        
    } catch (error) {
        console.error("Failed to load projects list:", error);
        container.innerHTML = "<p style='color: white;'>Failed to load projects.</p>";
    }
}

function renderCards(projectsArray) {
    container.innerHTML = ""; 

    if (projectsArray.length === 0) {
        container.innerHTML = "<p style='color: white;'>No projects found.</p>";
        return; 
    }

    projectsArray.forEach(project => {
        // Change href to project_details.html?id=${project.id}
        // When a previse project_details page has been made
        const cardHTML = `
            <a href="${project.site}" class="games_card_link">
                <div class="projects_card" style="background-image: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(17,17,17,0.8) 100%), url('${project.image}');">
                    <h2>${project.title}</h2>
                </div>
            </a>
        `;
        container.innerHTML += cardHTML;
    });
}

loadProjectsList();