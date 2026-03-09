/* Show button after 3 seconds */

setTimeout(() => {
    document.getElementById("balanceBtn").style.display = "inline-block";
}, 3000);


/* Button redirect */

document.getElementById("balanceBtn").addEventListener("click", () => {
    window.location.href = "/profile/index.html";
});


/* Firework effect */

function createFirework() {

    const fw = document.createElement("div");

    fw.className = "firework";

    fw.style.left = Math.random() * 100 + "vw";
    fw.style.top = Math.random() * 100 + "vh";

    fw.style.background = `hsl(${Math.random() * 360},100%,60%)`;

    document.body.appendChild(fw);

    setTimeout(() => {
        fw.remove();
    }, 1200);

}

setInterval(createFirework, 350);


/* Confetti effect */

function createConfetti() {

    const conf = document.createElement("div");

    conf.className = "confetti";

    conf.style.left = Math.random() * 100 + "vw";

    conf.style.background = `hsl(${Math.random() * 360},100%,60%)`;

    conf.style.animationDuration = (Math.random() * 3 + 2) + "s";

    document.body.appendChild(conf);

    setTimeout(() => {
        conf.remove();
    }, 5000);

}

setInterval(createConfetti, 200);