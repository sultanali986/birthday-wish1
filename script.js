// --- 1. CONTINUOUS FLOATING BACKGROUND (Stars, Hearts, Balloons, Candles) ---
const canvas = document.getElementById('bgAnimationCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const elements = [];
const types = ['star', 'heart', 'balloon', 'candle'];
const colorsList = ['#ff007f', '#ff66c4', '#ffd700', '#ffffff', '#00f2fe', '#a855f7'];

for (let i = 0; i < 60; i++) {
    elements.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 12 + 8,
        speedY: Math.random() * 1.2 + 0.3,
        type: types[Math.floor(Math.random() * types.length)],
        color: colorsList[Math.floor(Math.random() * colorsList.length)]
    });
}

function drawHeart(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
    ctx.bezierCurveTo(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
    ctx.fill();
}

function drawStar(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size / 3.5, 0, Math.PI * 2);
    ctx.fill();
}

function drawBalloon(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, size / 2, size / 1.4, 0, 0, Math.PI * 2);
    ctx.fill();
}

function drawCandle(x, y) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, 4, 14);
    ctx.fillStyle = '#ff9900';
    ctx.beginPath();
    ctx.arc(x + 2, y - 2, 3, 0, Math.PI * 2);
    ctx.fill();
}

function renderBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    elements.forEach(el => {
        el.y -= el.speedY;
        el.x += Math.sin(el.y * 0.02) * 0.5;

        if (el.type === 'star') drawStar(el.x, el.y, el.size, el.color);
        else if (el.type === 'heart') drawHeart(el.x, el.y, el.size, el.color);
        else if (el.type === 'balloon') drawBalloon(el.x, el.y, el.size, el.color);
        else if (el.type === 'candle') drawCandle(el.x, el.y);

        if (el.y < -20) {
            el.y = canvas.height + 20;
            el.x = Math.random() * canvas.width;
        }
    });

    requestAnimationFrame(renderBackground);
}
renderBackground();

// --- 2. DYNAMIC THEME COLOR SHIFT & CLICK SPARKLES ---
const themeGradients = [
    { bg1: '#2a081a', bg2: '#12000c', accent: '#ff007f' },
    { bg1: '#1d002c', bg2: '#0a0014', accent: '#a855f7' },
    { bg1: '#001a2c', bg2: '#000814', accent: '#00f2fe' },
    { bg1: '#2c1a00', bg2: '#140b00', accent: '#ffd700' }
];

let themeIndex = 0;

window.addEventListener('click', (e) => {
    explodeStars(e);
    
    // Shift theme tint on click
    themeIndex = (themeIndex + 1) % themeGradients.length;
    const t = themeGradients[themeIndex];
    document.documentElement.style.setProperty('--theme-bg1', t.bg1);
    document.documentElement.style.setProperty('--theme-bg2', t.bg2);
    document.documentElement.style.setProperty('--accent-glow', t.accent);
});

function explodeStars(e) {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 25,
            spread: 80,
            origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
            colors: ['#ffd700', '#ff007f', '#ff66c4', '#ffffff', '#00f2fe']
        });
    }
}

// --- 3. STEP NAVIGATION ---
function nextStep(stepNum) {
    document.querySelectorAll('.step-card').forEach(card => card.classList.remove('active'));
    const target = document.getElementById(`step-${stepNum}`);
    if (target) {
        target.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// --- 4. COUNTDOWN TIMER ---
let timer = 5;
const timerElem = document.getElementById('timer-number');
const timerBtn = document.getElementById('btn-timer');

const countdown = setInterval(() => {
    timer--;
    timerElem.innerText = timer < 10 ? '0' + timer : timer;
    if (timer <= 0) {
        clearInterval(countdown);
        timerElem.innerText = "00";
        timerBtn.classList.remove('hidden');
    }
}, 1000);

// --- 5. DIGIT KEYPAD ---
let pin = "";
function pressKey(num, e) {
    if (pin.length < 4) {
        pin += num;
        updateDots();
    }
    if (pin.length === 4) setTimeout(submitPasscode, 300);
}

function clearKey(e) {
    if (pin.length > 0) {
        pin = pin.slice(0, -1);
        updateDots();
    }
}

function updateDots() {
    for (let i = 0; i < 4; i++) {
        const dot = document.getElementById(`dot-${i}`);
        if (i < pin.length) dot.classList.add('filled');
        else dot.classList.remove('filled');
    }
}

function submitPasscode() {
    if (pin === "2708" || pin === "2026") {
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
        nextStep(3);
    } else {
        document.getElementById('pass-error').innerText = "Wrong Passcode! Try again ❤️";
        pin = "";
        setTimeout(updateDots, 400);
    }
}

// --- 6. POP BALLOONS & WISHES ---
const wishes = [
    "Wishing you endless happiness & smiles! 😊",
    "May all your dreams turn into reality! ✨",
    "Health, peace, and boundless love forever! 🍀",
    "You are truly one in a million! 💖"
];
const balloonGrid = document.getElementById('balloonGrid');
const colors = ['#ff007f', '#a855f7', '#ffd700', '#00f2fe'];

wishes.forEach((w, i) => {
    const b = document.createElement('div');
    b.className = 'balloon';
    b.style.backgroundColor = colors[i % colors.length];
    b.onclick = (e) => {
        b.style.visibility = 'hidden';
        document.getElementById('wishMsg').innerText = w;
        document.getElementById('wishBox').classList.remove('hidden');
    };
    balloonGrid.appendChild(b);
});

// --- 7. CANDLE BLOW ---
function blowCandle(elem, e) {
    const flame = elem.querySelector('.flame');
    if (flame) flame.classList.add('out');
}

// --- 8. PHOTO GALLERY (FULL DISPLAY) ---
const photos = [
    { img: "https://i.ibb.co/xqXrkbXz/image.jpg", text: "Every moment with you is pure magic!" },
    { img: "https://i.ibb.co/htqXCct/image.jpg", text: "Bringing so much brightness into the world!" },
    { img: "https://i.ibb.co/YFqd7gJS/image.jpg", text: "Here's to another wonderful year ahead!" }
];
let photoIdx = 0;

function nextPhoto(e) {
    photoIdx = (photoIdx + 1) % photos.length;
    document.getElementById('galleryImg').src = photos[photoIdx].img;
    document.getElementById('galleryCaption').innerText = `"${photos[photoIdx].text}"`;
}

function prevPhoto(e) {
    photoIdx = (photoIdx - 1 + photos.length) % photos.length;
    document.getElementById('galleryImg').src = photos[photoIdx].img;
    document.getElementById('galleryCaption').innerText = `"${photos[photoIdx].text}"`;
}

// --- 9. VIDEO SWITCHERS ---
function switchVideo1(url, e) {
    document.getElementById('videoPlayer1').src = url;
}

function switchVideo2(url, e) {
    document.getElementById('videoPlayer2').src = url;
}

function finalParty(e) {
    confetti({ particleCount: 300, spread: 140, origin: { y: 0.5 } });
}
