attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform vec3 uLightDirection; // Directional light source

varying vec3 vColor;

void main() {
    vec3 normal = normalize((uNormalMatrix * vec4(aNormal, 0.0)).xyz);
    float lightIntensity = max(dot(normal, normalize(uLightDirection)), 0.0);

    vColor = vec3(1.0, 0.6, 0.3) * lightIntensity; // Modify color as needed

    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
}
