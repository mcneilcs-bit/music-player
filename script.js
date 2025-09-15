const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');

const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

const shuffleBtn = document.getElementById('shuffle');
const repeatBtn = document.getElementById('repeat');
// Song titles

const songs = ['74', 'Trouble', 'WeddingRing'];
let songIndex = 0;
let isShuffle = false;
let isRepeat = false;

function loadSong(song) {
    title.innerText = song;
    audio.src = `music/${song}.mp3`;
    cover.src = `images/${song}.jpeg`;
    audio.load();
}

loadSong(songs[songIndex]);
 // Remove the event listener after the first play

function playSong() {
    musicContainer.classList.add('play');
    playBtn.querySelector('i.fas').classList.replace('fa-play', 'fa-pause');
    audio.play();
}

function pauseSong() {
    musicContainer.classList.remove('play');
    playBtn.querySelector('i.fas').classList.replace('fa-pause', 'fa-play');
    audio.pause();
}

playBtn.addEventListener('click', () => {
    const isPlaying = musicContainer.classList.contains('play');
    isPlaying ? pauseSong() : playSong();
});

function prevSong() {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    loadSong(songs[songIndex]);
    playSong();
    audio.oncanplaythrough = null;
 // Remove he event listener after the first play
}

function nextSong() {
    if (isRepeat) {
        audio.currentTime = 0;
        playSong();

    } else if (isShuffle) {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * songs.length);
        } while (newIndex === songIndex && songs.length > 1);
        songIndex = newIndex;
        loadSong(songs[songIndex]);
        audio.oncanplaythrough = () => {
        playSong();
        audio.oncanplaythrough = null; 
        };// Remove the event listener after the first play
    } else {
        songIndex = (songIndex + 1) % songs.length;
        loadSong(songs[songIndex]);
        playSong();
        audio.oncanplaythrough = null;


    }

}

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
audio.addEventListener('ended', nextSong);


shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
    if (isShuffle) {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * songs.length);
        } while (newIndex === songIndex && songs.length > 1);
        songIndex = newIndex;
        loadSong(songs[songIndex]);
        playSong();
    }
});

repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active', isRepeat);

    if (isRepeat) {
        audio.currentTime = 0;
        playSong();
    }
});
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const percent = (currentTime / duration) * 100;
    progress.style.width = `${percent}%`;

    //Update current time 
    currentTimeEl.innerText = formatTime(currentTime);
    //Update duration
    if (duration) {
        durationEl.innerText = formatTime(duration);
    }
}

audio.addEventListener('timeupdate', updateProgress);

audio.addEventListener('loadedmetadata', () => {
    durationEl.innerText = formatTime(audio.duration);
});

function setProgress(e) {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;

    if (!isNaN(duration)) {
        audio.currentTime = (clickX / width) * duration;
    }

}
progressContainer.addEventListener('click', setProgress);
