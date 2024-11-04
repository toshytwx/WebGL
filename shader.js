class ShaderProgram {
    constructor(name, program, gl) {
        this.name = name;
        this.prog = program;

        gl.useProgram(this.prog);

        this.iAttribPosition = gl.getAttribLocation(this.prog, "aPosition");
        this.iAttribNormal = gl.getAttribLocation(this.prog, "aNormal");
        this.iModelViewMatrix = gl.getUniformLocation(this.prog, "uModelViewMatrix");
        this.iProjectionMatrix = gl.getUniformLocation(this.prog, "uProjectionMatrix");
        this.iNormalMatrix = gl.getUniformLocation(this.prog, "uNormalMatrix");
        this.iLightDirection = gl.getUniformLocation(this.prog, "uLightDirection");
        this.iColor = gl.getUniformLocation(this.prog, "color");
    }
}
export { ShaderProgram };
