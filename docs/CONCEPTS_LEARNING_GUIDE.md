# Learning Path Through Graphics Concepts

Progressive guide through graphics programming with this library, aligned to course content.

---

## Tier 1: Beginner (Phases 1-2)

### Learning Goal
Understand the WebGL rendering pipeline and how to create interactive 3D scenes.

### Core Concepts

#### 1. WebGL Rendering Pipeline
**What:** The complete journey from geometry to pixels on screen
```
Vertex Data → Vertex Shader → Rasterization → Fragment Shader → Screen
```

**Why It Matters:** Understanding each stage helps you debug problems and optimize performance.

**Where in Library:** `src/core/GLContext.ts`, shader classes

**Practical Example:**
```typescript
// Each vertex goes through: Vertex Shader → Fragment Shader
const vertices = [
  -1, -1, 0,  // First vertex
   1, -1, 0,  // Second vertex
   0,  1, 0   // Third vertex
];
// Vertex shader gets called 3 times (once per vertex)
// Fragment shader gets called thousands of times (once per pixel inside triangle)
```

#### 2. 3D Coordinate Systems
**What:** Different spaces we use to describe 3D geometry

**The Four Spaces:**
1. **Model Space (Object Space)** - Local coordinates relative to the object
   - Triangle at origin, facing +Z
   - Object can be positioned anywhere

2. **World Space** - Global scene coordinates
   - Where objects are positioned relative to scene
   - "The car is at position (10, 0, 5)"

3. **View Space (Camera Space)** - Coordinates relative to camera
   - Camera is at origin
   - "From the camera's perspective"

4. **Clip Space** - GPU-normalized coordinates
   - Ranges from -1 to +1
   - GPU automatically handles this transformation

5. **Screen Space** - Final pixel coordinates
   - (0, 0) is top-left, (width, height) is bottom-right

**Why It Matters:** When rendering fails, your coordinates might be in the wrong space.

**Where in Library:** `src/math/` for matrix operations, `src/scene/Camera.ts` for view/projection

**Practical Example:**
```typescript
// Model space: triangle relative to its origin
const triangle = new TriangleGeometry();  // Vertices in range (-1 to 1)

// World space: position the triangle in the scene
mesh.position.set(5, 0, -10);  // Now at (5, 0, -10) in world coords

// View space: camera looks at it
camera.position.set(0, 0, 0);
camera.lookAt(5, 0, -10);

// Clip space: GPU computes this automatically
// Screen space: pixels on canvas
```

#### 3. Transformations & Matrices
**What:** How to move, rotate, and scale objects using matrices

**Three Basic Transformations:**
- **Translation:** Move object to new position
- **Rotation:** Turn object around axis
- **Scale:** Make object bigger or smaller

**Why Matrix Order Matters:**
```typescript
// These are DIFFERENT!
translate(scale(rotate(x)))   // ≠  rotate(scale(translate(x)))

// Think of it like this:
// 1. Rotate the car
// 2. Then scale it (wheels bigger too)
// 3. Then move it
// vs.
// 1. Move the car
// 2. Then rotate it (wheels rotate around scene origin!)
// 3. Then scale it
```

**Where in Library:** `src/math/matrices/Matrix4.ts`, `src/scene/Object3D.ts`

**Practical Example:**
```typescript
const mesh = new Mesh(geometry, material);

// These are applied in order (local → world)
mesh.position.set(10, 5, 0);      // Translate to (10, 5, 0)
mesh.rotation.z = Math.PI / 4;    // Rotate 45° around Z-axis
mesh.scale.set(2, 2, 2);          // Make 2× bigger

// Library computes: Translation × Rotation × Scale = Final position
```

**Key Formula:**
```
Final Position = Parent Matrix × Translation × Rotation × Scale × Original Vertex
```

#### 4. Vertex Attributes
**What:** Data that varies per-vertex (position, color, normal, UV, etc.)

**Common Attributes:**
- **Position:** (x, y, z) coordinates
- **Color:** (r, g, b, a) per-vertex color
- **Normal:** (nx, ny, nz) direction face points
- **UV (Texture Coordinates):** (u, v) where to sample texture

**Why It Matters:** Different shaders need different attributes.

**Where in Library:** `src/resources/VertexArray.ts`, `src/geometry/Geometry.ts`

**Practical Example:**
```typescript
// Define vertices with color attribute
const vertices = [
  -1, -1, 0,  // Position
   1,  0, 0,  // Red vertex

   1, -1, 0,  // Position
   0,  1, 0,  // Green vertex

   0,  1, 0,  // Position
   0,  0, 1   // Blue vertex
];

// Vertex shader receives each attribute
// Fragment shader interpolates between them (smooth color gradient)
```

#### 5. Index Buffers & Winding Order
**What:** How to efficiently reuse vertices and define triangle orientation

**Winding Order:** Which direction triangle faces
```typescript
// Counter-clockwise when viewed from outside
vertices: [0, 1, 2]  // Face points TOWARD you

// Clockwise when viewed from outside
vertices: [0, 2, 1]  // Face points AWAY from you
```

**Why It Matters:**
- GPU culls back-facing triangles (for performance)
- Smooth shading depends on consistent winding
- Lighting calculations use face direction

**Where in Library:** `src/resources/buffers/IndexBuffer.ts`

---

## Tier 2: Intermediate (Phases 3-5)

### Learning Goal
Understand advanced geometry, realistic lighting, and interactive cameras.

### Advanced Concepts

#### 1. Parametric Geometry (CS536)
**What:** Defining curves and surfaces using mathematical functions

**Key Concept:** Instead of listing vertices, describe them mathematically
```typescript
// Non-parametric: List 100 vertices
const vertices = [x1, y1, z1, x2, y2, z2, ..., x100, y100, z100];

// Parametric: One formula
// Circle: x = cos(t), y = sin(t), z = 0  where t ∈ [0, 2π]
const circle = new ParametricCurve((t) => {
  return new Vector3(Math.cos(t), Math.sin(t), 0);
});
```

**Benefits:**
- Smooth, infinitely detailed
- Small memory footprint
- Mathematical precision

**Bezier Curves (CS536 A1-A2):**
```typescript
// Define with control points
const controlPoints = [p0, p1, p2, p3];
const curve = new BezierCurve(controlPoints);

// Evaluate at any parameter value (0 to 1)
const pointAt05 = curve.evaluate(0.5);  // Exact point at 50% along curve
```

**De Casteljau's Algorithm:**
The recursive evaluation formula that makes Bezier curves work
```typescript
// Simplified: De Casteljau computes point along curve
P(t) = (1-t)P0 + t*P1           // Linear interpolation
P(t) = (1-t)²P0 + 2(1-t)tP1 + t²P2  // Quadratic
// ...and so on for higher degrees
```

**Catmull-Rom Splines (CS536 A2):**
```typescript
// Interpolates THROUGH points (unlike Bezier)
const points = [p0, p1, p2, p3];
const spline = new CatmullRomSpline(points);

// Passes exactly through p1 and p2
const pointAtStart = spline.evaluate(0);  // Exactly p1
const pointAtEnd = spline.evaluate(1);    // Exactly p2

// Adjust tension for smooth or sharp curves
spline.tension = 0.5;  // Smoother
spline.tension = -0.5; // Sharper corners
```

**Where in Library:** `src/geometry/curves/`

#### 2. Parametric Surfaces (CS536 A3-A6)
**What:** 2D mathematical functions that define 3D surfaces

**Bezier Patches (CS536 A3):**
```typescript
// 4×4 grid of control points
const controlPoints = [
  [p00, p01, p02, p03],
  [p10, p11, p12, p13],
  [p20, p21, p22, p23],
  [p30, p31, p32, p33]
];
const patch = new BezierPatch(controlPoints);

// Evaluate at (u,v) parameter
const surfacePoint = patch.evaluate(0.5, 0.5);  // Point at center

// Generate renderable triangle mesh
const geometry = patch.toGeometry(20, 20);  // 20×20 grid of triangles
```

**Surfaces of Revolution (CS536 A4):**
```typescript
// Take a 2D curve and rotate it around an axis
const profile = new CatmullRomSpline([p0, p1, p2, p3]);
const surface = new SurfaceOfRevolution(profile);

// u = position along profile curve (0 to 1)
// v = rotation angle around axis (0 to 2π)
const point = surface.evaluate(u, v);
```

**Superellipsoids (CS536 A6):**
```typescript
// Generalized ellipsoid with shape parameters
const ellipsoid = new Superellipsoid({
  s1: 1.5,  // Shape parameter 1
  s2: 2.0,  // Shape parameter 2
  scaleX: 2, scaleY: 1, scaleZ: 3  // Dimensions
});

// Smooth sphere when s1=s2=1
// Gets pointy at poles as s1,s2 decrease
const point = ellipsoid.evaluate(u, v);
```

**Where in Library:** `src/geometry/surfaces/`

#### 3. Exact Normal Computation
**What:** Computing surface normals from mathematical derivatives

**Why It Matters:** Lighting quality depends on accurate normals
```typescript
// Poor: Average normals from mesh triangles (approximation)
normal ≈ average(face1.normal, face2.normal, ...)

// Excellent: Compute from surface derivatives (exact)
normal = ∂S/∂u × ∂S/∂v  // Cross product of partial derivatives
```

**Example:**
```typescript
// Surface evaluated as S(u,v) = (x(u,v), y(u,v), z(u,v))
// Partial derivatives tell us how surface changes:
// ∂S/∂u: Direction surface changes along u
// ∂S/∂v: Direction surface changes along v
// Cross product: Normal perpendicular to surface

const S_u = surface.derivative_u(u, v);
const S_v = surface.derivative_v(u, v);
const normal = S_u.cross(S_v).normalize();
```

**Impact on Lighting:**
- Wrong normals = wrong lighting (flat or glitchy appearance)
- Exact normals = smooth, realistic lighting

**Where in Library:** Surface classes compute normals in Phase 3

#### 4. Lighting & Shading
**What:** How light interacts with surfaces

**Phong Lighting Model:**
```
Color = Ambient + Diffuse + Specular

Ambient = Ka · Ia
  → Ambient light always present (no direction)

Diffuse = Kd · Id · max(0, N·L)
  → Brightness depends on angle to light
  → N = surface normal
  → L = direction to light

Specular = Ks · Is · max(0, R·V)^Sh
  → Shiny highlights
  → R = reflection of light
  → V = direction to viewer
  → Sh = shininess (higher = sharper highlight)
```

**Gouraud vs. Phong Shading:**
```typescript
// Gouraud (Per-Vertex)
// Computed in: Vertex Shader
// Result: Smooth color gradients
// Pro: Fast
// Con: Can miss details

// Phong (Per-Fragment)
// Computed in: Fragment Shader
// Result: Sharp highlights
// Pro: High quality
// Con: Slower (but not much slower than Gouraud!)
```

**Where in Library:** `src/materials/` (Phase 4)

#### 5. Camera Systems
**What:** Different ways to view your 3D scene

**Projection Types:**
```typescript
// Perspective: Objects farther away look smaller (realistic)
const camera = new PerspectiveCamera({
  fov: 75,       // Field of view in degrees
  aspect: 800/600, // Screen aspect ratio
  near: 0.1,     // Don't render closer than this
  far: 1000      // Don't render farther than this
});

// Orthographic: Objects same size regardless of distance (like blueprint)
const camera = new OrthographicCamera({
  left: -400, right: 400,
  top: 300, bottom: -300,
  near: 0.1, far: 1000
});
```

**Camera Control:**
```typescript
// Orbit camera around target
camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 0);  // Look at object

// Rotate around Y-axis
const angle = performance.now() * 0.001;
camera.position.x = Math.cos(angle) * 10;
camera.position.z = Math.sin(angle) * 10;
```

**Where in Library:** `src/camera/`

---

## Tier 3: Expert (Phases 6-10)

### Learning Goal
Understand advanced rendering techniques, optimization, and professional workflows.

### Expert Concepts

#### 1. Frame Buffer Objects (CSI699 A9)
**What:** Render to texture instead of screen

**Use Cases:**
- Picking (render with object IDs)
- Shadow mapping (render depth map)
- Post-processing (blur, bloom)
- Render-to-texture (reflections)

**Picking Example:**
```typescript
// Create FBO with 8-bit color (for object IDs)
const pickFBO = new Framebuffer(width, height, { format: 'rgba' });

// Render scene with each object a unique color
pickFBO.bind();
for (const [id, mesh] of objects.entries()) {
  material.setColor(idToColor(id));  // R,G,B encodes object ID
  renderer.render(mesh);
}
pickFBO.unbind();

// Read pixel at mouse click
const [r, g, b, a] = pickFBO.readPixel(mouseX, mouseY);
const objectID = colorToID(r, g, b);
```

**Where in Library:** `src/resources/Framebuffer.ts` (Phase 8)

#### 2. Performance Optimization
**What:** Techniques to maintain 60 FPS

**Key Optimizations:**
- **Batch Rendering:** Combine meshes to reduce draw calls
- **Level of Detail (LOD):** Use simpler models for distant objects
- **Frustum Culling:** Skip rendering objects outside camera view
- **Static Binding:** Avoid redundant GPU state changes

**In This Library:**
- Batching: Phase 9+
- LOD: Phase 9+
- Frustum Culling: Phase 3 (basic)
- Static Binding: Phase 1 (automatic)

#### 3. Asset Loading & Format Support
**What:** Loading 3D models from files

**Formats:**
- **SMF (Simplified Model Format):** CS536 standard
  - Simple text format
  - Vertices, faces, normals

- **OBJ (Wavefront):** Industry standard
  - Vertex data + material library
  - UV coordinates

- **glTF 2.0:** Modern standard
  - PBR materials
  - Animation support
  - Binary format (efficient)

**Where in Library:** `src/loaders/` (Phase 6)

#### 4. Shader Utilities (Phase 4+)
**What:** Tools for working with shaders professionally

**Planned Features:**
- Load shaders from files (`Shader.load()`)
- Shader validation before use
- Shader caching for performance
- Uniform state management

**Advanced Usage:**
```typescript
// Load from file (Phase 4+)
const shader = await Shader.load(ctx, 'shaders/pbr.glsl');

// Write modified shader
await shader.write('/tmp/modified-shader.glsl');

// Validate (Phase 4+)
const errors = await shader.validate();
if (errors.length > 0) {
  console.error('Shader compilation errors:', errors);
}
```

---

## Summary: Learning Progression

### Phase 1-2: Foundation
- Learn WebGL pipeline (GPU to screen)
- Understand coordinate systems
- Master transformations and matrices
- Implement basic rendering

**Outcome:** Can render 2D/3D shapes with colors

---

### Phase 2B-3: Mathematical Geometry
- Study parametric curves (Bezier, Catmull-Rom)
- Study parametric surfaces (patches, revolution, ellipsoids)
- Learn exact normal computation
- Understand De Casteljau's algorithm

**Outcome:** Can create smooth, complex geometry mathematically

---

### Phase 3-4: Realistic Graphics
- Implement camera systems (perspective, orthographic, orbit)
- Study Phong lighting model
- Compare Gouraud vs. Phong shading
- Manage multiple light sources

**Outcome:** Can create realistic lit scenes

---

### Phase 6-10: Professional Development
- Load 3D models from files
- Optimize rendering performance
- Use frame buffers for advanced effects
- Implement interactive picking

**Outcome:** Can build professional 3D applications

---

## Key Takeaways

1. **Graphics is Mathematics:** Curves, surfaces, matrices, derivatives all matter
2. **Pipeline Awareness:** Understanding each GPU stage helps you optimize
3. **Coordinate Spaces:** Many rendering bugs are coordinate space confusion
4. **Exact Computation:** Use exact normals, not approximations, for quality
5. **Progressive Learning:** Start simple, gradually understand complex techniques
