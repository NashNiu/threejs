#define PI 3.141592653
varying vec2 vUv;
float random (vec2 st) {
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}
vec2 rotate(vec2 uv, float rotation, vec2 mid){
    return vec2(
        cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
        cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}
void main(){
    // float strength = 1.0 - vUv.y;

    // float strength = vUv.y;
    
    // if(strength < 0.5){
    //     strength = 0.0;
    // }else{
    //     strength = 1.0;
    // };
    // strength = strength < 0.5 ? 0.0 : 1.0;

    // float strength = mod(vUv.y * 10.0, 1.0);
    // strength = step(0.8, strength);

    // float strength = mod(vUv.x * 10.0, 1.0);
    // strength = step(0.8, strength);

    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength += step(0.8, mod(vUv.y * 10.0, 1.0));

    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength *= step(0.8, mod(vUv.y * 10.0, 1.0));

    // float strength = step(0.2, mod(vUv.x * 10.0, 1.0));
    // strength *= step(0.8, mod(vUv.y * 10.0, 1.0));

    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    // barX *= step(0.8, mod(vUv.y * 10.0, 1.0));
    // float barY = step(0.8, mod(vUv.x * 10.0, 1.0));
    // barY *= step(0.4, mod(vUv.y * 10.0, 1.0));
    // float strength = barX + barY;

    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    // barX *= step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0));
    // float barY = step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0));
    // barY *= step(0.4, mod(vUv.y * 10.0, 1.0));
    // float strength = barX + barY;

    // float strength = abs(vUv.x - 0.5);

    // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

    // float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

    // float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

    // float square1 = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // float square2  = 1.0 - step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // float strength = square1 * square2;

    // float strength = floor(vUv.x * 10.0) / 10.0;

    // float strength = floor(vUv.y * 10.0) / 10.0;
    // strength *= floor(vUv.x * 10.0) / 10.0;

    // float strength = random(vUv);

    // vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0,
    //                    floor(vUv.y * 10.0) / 10.0);
    // float strength = random(gridUv);

    // vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0,
    //                    floor(vUv.y * 10.0 + + vUv.x * 5.0) / 10.0);
    // float strength = random(gridUv);

    // float strength = length(vUv);

    // float strength = distance(vUv, vec2(0.5, 0.2));

    // float strength = 1.0 - distance(vUv, vec2(0.5));

    // float strength = 0.015 / distance(vUv, vec2(0.5));

    // vec2 lightUv = vec2(
    //     vUv.x * 0.1 + 0.45,
    //     vUv.y * 0.5 + 0.25
    // );
    // float strength = 0.015 / distance(lightUv, vec2(0.5));


    vec2 rotatedUv = rotate(vUv, PI * 0.25, vec2(0.5));
    vec2 lightUvX = vec2(rotatedUv.x * 0.1 + 0.45, rotatedUv.y * 0.5 + 0.25);
    float lightX = 0.015 / distance(lightUvX, vec2(0.5));
    vec2 lightUvY = vec2(rotatedUv.y * 0.1 + 0.45, rotatedUv.x * 0.5 + 0.25);
    float lightY = 0.015 / distance(lightUvY, vec2(0.5));
    float strength = lightX * lightY;


    gl_FragColor = vec4(strength, strength, strength, 1.0);
}