# TODO List - Quick Reference

**Last Updated:** January 2026

This is a quick-reference TODO list. See `HANDOFF.md` for detailed context and `PLAN.md` for the complete roadmap.

---

## Phase 1: Core MVP (Current Phase)

### Core Rendering Infrastructure
- [ ] `src/core/Canvas.ts` - Canvas initialization & WebGL context management
- [ ] `src/core/GLContext.ts` - WebGL wrapper with error handling
- [ ] `src/core/Renderer.ts` - Base renderer interface

### GPU Resources
- [ ] `src/resources/Buffer.ts` - Vertex/Index buffer abstraction
- [ ] `src/resources/Shader.ts` - Shader compilation & program management
- [ ] `src/resources/VertexArray.ts` - VAO abstraction (WebGL 2)
- [ ] `src/resources/Texture.ts` - Texture loading & management

### Geometry System
- [ ] `src/geometry/Geometry.ts` - Base geometry class
- [ ] `src/geometry/BufferGeometry.ts` - Geometry with buffer data
- [ ] Triangle geometry primitive
- [ ] Quad geometry primitive

### Material System
- [ ] `src/materials/Material.ts` - Base material class
- [ ] `src/materials/BasicMaterial.ts` - Flat color material

### Scene Graph
- [ ] `src/scene/Object3D.ts` - Base class for all scene objects
- [ ] `src/scene/Scene.ts` - Root scene container
- [ ] `src/scene/Mesh.ts` - Renderable mesh object

### Renderer Implementation
- [ ] `src/renderer/WebGLRenderer.ts` - Main WebGL renderer

### Basic Image Export
- [ ] Browser: `canvas.toDataURL()` wrapper
- [ ] Basic image export API

### Demo
- [ ] Rotating colored triangle/cube demo

---

## Phase 2: Geometry & Primitives

- [ ] `src/geometry/primitives/Box.ts`
- [ ] `src/geometry/primitives/Sphere.ts`
- [ ] `src/geometry/primitives/Plane.ts`
- [ ] `src/geometry/primitives/Cylinder.ts`
- [ ] `src/geometry/primitives/Torus.ts`
- [ ] `src/geometry/curves/BezierCurve.ts`
- [ ] `src/geometry/curves/CatmullRomCurve.ts`
- [ ] `src/geometry/surfaces/Superellipsoid.ts`
- [ ] `src/geometry/surfaces/RotationalSolid.ts`
- [ ] `src/utils/Transform.ts` - Transform helpers

---

## Phase 3: Scene Graph & Cameras

- [ ] `src/camera/Camera.ts` - Base camera class
- [ ] `src/camera/PerspectiveCamera.ts`
- [ ] `src/camera/OrthographicCamera.ts`
- [ ] Camera controls (basic orbit controls)
- [ ] Frustum culling (basic implementation)

---

## Phase 4: Lighting & Materials

- [ ] `src/lights/Light.ts` - Base light class
- [ ] `src/lights/AmbientLight.ts`
- [ ] `src/lights/DirectionalLight.ts`
- [ ] `src/lights/PointLight.ts`
- [ ] `src/lights/SpotLight.ts`
- [ ] `src/materials/LambertMaterial.ts`
- [ ] `src/materials/PhongMaterial.ts`
- [ ] `src/materials/MirrorMaterial.ts`
- [ ] Basic shadow mapping (optional)

---

## Phase 5: Animation System

- [ ] `src/animation/Clock.ts` - Time management
- [ ] `src/animation/KeyframeTrack.ts` - Individual property tracks
- [ ] `src/animation/AnimationClip.ts` - Keyframe animation clips
- [ ] `src/animation/AnimationMixer.ts` - Animation mixer

---

## Phase 6: Asset Loading

- [ ] `src/loaders/OBJLoader.ts`
- [ ] `src/loaders/GLTFLoader.ts`

---

## Phase 7: Advanced Effects

- [ ] Mirror/reflective surfaces (environment mapping)
- [ ] Render-to-texture
- [ ] Post-processing effects (basic)
- [ ] Instanced rendering
- [ ] Performance optimizations

---

## Phase 8: Polish & Packaging

- [ ] Complete TypeScript definitions
- [ ] Documentation (API docs, examples)
- [ ] npm package setup
- [ ] Tree-shaking support
- [ ] Example projects
- [ ] Performance benchmarks
- [ ] WebGL 1.0 fallback (optional)

---

## Phase 9: Output Capabilities

- [ ] `src/output/OutputTarget.ts` - Abstract base class
- [ ] `src/output/CanvasOutput.ts` - Browser canvas output
- [ ] `src/output/NodeWindowOutput.ts` - Node.js window output
- [ ] `src/output/ImageOutput.ts` - Image export (PNG, JPEG)
- [ ] `src/output/VideoOutput.ts` - Video export (MP4, WebM)
- [ ] `src/output/FrameCapture.ts` - Frame-by-frame capture utilities

---

## Phase 10: Interactivity Module

- [ ] `src/interactivity/InputManager.ts` - Main input manager
- [ ] `src/interactivity/MouseHandler.ts` - Mouse event handling
- [ ] `src/interactivity/KeyboardHandler.ts` - Keyboard event handling
- [ ] `src/interactivity/VideoCaptureHandler.ts` - WebRTC video capture
- [ ] `src/interactivity/EventTypes.ts` - Type definitions

---

## Utilities & Helpers

- [ ] `src/utils/Color.ts` - Color utilities
- [ ] `src/utils/MathUtils.ts` - Scalar math functions (clamp, smoothstep, etc.)

---

## Testing & Quality

- [ ] Add tests for all new modules (maintain 95%+ line coverage, 90%+ branch coverage)
- [ ] Fix remaining uncovered lines in existing code (see HANDOFF.md)
- [ ] Add integration tests for rendering pipeline
- [ ] Performance benchmarks

---

## Documentation

- [ ] API documentation (JSDoc)
- [ ] Concept documentation (`docs/concepts/`)
- [ ] Example projects (`examples/`)
- [ ] Tutorial guides

---

**Note:** This is a condensed TODO list. For detailed information about each item, see:
- `HANDOFF.md` - Comprehensive handoff documentation
- `PLAN.md` - Complete development roadmap with rationale
