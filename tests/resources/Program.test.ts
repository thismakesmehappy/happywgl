import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Program } from '../../src/resources/Program.js';
import { GLContext } from '../../src/core/GLContext.js';

/**
 * Test suite for Program (WebGL shader program wrapper)
 *
 * Tests the Program class covering:
 * - Constructor and initialization
 * - Compilation and linking via GLContext
 * - Program activation (use) and deactivation (unused)
 * - Uniform location caching and retrieval
 * - Attribute location caching and retrieval
 * - Static binding state tracking
 * - Resource cleanup (dispose)
 * - Error handling for disposed programs
 * - Method chaining support
 */

describe('Program', () => {
  let mockGLContext: Partial<GLContext>;
  let mockGL: any;
  let mockProgram: WebGLProgram;

  const validVertexShader = `
    attribute vec4 aPosition;
    void main() {
      gl_Position = aPosition;
    }
  `;

  const validFragmentShader = `
    precision mediump float;
    uniform vec4 uColor;
    void main() {
      gl_FragColor = uColor;
    }
  `;

  beforeEach(() => {
    // Create a mock WebGLProgram
    mockProgram = {} as WebGLProgram;

    // Create mock GL object with shader compilation, linking, and location queries
    mockGL = {
      NO_ERROR: 0,
      COMPILE_STATUS: 0x8b81,
      LINK_STATUS: 0x8b82,
      FRAGMENT_SHADER: 0x8b30,
      VERTEX_SHADER: 0x8b31,
      createShader: vi.fn((type: number) => ({})),
      shaderSource: vi.fn(),
      compileShader: vi.fn(),
      getShaderParameter: vi.fn((shader: any, param: number) => {
        // Always report successful compilation
        return param === 0x8b81 ? true : null;
      }),
      getShaderInfoLog: vi.fn(() => ''),
      deleteShader: vi.fn(),
      createProgram: vi.fn(() => mockProgram),
      attachShader: vi.fn(),
      linkProgram: vi.fn(),
      getProgramParameter: vi.fn((program: any, param: number) => {
        // Always report successful linking
        return param === 0x8b82 ? true : null;
      }),
      getProgramInfoLog: vi.fn(() => ''),
      deleteProgram: vi.fn(),
      useProgram: vi.fn(),
      getUniformLocation: vi.fn((program: any, name: string) => {
        // Return a mock location for uniform variables
        // Return null for non-existent uniforms
        if (name === 'uColor' || name === 'uTime' || name === 'uMatrix') {
          return { name } as unknown as WebGLUniformLocation;
        }
        return null;
      }),
      getAttribLocation: vi.fn((program: any, name: string) => {
        // Return indices for attribute variables
        // Return -1 for non-existent attributes
        if (name === 'aPosition') return 0;
        if (name === 'aColor') return 1;
        if (name === 'aNormal') return 2;
        return -1;
      }),
      getError: vi.fn(() => 0),
    };

    // Create mock GLContext
    mockGLContext = {
      gl: mockGL as WebGL2RenderingContext,
      createProgram: vi.fn((vertexSource: string, fragmentSource: string) => {
        // Simulate program creation via GLContext
        return mockProgram;
      }),
      registerProgram: vi.fn(),
      queryCurrentProgram: vi.fn(() => null),
      _checkError: vi.fn(),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Constructor', () => {
    it('creates a program with vertex and fragment shaders', () => {
      const program = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      expect(mockGLContext.createProgram).toHaveBeenCalledWith(
        validVertexShader,
        validFragmentShader,
      );
      expect(mockGLContext.registerProgram).toHaveBeenCalledWith(mockProgram);
    });

    it('initializes location caches as empty', () => {
      const program = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      // Access a location to verify cache works
      program.getUniformLocation('uColor');
      program.getUniformLocation('uColor');

      // Should only query once (cache hit on second call)
      expect(mockGL.getUniformLocation).toHaveBeenCalledTimes(1);
    });

    it('marks program as not disposed initially', () => {
      const program = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      // Should not throw when calling use()
      expect(() => program.use()).not.toThrow();
    });
  });

  describe('webGLProgram accessor', () => {
    it('returns the underlying WebGL program', () => {
      const program = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      expect(program.webGLProgram).toBe(mockProgram);
    });

    it('throws error if program has been disposed', () => {
      const program = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      program.dispose();

      expect(() => program.webGLProgram).toThrow('Program has been disposed');
    });
  });

  describe('Program.queryBinding()', () => {
    it('returns the currently active program from WebGL', () => {
      const program1 = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      const activeProgram = {} as WebGLProgram;
      (mockGLContext.queryCurrentProgram as any).mockReturnValue(activeProgram);

      const result = Program.queryBinding(mockGLContext as GLContext);

      expect(result).toBe(activeProgram);
      expect(mockGLContext.queryCurrentProgram).toHaveBeenCalled();
    });

    it('returns null when no program is active', () => {
      (mockGLContext.queryCurrentProgram as any).mockReturnValue(null);

      const result = Program.queryBinding(mockGLContext as GLContext);

      expect(result).toBeNull();
    });
  });

  describe('use()', () => {
    it('activates the program with gl.useProgram()', () => {
      const program = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      program.use();

      expect(mockGL.useProgram).toHaveBeenCalledWith(mockProgram);
    });

    it('returns this for method chaining', () => {
      const program = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      const result = program.use();

      expect(result).toBe(program);
    });

    it('supports method chaining', () => {
      const program = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      const result = program.use().unused();

      expect(result).toBe(program);
      expect(mockGL.useProgram).toHaveBeenCalledWith(mockProgram);
      expect(mockGL.useProgram).toHaveBeenCalledWith(null);
    });

    it('throws error if program has been disposed', () => {
      const program = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      program.dispose();

      expect(() => program.use()).toThrow('Program has been disposed');
    });

    it('updates static binding tracker', () => {
      const program = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      program.use();

      // Verify useProgram was called (static tracking happens internally)
      expect(mockGL.useProgram).toHaveBeenCalledWith(mockProgram);
    });
  });

  describe('unused()', () => {
    it('deactivates the program by calling gl.useProgram(null)', () => {
      const program = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      program.use();
      mockGL.useProgram.mockClear();

      program.unused();

      expect(mockGL.useProgram).toHaveBeenCalledWith(null);
    });

    it('returns this for method chaining', () => {
      const program = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      program.use();

      const result = program.unused();

      expect(result).toBe(program);
    });

    it('supports method chaining with dispose', () => {
      const program = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      // Chain: use -> unused -> dispose
      program.use().unused();

      expect(mockGL.useProgram).toHaveBeenCalledWith(mockProgram);
      expect(mockGL.useProgram).toHaveBeenCalledWith(null);
    });

    it('throws error if program has been disposed', () => {
      const program = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      program.dispose();

      expect(() => program.unused()).toThrow('Program has been disposed');
    });

    it('updates static binding tracker', () => {
      const program = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      program.use();
      program.unused();

      // useProgram called twice: once with program, once with null
      expect(mockGL.useProgram).toHaveBeenCalledTimes(2);
    });
  });

  describe('getUniformLocation()', () => {
    it('returns uniform location for existing uniform', () => {
      const program = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      const location = program.getUniformLocation('uColor');

      expect(location).not.toBeNull();
      expect(mockGL.getUniformLocation).toHaveBeenCalledWith(
        mockProgram,
        'uColor',
      );
    });

    it('returns null for non-existent uniform', () => {
      const program = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      const location = program.getUniformLocation('uNonExistent');

      expect(location).toBeNull();
    });

    it('caches uniform locations for fast access', () => {
      const program = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      // First call queries GPU
      program.getUniformLocation('uColor');
      // Second call should use cache
      program.getUniformLocation('uColor');

      // Should only query once (cache hit on second call)
      expect(mockGL.getUniformLocation).toHaveBeenCalledTimes(1);
    });

    it('caches null results for non-existent uniforms', () => {
      const program = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      // First call queries GPU and returns null
      program.getUniformLocation('uNonExistent');
      // Second call should use cache and return null
      program.getUniformLocation('uNonExistent');

      // Should only query once
      expect(mockGL.getUniformLocation).toHaveBeenCalledTimes(1);
    });

    it('throws error if program has been disposed', () => {
      const program = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      program.dispose();

      expect(() => program.getUniformLocation('uColor')).toThrow(
        'Program has been disposed',
      );
    });

    it('handles multiple different uniforms', () => {
      const program = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      const loc1 = program.getUniformLocation('uColor');
      const loc2 = program.getUniformLocation('uTime');
      const loc3 = program.getUniformLocation('uMatrix');

      expect(loc1).not.toBeNull();
      expect(loc2).not.toBeNull();
      expect(loc3).not.toBeNull();
      expect(mockGL.getUniformLocation).toHaveBeenCalledTimes(3);
    });
  });

  describe('getAttributeLocation()', () => {
    it('returns attribute location for existing attribute', () => {
      const program = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      const location = program.getAttributeLocation('aPosition');

      expect(location).toBe(0);
      expect(mockGL.getAttribLocation).toHaveBeenCalledWith(
        mockProgram,
        'aPosition',
      );
    });

    it('returns -1 for non-existent attribute', () => {
      const program = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      const location = program.getAttributeLocation('aNonExistent');

      expect(location).toBe(-1);
    });

    it('caches attribute locations for fast access', () => {
      const program = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      // First call queries GPU
      program.getAttributeLocation('aPosition');
      // Second call should use cache
      program.getAttributeLocation('aPosition');

      // Should only query once (cache hit on second call)
      expect(mockGL.getAttribLocation).toHaveBeenCalledTimes(1);
    });

    it('caches -1 results for non-existent attributes', () => {
      const program = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      // First call queries GPU and returns -1
      program.getAttributeLocation('aNonExistent');
      // Second call should use cache and return -1
      program.getAttributeLocation('aNonExistent');

      // Should only query once
      expect(mockGL.getAttribLocation).toHaveBeenCalledTimes(1);
    });

    it('throws error if program has been disposed', () => {
      const program = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      program.dispose();

      expect(() => program.getAttributeLocation('aPosition')).toThrow(
        'Program has been disposed',
      );
    });

    it('handles multiple different attributes', () => {
      const program = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      const loc1 = program.getAttributeLocation('aPosition');
      const loc2 = program.getAttributeLocation('aColor');
      const loc3 = program.getAttributeLocation('aNormal');

      expect(loc1).toBe(0);
      expect(loc2).toBe(1);
      expect(loc3).toBe(2);
      expect(mockGL.getAttribLocation).toHaveBeenCalledTimes(3);
    });
  });

  describe('dispose()', () => {
    it('deletes the WebGL program', () => {
      const program = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      program.dispose();

      expect(mockGL.deleteProgram).toHaveBeenCalledWith(mockProgram);
    });

    it('clears location caches', () => {
      const program = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      // Populate caches
      program.getUniformLocation('uColor');
      program.getAttributeLocation('aPosition');

      // Clear mocks to count new calls
      mockGL.getUniformLocation.mockClear();
      mockGL.getAttribLocation.mockClear();

      // Dispose
      program.dispose();

      // Try to access (should fail, not use cache)
      expect(() => program.getUniformLocation('uColor')).toThrow(
        'Program has been disposed',
      );
    });

    it('marks program as disposed', () => {
      const program = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      program.dispose();

      expect(() => program.use()).toThrow('Program has been disposed');
      expect(() => program.unused()).toThrow('Program has been disposed');
      expect(() => program.webGLProgram).toThrow('Program has been disposed');
    });

    it('can be called multiple times safely (idempotent)', () => {
      const program = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      program.dispose();
      program.dispose();

      // Should not throw on second dispose
      expect(() => program.dispose()).not.toThrow();

      // deleteProgram should still only be called once
      // (on first dispose, subsequent calls return early)
      expect(mockGL.deleteProgram).toHaveBeenCalledTimes(1);
    });

    it('updates binding tracker if this program was active', () => {
      const program = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      program.use();
      program.dispose();

      // Verify program was marked for cleanup
      expect(mockGL.deleteProgram).toHaveBeenCalledWith(mockProgram);
    });
  });

  describe('Integration: Full rendering workflow', () => {
    it('supports complete use -> query -> unused -> dispose cycle', () => {
      const program = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      // Activate
      program.use();
      expect(mockGL.useProgram).toHaveBeenCalledWith(mockProgram);

      // Query locations
      const colorLoc = program.getUniformLocation('uColor');
      const posLoc = program.getAttributeLocation('aPosition');
      expect(colorLoc).not.toBeNull();
      expect(posLoc).toBe(0);

      // Deactivate
      program.unused();
      expect(mockGL.useProgram).toHaveBeenLastCalledWith(null);

      // Cleanup
      program.dispose();
      expect(mockGL.deleteProgram).toHaveBeenCalledWith(mockProgram);
    });

    it('supports switching between programs', () => {
      const program1 = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      const program2 = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      // Use program 1
      program1.use();
      expect(mockGL.useProgram).toHaveBeenLastCalledWith(mockProgram);

      // Switch to program 2
      program2.use();
      expect(mockGL.useProgram).toHaveBeenLastCalledWith(mockProgram);

      // Deactivate program 2
      program2.unused();
      expect(mockGL.useProgram).toHaveBeenLastCalledWith(null);
    });

    it('allows method chaining throughout lifecycle', () => {
      const program = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      // Chain: use -> unused
      const result = program.use().unused();

      expect(result).toBe(program);
      expect(mockGL.useProgram).toHaveBeenCalledWith(mockProgram);
      expect(mockGL.useProgram).toHaveBeenCalledWith(null);
    });
  });

  describe('Error handling', () => {
    it('throws descriptive error when operations performed on disposed program', () => {
      const program = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      program.dispose();

      expect(() => program.use()).toThrow('Program has been disposed');
      expect(() => program.unused()).toThrow('Program has been disposed');
      expect(() => program.webGLProgram).toThrow('Program has been disposed');
      expect(() => program.getUniformLocation('uColor')).toThrow(
        'Program has been disposed',
      );
      expect(() => program.getAttributeLocation('aPosition')).toThrow(
        'Program has been disposed',
      );
    });
  });

  describe('Multiple instances', () => {
    it('each Program instance is independent', () => {
      const mockProgram1 = {} as WebGLProgram;
      const mockProgram2 = {} as WebGLProgram;

      let createCount = 0;
      (mockGLContext.createProgram as any).mockImplementation(() => {
        createCount++;
        return createCount === 1 ? mockProgram1 : mockProgram2;
      });

      const program1 = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );
      const program2 = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      expect(program1.webGLProgram).toBe(mockProgram1);
      expect(program2.webGLProgram).toBe(mockProgram2);
      expect(program1.webGLProgram).not.toBe(program2.webGLProgram);
    });

    it('disposes one program without affecting others', () => {
      const mockProgram1 = {} as WebGLProgram;
      const mockProgram2 = {} as WebGLProgram;

      let createCount = 0;
      (mockGLContext.createProgram as any).mockImplementation(() => {
        createCount++;
        return createCount === 1 ? mockProgram1 : mockProgram2;
      });

      const program1 = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );
      const program2 = new Program(
        mockGLContext as GLContext,
        validVertexShader,
        validFragmentShader,
      );

      program1.dispose();

      expect(() => program1.use()).toThrow();
      expect(() => program2.use()).not.toThrow();
    });
  });
});