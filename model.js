class Model {
    constructor(name) {
        this.name = name;
        this.iVertexBuffer = gl.createBuffer();
        this.count = 0;
        this.vertices = []
    }

    bindBufferData() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STREAM_DRAW);

        this.count = this.vertices.length / 3;
    }

    draw() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.vertexAttribPointer(shProgram.iAttribVertex, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shProgram.iAttribVertex);

        gl.drawArrays(gl.LINE_STRIP, 0, this.count);
    }

    createSurfaceData(a, c, theta) {
        let vertexList = [];
        let numSegments = 72;  // Number of rotation segments (360 degrees / numSegments)
        let numSteps = 20;     // Number of steps along the parabola (T direction)
        let maxT = 1.0;        // Maximum value of T (controls height of parabola)
    
        // Convert theta to radians
        theta = this.deg2rad(theta);
    
        // Loop over the U direction (rotation angle)
        for (let i = 0; i <= numSegments; i++) {
            let u = this.deg2rad(i * 360 / numSegments); // U is the angle of rotation
    
            // Loop over the T direction (position along the parabola)
            for (let t = 0; t <= maxT; t += maxT / numSteps) {
                // Parametric equations for the surface of revolution
                let cosTheta = Math.cos(theta);
                let sinTheta = Math.sin(theta);
                let ctSquared = c * t * t;
    
                let x = (a + t * cosTheta + ctSquared * sinTheta) * Math.cos(u);
                let y = (a + t * cosTheta + ctSquared * sinTheta) * Math.sin(u);
                let z = -t * sinTheta + ctSquared * cosTheta;
    
                // Add the computed vertex to the vertex list
                vertexList.push(x, y, z);
            }
        }
    
        this.vertices = vertexList;
    }

    deg2rad(angle) {
        return angle * Math.PI / 180;
    }
}