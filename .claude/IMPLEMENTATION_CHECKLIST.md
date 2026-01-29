# Phase 1 Implementation Checklist

**Status:** Ready for Implementation
**Last Updated:** January 29, 2026

---

## What's Documented & Decided ✅

- [x] Architecture approved (Program + Shader + GLContext query methods)
- [x] All design patterns documented
- [x] Resource layer structure finalized
- [x] Binding state query pattern established (WebGL source of truth)
- [x] GLContext query methods designed
- [x] Phase 1 remaining implementation order confirmed
- [x] All approval documents created

---

## Critical Points to Implement in Each Resource

### All Layer 2 Resources (Buffer, Program, VertexArray, Texture)

**Pattern to Follow:**

```typescript
export class ResourceName {
  private ctx: GLContext;
  private webGLResource: WebGLResourceType;

  constructor(ctx: GLContext, ...args: any[]) {
    this.ctx = ctx;
    // Create the WebGL resource
    this.webGLResource = ctx.gl.createXXX(...);
    if (!this.webGLResource) throw new Error(...);

    // Self-register for cleanup
    ctx.registerXXX(this.webGLResource);

    // Validate with error checking
    this._checkError('constructor');
  }

  /**
   * Query the currently bound XXX from WebGL (source of truth)
   * @param ctx - GLContext to query
   * @returns Currently bound WebGLXXX or null
   */
  static queryBinding(ctx: GLContext): WebGLXXX | null {
    return ctx.gl.getParameter(ctx.gl.XXX_BINDING);
  }

  bind(): this {
    // Binding operation
    this.ctx.gl.bindXXX(..., this.webGLResource);
    this._checkError('bind');
    return this;
  }

  unbind(): this {
    this.ctx.gl.bindXXX(..., null);
    this._checkError('unbind');
    return this;
  }

  dispose(): void {
    if (!this.webGLResource) return;
    this.ctx.gl.deleteXXX(this.webGLResource);
    this._checkError('dispose');
    (this.webGLResource as any) = null;
  }

  private _checkError(context: string): void {
    this.ctx.gl.getError(); // Clear error queue
    // Or use ctx's error checking if available
  }
}
```

---

### Specific Implementations

#### Buffer.ts (Already Exists ✅)

- ✅ Constructor creates WebGLBuffer
- ✅ `setData()` uploads vertex data
- ✅ `bind()` / `unbind()` methods
- ✅ `dispose()` cleanup
- 🔄 **Need to Add:** `static queryBinding(ctx, target)` method

#### Program.ts (Next to Implement)

```typescript
class Program {
  constructor(ctx: GLContext, vertexSource: string, fragmentSource: string)

  // Query pattern
  static queryBinding(ctx: GLContext): WebGLProgram | null

  // Binding methods
  use(): this
  unused(): this

  // Location caching
  getUniformLocation(name: string): GLint
  getAttributeLocation(name: string): GLint

  // Cleanup
  dispose(): void
}
```

#### VertexArray.ts (After Program)

```typescript
class VertexArray {
  constructor(ctx: GLContext)

  // Query pattern
  static queryBinding(ctx: GLContext): WebGLVertexArrayObject | null

  // Configuration
  setAttributePointer(index: GLuint, buffer: Buffer, size: GLint,
                     type: GLenum, stride: GLsizei, offset: GLintptr): this
  setIndexBuffer(buffer: Buffer): this

  // Binding
  bind(): this
  unbind(): this

  // Cleanup
  dispose(): void
}
```

#### Texture.ts (After VertexArray)

```typescript
class Texture {
  constructor(ctx: GLContext)

  // Query pattern
  static queryBinding(ctx: GLContext, textureUnit?: number): WebGLTexture | null

  // Data management
  setImage(imageData: TexImageSource | ArrayBufferView,
          width?: number, height?: number): this

  // Binding
  bind(textureUnit?: number): this
  unbind(): this

  // Parameters
  setWrapMode(wrapS: GLenum, wrapT: GLenum): this
  setFilterMode(min: GLenum, mag: GLenum): this

  // Cleanup
  dispose(): void
}
```

---

### GLContext Methods to Add

```typescript
class GLContext {
  // New query methods (source of truth from WebGL)

  queryBufferBinding(target?: GLenum): WebGLBuffer | null
  queryProgram(): WebGLProgram | null
  queryVAO(): WebGLVertexArrayObject | null
  queryTextureBinding(textureUnit?: number): WebGLTexture | null
}
```

---

## Tests to Write

### For Each Resource (Budget ~20-30 tests per resource)

**Constructor Tests:**
- ✅ Creates instance with valid inputs
- ✅ Throws error if WebGL resource creation fails
- ✅ Calls `ctx.register*()` for cleanup tracking
- ✅ Initializes internal state correctly

**Query Binding Tests:**
- ✅ Returns null when nothing is bound
- ✅ Returns correct binding after bind()
- ✅ Works after external ctx.gl calls (verifies it queries GPU)

**Binding Tests:**
- ✅ bind() sets WebGL binding
- ✅ unbind() clears WebGL binding
- ✅ Methods return `this` for chaining
- ✅ Error checking catches WebGL errors

**Dispose Tests:**
- ✅ Deletes WebGL resource
- ✅ Sets internal reference to null
- ✅ Subsequent operations throw helpful errors
- ✅ Can dispose() multiple times safely

**Integration Tests:**
- ✅ Complete workflow: create → bind → use → unbind → dispose
- ✅ Multiple instances don't interfere
- ✅ Chainable methods work in sequence

---

## Coverage Requirements

**Target:** 95%+ line coverage / 90%+ branch coverage

**Per Resource:**
- Program.ts: ~250 lines → ~23 lines uncovered acceptable
- VertexArray.ts: ~200 lines → ~20 lines uncovered acceptable
- Texture.ts: ~150 lines → ~15 lines uncovered acceptable
- Shader.ts: ~100 lines → ~5 lines uncovered acceptable

---

## File Structure to Create

```
src/
├── resources/
│   ├── index.ts              ← Update exports
│   ├── Program.ts            ← NEW
│   └── Shader.ts             ← NEW (after Program)
│
├── geometry/
│   ├── index.ts              ← Create
│   └── (implementations next)
│
├── materials/
│   ├── index.ts              ← Create
│   └── (implementations next)
│
└── scene/
    ├── index.ts              ← Create
    └── (implementations next)

tests/resources/
├── Program.test.ts           ← NEW
├── Shader.test.ts            ← NEW
├── VertexArray.test.ts       ← NEW
└── Texture.test.ts           ← NEW
```

---

## Dependency Chain (Build in This Order)

```
1. GLContext Query Methods (add to existing GLContext.ts)
   ↓
2. Program.ts (lowest level, depends only on GLContext)
   ↓
3. Shader.ts (wraps Program)
   ↓
4. VertexArray.ts (independent Layer 2 resource)
   ↓
5. Texture.ts (independent Layer 2 resource)
   ↓
6. Geometry.ts (uses Buffer + VertexArray)
   ↓
7. Material.ts (uses Shader)
   ↓
8. BasicMaterial.ts (extends Material)
   ↓
9. Object3D.ts (standalone transforms)
   ↓
10. Scene.ts (extends Object3D)
   ↓
11. Mesh.ts (combines Geometry + Material + Object3D)
   ↓
12. WebGLRenderer.ts (renders Scene)
```

---

## Checklist for Each Feature

When implementing each resource, ensure:

- [ ] Follows pattern from Buffer.ts (existing reference)
- [ ] Constructor takes GLContext as first parameter
- [ ] Calls `ctx.registerXXX()` in constructor
- [ ] `dispose()` method cleans up WebGL resource
- [ ] Static `queryBinding()` method queries WebGL (source of truth)
- [ ] Binding methods (`bind()`, `unbind()`) return `this`
- [ ] All methods chainable where appropriate
- [ ] JSDoc comments explain graphics concepts
- [ ] Comprehensive tests written
- [ ] Tests achieve 95%+ line / 90%+ branch coverage
- [ ] All tests pass: `npm test`
- [ ] No TypeScript errors: `npm run build`
- [ ] No console.log or debugging code left
- [ ] Error messages are descriptive

---

## Key Patterns to Remember

### Uniform Naming
- Methods: `bind()`, `unbind()`, `dispose()`
- Query: `static queryBinding(ctx: GLContext): WebGLResourceType | null`
- Configuration: `setXXX()` methods that return `this`

### Error Handling Pattern
```typescript
if (!this.webGLResource) {
  throw new Error('XXX has been disposed');
}
```

### Chainable Methods Pattern
```typescript
methodThatModifies(): this {
  // Do work
  return this;
}
```

### Static Query Pattern
```typescript
static queryBinding(ctx: GLContext): WebGLXXX | null {
  return ctx.gl.getParameter(ctx.gl.XXX_BINDING);
}
```

---

## When Tests Are Complete

After each feature passes tests (95%+ coverage):

1. Create new commit with feature
2. Update test count in CLAUDE.md
3. Update coverage percentage in CLAUDE.md
4. Mark feature as ✅ Complete in CLAUDE.md
5. Move to next feature (don't batch multiple features)

---

## Reference Implementations

**Study these existing implementations:**
- `src/resources/Buffer.ts` - Perfect pattern for Layer 2 resources
- `src/core/GLContext.ts` - For understanding error checking pattern
- `tests/resources/Buffer.test.ts` - For understanding test patterns

---

## Known Gotchas

1. **WebGL Binding Parameters:**
   - ARRAY_BUFFER_BINDING (for GL.ARRAY_BUFFER)
   - ELEMENT_ARRAY_BUFFER_BINDING (for GL.ELEMENT_ARRAY_BUFFER)
   - VERTEX_ARRAY_BINDING (for VAO)
   - CURRENT_PROGRAM (for Program)
   - TEXTURE_BINDING_2D (for Textures - requires activeTexture first)

2. **Texture Unit Handling:**
   - Must call `gl.activeTexture(gl.TEXTURE0 + unit)` before binding
   - Query binding also requires active texture call

3. **Shader Deletion:**
   - Shaders attached to programs are auto-deleted by WebGL
   - GLContext.createProgram() already handles this

4. **VAO Special Case:**
   - VAO index buffer is part of VAO state
   - Binding an index buffer while VAO is bound affects that VAO

---

## Documentation to Update After Phase 1 Complete

- `.claude/RESOURCE_ARCHITECTURE.md` - Update to reflect Program vs Shader
- `CLAUDE.md` - Update status table
- Phase 1 comment in PLAN.md if needed

---

**Ready to Start:** Program.ts implementation when you give the go-ahead! 🚀
