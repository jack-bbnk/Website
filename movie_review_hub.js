const container = document.querySelector('.games_container');
let allMovies = [];

async function loadMovieList() {
    try {
        const response = await fetch('movie_reviews/movie_list.json');
        allMovies = await response.json();

        renderCards(allMovies);
    } catch (error){
        console.error("Failed to load movies list:", error);
        container.innerHTML = "<p>Failed to load movies. Please try again later, or report the issue to jhbrooksbank227@gmail.com if the problem persists.</p>";
    }
}

function renderCards(moviesArray) {
    container.innerHTML = "";

    if(moviesArray.length === 0) {
        container.innerHTML = "<p style='color: white; width: 100%; text-align: center;'>Um... I haven't done whatever you're searching for (yet)</p>";
        return;
    }

    moviesArray.forEach(movie => {
        const cardHTML = `
            <a href="movie_reviews.html?movie=${movie.id}" class="games_card_link">
                <div class="games_card" style="background-image: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(17,17,17,0.8) 100%), url('${movie.image}');">
                    <h2>${movie.title}</h2>
                </div>
            </a>
        `;

        container.innerHTML += cardHTML;
    });
}

const searchInput = document.getElementById('game_search');

searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredMovies = allMovies.filter(movie => {
        return movie.title.toLowerCase().includes(searchTerm);
    });
    renderCards(filteredMovies);
});

loadMovieList();