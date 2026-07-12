const audio = document.getElementById('audio-player');
audio.volume = 0.25;
const canvas = document.getElementById('wave-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = 200;

let audioContext;
let analyser;
let source;

audio.addEventListener('play', () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();

        source = audioContext.createMediaElementSource(audio);

        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;

        source.connect(analyser);
        analyser.connect(audioContext.destination);

        drawWave();
    }
});

audio.addEventListener('play', () => {
    const banner = document.getElementById('now-playing');
    banner.classList.add('slide-animation');
}, { once: true });

let dataArray;

function drawWave() {

    requestAnimationFrame(drawWave);

    if(analyser) {
        if(!dataArray) {
            dataArray = new Uint8Array(analyser.frequencyBinCount);
        }

        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // ---Drawing Logic---
        
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#00C6FF';
        ctx.beginPath();

        const visibleBins = window.innerWidth < 768 ? 20 : 50;

        const sliceWidth = canvas.width / (visibleBins - 1);

        let x = 0;
        let prevX = 0;
        let prevY = canvas.height;

        const heightMultiplier = window.innerWidth < 768 ? 0.3 : 0.5;

        for (let i = 0; i < visibleBins; i++) {
            //Array is between 0 and 255, divide by 255 to give percentage btwn 0.0-1.0
            const volumePercentage = dataArray[i] / 255.0;

            const y = canvas.height - (volumePercentage * canvas.height * heightMultiplier);

            if(i === 0) {
                ctx.moveTo(x, y); //Place pen down for first dot
            } else{
                const midX = (prevX + x) / 2;
                const midY = (prevY + y) / 2;
                ctx.quadraticCurveTo(prevX, prevY, midX, midY); //Draw curve to next dot
            }

            prevX = x;
            prevY = y;
            x += sliceWidth; //Move to next point
        }

        ctx.lineTo(prevX, prevY);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);

        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(0,198,255,0.4)');
        gradient.addColorStop(1, 'rgba(0,198,255,0)');
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.stroke();
    }
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
});


//Audio Control

const playBtn = document.getElementById('play-pause-btn');
const playIcon = playBtn.querySelector('i');
const volumeSlider = document.getElementById('volume-slider');
volumeSlider.value = audio.volume;

playBtn.addEventListener('click', () => {

    if(audio.paused) {
        audio.play();
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
    } else {
        audio.pause();
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
    }

});

volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
});

const toggleArrow = document.getElementById('toggle-arrow');
const audioPanel = document.getElementById('audio-panel');
const arrowIcon = toggleArrow.querySelector('i');

toggleArrow.addEventListener('click', () => {
    audioPanel.classList.toggle('panel-hidden');
    arrowIcon.classList.toggle('fa-chevron-up');
    arrowIcon.classList.toggle('fa-chevron-down');
});

window.addEventListener('DOMContentLoaded', () => {
    const playPromise = audio.play();

    if(playPromise != undefined) {
        playPromise.then(() => {
            playIcon.classList.remove('fa-play');
            playIcon.classList.add('fa-pause');
        }).catch(error => {
            console.log('Autoplay prevented:', error);
        });
    }
});


//May want to remove? basically as soon as you click it'll autoplay music
document.body.addEventListener('click', () => {
    
    if (audio.paused) {
        audio.play();
        
        // Update the UI button to match
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
    }
    
}, { once: true });