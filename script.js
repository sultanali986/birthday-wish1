// --- 1. CONTINUOUS FLOATING BACKGROUND (Balloons, Stars, Candles) ---
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

for (let i = 0; i < 50; i++) {
    elements.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 14 + 8,
        speedY: Math.random() * 1.2 + 0.4,
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

function drawCandleShape(x, y, size, color) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - size/6, y, size/3, size);
    ctx.fillStyle = 'orange';
    ctx.beginPath();
    ctx.arc(x, y - 4, size/4, 0, Math.PI * 2);
    ctx.fill();
}

function renderBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    elements.forEach(el => {
        el.y -= el.speedY;
        el.x += Math.sin(el.y * 0.02) * 0.6;

        if (el.type === 'star') drawStar(el.x, el.y, el.size, el.color);
        else if (el.type === 'heart') drawHeart(el.x, el.y, el.size, el.color);
        else if (el.type === 'balloon') drawBalloon(el.x, el.y, el.size, el.color);
        else if (el.type === 'candle') drawCandleShape(el.x, el.y, el.size, el.color);

        if (el.y < -25) {
            el.y = canvas.height + 25;
            el.x = Math.random() * canvas.width;
        }
    });
    requestAnimationFrame(renderBackground);
}
renderBackground();

// --- 2. TOUCH & CLICK EFFECTS (DYNAMIC COLOR CHANGE & PARTICLES) ---
const themeColors = [
    { bg1: '#2a081a', bg2: '#12000c', glow: '#ff007f' },
    { bg1: '#081a2a', bg2: '#000c12', glow: '#00f2fe' },
    { bg1: '#2a2208', bg2: '#120e00', glow: '#ffd700' },
    { bg1: '#1a082a', bg2: '#0c0012', glow: '#a855f7' }
];
let colorIndex = 0;

function sparkTouch(e) {
    // Change background theme color dynamically on touch/click anywhere
    colorIndex = (colorIndex + 1) % themeColors.length;
    const t = themeColors[colorIndex];
    document.body.style.background = `radial-gradient(circle at center, ${t.bg1} 0%, ${t.bg2} 80%, #000000 100%)`;
    document.documentElement.style.setProperty('--accent-glow', t.glow);

    if (typeof confetti === 'function') {
        confetti({
            particleCount: 18,
            spread: 60,
            origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
            colors: [t.glow, '#ffd700', '#ffffff']
        });
    }
}

function explodeStars(e) {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 25,
            spread: 80,
            origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
            colors: ['#ffd700', '#ff007f', '#ffffff']
        });
    }
}

function explodeHearts(e) {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 50,
            spread: 90,
            colors: ['#ff007f', '#ff4d4d', '#ffd700'],
            origin: { y: 0.6 }
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

// --- 4. TIMER ---
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

// --- 5. STYLISH PASSCODE WITH DIGIT PARTICLES & AUTO-OPEN ---
let pin = "";
function pressKey(num, e) {
    sparkTouch(e); // Trigger special color/particle effect on each digit click
    if (pin.length < 4) {
        pin += num;
        updateDots();
    }
    if (pin.length === 4) {
        setTimeout(submitPasscode, 300);
    }
}

function clearKey(e) {
    sparkTouch(e);
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

function submitPasscode(e) {
    if (pin === "2708" || pin === "2026") {
        confetti({ particleCount: 200, spread: 120, origin: { y: 0.5 } });
        nextStep(3); // Auto opens website/next step instantly!
    } else {
        document.getElementById('pass-error').innerText = "Wrong Passcode! Try again ❤️";
        pin = "";
        setTimeout(updateDots, 400);
    }
}

// --- 6. BALLOONS ---
const wishes = [
    `✨ Message 1: Happy 20th Birthday! 🌟\n\nTurning 20 is a huge milestone. You bring endless joy, brightness, and comfort into my life. Stay wonderful! ❤️`,
    `✨ Message 2: A Wish From The Heart 💖\n\nOn this 27th of August, a very special soul was born. May this year be filled with success, blessings, and deep peace! 🌸`,
    `✨ Message 3: To An Extraordinary Person 👑\n\nWishing a very Happy Birthday! Entering your twenties is magical. May your dreams take flight! 🎉`,
    `✨ Message 4: Celebrating YOU Today! 🎈\n\n20 years of bringing light and laughter into this world! Cheers to your 20th chapter! 🥂✨`
];

let poppedBalloonsCount = 0;
const balloonGrid = document.getElementById('balloonGrid');
const colors = ['#ff007f', '#a855f7', '#ffd700', '#00f2fe'];

wishes.forEach((w, i) => {
    const b = document.createElement('div');
    b.className = 'balloon';
    b.style.backgroundColor = colors[i % colors.length];
    b.onclick = (e) => {
        e.stopPropagation();
        sparkTouch(e);
        b.style.visibility = 'hidden';
        document.getElementById('wishMsg').innerText = w;
        document.getElementById('wishBox').classList.remove('hidden');
        poppedBalloonsCount++;
    };
    balloonGrid.appendChild(b);
});

function closeWishBox(e) {
    e.stopPropagation();
    document.getElementById('wishBox').classList.add('hidden');
    if (poppedBalloonsCount >= wishes.length) {
        document.getElementById('afterBalloonsBtn').classList.remove('hidden');
    }
}

// --- 7. CANDLE BLOW ---
function blowCandle(elem, e) {
    e.stopPropagation();
    sparkTouch(e);
    const flame = elem.querySelector('.flame');
    if (flame) flame.classList.add('out');
}

// --- 8. PHOTO GALLERY ---
const photos = [
    { img: "https://i.ibb.co/xqXrkbXz/image.jpg", text: "Every moment with you is pure magic!" },
    { img: "https://i.ibb.co/htqXCct/image.jpg", text: "Bringing so much brightness into the world!" },
    { img: "https://i.ibb.co/YFqd7gJS/image.jpg", text: "Here's to another wonderful year ahead!" }
];
let photoIdx = 0;

function nextPhoto(e) {
    e.stopPropagation();
    sparkTouch(e);
    photoIdx = (photoIdx + 1) % photos.length;
    document.getElementById('galleryImg').src = photos[photoIdx].img;
    document.getElementById('galleryCaption').innerText = `"${photos[photoIdx].text}"`;
}

function prevPhoto(e) {
    e.stopPropagation();
    sparkTouch(e);
    photoIdx = (photoIdx - 1 + photos.length) % photos.length;
    document.getElementById('galleryImg').src = photos[photoIdx].img;
    document.getElementById('galleryCaption').innerText = `"${photos[photoIdx].text}"`;
}

// --- 9. CLEAN VIDEO PLAY & SWITCH CONTROLS ---
function triggerPlay(videoId, overlayId) {
    const video = document.getElementById(videoId);
    const overlay = document.getElementById(overlayId);
    if (video) {
        video.play();
        if (overlay) overlay.style.display = 'none';
    }
}

function switchCleanVideo1(videoUrl, e) {
    e.stopPropagation();
    sparkTouch(e);
    const video = document.getElementById('mainVideoPlayer1');
    const overlay = document.getElementById('playOverlay1');
    
    video.src = videoUrl;
    video.load();
    overlay.style.display = 'flex';

    if (e && e.target) {
        const buttons = e.target.parentElement.querySelectorAll('.btn-sec');
        buttons.forEach(btn => btn.classList.remove('active-vbtn'));
        e.target.classList.add('active-vbtn');
    }
}

function switchCleanVideo2(videoUrl, e) {
    e.stopPropagation();
    sparkTouch(e);
    const video = document.getElementById('mainVideoPlayer2');
    const overlay = document.getElementById('playOverlay2');
    
    video.src = videoUrl;
    video.load();
    overlay.style.display = 'flex';

    if (e && e.target) {
        const buttons = e.target.parentElement.querySelectorAll('.btn-sec');
        buttons.forEach(btn => btn.classList.remove('active-vbtn'));
        e.target.classList.add('active-vbtn');
    }
}

function finalParty(e) {
    e.stopPropagation();
    confetti({ particleCount: 350, spread: 150, origin: { y: 0.5 } });
}
