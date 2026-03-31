uniform float uTime;
uniform float uDeltaTime;
uniform sampler2D uBase;
uniform float uFlowFieldInfluence;
uniform float uFlowFieldStrength;
uniform float uFlowFieldFrequency;

#include ../includes/simplexNoise4d.glsl

void main()
{
    float time = uTime * 0.2;
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 particle = texture(uParticles, uv);
    vec4 base = texture(uBase, uv);

    //dead
    if(particle.a>=1.0){
        // return decimal part
        particle.a = mod(particle.a, 1.0);
        particle.xyz = base.xyz;
    }else{
        //alive

        //strength of flow field
        float flowFieldStrength = simplexNoise4d(vec4(base.xyz * 0.2, time + 1.0));
        float influence = (uFlowFieldInfluence - 0.5) * (-2.0);
        flowFieldStrength = smoothstep(influence, 1.0, flowFieldStrength);
        // flow field
        vec3 flowField = vec3(
            simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency + 0.0, time)),
            simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency + 1.1, time)),
            simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency + 2.2, time))
        );
        flowField = normalize(flowField);
        particle.xyz += flowField * 0.5 * uDeltaTime * flowFieldStrength * uFlowFieldStrength;
        particle.a += 0.3 * uDeltaTime;
    }
    
    gl_FragColor = particle;
}