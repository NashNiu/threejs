attribute vec4 tangent;
uniform float uTime;
uniform float uPositionFrequency;
uniform float uTimerFrequency;
uniform float uStrength;
uniform float uWrapPositionFrequency;
uniform float uWrapTimerFrequency;
uniform float uWrapStrength;
varying float vWobble;
#include ../includes/simplexNoise4d.glsl

float getWobble(vec3 position)
{
    vec3 warpedPosition = position;
    warpedPosition += simplexNoise4d(vec4(
            position * uWrapPositionFrequency,
            uTime * uWrapTimerFrequency
        )) * uWrapStrength;

    return simplexNoise4d(vec4( 
        warpedPosition * uPositionFrequency,
        uTime * uTimerFrequency
    )) * uStrength;
}

void main()
{
    vec3 bTangent = cross(normal, tangent.xyz);
    // neighbor
    float shift = 0.01;
    vec3 positionA = csm_Position + tangent.xyz * shift;
    vec3 positionB = csm_Position + bTangent.xyz * shift;

    // wobble
    float wobble = getWobble(csm_Position);
    csm_Position += wobble * normal;
    positionA += getWobble(positionA) * normal;
    positionB += getWobble(positionB) * normal;

    // compute normal
    vec3 toA = normalize(positionA - csm_Position);
    vec3 toB = normalize(positionB - csm_Position);
    csm_Normal = cross(toA, toB);

    vWobble = wobble / uStrength;
   }
