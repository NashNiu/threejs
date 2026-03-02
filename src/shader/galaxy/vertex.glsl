uniform float uSize;
attribute float aScale;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    /**
      * size
      */
    gl_PointSize = uSize * aScale;
    /**
     * 透视投影下，点的大小会随着距离而变化
     */
    gl_PointSize *= (1.0 / - viewPosition.z);
}