//Initialising
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('movie'); 
const audioSource = document.getElementById('audio-player');

async function loadReviewData() {

    try {
        const jsonResponse = await fetch(`movie_reviews/${movieId}.json`);

        if (!jsonResponse.ok){
            throw new Error("Review data not found");
        }

        const movieData = await jsonResponse.json();

        const mdResponse = await fetch(`movie_reviews/${movieId}.md`);
        const markdownText = await mdResponse.text();

        document.querySelector('.movie_title').innerText = movieData.title;
        document.querySelector('.movie_subtitle').innerText = movieData.subtitle;
        document.querySelector('.movie_score_word').innerText = movieData.scoreWord;

        if (movieData.songTitle) {
            document.getElementById('song-title-display').innerText = `Now Playing: ${movieData.songTitle}`;
        }
        else{
            document.getElementById('song-title-display').innerText = "No song for this page!"; 
            document.querySelector('.custom-controls-wrapper').style.display = "none"; 
        }

        audioSource.src = `audio/${movieId}.mp3`;
        
        document.querySelector('.movie_score_word').innerText = movieData.scoreWord;

        const movieRating = movieData.rating;
        const fullStars = Math.floor(movieRating);
        const halfStar = (movieRating % 1 !== 0) ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;

        let starsHTML = '';
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star movie-star-icon"></i>';
        }
        if (halfStar) {
            starsHTML += '<i class="fas fa-star-half-stroke movie-star-icon"></i>';
        }
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="fa-regular fa-star movie-star-icon"></i>';
        }

        document.getElementById('movie-stars-zone').innerHTML = starsHTML;

        const markdownZone = document.getElementById('markdown-injector-zone');
        markdownZone.innerHTML = marked.parse(markdownText);
        
        initializeInteractiveElements(); 
    } catch (error) {
        console.error(error);
        document.querySelector('.movie_title').innerText = "Review Not Found";
        document.querySelector('.movie_subtitle').innerText = "Damn, I don't think I've reviewed this one (yet...)";
    }
    
}

function initializeInteractiveElements() {
    const movieContainer = document.querySelector('.movie_score_container');
    
    const word = document.querySelector('.movie_score_word');
    
    const stars = document.querySelectorAll('.movie-star-icon');

    const reviewObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                
                word.classList.add('movie-word-animate');

                stars.forEach((star, index) => {
                    setTimeout(() => {
                        star.classList.add('star-animate');
                    }, index * 200); 
                });

                reviewObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (movieContainer) {
        reviewObserver.observe(movieContainer);
    }
}

if (movieId) {
    loadReviewData();
} else{
    document.querySelector('.movie_title').innerText = "No movie Selected";
    document.querySelector('.movie_subtitle').innerText = "I think ya missed something";
}



