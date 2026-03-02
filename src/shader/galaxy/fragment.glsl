// uniform vec3 uColor;
varying vec3 vColor;
void main() {
  
    // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);

    // float strength = distance(gl_PointCoord, vec2(0.5));
    // strength = step(0.5, distanceToCenter);
    // strength = 1.0 - strength;

    // 散射效果 diffuse
    // float strength = distance(gl_PointCoord, vec2(0.5));
    // strength *= 2.0;
    // strength = 1.0 - strength;

    // light 
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength, 10.0);

    // final
    vec3 color = mix(vec3(0.0), vColor, strength);

    gl_FragColor = vec4(color, 1.0);
}