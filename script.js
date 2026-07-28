// 1. COUNTDOWN TIMER LOGIC
let timeLeft = 5;
const timerDisplay = document.getElementById("timer-seconds");
const nextBtn = document.getElementById("btn-timer-next");

const countdown = setInterval(() => {
    timeLeft--;
    if (timeLeft < 10) {
        timerDisplay.textContent = "0" + timeLeft;
    } else {
        timerDisplay.textContent = timeLeft;
    }

    if (timeLeft <= 0) {
        clearInterval(countdown);
        timerDisplay.textContent = "00";
        nextBtn.classList.remove("hidden");
    }
}, 1000);

// STEP NAVIGATION
function goToStep(stepId) {
    document.querySelectorAll(".step-screen").forEach(el => el.classList.remove("active"));
    document.getElementById(stepId).classList.add("active");
    triggerGlobalSparkles();
}

// 2. PASSWORD CHECK (Default: 2708)
function checkPassword() {
    const input = document.getElementById("passInput").value;
    const error = document.getElementById("pass-error");

    if (input === "2708" || input === "2026") {
        document.getElementById("step-password").classList.remove("active");
        document.getElementById("main-content").classList.remove("hidden");
        fireCelebration();
    } else {
        error.textContent = "Incorrect password! Try again ❤️";
    }
}

// 3. BALLOON POPPING & WISHES
const wishes = [
    "May your 20th year bring endless adventures! ✨",
    "You shine brighter than any star in the sky! 🌟",
    "Wishing you joy, love, and sweet memories today! ❤️",
    "May all your dreams come true this year! 🌸",
    "Stay incredible, stay happy always! 🎉"
];

const balloonContainer = document.getElementById("balloonContainer");
if (balloonContainer) {
    const colors = ["#ff007f", "#7928ca", "#ffd700", "#00f2fe", "#4facfe"];
    wishes.forEach((wish, index) => {
        const balloon = document.createElement("div");
        balloon.className = "balloon";
        balloon.style.backgroundColor = colors[index % colors.length];
        balloon.onclick = (e) => popBalloon(e, wish);
        balloonContainer.appendChild(balloon);
    });
}

function popBalloon(event, wish) {
    event.target.style.visibility = "hidden";
    triggerSparkle(event);
    document.getElementById("wishText").textContent = wish;
    document.getElementById("wishModal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("wishModal").classList.add("hidden");
}

// 4. CANDLE BLOW LOGIC
function blowCandle(candle) {
    const flame = candle.querySelector(".flame");
    if (flame) {
        flame.classList.add("out");
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
    }
}

// 5. CLICK SPARKLES & CONFETTI EFFECTS
window.addEventListener("click", (e) => {
    createClickSparkle(e.clientX, e.clientY);
});

function createClickSparkle(x, y) {
    const canvas = document.getElementById("sparkleCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    for (let i = 0; i < 8; i++) {
        ctx.fillStyle = "#ffd700";
        ctx.beginPath();
        ctx.arc(x + (Math.random() * 40 - 20), y + (Math.random() * 40 - 20), Math.random() * 4 + 1, 0, Math.PI * 2);
        ctx.fill();
    }
}

function triggerSparkle(e) {
    confetti({
        particleCount: 25,
        spread: 50,
        origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight }
    });
}

function fireCelebration() {
    confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.6 }
    });
}

function triggerGlobalSparkles() {
    fireCelebration();
}
