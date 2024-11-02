class Model {
    constructor(name) {
        this.name = name;
        this.vertices = [];
        this.uLines = [];
        this.vLines = [];
        this.indices = [];
    }

    bindBufferData(gl, shProgram) {
        this.vertices = this.generateVertices();
        this.iVertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        this.generateIndices();
        this.iIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
    }

    draw(gl, shProgram) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.vertexAttribPointer(shProgram.iAttribVertex, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shProgram.iAttribVertex);

        // Bind the index buffer
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iIndexBuffer);

        // Draw the triangles
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    }

    generateVertices() {
        return this.uLines.flat(2).concat(this.vLines.flat(2));
    }

    generateIndices() {
        this.indices = [];
        const uSegments = this.uLines.length;
        const vSegments = this.vLines.length;

        // Loop through the uLines and vLines to create two triangles per rectangle
        for (let u = 0; u < uSegments - 1; u++) {
            for (let v = 0; v < vSegments - 1; v++) {
                const topLeft = u * vSegments + v;
                const topRight = topLeft + 1;
                const bottomLeft = (u + 1) * vSegments + v;
                const bottomRight = bottomLeft + 1;

                // Two triangles per rectangle
                this.indices.push(topLeft, bottomLeft, topRight);
                this.indices.push(bottomLeft, bottomRight, topRight);
            }
        }
    }

    createSurfaceData(a, c, theta, uGranularity, vGranularity) {
        let numSegments = uGranularity;  // Number of rotation segments (360 degrees / numSegments)
        let numSteps = vGranularity;     // Number of steps along the parabola (T direction)
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

export { Model };
