import restart from "vite-plugin-restart";
import { resolve } from "path";
import glsl from "vite-plugin-glsl";
import react from "@vitejs/plugin-react";
export default {
  root: "src/", // Sources files (typically where index.html is)
  publicDir: "../static/", // Path from "root" to static assets (files that are served as they are)
  server: {
    host: true, // Open to local network and display URL
    open: !("SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env), // Open if it's not a CodeSandbox
  },
  build: {
    outDir: "../dist", // Output in the dist/ folder
    emptyOutDir: true, // Empty the folder first
    sourcemap: true, // Add sourcemap
    target: "esnext",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        scroll: resolve(__dirname, "src/scroll.html"),
        fox: resolve(__dirname, "src/fox/index.html"),
        modifiedMaterial: resolve(__dirname, "src/modifiedMaterial/index.html"),
        coffeeSmoke: resolve(__dirname, "src/coffeeSmoke/index.html"),
        holographic: resolve(__dirname, "src/hologramShader/index.html"),
        fireworks: resolve(__dirname, "src/fireworks/index.html"),
        lightsShading: resolve(__dirname, "src/lightsShading/index.html"),
        ragingSea: resolve(__dirname, "src/ragingSea/index.html"),
        halftoneShading: resolve(__dirname, "src/halftoneShading/index.html"),
        earth: resolve(__dirname, "src/earth/index.html"),
        particlesCursor: resolve(__dirname, "src/particlesCursor/index.html"),
        particlesMorphing: resolve(
          __dirname,
          "src/particlesMorphing/index.html",
        ),
        gpgpuParticles: resolve(__dirname, "src/gpgpu/index.html"),
        wobblySphereShader: resolve(
          __dirname,
          "src/wobblySphereShader/index.html",
        ),
        slicedModelShader: resolve(
          __dirname,
          "src/slicedModelShader/index.html",
        ),
        proceduralTerrainShader: resolve(
          __dirname,
          "src/proceduralTerrainShader/index.html",
        ),
        postProcessing: resolve(__dirname, "src/postProcessing/index.html"),
        performanceTips: resolve(__dirname, "src/performanceTips/index.html"),
        introAndLoading: resolve(__dirname, "src/introAndLoading/index.html"),
        mixHtmlAndWebgl: resolve(__dirname, "src/mixHtmlAndWebgl/index.html"),
        firstReactApplication: resolve(
          __dirname,
          "src/react/firstReactApp/src/index.html",
        ),
        firstR3fApplication: resolve(
          __dirname,
          "src/react/firstR3fApp/src/index.html",
        ),
        dreiApplication: resolve(
          __dirname,
          "src/react/drei/src/index.html",
        ),
        debugApplication: resolve(
          __dirname,
          "src/react/debug/src/index.html",
        ),
        environmentMapApplication: resolve(
          __dirname,
          "src/react/environment/src/index.html",
        ),
        loadModelApplication: resolve(
          __dirname,
          "src/react/loadModel/src/index.html",
        ),
        _3dTextApplication: resolve(
          __dirname,
          "src/react/3dText/src/index.html",
        ),
        portalSceneApplication: resolve(
          __dirname,
          "src/react/portalScene/src/index.html",
        ),
        mouseEventApplication: resolve(
          __dirname,
          "src/react/mouseEvent/src/index.html",
        ),
         postProcessingApp: resolve(
          __dirname,
          "src/react/postProcessing/src/index.html",
        )
      },
    },
  },
  plugins: [
    restart({ restart: ["../static/**"] }), // Restart server on static file change
    react(),
    glsl({
      include: /\.(glsl|vs|fs|vert|frag)$/,
    }),
  ],
};
