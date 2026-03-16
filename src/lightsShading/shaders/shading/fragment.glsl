uniform vec3 uColor;
varying vec3 vNormal;

varying vec3 vPosition;

#include ../includes/ambientLight.glsl
#include ../includes/directionLight.glsl



void main(){
    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 color = uColor;

    // light
    vec3 light = vec3(0.0, 0.0, 0.0); // Light direction
     // Add ambient light
    light += ambientLight(
        vec3(1.0, 1.0, 1.0), // lightColor
        0.03 // lightIntensity
    );

     // Add direction light
    light += directionLight(
        vec3(0.1, 0.1, 1.0), // lightColor
        1.0, // lightIntensity
        normal, // normal
        vec3(0.0, 0.0, 3.0), // light position
        viewDirection, // viewDirection
        20.0  // specularPower
    );
    color *= light; // Apply light to the color

    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}