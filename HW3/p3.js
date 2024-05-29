const canvas = document.getElementById('solarSystemCanvas');
const ctx = canvas.getContext('2d');
const speedSlider = document.getElementById('speedSlider');

function drawStars() {
    ctx.save();
    ctx.fillStyle = 'white';
    for (let i = 0; i < 200; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}

function drawTitle() {
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.fillText('The Solar System', canvas.width / 2 - 200, 80);
    ctx.restore();
}

function drawPlanet(x, y, radius, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

const sun = { x: canvas.width / 2, y: canvas.height / 2, radius: 50 };
const planets = [
    {
        distance: 150, radius: 15, angle: 0, color: 'blue', speed: 0.01,
        moons: [
            { distance: 20, radius: 5, angle: 0, color: 'gray', speed: 0.02 }
        ]
    },
    {
        distance: 200, radius: 10, angle: 0, color: 'red', speed: 0.015,
        moons: [
            { distance: 15, radius: 3, angle: 0, color: 'gray', speed: 0.03 }
        ]
    },
    {
        distance: 280, radius: 8, angle: 0, color: 'green', speed: 0.02,
        moons: [
            { distance: 18, radius: 4, angle: 0, color: 'gray', speed: 0.025 }
        ]
    }
];

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawStars();
    drawTitle();

    ctx.fillStyle = 'orange';
    ctx.beginPath();
    ctx.arc(sun.x, sun.y, sun.radius, 0, Math.PI * 2);
    ctx.fill();

    planets.forEach(planet => {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.arc(sun.x, sun.y, planet.distance, 0, Math.PI * 2);
        ctx.stroke();
        const planetTransform = mat3.create();
        mat3.translate(planetTransform, planetTransform, [sun.x, sun.y]);
        mat3.rotate(planetTransform, planetTransform, planet.angle);
        mat3.translate(planetTransform, planetTransform, [planet.distance, 0]);

        const x = planetTransform[6];
        const y = planetTransform[7];

        drawPlanet(x, y, planet.radius, planet.color);
        planet.angle += planet.speed * speedSlider.value;

        if (planet.moons) {
            planet.moons.forEach(moon => {
                const moonTransform = mat3.create();
                mat3.translate(moonTransform, moonTransform, [x, y]);
                mat3.rotate(moonTransform, moonTransform, moon.angle);
                mat3.translate(moonTransform, moonTransform, [moon.distance, 0]);

                const moonX = moonTransform[6];
                const moonY = moonTransform[7];

                drawPlanet(moonX, moonY, moon.radius, moon.color);
                moon.angle += moon.speed * speedSlider.value;
            });
        }
    });

    requestAnimationFrame(draw);
}

draw();


