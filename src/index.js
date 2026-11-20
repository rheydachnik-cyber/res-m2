import './styles/main.scss';

import rainAudio from './assets/audio/rain.mp3';
import summerAudio from './assets/audio/summer.mp3';
import winterAudio from './assets/audio/winter.mp3';


import rainImg from './assets/images/rainy-bg.jpg';
import summerImg from './assets/images/summer-bg.jpg';
import winterImg from './assets/images/winter-bg.jpg';

import rainIcon from './assets/images/cloud-rain.svg';
import summerIcon from './assets/images/sun.svg';
import winterIcon from './assets/images/cloud-snow.svg';
import pauseIcon from './assets/images/pause.svg';

const SOUNDS = [
  { id: 'rain',   label: 'Дождь', audio: rainAudio,   image: rainImg,   icon: rainIcon },
  { id: 'summer', label: 'Лето',  audio: summerAudio, image: summerImg, icon: summerIcon },
  { id: 'winter', label: 'Зима',  audio: winterAudio, image: winterImg, icon: winterIcon },
];

const buttonsContainer = document.getElementById('buttons');
const volumeInput = document.getElementById('volume');

const buttons = {};
SOUNDS.forEach(({ id, label, icon }) => {
  const btn = document.createElement('button');
  btn.className = 'sound-btn';
  btn.dataset.id = id;
  btn.dataset.label = label; 
  btn.style.backgroundImage = `url(${icon})`; 
  buttonsContainer.appendChild(btn);
  buttons[id] = btn;
});

const audios = {};
SOUNDS.forEach(({ id, audio }) => {
  const a = new Audio(audio);
  a.loop = true;
  a.volume = Number(volumeInput.value);
  audios[id] = a;
});

let currentId = null;
function stopAll(exceptId = null) {
  Object.entries(audios).forEach(([id, audio]) => {
    if (id !== exceptId) {
      audio.pause();
      audio.currentTime = 0;
      buttons[id].classList.remove('active');
      buttons[id].style.backgroundImage = `url(${SOUNDS.find(s => s.id === id).icon})`;
    }
  });
}

function setBackground(url) {
  document.body.style.backgroundImage = url ? `url(${url})` : 'none';
}

function handleClick(id) {
  const audio = audios[id];
  const btn = buttons[id];
  const soundData = SOUNDS.find((s) => s.id === id);
  if (currentId === id) {
    if (audio.paused) {
      audio.play();
      btn.classList.add('active');
      btn.style.backgroundImage = `url(${soundData.icon})`;
    } else {
      audio.pause();
      btn.classList.remove('active');
      btn.style.backgroundImage = `url(${pauseIcon})`; 
    }
    return;
  }
  stopAll(id);
  audio.currentTime = 0;
  audio.play();
  btn.classList.add('active');
  btn.style.backgroundImage = `url(${soundData.icon})`;
  currentId = id;
  setBackground(soundData.image);
}
Object.keys(buttons).forEach((id) => {
  buttons[id].addEventListener('click', () => handleClick(id));
});
volumeInput.addEventListener('input', (e) => {
  const v = Number(e.target.value);
  Object.values(audios).forEach((a) => { a.volume = v; });
});
