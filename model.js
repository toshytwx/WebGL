class Model {
    constructor(name) {
        this.name = name;
        this.vertices = [];
        this.uLines = [];
        this.vLines = [];
    }

    bindBufferData() {
        this.vertices = this.generateVertices();
        this.iVertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    }

    draw() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.vertexAttribPointer(shProgram.iAttribVertex, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shProgram.iAttribVertex);
    
        const uLineSegments = this.uLines.length;
        const vLineSegments = this.vLines.length;
        const pointsInULine = this.uLines[0].length;
        const uVerticesCount = uLineSegments * pointsInULine;
    
        for (let uIndex = 0; uIndex < uLineSegments; uIndex++) {
            const uOffset = uIndex * pointsInULine;
            gl.drawArrays(gl.LINE_STRIP, uOffset, pointsInULine);
        }
    
        for (let vIndex = 0; vIndex < vLineSegments; vIndex++) {
            const vOffset = uVerticesCount + vIndex * uLineSegments;
            gl.drawArrays(gl.LINE_STRIP, vOffset, uLineSegments);
        }
    }

    createSurfaceData(a, c, theta) {
        let numSegments = 72;  // Number of rotation segments (360 degrees / numSegments)
        let numSteps = 20;     // Number of steps along the parabola (T direction)
        let maxT = 1.0;        // Maximum value of T (controls height of parabola)
    
        // Convert theta to radians
        theta = this.deg2rad(theta);
    
        // Loop over the U direction (rotation angle)
        for (let i = 0; i <= numSegments; i++) {
            let uLine = [];
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
                
                uLine.push([x, y, z]);
            }
            this.uLines.push(uLine);
        }

        this.vLines = this.transpose(this.uLines);
    }

    generateVertices() {
        return this.uLines.flat(2).concat(this.vLines.flat(2));
    }

    transpose(matrix) {
        const [numRows, numCols] = [matrix.length, matrix[0].length];
        return Array.from({ length: numCols }, (_, col) =>
            Array.from({ length: numRows }, (_, row) => matrix[row][col])
        );
    }
      

    deg2rad(angle) {
        return angle * Math.PI / 180;
    }
}