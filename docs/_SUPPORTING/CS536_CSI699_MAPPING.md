# CS536/CSI699 Course Assignment → Library Phase Mapping

Complete mapping of course assignments to library implementation phases.

---

## CSI699 - Real-Time WebGL Graphics (Drexel University)

| Assignment | Topic | Focus | Library Phase | Status | Key Features |
|---|---|---|---|---|---|
| **A1** | Basic WebGL | 2D polygons, viewport, vertex colors | Phase 1 | 🚧 Planned | Display colored 2D polygon, viewport bounds |
| **A2** | 2D Rendering | Color interpolation, parametric shapes | Phase 1-2 | 🚧 Planned | Triangle fan/strip rendering, circles via parametric equations |
| **A3** | User Interaction | Buttons, sliders, menus, keyboard, mouse | Phase 2 | 🚧 Planned | Interactive UI controls framework |
| **A4** | 3D Transforms | Scale, rotate, translate, cumulative | Phase 2 | 🚧 Planned | Object3D transform hierarchy, interactive manipulation |
| **A5** | Cameras & Viewing | LookAt, projections, SMF loading | Phase 3 | 🚧 Planned | Camera systems, perspective/orthographic, model loading |
| **A6** | Lighting & Shading | Phong, Gouraud, multiple lights | Phase 4 | 🚧 Planned | Phong/Gouraud materials, interactive light control |
| **A7** | Bezier Patches | Tessellation, normals, flat/smooth shading | Phase 3 | 🚧 Planned | BezierPatch surface, exact normal computation |
| **A9** | Picking & FBO | Off-screen rendering, object selection | Phase 8 | 🚧 Planned | Framebuffer-based picking, color-coded objects |

---

## CS536 - Computer Graphics Fundamentals (Drexel University)

| Assignment | Topic | Algorithm | Library Phase | Status | Key Features |
|---|---|---|---|---|---|
| **A1** | Bezier Curves | De Casteljau evaluation | Phase 2B | 🚧 Planned | Arbitrary-degree curves, control points, polyline output |
| **A2** | Catmull-Rom Splines | Hermite conversion, tension | Phase 2B | 🚧 Planned | C1 splines, Kochanek-Bartels tension, smooth interpolation |
| **A3** | Bezier Patches | Biparametric evaluation, normals | Phase 3 | 🚧 Planned | 4×4 control grid, exact normals via ∂S/∂u × ∂S/∂v |
| **A4** | Surfaces of Revolution | Profile rotation around axis | Phase 3 | 🚧 Planned | C-R spline rotation, smooth shading, capping |
| **A5** | Polygon Union | Weiler-Atherton clipping | — | ⏭️ Skipped* | 2D geometry operation (lower priority for WebGL library) |
| **A6** | Superellipsoids | Parametric evaluation | Phase 3 | 🚧 Planned | Arbitrary shape parameters (s1, s2), smooth poles |
| **A7** | Hierarchical Models | Kinematic chains, transforms | Phase 2 | ✅ Included | Object3D scene graph, transform composition |

*2D polygon union is valuable geometrically but lower priority than 3D capabilities for a WebGL library. Can be added later as utility.

---

## Learning Objectives by Course

### CSI699 Real-Time WebGL Graphics

**Covered by Library:**
1. ✅ WebGL fundamentals and 2D rendering (Phase 1)
2. ✅ 3D transformations and hierarchies (Phase 2)
3. ✅ Camera systems and viewing (Phase 3)
4. ✅ Interactive user controls (Phase 2)
5. ✅ Lighting models and shading (Phase 4)
6. ✅ Bezier surfaces (Phase 3)
7. ✅ Picking via off-screen rendering (Phase 8)
8. ✅ Complete scene rendering (Phase 9)

**Educational Value:** Students learn modern real-time graphics with WebGL 2.0, understanding the complete rendering pipeline from geometry to shaders to screen.

---

### CS536 Computer Graphics Fundamentals

**Covered by Library:**
1. ✅ Parametric curves (Bezier, Catmull-Rom) - Phase 2B
2. ✅ Parametric surfaces (Bezier patches, surfaces of revolution, superellipsoids) - Phase 3
3. ✅ Curve/surface evaluation algorithms - Phase 2B & 3
4. ✅ Normal computation (exact via derivatives) - Phase 3
5. ✅ Hierarchical transforms - Phase 2
6. ✅ Coordinate system transformations - Phase 3

**Educational Value:** Students learn foundational computational geometry concepts—how to evaluate curves/surfaces mathematically, compute normals, and convert parametric descriptions to renderable geometry.

---

## Feature Cross-Reference

| Concept | CSI699 Connection | CS536 Connection | Library Location | Phase |
|---|---|---|---|---|
| **Parametric Curves** | A7 (Bezier patches) | A1-A2 (Bezier, C-R) | `src/geometry/curves/` | 2B |
| **Parametric Surfaces** | A7 (patches) | A3-A4, A6 | `src/geometry/surfaces/` | 3 |
| **Normal Computation** | A6 (lighting) | A3-A6 (exact normals) | Surface classes | 3 |
| **Bezier Evaluation** | A7 (patches) | A1 (curves) | BezierCurve, BezierPatch | 2B, 3 |
| **Catmull-Rom Splines** | A7 (surfaces) | A2 (splines) | CatmullRomSpline, SurfaceOfRevolution | 2B, 3 |
| **Transform Hierarchy** | A4 (cumulative) | A7 (kinematic) | Object3D scene graph | 2 |
| **Lighting Models** | A6 (Phong, Gouraud) | A3-A6 (shading) | PhongMaterial, GouraudMaterial | 4 |
| **Camera Systems** | A5 (viewing) | Implicit (transforms) | PerspectiveCamera, OrbitCamera | 3 |
| **Model Loading** | A5 (SMF format) | A1-A7 (output format) | SMFLoader, OBJLoader | 6 |
| **Exact Normals** | A6 (lighting) | A3-A6 (normals) | Surface partial derivatives | 3 |
| **Smooth Shading** | A6 (Gouraud/Phong) | A3-A6 (smooth) | GouraudMaterial, PhongMaterial | 4 |
| **Picking/Selection** | A9 (FBO) | Implicit | Framebuffer + off-screen | 8 |

---

## Implementation Strategy: Two-Course Alignment

### Phase 2B: Parametric Curves (CS536 Foundation)

**Assignments Covered:**
- CS536 A1: Bezier curves with De Casteljau
- CS536 A2: Catmull-Rom splines with tension
- CSI699 A7: Foundation for surface patches

**Key Learning Outcomes:**
- Understand parametric evaluation
- De Casteljau vs. basis function algorithms
- Continuity concepts (C0, C1, C2)
- Derivative computation for tangents

**Library Features:**
- BezierCurve with arbitrary control points
- CatmullRomSpline with Kochanek-Bartels tension
- CurveGeometry for polyline generation

---

### Phase 3: Scene Graph + Parametric Surfaces (Both Courses)

**Assignments Covered:**
- CSI699 A3-A4: User interaction + transforms
- CSI699 A5: Camera systems
- CSI699 A7: Bezier patches
- CS536 A3-A6: All surface types + normals

**Key Learning Outcomes (CSI699):**
- Scene graph architecture
- Hierarchical transforms
- Camera controls and viewing

**Key Learning Outcomes (CS536):**
- Surface patch evaluation
- Exact normal computation
- Tessellation and mesh generation
- Multiple surface types

**Library Features:**
- Scene graph with Object3D hierarchy
- Multiple camera types
- BezierPatch, SurfaceOfRevolution, Superellipsoid
- Exact surface normal computation

---

### Phase 4: Lighting & Shading (CSI699 A6)

**Assignments Covered:**
- CSI699 A6: Phong/Gouraud shading with multiple lights
- CS536 A3-A6: Normal usage in shading

**Key Learning Outcomes:**
- Phong lighting model
- Gouraud vs. Phong shading differences
- Multiple light source management
- Material properties

**Library Features:**
- PhongMaterial and GouraudMaterial
- Multiple light types (Ambient, Point, Directional, Spot)
- Interactive light control

---

### Phase 8: Picking & Advanced Rendering (CSI699 A9)

**Assignments Covered:**
- CSI699 A9: Picking via off-screen rendering

**Key Learning Outcomes:**
- Frame buffer objects
- Off-screen rendering techniques
- Color-coded object identification

**Library Features:**
- Framebuffer class
- Off-screen rendering support
- Picker utility for object selection

---

## Summary: Unique Educational Value

### Why Both Courses Together?

This library provides unique educational value by combining:

1. **CSI699 (Real-Time Focus):** Learn modern graphics programming with WebGL, interactive rendering, real-time lighting and shading
2. **CS536 (Fundamentals Focus):** Learn mathematical foundations—how to evaluate curves/surfaces, compute normals exactly, tessellate parametric geometry

**Result:** Students understand both:
- **HOW** to render (WebGL, shaders, materials) - *CSI699*
- **WHY** rendering works (mathematics, algorithms, geometry) - *CS536*

### Progressive Learning Path

1. **Phase 1-2:** Core rendering + basic curves (CSI699 A1-A4, CS536 A1)
2. **Phase 2B:** Advanced curves + splines (CS536 A1-A2)
3. **Phase 3:** Surfaces + cameras (CS536 A3-A6, CSI699 A5, A7)
4. **Phase 4:** Lighting and shading (CSI699 A6)
5. **Phase 8-9:** Advanced rendering (CSI699 A9)

This progression ensures students master fundamentals before advanced topics.
