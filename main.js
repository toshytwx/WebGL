import { Model } from './model.js';
import { TrackballRotator } from './Utils/trackball-rotator.js'
import { ShaderProgram } from './shader.js'


let gl;                         // The WebGL context
let surface;                    // A surface model
let shProgram;                  // A shader program
let spaceball;                  // A SimpleRotator object that lets the user rotate the view by mouse

function draw() {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Set the values of the projection transformation
    const projection = m4.perspective(Math.PI / 8, 1, 8, 12);

    // Get the view matrix from the SimpleRotator object
    const modelView = spaceball.getViewMatrix();

    const rotateToPointZero = m4.axisRotation([0.707, 0.707, 0], 0.7);
    const translateToPointZero = m4.translation(0, 0, -10);

    const matAccum0 = m4.multiply(rotateToPointZero, modelView);
    const matAccum1 = m4.multiply(translateToPointZero, matAccum0);

    // Multiply the projection matrix times the modelview matrix
    const modelViewProjection = m4.multiply(projection, matAccum1);

    gl.uniformMatrix4fv(shProgram.iModelViewProjectionMatrix, false, modelViewProjection);
    gl.uniform4fv(shProgram.iColor, [1, 1, 1, 1]);

    surface.draw(gl, shProgram);
}

// Initialize the WebGL context
function initGL() {
    const prog = createProgram(gl, vertexShaderSource, fragmentShaderSource);
    shProgram = new ShaderProgram('Lab 1', prog, gl);
    surface = new Model('Surface of Revolution of a Parabola of Arbitrary Position');
    surface.createSurfaceData(0.8, 1.25, 270);
    surface.bindBufferData(gl);

    gl.enable(gl.DEPTH_TEST);
}

// Creates a program for use in the WebGL context gl
function createProgram(gl, vShader, fShader) {
    const vsh = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vsh, vShader);
    gl.compileShader(vsh);
    if (!gl.getShaderParameter(vsh, gl.COMPILE_STATUS)) {
        throw new Error("Error in vertex shader:  " + gl.getShaderInfoLog(vsh));
    }

    const fsh = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fsh, fShader);
    gl.compileShader(fsh);
    if (!gl.getShaderParameter(fsh, gl.COMPILE_STATUS)) {
        throw new Error("Error in fragment shader:  " + gl.getShaderInfoLog(fsh));
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, vsh);
    gl.attachShader(prog, fsh);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        throw new Error("Link error in program:  " + gl.getProgramInfoLog(prog));
    }

    return prog;
}

function init() {
    let canvas;
    try {
        canvas = document.getElementById("webglcanvas");
        gl = canvas.getContext("webgl");
        if (!gl) {
            throw "Browser does not support WebGL";
        }
    } catch (e) {
        document.getElementById("canvas-holder").innerHTML =
            "<p>Sorry, could not get a WebGL graphics context.</p>";
        return;
    }

    try {
        initGL();  // Initialize the WebGL graphics context
    } catch (e) {
        document.getElementById("canvas-holder").innerHTML =
            "<p>Sorry, could not initialize the WebGL graphics context: " + e + "</p>";
        return;
    }

    spaceball = new TrackballRotator(canvas, draw, 0);
    draw();
}

// Call the init function to start everything
init();
