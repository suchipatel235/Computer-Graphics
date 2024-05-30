function setup() {
    // Set up WebGL context
    var canvas = document.getElementById("myCanvas");
    var gl = canvas.getContext("webgl");

    // Initialize sliders for user interaction
    var slider1= document.getElementById("slider1");
    slider1.value = 0;
    var slider2 = document.getElementById("slider2");
    slider2.value = 0;
    var slider3 = document.getElementById("slider3");
    slider3.value = 0;

    var time = 0;

    // Shader setup
    var vertexSource = document.getElementById("vertexShader").text; 
    var fragmentSource = document.getElementById("fragmentShader").text; 
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);

    gl.shaderSource(vertexShader, vertexSource); 
    gl.compileShader(vertexShader); 

    // Check for vertex shader compilation errors
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) { 
        alert(gl.getShaderInfoLog(vertexShader)); 
        return null; 
    }

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER); 
    gl.shaderSource(fragmentShader, fragmentSource); 
    gl.compileShader(fragmentShader); 

    // Check for fragment shader compilation errors
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) { 
        alert(gl.getShaderInfoLog(fragmentShader)); 
        return null; 
    }

    // Create and link shader program
    var shaderProgram = gl.createProgram(); 
    gl.attachShader(shaderProgram, vertexShader); 
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram); 

    // Check for shader program link errors
    if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) { 
        alert("Could not initialize shaders"); 
    }

    // Set up shader attribute and uniform locations
    gl.useProgram(shaderProgram);
    shaderProgram.PositionAttribute = gl.getAttribLocation(shaderProgram, "vPosition");
    gl.enableVertexAttribArray(shaderProgram.PositionAttribute);
    shaderProgram.ColorAttribute = gl.getAttribLocation(shaderProgram, "vColor");
    gl.enableVertexAttribArray(shaderProgram.ColorAttribute);
    shaderProgram.NormalAttribute = gl.getAttribLocation(shaderProgram, "vNormal");
    gl.enableVertexAttribArray(shaderProgram.NormalAttribute);
    shaderProgram.TexCoordAttribute = gl.getAttribLocation(shaderProgram, "vTexCoord");
    gl.enableVertexAttribArray(shaderProgram.TexCoordAttribute);
    shaderProgram.MVmatrix = gl.getUniformLocation(shaderProgram, "uMV");
    shaderProgram.MVPmatrix = gl.getUniformLocation(shaderProgram, "uMVP");
    shaderProgram.MVnormalMatrix = gl.getUniformLocation(shaderProgram, "uMVn");
    shaderProgram.movingLight = gl.getUniformLocation(shaderProgram, "rawLight");
    shaderProgram.texSampler1 = gl.getUniformLocation(shaderProgram, "texSampler1");
    gl.uniform1i(shaderProgram.texSampler1, 0);
    shaderProgram.texSampler2 = gl.getUniformLocation(shaderProgram, "texSampler2");
    gl.uniform1i(shaderProgram.texSampler2, 1);

    // vertex positions from course example
    var vertexPos = new Float32Array(
        [  1, 1, 1,  -1, 1, 1,  -1,-1, 1,   1,-1, 1,
           1, 1, 1,   1,-1, 1,   1,-1,-1,   1, 1,-1,
           1, 1, 1,   1, 1,-1,  -1, 1,-1,  -1, 1, 1,
          -1, 1, 1,  -1, 1,-1,  -1,-1,-1,  -1,-1, 1,
          -1,-1,-1,   1,-1,-1,   1,-1, 1,  -1,-1, 1,
           1,-1,-1,  -1,-1,-1,  -1, 1,-1,   1, 1,-1 ]);

    // vertex normals from course example
    var vertexNormals = new Float32Array(
        [  0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1, 
           1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0, 
           0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0, 
          -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0, 
           0,-1, 0,   0,-1, 0,   0,-1, 0,   0,-1, 0, 
           0, 0,-1,   0, 0,-1,   0, 0,-1,   0, 0,-1  ]);

           var vertexColors = new Float32Array(
            [  0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,
               0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,
               0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,
               0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,
               0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,
               0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0 ]);
        
        

    
    // vertex texture coordinates from course example
    var vertexTextureCoords = new Float32Array(
        [  0, 0,   1, 0,   1, 1,   0, 1,
           1, 0,   1, 1,   0, 1,   0, 0,
           0, 1,   0, 0,   1, 0,   1, 1,
           0, 0,   1, 0,   1, 1,   0, 1,
           1, 1,   0, 1,   0, 0,   1, 0,
           1, 1,   0, 1,   0, 0,   1, 0 ]);

    // element index array from course example
    var triangleIndices = new Uint8Array(
        [  0, 1, 2,   0, 2, 3,    // front
           4, 5, 6,   4, 6, 7,    // right
           8, 9,10,   8,10,11,    // top
          12,13,14,  12,14,15,    // left
          16,17,18,  16,18,19,    // bottom
	      20,21,22,  20,22,23 ]); // back

    // Create the vertex buffer objects
    var trianglePosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexPos, gl.STATIC_DRAW);
    trianglePosBuffer.itemSize = 3;
    trianglePosBuffer.numItems = 24;
    var normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexNormals, gl.STATIC_DRAW);
    normalBuffer.itemSize = 3;
    normalBuffer.numItems = 24;
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexColors, gl.STATIC_DRAW);
    colorBuffer.itemSize = 3;
    colorBuffer.numItems = 24;
    var textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexTextureCoords, gl.STATIC_DRAW);
    textureBuffer.itemSize = 2;
    textureBuffer.numItems = 24;
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleIndices, gl.STATIC_DRAW);

    // Texture Setup
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    var image = new Image(); 

    // Initialize texture and draw when the image is loaded
    function initTextureThenDraw() { 
        image.onload = function() {
            loadTexture(image, texture); 
        };

        image.crossOrigin = "anonymous";
        
        image.src = 'https://cdnb.artstation.com/p/assets/images/images/063/882/025/large/andrei-zelenco-5.jpg?1686599869';
        window.setTimeout(draw, 200);
    }

    function loadTexture(image, texture) { 
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    function update() {
        // Function for updating scene parameters (currently does nothing)
    }

    function draw() { 
        time = time + .1; 
        time = time + slider3.value * 0.01; 

        window.requestAnimationFrame(draw); 

        // Variable initializations
        var angleCamera = time * 0.01 * Math.PI;
        var lightDir = slider1.value * 0.01 * Math.PI;
        var angleRotate = slider2.value * 0.01 * Math.PI;
        var eye = [400 * Math.sin(angleCamera), 200.0, 400 * Math.cos(angleCamera)];
        var target = [0, 0, 0];
        var up = [0, 1, 0];
        

        // Create the view matrix
        var tModel = mat4.create();
        mat4.fromRotation(tModel, angleRotate, [1, 1, 1]);
        mat4.scale(tModel, tModel, [100, 100, 100]);
        var tCamera = mat4.create();
        mat4.lookAt(tCamera, eye, target, up);
        var tProjection = mat4.create();
        mat4.perspective(tProjection, Math.PI / 4, 1, 10, 1000);
        var tMVP = mat4.create();
        var tMV = mat4.create();
        mat4.multiply(tMV, tCamera, tModel);
        var tMVn = mat3.create();
        mat3.normalFromMat4(tMVn, tMV);
        mat4.multiply(tMVP, tProjection, tMV);
        var light = [Math.sin(lightDir), 1.5, Math.cos(lightDir)];

        // Clear the canvas
        gl.clearColor(0.39, 0.19, 0.38, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Set the shader program (mostly from course example)
        gl.uniformMatrix4fv(shaderProgram.MVmatrix, false, tMV);
        gl.uniformMatrix3fv(shaderProgram.MVnormalMatrix, false, tMVn);
        gl.uniformMatrix4fv(shaderProgram.MVPmatrix, false, tMVP);
        gl.uniform3fv(shaderProgram.movingLight, light);
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
        gl.vertexAttribPointer(shaderProgram.PositionAttribute, trianglePosBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(shaderProgram.ColorAttribute, colorBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.vertexAttribPointer(shaderProgram.NormalAttribute, normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
        gl.vertexAttribPointer(shaderProgram.TexCoordAttribute, textureBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.drawElements(gl.TRIANGLES, triangleIndices.length, gl.UNSIGNED_BYTE, 0);
    }

    //Event listeners for sliders
    slider1.addEventListener("input", update);
    slider2.addEventListener("input", update);

    //Initial Function calls
    draw();
    initTextureThenDraw();
}

window.onload = setup;
