const container = document.querySelector('.games_container');
let allGames = [];

async function loadGamesList() {
    try {
        const response = await fetch('game_reviews/games_list.json');
        allGames = await response.json();

        renderCards(allGames);
    } catch (error){
        console.error("Failed to load games list:", error);
        container.innerHTML = "<p>Failed to load games. Please try again later, or report the issue to jhbrooksbank227@gmail.com if the problem persists.</p>";
    }
}

function renderCards(gamesArray) {
    container.innerHTML = "";

    if(gamesArray.length === 0) {
        container.innerHTML = "<p style='color: white; width: 100%; text-align: center;'>Um... I haven't done whatever you're searching for (yet)</p>";
        return;
    }

    gamesArray.forEach(game => {
        const cardHTML = `
            <a href="game_reviews.html?game=${game.id}" class="games_card_link">
                <div class="games_card" style="background-image: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(17,17,17,0.8) 100%), url('${game.image}');">
                    <h2>${game.title}</h2>
                </div>
            </a>
        `;

        container.innerHTML += cardHTML;
    });
}

const searchInput = document.getElementById('game_search');

searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredGames = allGames.filter(game => {
        return game.title.toLowerCase().includes(searchTerm);
    });
    renderCards(filteredGames);
});

loadGamesList();