uniform vec2 uResolution;
uniform float uSize;
attribute vec3 aPositionTarget;
attribute float aSize;
uniform float uProgress;
varying vec3 vColor;
uniform vec3 uColorA;
uniform vec3 uColorB;


#include ../includes/simplexNoise3d.glsl

void main()
{
    // mixed position
    float noiseOrigin = snoise(position * 0.2);
    float noiseTarget = snoise(aPositionTarget * 0.2);
    float noise = mix(noiseOrigin, noiseTarget, uProgress);
    noise = smoothstep(-1.0, 1.0, noise);

    float duration = 0.4;
    float delay = (1.0 - duration) * noise;
    float end = delay + duration;
    float progress = smoothstep(delay, end, uProgress);
    vec3 mixedPosition = mix(position, aPositionTarget, progress);
    // Final position
    vec4 modelPosition = modelMatrix * vec4(mixedPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Point size
    gl_PointSize = uSize * aSize * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    // Color
    vColor = mix(uColorA, uColorB, noise);
}