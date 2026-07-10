//Initialising
const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get('game'); 

async function loadReviewData() {

    try {
        const jsonResponse = await fetch(`game_reviews/${gameId}.json`);

        if (!jsonResponse.ok){
            throw new Error("Review data not found");
        }

        const gameData = await jsonResponse.json();

        const mdResponse = await fetch(`game_reviews/${gameId}.md`);
        const markdownText = await mdResponse.text();

        document.querySelector('.game_title').innerText = gameData.title;
        document.querySelector('.game_subtitle').innerText = gameData.subtitle;
        document.querySelector('.score_word').innerText = gameData.scoreWord;
        
        document.querySelector('.score_number').setAttribute('data-target', gameData.scoreNumber);

        // Dynamic Stars Injection
        const starZone = document.getElementById('star-injector-zone');
        let allStarRowsHTML = "";

        gameData.stars.forEach(starItem => {
            const fullStars = Math.floor(starItem.rating);
            const halfStar = (starItem.rating % 1 != 0) ? 1 : 0;
            const emptyStars = 5 - fullStars - halfStar;

            const fullHTML = '<i class="fas fa-star"></i>'.repeat(fullStars);
            const halfHTML = '<i class="fas fa-star-half-stroke"></i>'.repeat(halfStar);
            const emptyHTML = '<i class="fa-regular fa-star"></i>'.repeat(emptyStars);
            const iconsHTML = fullHTML + halfHTML + emptyHTML;

            let icon = "";

            if (starItem.category === 'Gameplay') {
                icon = '<i class="fa-solid fa-gamepad"></i>';
            } else if (starItem.category === 'Story') {
                icon = '<i class="fa-solid fa-book"></i>';
            } else if (starItem.category === 'Music') {
                icon = '<i class="fa-solid fa-music"></i>';
            } else if (starItem.category === 'Visuals') {
                icon = '<i class="fa-solid fa-image"></i>';
            } else if (starItem.category === 'Playability') {
                icon = '<i class="fa-solid fa-bug-slash"></i>';
            }

            const rowHTML = `
                <div class="star_row">
                    <span class="category">${icon} ${starItem.category}</span>
                    <div class="stars">
                        ${iconsHTML}
                    </div>
                </div>
            `;

            allStarRowsHTML += rowHTML;
        });

        starZone.innerHTML = allStarRowsHTML;

        const summaryBox = document.getElementById('summary-box');
        
        // We check if gameData.summary exists AND if the HTML box exists to prevent errors
        if (gameData.summary && summaryBox) {
            const listGood = document.getElementById('list-good');
            const listBad = document.getElementById('list-bad');
            const listUgly = document.getElementById('list-ugly');

            gameData.summary.good.forEach(point => {
                listGood.innerHTML += `<li>${point}</li>`;
            });

            gameData.summary.bad.forEach(point => {
                listBad.innerHTML += `<li>${point}</li>`;
            });

            gameData.summary.ugly.forEach(point => {
                listUgly.innerHTML += `<li>${point}</li>`;
            });
        } else if (summaryBox) {
            // Hides the box entirely if no summary exists in the JSON
            summaryBox.style.display = 'none';
        }

        const markdownZone = document.getElementById('markdown-injector-zone');
        markdownZone.innerHTML = marked.parse(markdownText);
        
        initializeInteractiveElements(); 
    } catch (error) {
        console.error(error);
        document.querySelector('.game_title').innerText = "Review Not Found";
        document.querySelector('.game_subtitle').innerText = "Damn, I don't think I've reviewed this one (yet...)";
    }
    
}

function initializeInteractiveElements() {

    //Stars Rating Part
    const container = document.querySelector('.score_container');
    const circle = document.querySelector('.score_circle');
    const word = document.querySelector('.score_word');
    const numberElement = document.querySelector('.score_number');

    const targetScore = parseInt(numberElement.getAttribute('data-target'));

    function startCounter() {
        let currentScore = 0;

        function update() {
            const distance = targetScore - currentScore;
            currentScore += distance * 0.05;
            numberElement.innerText = Math.ceil(currentScore);

            if (distance > 0.5) {
                requestAnimationFrame(update);
            } else {
                numberElement.innerText = targetScore;
            }
        }

        update();
    }

    const reviewObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {

            if(entry.isIntersecting) {
                circle.classList.add('fade-up');
                startCounter();

                setTimeout(() => {
                    circle.classList.add('slide-left');
                    word.classList.add('slide-right');
                }, 1500);

                setTimeout(() => {
                    const starRows = document.querySelectorAll('.star_row');
                    starRows.forEach((row, index) => {
                        setTimeout(() => {
                            row.classList.add('drop-down');
                        }, index * 200);
                    });
                }, 2500);

                reviewObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    reviewObserver.observe(container);


    //Carousel Code

    const track = document.querySelector('.carousel_track');
    const leftBtn = document.querySelector('.left_btn');
    const rightBtn = document.querySelector('.right_btn');
    const images = document.querySelectorAll('.carousel_img');
    const counterDisplay = document.querySelector('.carousel_counter');

    let currentIndex = 0;

    function updateCarousel() {
        const slideAmount = -(currentIndex * 100);
        track.style.transform = `translateX(${slideAmount}%)`;
        counterDisplay.innerText = `${currentIndex + 1} / ${images.length}`;
    }

    rightBtn.addEventListener('click', () => {
        if (currentIndex === images.length - 1){
            currentIndex = 0;
        } else {
            currentIndex++;
        }
        updateCarousel();
    })

    leftBtn.addEventListener('click', () => {
        if (currentIndex === 0){
            currentIndex = images.length - 1;
        } else {
            currentIndex--;
        }
        updateCarousel();
    })


    //Lightbox code

    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lb_img');
    const lbCounter = document.getElementById('lb_counter');
    const lbClose = document.querySelector('.lightbox_close');
    const lbLeft = document.querySelector('.lb_left');
    const lbRight = document.querySelector('.lb_right');

    function updateLightBox() {
        lbImg.src = images[currentIndex].src;
        lbImg.alt = images[currentIndex].alt;

        lbCounter.innerText = `${currentIndex + 1} / ${images.length}`;

        updateCarousel();
    }

    images.forEach((img, index) => {
        img.addEventListener('click', () => {
            currentIndex = index;
            updateLightBox();
            lightbox.classList.add('active');
        });
    });

    lbClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    lbRight.addEventListener('click', () => {
        if (currentIndex === images.length - 1) {
            currentIndex = 0;
        } else {
            currentIndex++;
        }
        updateLightBox();
    });

    lbLeft.addEventListener('click', () => {
        if (currentIndex === 0) {
            currentIndex = images.length - 1;
        } else {
            currentIndex--;
        }
        updateLightBox();
    });
}

if (gameId) {
    loadReviewData();
} else{
    document.querySelector('.game_title').innerText = "No Game Selected";
    document.querySelector('.game_subtitle').innerText = "I think ya missed something";
}



