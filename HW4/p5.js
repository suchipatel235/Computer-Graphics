function setup() {
    var observerCanvas = document.getElementById('observerCanvas');
    var cameraCanvas = document.getElementById('cameraCanvas');
    var observerContext = observerCanvas.getContext('2d');
    var cameraContext = cameraCanvas.getContext('2d');
    var slider2 = document.getElementById('slider2');
    slider2.value = 0;
    var tParam = 0;
	
    var context = cameraContext; // default to drawing in the camera window
    var t = 0;

    function draw() {
	    // clear both canvas instances
	observerCanvas.width = observerCanvas.width;
	cameraCanvas.width = cameraCanvas.width;

	
    
  if (tParam>9){
    tParam = 0;
  }
    
    var viewAngle = slider2.value*0.02*Math.PI;
    var locCamera = vec3.create();
    var distCamera = 400.0;
    locCamera[0] = distCamera*Math.sin(viewAngle);
    locCamera[1] = 100;
    locCamera[2] = distCamera*Math.cos(viewAngle);
	var TlookAt = mat4.create();
    mat4.lookAt(TlookAt, locCamera, [0,0,0], [0,1,0]);
     
	function moveToTx(loc,Tx)
	{var res=vec3.create(); vec3.transformMat4(res,loc,Tx); context.moveTo(res[0],res[1]);}

	function lineToTx(loc,Tx)
	{var res=vec3.create(); vec3.transformMat4(res,loc,Tx); context.lineTo(res[0],res[1]);}
	

    function drawFly(context, centerX, centerY, angle, distance) {
        // Calculate fly position based on angle and distance from the center (bee's position)
        var flyX = centerX + Math.cos(angle) * distance;
        var flyY = centerY + Math.sin(angle) * distance;
    
        // Draw the fly as a simple circle
        context.fillStyle = 'black';
        context.beginPath();
        context.arc(flyX, flyY, 2, 0, 2 * Math.PI);
        context.fill();
    }
    
    function animateFlies(context, centerX, centerY, numFlies, radius, t) {
        var angleIncrement = (2 * Math.PI) / numFlies; // Angle between each fly
        for (var i = 0; i < numFlies; i++) {
            // Calculate the current angle for each fly, adding time-based rotation
            var angle = i * angleIncrement + t;
            drawFly(context, centerX, centerY, angle, radius);
        }
    }


    function drawBee(color, Tx, t) {
        // Body with Stripes
        context.fillStyle = color;
        context.beginPath();
        context.ellipse(Tx[12], Tx[13], 15, 25, 0, 0, 2 * Math.PI);
        context.fill();
        
        // Stripes on the body
        context.fillStyle = "black";
        const totalStripes = 10; // Adjust the number of stripes as needed
        const stripeHeight = 1; // Adjust the height of each stripe
        
        const ellipseHeight = 30;
        const yOffsetIncrement = ellipseHeight / totalStripes;
        
        for (let i = 0; i < totalStripes; i++) {
            const yOffset = i * yOffsetIncrement - ellipseHeight / 2;
            context.fillRect(Tx[12] - 6, Tx[13] + yOffset, 12, stripeHeight);
        }
        
        // Head
        context.beginPath();
        context.arc(Tx[12] + 20, Tx[13], 10, 0, 2 * Math.PI);
        context.fill();
        
        // Eyes
        context.fillStyle = "white";
        context.beginPath();
        context.arc(Tx[12] + 17, Tx[13] - 5, 3, 0, 2 * Math.PI);
        context.fill();
        context.beginPath();
        context.arc(Tx[12] + 23, Tx[13] - 5, 3, 0, 2 * Math.PI);
        context.fill();
        
        // Wings
        // Calculate the wing flap based on t
        var wingAngle = Math.sin(t * 10) * 0.2; // 0.2 is the amplitude of the flap

        // Wings - modified to include the hierarchical transform for flapping
        context.save(); // Save the current context state
        context.translate(Tx[12], Tx[13]); // Move to the bee body center
        context.rotate(wingAngle); // Apply the wing flap rotation
        context.fillStyle = "rgba(255, 255, 255, 0.5)";
        context.beginPath();
        context.moveTo[(-5, -10,0),Tx];
        context.lineTo[(-15, -30,0),Tx];
        context.lineTo[(-5, -30,0),Tx];
        context.lineTo[(5, -10,0),Tx];
        context.closePath();
        context.fill();
        context.restore(); // Restore the context to the state before wing transform

        context.save(); // Do the same for the other wing
        context.translate(Tx[12], Tx[13]);
        context.rotate(-wingAngle); // Flap in the opposite direction for the other wing
        context.beginPath();
        context.moveTo[(-5, -10),Tx];
        context.lineTo[(5, -30),Tx];
        context.lineTo[(15, -30),Tx];
        context.lineTo[(5, -10),Tx];
        context.closePath();
        context.fill();
        context.restore();

        var numFlies = 5; // Number of flies
        var rotationRadius = 50; // Radius of the flies' circular path around the bee
        animateFlies(context, Tx[12], Tx[13], numFlies, rotationRadius, t);
    }
    
    
    function drawFlower(Tx) {
        // Draw flower petals
        context.fillStyle = "pink"; 
        for (let i = 0; i < 6; i++) {
            const angle = (i * 2 * Math.PI) / 6;
            const petalX = Tx[12] + 30 * Math.cos(angle);
            const petalY = Tx[13] + 30 * Math.sin(angle);
            context.beginPath();
            context.arc(petalX, petalY, 20, 0, Math.PI * 2);
            context.closePath();
            context.fill();
        }
    
        // Draw flower center
        context.fillStyle = "lightgreen"; 
        context.beginPath();
        context.arc(Tx[12], Tx[13], 20, 0, Math.PI * 2);
        context.closePath();
        context.fill();
    }
      

	    function drawCamera(color,TxU,scale) {
        var Tx = mat4.clone(TxU);
        mat4.scale(Tx,Tx,[scale,scale,scale]);
        context.beginPath();
	    context.strokeStyle = color;
        // Twelve edges of a cropped pyramid
        moveToTx([-3,-3,-2],Tx);lineToTx([3,-3,-2],Tx);
        lineToTx([3,3,-2],Tx);lineToTx([-3,3,-2],Tx);
        moveToTx([3,-3,-2],Tx);lineToTx([2,-2,0],Tx);
        lineToTx([2,2,0],Tx);lineToTx([3,3,-2],Tx);
        moveToTx([2,-2,0],Tx);lineToTx([-2,-2,0],Tx);
        lineToTx([-2,2,0],Tx);lineToTx([2,2,0],Tx);
        moveToTx([-2,-2,0],Tx);lineToTx([-3,-3,-2],Tx);
        lineToTx([-3,3,-2],Tx);lineToTx([-2,2,0],Tx);
        context.stroke();
    }
	
	    function drawUVWAxes(color,TxU,scale) {
        var Tx = mat4.clone(TxU);
        mat4.scale(Tx,Tx,[scale,scale,scale]);

        context.strokeStyle=color;
	    context.beginPath();
	    // Axes
	    moveToTx([1.2,0,0],Tx);lineToTx([0,0,0],Tx);lineToTx([0,1.2,0],Tx);
        moveToTx([0,0,0],Tx);lineToTx([0,0,1.2],Tx);
	    // Arrowheads
	    moveToTx([1.1,.05,0],Tx);lineToTx([1.2,0,0],Tx);lineToTx([1.1,-.05,0],Tx);
	    moveToTx([.05,1.1,0],Tx);lineToTx([0,1.2,0],Tx);lineToTx([-.05,1.1,0],Tx);
      	moveToTx([.05,0,1.1],Tx);lineToTx([0,0,1.2],Tx);lineToTx([-.05,0,1.1],Tx);
	    // U-label
        moveToTx([1.3,.05,0],Tx);lineToTx([1.3,-.035,0],Tx);lineToTx([1.35,-.05,0],Tx);
        lineToTx([1.4,-.035,0],Tx);lineToTx([1.4,.05,0],Tx);
        // V-label
        moveToTx([-.05,1.4,0],Tx);lineToTx([0,1.3,0],Tx);lineToTx([.05,1.4,0],Tx);
	    // W-label
	    moveToTx([-.1,0,1.3],Tx);lineToTx([-.05,0,1.4],Tx);lineToTx([-0,0,1.3],Tx);
	    lineToTx([.05,0,1.4],Tx);lineToTx([.1,0,1.3],Tx);

	    context.stroke();
	}



	var Hermite = function(t) {
	    return [
		2*t*t*t-3*t*t+1,
		t*t*t-2*t*t+t,
		-2*t*t*t+3*t*t,
		t*t*t-t*t
	    ];
	}

    var HermiteDerivative = function(t) {
        return [
        6*t*t-6*t,
        3*t*t-4*t+1,
        -6*t*t+6*t,
        3*t*t-2*t
        ];
    }

	function Cubic(basis,P,t){
	    var b = basis(t);
	    var result=vec3.create();
	    vec3.scale(result,P[0],b[0]);
	    vec3.scaleAndAdd(result,result,P[1],b[1]);
	    vec3.scaleAndAdd(result,result,P[2],b[2]);
	    vec3.scaleAndAdd(result,result,P[3],b[3]);
	    return result;
	}

      
      //points and tangents 
	var Point0 = [0, 0, 0];
    var d0 = [40, 10, 0];
    var Point1 = [300, 50, 0];
    var d1 = [60, 30, 0];
    var Point2 = [120, 120, 0];
    var d2 = [0, 60, 60];
    var Point3 = [-200, 150, 40];
    var d3 = [-60, 150, 0];
    var Point4 = [0, 80, -70];
    var d4 = [-150, -40, 0];
    var Point5 = [220, 250, 25];
    var d5 = [-20, 280, 0];
    var Point6 = [60, -60, 15];
    var d6 = [-30, 650, 5*25];
    var Point7 = [-20, -100, 0];
    var d7 = [40, 100, -50];
    var Point8 = [120, -80, -15*2.5];
    var d8 = [120, 50, -125];
    var Point9 = [0, 0, 0];
    var d9 = [40, 70, -25];

	var Points0 = [Point0,d0,Point1,d1]; 
	var C0 = function(t_) {return Cubic(Hermite,Points0,t_);};
    var C0prime = function(t_) {return Cubic(HermiteDerivative,Points0,t_);};

    var Points1 = [Point1, d1, Point2, d2];
    var C1 = function(t_) { return Cubic(Hermite, Points1, t_); };
    var C1prime = function(t_) { return Cubic(HermiteDerivative, Points1, t_); };

    var Points2 = [Point2, d2, Point3, d3];
    var C2 = function(t_) { return Cubic(Hermite, Points2, t_); };
    var C2prime = function(t_) { return Cubic(HermiteDerivative, Points2, t_); };

    var Points3 = [Point3, d3, Point4, d4];
    var C3 = function(t_) { return Cubic(Hermite, Points3, t_); };
    var C3prime = function(t_) { return Cubic(HermiteDerivative, Points3, t_); };

    var Points4 = [Point4, d4, Point5, d5];
    var C4 = function(t_) { return Cubic(Hermite, Points4, t_); };
    var C4prime = function(t_) { return Cubic(HermiteDerivative, Points4, t_); };

    var Points5 = [Point5, d5, Point6, d6];
    var C5 = function(t_) { return Cubic(Hermite, Points5, t_); };
    var C5prime = function(t_) { return Cubic(HermiteDerivative, Points5, t_); };

    var Points6 = [Point6, d6, Point7, d7];
    var C6 = function(t_) { return Cubic(Hermite, Points6, t_); };
    var C6prime = function(t_) { return Cubic(HermiteDerivative, Points6, t_); };

    var Points7 = [Point7, d7, Point8, d8];
    var C7 = function(t_) { return Cubic(Hermite, Points7, t_); };
    var C7prime = function(t_) { return Cubic(HermiteDerivative, Points7, t_); };

    var Points8 = [Point8, d8, Point9, d9];
    var C8 = function(t_) { return Cubic(Hermite, Points8, t_); };
    var C8prime = function(t_) { return Cubic(HermiteDerivative, Points8, t_); };


    var selectCurve = function(t) {  
        if (t<1){
              var u = t;
              return C0(u);
          } 
        else if (t<2) {
              var u = t-1.0;
              return C1(u);
          }          
        else if (t<3) {
              var u = t-2.0;
              return C2(u);
          }          
        else if (t<4) {
              var u = t-3.0;
              return C3(u);
          } 
        else if (t<5) {
              var u = t-4.0;
              return C4(u);
          }          
        else if (t<6) {
              var u = t-5.0;
              return C5(u);
          } 
        else if (t<7) {
              var u = t-6.0;
              return C6(u);
          }
        else if (t<8) {
              var u = t-7.0;
              return C7(u);
          }
        else {
              var u = t-8.0;
              return C8(u);
          } 
      }
  
      var selectCurve_tangent = function(t) {
  if (t<1){
              var u = t;
              return C0prime(u);
          } 
        else if (t<2) {
              var u = t-1.0;
              return C1prime(u);
          }          
        else if (t<3) {
              var u = t-2.0;
              return C2prime(u);
          }          
        else if (t<4) {
              var u = t-3.0;
              return C3prime(u);
          } 
        else if (t<5) {
              var u = t-4.0;
              return C4prime(u);
          }          
        else if (t<6) {
              var u = t-5.0;
              return C5prime(u);
          } 
        else if (t<7) {
              var u = t-6.0;
              return C6prime(u);
          }      
        else if (t<8) {
              var u = t-7.0;
              return C7prime(u);
          }
        else {
              var u = t-8.0;
              return C8prime(u);
          }           
      }

	var CameraCurve = function(angle) {
        var distance = 120.0;
        var eye = vec3.create();
        eye[0] = distance*Math.sin(viewAngle);
        eye[1] = 100;
        eye[2] = distance*Math.cos(viewAngle);  
        return [eye[0],eye[1],eye[2]];
    }
	
    function drawPath(t_begin,t_end,intervals,C,Tx,color) {
	    context.strokeStyle=color;
	    context.beginPath();
        moveToTx(C(t_begin),Tx);
        for(var i=1;i<=intervals;i++){
            var t=((intervals-i)/intervals)*t_begin+(i/intervals)*t_end;
            lineToTx(C(t),Tx);
        }
        context.stroke();
	}

	// Create Camera (lookAt) transform
    var eyeCamera = CameraCurve(viewAngle);
    var targetCamera = vec3.fromValues(0,0,0); // Aim at the origin of the world coords
    var upCamera = vec3.fromValues(0,100,0); // Y-axis of world coords to be vertical
	var TlookAtCamera = mat4.create();
    mat4.lookAt(TlookAtCamera, eyeCamera, targetCamera, upCamera);
      
    // Create Camera (lookAt) transform
    var eyeObserver = vec3.fromValues(500,300,500);
    var targetObserver = vec3.fromValues(0,50,0); // Observer still looks at origin
    var upObserver = vec3.fromValues(0,1,0); // Y-axis of world coords to be vertical
	var TlookAtObserver = mat4.create();
    mat4.lookAt(TlookAtObserver, eyeObserver, targetObserver, upObserver);
      
    // Create ViewPort transform (assumed the same for both canvas instances)
    var Tviewport = mat4.create();
	mat4.fromTranslation(Tviewport,[200,300,0]);  // Move the center of the

    mat4.scale(Tviewport,Tviewport,[100,-100,1]); // Flip the Y-axis,
  

    context = cameraContext;

    // Create Camera projection transform
    // (orthographic for now)
    var TprojectionCamera = mat4.create();
    mat4.ortho(TprojectionCamera,-100,100,-100,100,-1,1);
    //mat4.perspective(TprojectionCamera,Math.PI/4,1,-1,1); // Use for perspective teaser!

    // Create Observer projection transform
    // (orthographic for now)
    var TprojectionObserver = mat4.create();
    mat4.ortho(TprojectionObserver,-120,120,-120,120,-1,1);
     
    // Create transform t_VP_PROJ_CAM that incorporates
    // Viewport, projection and camera transforms
    var tVP_PROJ_VIEW_Camera = mat4.create();
    mat4.multiply(tVP_PROJ_VIEW_Camera,Tviewport,TprojectionCamera);
    mat4.multiply(tVP_PROJ_VIEW_Camera,tVP_PROJ_VIEW_Camera,TlookAtCamera);
    var tVP_PROJ_VIEW_Observer = mat4.create();
    mat4.multiply(tVP_PROJ_VIEW_Observer,Tviewport,TprojectionObserver);
    mat4.multiply(tVP_PROJ_VIEW_Observer,tVP_PROJ_VIEW_Observer,TlookAtObserver);
      
	// Create model(ing) transform
    // (from moving object to world)
    var Tmodel = mat4.create();
	mat4.fromTranslation(Tmodel,selectCurve(tParam));
    var tangent = selectCurve_tangent(tParam);
    var angle = Math.atan2(tangent[1],tangent[0]);
	mat4.rotateZ(Tmodel,Tmodel,angle);

    
    var tVP_PROJ_VIEW_MOD_Camera = mat4.create();
	mat4.multiply(tVP_PROJ_VIEW_MOD_Camera, tVP_PROJ_VIEW_Camera, Tmodel);
    var tVP_PROJ_VIEW_MOD1_Observer = mat4.create();
	mat4.multiply(tVP_PROJ_VIEW_MOD1_Observer, tVP_PROJ_VIEW_Observer, Tmodel);
    var tVP_PROJ_VIEW_MOD2_Observer = mat4.create();
    mat4.translate(tVP_PROJ_VIEW_MOD2_Observer, tVP_PROJ_VIEW_Observer, eyeCamera);
	var TlookFromCamera = mat4.create();
    mat4.invert(TlookFromCamera,TlookAtCamera);
    mat4.multiply(tVP_PROJ_VIEW_MOD2_Observer, tVP_PROJ_VIEW_MOD2_Observer, TlookFromCamera);



    

    // Draw the following in the Camera window
	context = cameraContext;
	drawPath(0.0, 1.0, 100, C0, tVP_PROJ_VIEW_Camera, "purple"); 
    drawPath(0.0, 1.0, 100, C1, tVP_PROJ_VIEW_Camera, "blue");
    drawPath(0.0, 1.0, 100, C2, tVP_PROJ_VIEW_Camera, "#00FF00");
    drawPath(0.0, 1.0, 100, C3, tVP_PROJ_VIEW_Camera, "orange");
    drawPath(0.0, 1.0, 100, C4, tVP_PROJ_VIEW_Camera, "maroon");
    drawPath(0.0, 1.0, 100, C5, tVP_PROJ_VIEW_Camera, "red");
    drawPath(0.0, 1.0, 100, C6, tVP_PROJ_VIEW_Camera, "green");
    drawPath(0.0, 1.0, 100, C7, tVP_PROJ_VIEW_Camera, "yellow");
    drawPath(0.0, 1.0, 100, C8, tVP_PROJ_VIEW_Camera, "cyan");


     
	drawBee("yellow",tVP_PROJ_VIEW_MOD_Camera, tParam);

      
	  
	// Draw the following in the Observer window
    context = observerContext;
	drawPath(0.0,1.0,100,C0,tVP_PROJ_VIEW_Observer,"purple");
    drawPath(0.0,1.0,100,C1,tVP_PROJ_VIEW_Observer,"blue");
    drawPath(0.0,1.0,100,C2,tVP_PROJ_VIEW_Observer,"#00FF00");
    drawPath(0.0,1.0,100,C3,tVP_PROJ_VIEW_Observer,"orange");
    drawPath(0.0,1.0,100,C4,tVP_PROJ_VIEW_Observer,"maroon");
    drawPath(0.0,1.0,100,C5,tVP_PROJ_VIEW_Observer,"red");
    drawPath(0.0,1.0,100,C6,tVP_PROJ_VIEW_Observer,"green");
    drawPath(0.0,1.0,100,C7,tVP_PROJ_VIEW_Observer,"yellow");
    drawPath(0.0,1.0,100,C8,tVP_PROJ_VIEW_Observer,"cyan");
	drawCamera("white",tVP_PROJ_VIEW_MOD2_Observer,10.0); 
	drawUVWAxes("white",tVP_PROJ_VIEW_MOD2_Observer,100.0);  
	drawFlower(tVP_PROJ_VIEW_Observer);
	drawBee("yellow",tVP_PROJ_VIEW_Observer, tParam);
  
    t +=0.02;
	tParam = tParam + 0.01;
      
    window.requestAnimationFrame(draw);

    } //end draw
          	
  window.requestAnimationFrame(draw);


}
window.onload = setup;