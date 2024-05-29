function setup() {
    var canvas = document.getElementById('myCanvas');
    var slider1 = document.getElementById('slider1');
    slider1.value = 0;
    var slider2 = document.getElementById('slider2');
    slider2.value = 0;

    function draw() {
        var context = canvas.getContext('2d');
        canvas.width = canvas.width;

        // Use the sliders to get various parameters
        var dx = parseInt(slider1.value);
        var dy = parseInt(slider2.value);

        // Create gradient
        const grd = context.createRadialGradient(800, 20, 3, 50, -50, 1000);
        grd.addColorStop(0, "purple");
        grd.addColorStop(1, "pink");

        // Fill with gradient
        context.fillStyle = grd;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Draw a smaller house outline
                context.beginPath();
                context.moveTo(100 + dx, 500 + dy); // Bottom-left corner
                context.lineTo(500 + dx, 100 + dy); // Top-middle point
                context.lineTo(900 + dx, 500 + dy); // Bottom-right corner
                context.lineTo(900 + dx, 800 + dy); // Right side
                context.lineTo(100 + dx, 800 + dy); // Left side
                context.closePath();
                context.strokeStyle = "beige";
                context.lineWidth = 10;
                context.stroke();

                // Draw windows
                context.fillStyle = "lightblue";
                context.fillRect(290 + dx, 510 + dy, 100, 100);
                context.fillRect(600 + dx, 510 + dy, 100, 100);

                // Draw a door
                context.fillStyle = "teal";
                context.fillRect(420 + dx, 550 + dy, 150, 250);

                context.lineWidth = 10;
                context.strokeStyle = "beige";

            //line
            context.beginPath();
            context.moveTo(100+dx,500+dy);
            context.lineTo(900+dx,500+dy);
            context.stroke();

            //smaller triangle
            context.beginPath();
            context.moveTo(200+dx,500+dy);
            context.lineTo(500+dx,250+dy);
            context.lineTo(800+dx,500+dy);
            context.closePath();
            context.fillStyle="teal";
            context.fill();
            context.stroke();
    }

    slider1.addEventListener("input", draw);
    slider2.addEventListener("input", draw);

    // Initial drawing of the house with windows and a door
    draw();
}

window.onload = setup;
