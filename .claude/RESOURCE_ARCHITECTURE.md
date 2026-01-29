# Resource Architecture: Layered Abstraction Design

**Purpose:** Define how GPU resources (buffers, textures, shaders, VAOs) are organized across abstraction layers and how they integrate together.

---

## The Four Layers

```
Layer 4: Scene Graph (User-facing)
└─ Mesh, Scene, Object3D
   └─ Uses: Materials + Geometry

Layer 3: Material & Geometry Systems
├─ Material (shader + uniforms + state)
│  └─ Uses: Shader, WebGLState
├─ Geometry (vertex data organization)
│  └─ Uses: Buffer, VertexArray
└─ BufferGeometry (combined)
   └─ Uses: Buffer, VertexArray

Layer 2: GPU Resource Abstractions
├─ Buffer (vertex/index data)
├─ Shader (vertex/fragment shaders)
├─ VertexArray (VAO - vertex attribute binding)
└─ Texture (texture data)
   └─ All use: GLContext for creation + WebGLState for state

Layer 1: Low-Level APIs
├─ GLContext (WebGL wrapper)
├─ WebGLState (state management)
└─ Canvas (context creation)
   └─ Uses: Raw WebGL 2.0 API
```

---

## Layer 1: Low-Level (GLContext, WebGLState, Canvas)

**Responsibility:** Wrap WebGL with error checking and state management

**Who Uses This:**
- Library developers extending the system
- Advanced users who need custom rendering

**What It Provides:**
```typescript
// Low-level escape hatches for advanced users
const gl = ctx.gl;                    // Raw WebGL API
const program = ctx.createProgram(vertexSrc, fragmentSrc);  // Raw shader program
const buffer = ctx.createBuffer(target, data, usage);       // Raw buffer (no abstraction)
```

**Key Decision:**
- `GLContext.createBuffer()` is an **escape hatch**, not the recommended path
- Most users should use the `Buffer` class (Layer 2)
- The method exists for advanced cases and educational value

---

## Layer 2: GPU Resource Abstractions (Buffer, Shader, VertexArray, Texture)

**Responsibility:** Encapsulate GPU resources with sensible defaults and helper methods

**Layer 2 Classes:**

### Buffer
```typescript
// Creation - user's responsibility to manage
const buffer = new Buffer(ctx, BufferTarget.ARRAY_BUFFER, BufferUsage.STATIC_DRAW);

// Data management - Buffer handles binding/unbinding internally
buffer.setData(vertexData);          // Binds, uploads, unbinds
buffer.updateSubData(offset, data);  // Partial updates

// State management - user controls when to bind
buffer.bind();
// ... use buffer in rendering ...
buffer.unbind();

// Cleanup
buffer.dispose();
```

**Buffer's Responsibilities:**
- ✅ Create WebGL buffer object
- ✅ Handle binding/unbinding internally when uploading data
- ✅ Validate data types (Float32Array, Uint16Array, etc.)
- ✅ Track metadata (size, target, usage)
- ✅ Provide bind/unbind methods for user to call during rendering

**What Buffer Does NOT Do:**
- ❌ Manage which attributes use this buffer (that's VertexArray's job)
- ❌ Manage which uniforms affect this buffer (that's Material's job)
- ❌ Manage vertex layout/structure (that's Geometry's job)

---

### Shader
```typescript
// Creation with compilation
const shader = new Shader(ctx, vertexSource, fragmentSource);

// Metadata access
const program = shader.program;  // WebGL program object
shader.getUniformLocation(name);
shader.getAttributeLocation(name);

// State management - user controls when to use
shader.use();
// ... render with this shader ...

// Cleanup
shader.dispose();
```

**Shader's Responsibilities:**
- ✅ Compile vertex and fragment shaders
- ✅ Link them into a program
- ✅ Manage uniform and attribute locations
- ✅ Provide use/unused methods
- ✅ Delete shaders after linking (already in GLContext.createProgram, Shader wraps this)

**What Shader Does NOT Do:**
- ❌ Manage uniform VALUES (that's Material's job)
- ❌ Manage vertex attributes (that's VertexArray + Geometry's job)
- ❌ Manage textures or other state (that's Material's job)

---

### VertexArray
```typescript
// Creation - links buffer + shader attributes
const vao = new VertexArray(ctx);

// Configure vertex layout
vao.enableAttribute(0);
vao.setAttributePointer(0, buffer, 3, 'FLOAT', 12, 0);  // position: 3 floats, stride 12
vao.setAttributePointer(1, buffer, 2, 'FLOAT', 12, 12); // texCoord: 2 floats, offset 12

// Optionally set index buffer
vao.setIndexBuffer(indexBuffer);

// State management - user controls binding
vao.bind();
// ... render with this VAO ...
vao.unbind();

// Cleanup
vao.dispose();
```

**VertexArray's Responsibilities:**
- ✅ Create VAO object
- ✅ Manage vertex attribute pointers (which buffer, format, stride, offset)
- ✅ Enable/disable attributes
- ✅ Link index buffer (optional)
- ✅ Provide bind/unbind methods

**What VertexArray Does NOT Do:**
- ❌ Create the buffers (that's user's responsibility)
- ❌ Create the shader (that's user's responsibility)
- ❌ Manage shader attribute names (that's Geometry's job)

---

### Texture
```typescript
// Creation
const texture = new Texture(ctx);

// Upload data
texture.setImage(imageData, width, height);

// State management
texture.bind(textureUnit);
// ... render with texture ...
texture.unbind();

// Cleanup
texture.dispose();
```

**Texture's Responsibilities:**
- ✅ Create texture object
- ✅ Upload image data
- ✅ Set texture parameters (filters, wrapping)
- ✅ Bind/unbind to texture units

---

## Layer 3: Material & Geometry Systems

### Geometry
```typescript
class BoxGeometry {
  private buffer: Buffer;
  private vertexArray: VertexArray;
  private indexBuffer: Buffer;

  constructor(ctx: GLContext, width: number, height: number, depth: number) {
    // Create buffers for position, normal, UV data
    this.buffer = new Buffer(ctx, ARRAY_BUFFER);
    this.buffer.setData(this.generateVertexData(...));

    this.indexBuffer = new Buffer(ctx, ELEMENT_ARRAY_BUFFER);
    this.indexBuffer.setData(indices);

    // Create VAO linking buffer + shader
    this.vertexArray = new VertexArray(ctx);
    this.vertexArray.setAttributePointer(0, this.buffer, 3, FLOAT, ...); // position
    this.vertexArray.setAttributePointer(1, this.buffer, 3, FLOAT, ...); // normal
    this.vertexArray.setAttributePointer(2, this.buffer, 2, FLOAT, ...); // uv
    this.vertexArray.setIndexBuffer(this.indexBuffer);
  }

  getVertexArray(): VertexArray { return this.vertexArray; }
  getIndexBuffer(): Buffer { return this.indexBuffer; }
  getVertexCount(): number { return this.indexBuffer.size; }
}
```

**Geometry's Responsibilities:**
- ✅ Create and manage buffers (vertices, normals, UVs, etc.)
- ✅ Create and configure VertexArray with proper attribute layout
- ✅ Manage vertex structure (positions at 0, normals at 1, UVs at 2, etc.)
- ✅ Provide access to VAO and index buffer for rendering
- ✅ Encapsulate geometry-specific details (stride, offset, attribute indices)

**What Geometry Does NOT Do:**
- ❌ Manage shader program (that's Material's job)
- ❌ Manage uniforms (that's Material's job)
- ❌ Manage render state (that's Material's job)

---

### Material
```typescript
class BasicMaterial {
  private shader: Shader;
  private color: Vector4;
  private uniforms: Map<string, any> = new Map();

  constructor(ctx: GLContext, options: { color: number }) {
    // Create shader
    this.shader = new Shader(ctx, basicVertexShader, basicFragmentShader);

    // Store uniforms
    this.color = new Vector4(...);
    this.uniforms.set('uColor', this.color);
  }

  use(ctx: GLContext): void {
    this.shader.use();

    // Upload uniforms to shader
    const colorLoc = this.shader.getUniformLocation('uColor');
    ctx.gl.uniform4f(colorLoc, ...this.color.elements);
  }

  setColor(r: number, g: number, b: number, a: number = 1.0): this {
    this.color.set(r, g, b, a);
    return this;
  }
}
```

**Material's Responsibilities:**
- ✅ Create and manage shader program
- ✅ Manage uniform values (colors, matrices, textures, etc.)
- ✅ Set WebGL state (blend mode, depth test, etc.) via WebGLState
- ✅ Upload uniforms when rendering
- ✅ Manage textures used by this material
- ✅ Provide `use()` method to prepare for rendering

**What Material Does NOT Do:**
- ❌ Create geometry (that's Geometry's job)
- ❌ Create VAO (that's Geometry's job)
- ❌ Manage vertex attributes (that's VertexArray's job)

---

## Layer 4: Scene Graph (Mesh, Scene, Object3D)

```typescript
class Mesh {
  private geometry: Geometry;
  private material: Material;
  private modelMatrix: Matrix4;

  render(ctx: GLContext, viewMatrix: Matrix4, projectionMatrix: Matrix4): void {
    // Prepare material (sets shader, uniforms, state)
    this.material.use(ctx);

    // Upload transform matrices as uniforms
    const modelLoc = this.material.shader.getUniformLocation('uModel');
    ctx.gl.uniformMatrix4fv(modelLoc, false, this.modelMatrix.elements);

    // Bind and render geometry
    const vao = this.geometry.getVertexArray();
    vao.bind();
    ctx.gl.drawElements(
      ctx.gl.TRIANGLES,
      this.geometry.getVertexCount(),
      ctx.gl.UNSIGNED_SHORT,
      0
    );
    vao.unbind();
  }
}
```

**Mesh's Responsibilities:**
- ✅ Hold references to Geometry and Material
- ✅ Manage transform (position, rotation, scale)
- ✅ Orchestrate rendering (material → shader → geometry → GPU)
- ✅ Pass per-object uniforms to shader (model matrix, color, etc.)

---

## Data Flow Example: Rendering a Box

```
User Code:
│
├─ Create Geometry (BoxGeometry)
│  └─ Internally creates Buffer + VertexArray
│
├─ Create Material (BasicMaterial)
│  └─ Internally creates Shader
│
├─ Create Mesh
│  └─ Links Geometry + Material
│
└─ Render Loop:
   └─ mesh.render(ctx, viewMatrix, projectionMatrix)
      │
      ├─ material.use(ctx)
      │  ├─ shader.use()
      │  └─ Upload uniforms (color, matrices, textures)
      │
      └─ geometry.getVertexArray().bind()
         └─ ctx.gl.drawElements(...)
            └─ GPU uses:
               ├─ Shader program (from Material)
               ├─ Vertex data (from Geometry's Buffer)
               ├─ Vertex layout (from Geometry's VertexArray)
               └─ Uniforms (from Material)
```

---

## Responsibility Summary

| Component | Creates | Manages | Provides |
|-----------|---------|---------|----------|
| **GLContext** | Programs, Buffers (raw) | WebGL state | Low-level escape hatches |
| **Buffer** | WebGL buffer | Data, binding state | setData(), bind(), unbind() |
| **Shader** | Program, deletes shaders | Uniform/attribute locations | use(), getUniformLocation() |
| **VertexArray** | VAO | Attribute layout, index buffer | setAttributePointer(), bind() |
| **Texture** | Texture object | Image data, parameters | setImage(), bind() |
| **Geometry** | Buffers, VertexArray | Vertex structure | getVertexArray(), getVertexCount() |
| **Material** | Shader | Uniforms, state | use(), setColor(), setTexture() |
| **Mesh** | (none) | Geometry, Material, Transform | render() |

---

## Key Design Principles

### 1. **Single Responsibility**
- Each class owns ONE thing:
  - Buffer owns GPU vertex data
  - Shader owns shader program
  - Material owns shader + uniforms
  - Geometry owns vertex structure
  - Mesh owns transform + rendering

### 2. **Encapsulation with Escape Hatches**
- High-level users use Mesh → Material → Geometry
- Medium users use Material + Geometry directly
- Advanced users can drop to Buffer/Shader level
- Experts can use GLContext.createBuffer() raw API

### 3. **Lazy Binding**
- Buffers/VAO/Shaders created but NOT bound at construction
- User calls `bind()` explicitly when ready to render
- Prevents state pollution and makes dependencies clear

### 4. **Clear Data Flow**
- Geometry creates data structures (Buffer + VertexArray)
- Material manages shaders + state
- Mesh orchestrates the rendering (Geometry → Material → GPU)
- No circular dependencies

---

## For Phase 1 Remaining Implementations

When implementing Shader.ts and VertexArray.ts, follow this pattern:

### Shader.ts Should:
- ✅ Wrap GLContext.createProgram()
- ✅ Manage uniform/attribute locations (cache them)
- ✅ Provide use() method
- ✅ Handle cleanup

### VertexArray.ts Should:
- ✅ Create VAO
- ✅ Provide setAttributePointer(index, buffer, size, type, stride, offset)
- ✅ Support setIndexBuffer()
- ✅ Provide bind() and unbind() methods
- ✅ Handle cleanup

### Geometry.ts Should:
- ✅ Create Buffer instances
- ✅ Create VertexArray instance
- ✅ Configure VAO with attribute layout
- ✅ Provide getVertexArray(), getIndexBuffer(), getVertexCount()

### Material.ts Should:
- ✅ Create Shader instance
- ✅ Manage uniforms (store values, upload on use())
- ✅ Manage WebGLState for material-specific settings
- ✅ Provide use() method

---

## When to Use What

**User is beginner:**
→ Use Mesh with predefined geometry + material

**User needs custom shader:**
→ Create custom Material class, use existing Geometry

**User needs custom geometry:**
→ Extend Geometry class, use existing Materials

**User needs full control:**
→ Use Buffer, Shader, VertexArray directly from GLContext

**User is framework developer:**
→ Drop to GLContext.createProgram(), GLContext.createBuffer() raw API
