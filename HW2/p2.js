// Get the canvas element and its 2D rendering context
const canvas = document.getElementById('solarSystemCanvas');
const ctx = canvas.getContext('2d');

// Get the speed slider element
const speedSlider = document.getElementById('speedSlider');

// Function to draw stars on the canvas
function drawStars() {
    ctx.save();
    ctx.fillStyle = 'white';
    // Draw 200 white stars at random positions on the canvas
    for (let i = 0; i < 200; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}

// Function to draw the title text on the canvas
function drawTitle() {
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    // Center the text horizontally on the canvas
    ctx.fillText('The Solar System', canvas.width / 2 - 200, 80);
    ctx.restore();
}

// Function to draw a planet at given position, radius, and color
function drawPlanet(x, y, radius, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

// Sun and planet data with moons
const sun = { x: canvas.width / 2, y: canvas.height / 2, radius: 50, angle: 0 };
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

// Main drawing function
function draw() {
    
    // Draw black background and stars
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawStars();

    // Draw the title and the sun
    drawTitle();
    ctx.fillStyle = 'orange';
    ctx.beginPath();
    ctx.arc(sun.x, sun.y, sun.radius, 0, Math.PI * 2);
    ctx.fill();

    planets.forEach(planet => {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'; // Set a semi-transparent white color for the orbits
        ctx.beginPath();
        ctx.arc(sun.x, sun.y, planet.distance, 0, Math.PI * 2);
        ctx.stroke();
    });

    // Draw planets, their moons, and update their positions for animation
    planets.forEach(planet => {
        ctx.save();
        ctx.translate(sun.x, sun.y); // Translate to the sun's position
        ctx.rotate(planet.angle);   // Rotate based on the planet's orbit angle
        ctx.translate(planet.distance, 0); // Translate to the distance from the sun

        // Draw the planet and update its orbit angle for animation
        drawPlanet(0, 0, planet.radius, planet.color);

        // Draw moons and update their positions for animation
        planet.moons.forEach(moon => {
            ctx.save();
            ctx.rotate(moon.angle);   // Rotate based on the moon's orbit angle
            ctx.translate(moon.distance, 0); // Translate to the distance from the planet
            drawPlanet(0, 0, moon.radius, moon.color);
            ctx.restore(); // Restore the moon's context
            moon.angle += moon.speed * speedSlider.value;
        });

        ctx.restore(); // Restore the planet's context
        planet.angle += planet.speed * speedSlider.value;
    });

    // Request the next frame for animation
    requestAnimationFrame(draw);
}

// Call the draw function to start the animation
draw();
