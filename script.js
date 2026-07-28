// --- 1. CONTINUOUS BACKGROUND ANIMATION (Stars, Hearts, Balloons, Candles) ---
const canvas = document.getElementById('bgAnimationCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Dynamic Floating Elements Array
const elements = [];
const types = ['star', 'heart', 'balloon', 'candle'];
const colorsList = ['#ff007f', '#ff66c4', '#ffd700', '#ffffff', '#00f2fe'];

for (let i = 0; i < 50; i++) {
    elements.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 12 + 8,
        speedY: Math.random() * 1.2 + 0.3,
        type: types[Math.floor(Math.random() * types.length)],
        color: colorsList[Math.floor(Math.random() * colorsList.length)],
        swing: Math.random() * 2
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
    ctx.arc(x, y, size / 4, 0, Math.PI * 2);
    ctx.fill();
}

function drawBalloon(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, size / 2, size / 1.5, 0, 0, Math.PI * 2);
    ctx.fill();
}

function drawCandle(x, y, size) {
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
        else if (el.type === 'candle') drawCandle(el.x, el.y, el.size);

        if (el.y < -20) {
            el.y = canvas.height + 20;
            el.x = Math.random() * canvas.width;
        }
    });

    requestAnimationFrame(renderBackground);
}
renderBackground();

// --- 2. CLICK STAR EXPLOSION ---
window.addEventListener('click', (e) => explodeStars(e));

function explodeStars(e) {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 22,
            spread: 70,
            origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
            colors: ['#ffd700', '#ff007f', '#ff66c4', '#ffffff']
        });
    }
}

// --- 3. STEP BY STEP NAVIGATION ---
function nextStep(stepNum) {
    document.querySelectorAll('.step-card').forEach(card => card.classList.remove('active'));
    document.getElementById(`step-${stepNum}`).classList.add('active');
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

// --- 5. DIGIT KEYPAD LOGIC ---
let pin = "";
function pressKey(num, e) {
    if (pin.length < 4) {
        pin += num;
        updateDots();
        explodeStars(e);
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
        confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
        nextStep(3);
    } else {
        document.getElementById('pass-error').innerText = "Wrong Passcode! Try again ❤️";
        pin = "";
        setTimeout(updateDots, 400);
    }
}

// --- 6. BALLOONS ---
const wishes = [
    "Wishing you infinite laughter! 😂",
    "May all your dreams come true! ✨",
    "Health, wealth & happiness always! 🍀",
    "Stay incredible forever! 💖"
];
const balloonGrid = document.getElementById('balloonGrid');
const colors = ['#ff007f', '#7928ca', '#ffd700', '#00d2ff'];

wishes.forEach((w, i) => {
    const b = document.createElement('div');
    b.className = 'balloon';
    b.style.backgroundColor = colors[i % colors.length];
    b.onclick = (e) => {
        b.style.visibility = 'hidden';
        explodeStars(e);
        document.getElementById('wishMsg').innerText = w;
        document.getElementById('wishBox').classList.remove('hidden');
    };
    balloonGrid.appendChild(b);
});

// --- 7. CANDLE BLOW ---
function blowCandle(elem, e) {
    const flame = elem.querySelector('.flame');
    if (flame) {
        flame.classList.add('out');
        explodeStars(e);
    }
}

// --- 8. PHOTO GALLERY ---
const photos = [
    { img: "https://i.ibb.co/xqXrkbXz/image.jpg", text: "Every moment with you is magical!" },
    { img: "https://i.ibb.co/htqXCct/image.jpg", text: "Bringing so much brightness into the world!" },
    { img: "https://i.ibb.co/YFqd7gJS/image.jpg", text: "Here's to another wonderful year ahead!" }
];
let photoIdx = 0;

function nextPhoto(e) {
    photoIdx = (photoIdx + 1) % photos.length;
    document.getElementById('galleryImg').src = photos[photoIdx].img;
    document.getElementById('galleryCaption').innerText = `"${photos[photoIdx].text}"`;
    explodeStars(e);
}

function prevPhoto(e) {
    photoIdx = (photoIdx - 1 + photos.length) % photos.length;
    document.getElementById('galleryImg').src = photos[photoIdx].img;
    document.getElementById('galleryCaption').innerText = `"${photos[photoIdx].text}"`;
    explodeStars(e);
}

// --- 9. VIDEO SWITCHERS ---
function switchVideo1(url, e) {
    document.getElementById('videoPlayer1').src = url;
    explodeStars(e);
}

function switchVideo2(url, e) {
    document.getElementById('videoPlayer2').src = url;
    explodeStars(e);
}

function finalParty(e) {
    confetti({ particleCount: 200, spread: 120, origin: { y: 0.5 } });
}
