uniform vec3 uColor;

#include ../includes/ambientLight.glsl

void main(){
    vec3 color = uColor;

    // light
    vec3 light = vec3(0.0, 0.0, 0.0); // Light direction
     // Add ambient light
    light += ambientLight(
        vec3(1.0, 1.0, 1.0), // lightColor
        0.2 // lightIntensity
    );
    color *= light; // Apply light to the color

    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}