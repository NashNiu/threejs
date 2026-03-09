vec2 rotate2D(vec2 value, float angle) {
    float sinAngle = sin(angle);
    float cosAngle = cos(angle);
    mat2 rotationMatrix = mat2(cosAngle, -sinAngle, sinAngle, cosAngle);
    return rotationMatrix * value;
}