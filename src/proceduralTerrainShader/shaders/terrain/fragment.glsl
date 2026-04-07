uniform vec3 uWaterDeep;
uniform vec3 uWaterSurface;
uniform vec3 uLand;
uniform vec3 uGrass;
uniform vec3 uSnow;
uniform vec3 uRock;
varying vec3 vPosition;
varying float vUpDot;
#include ../includes/simplexNoise2d.glsl

void main  () {
    vec3 color = vec3(1.0);

    //water
    float surfaceWaterMix = smoothstep(-1.0, -0.1, vPosition.y);
    color = mix(uWaterDeep, uWaterSurface, surfaceWaterMix);

    //sand
    float sandMix = step(-0.1, vPosition.y);
    color = mix(color, uLand, sandMix);

    // grass
    float grassMix = step(-0.06, vPosition.y);
    color = mix(color, uGrass, grassMix);

    //rock
    float rockMix = vUpDot;
    rockMix = 1.0 - step(0.8, rockMix);
    rockMix *= step(-0.06, vPosition.y);
    color = mix(color, uRock, rockMix);

    //snow
    float snowThreshold = 0.45;
    snowThreshold += simplexNoise2d(vPosition.xz * 15.0) * 0.1;
    float snowMix = step(snowThreshold, vPosition.y);
    color = mix(color, uSnow, snowMix);

    //final color
    csm_DiffuseColor = vec4(color, 1.0);
}
