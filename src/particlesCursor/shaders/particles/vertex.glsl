uniform vec2 uResolution;
uniform sampler2D uParticleTexture;
uniform sampler2D uDisplacementTexture;
varying vec3 vColor;
void main()
{
    // Final position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // picture
    float pictureIntensity = texture(uParticleTexture, uv).r;
    // Point size
    gl_PointSize = 0.15 * pictureIntensity * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    // Color
    vColor = vec3(pow(pictureIntensity, 2.0));
}