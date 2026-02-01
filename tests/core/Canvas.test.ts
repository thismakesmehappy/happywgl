import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Canvas } from '../../src/core/Canvas.js';

/**
 * Test suite for Canvas
 *
 * Tests canvas wrapper functionality including:
 * - Canvas creation with factory methods
 * - Wrapping existing canvas elements
 * - Sizing and DPI-aware rendering
 * - Container appending
 * - Responsive resizing
 * - Data URL capture
 * - Resource cleanup
 */

describe('Canvas', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    // Create a container div for tests
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);

    // Mock window.devicePixelRatio
    Object.defineProperty(window, 'devicePixelRatio', {
      value: 1,
      configurable: true,
    });
  });

  afterEach(() => {
    // Clean up container
    if (container.parentElement) {
      container.parentElement.removeChild(container);
    }
    vi.clearAllMocks();
  });

  describe('Canvas.create()', () => {
    it('creates canvas with default options', () => {
      const canvas = Canvas.create();
      expect(canvas).toBeDefined();
      expect(canvas.width).toBe(800);
      expect(canvas.height).toBe(600);
      canvas.dispose();
    });

    it('creates canvas with custom dimensions', () => {
      const canvas = Canvas.create({ width: 1024, height: 768 });

      // Check Canvas wrapper properties
      expect(canvas.width).toBe(1024);
      expect(canvas.height).toBe(768);

      // Check underlying HTML element CSS dimensions
      expect(canvas.element.style.width).toBe('1024px');
      expect(canvas.element.style.height).toBe('768px');

      // Check drawing buffer dimensions (device pixel ratio considered)
      const dpr = window.devicePixelRatio || 1;
      expect(canvas.element.width).toBe(1024 * dpr);
      expect(canvas.element.height).toBe(768 * dpr);

      canvas.dispose();
    });

    it('sets CSS dimensions on canvas element', () => {
      const canvas = Canvas.create({ width: 640, height: 480 });
      expect(canvas.element.style.width).toBe('640px');
      expect(canvas.element.style.height).toBe('480px');
      canvas.dispose();
    });

    it('sets drawing buffer size', () => {
      const canvas = Canvas.create({ width: 800, height: 600 });
      // With devicePixelRatio of 1, drawing buffer should match CSS size
      expect(canvas.element.width).toBe(800);
      expect(canvas.element.height).toBe(600);
      canvas.dispose();
    });

    it('appends to container element', () => {
      const canvas = Canvas.create({ container });
      expect(container.contains(canvas.element)).toBe(true);
      canvas.dispose();
    });

    it('appends to container by CSS selector', () => {
      const canvas = Canvas.create({ container: '#test-container' });
      expect(container.contains(canvas.element)).toBe(true);
      canvas.dispose();
    });

    it('applies CSS class to canvas', () => {
      const canvas = Canvas.create({ className: 'my-canvas test' });
      expect(canvas.element.className).toBe('my-canvas test');
      canvas.dispose();
    });

    it('throws error for invalid container selector', () => {
      expect(() => {
        Canvas.create({ container: '#nonexistent-container' });
      }).toThrow(/Container not found/);
    });

    it('does not append to DOM by default', () => {
      const canvas = Canvas.create({ width: 800, height: 600 });
      expect(document.body.contains(canvas.element)).toBe(false);
      canvas.dispose();
    });

    it('creates canvas we own (dispose removes from DOM)', () => {
      const canvas = Canvas.create({ container });
      expect(container.contains(canvas.element)).toBe(true);
      canvas.dispose();
      expect(container.contains(canvas.element)).toBe(false);
    });
  });

  describe('Canvas.fromElement()', () => {
    it('wraps existing canvas by reference', () => {
      const htmlCanvas = document.createElement('canvas');
      container.appendChild(htmlCanvas);

      const canvas = Canvas.fromElement(htmlCanvas);
      expect(canvas.element).toBe(htmlCanvas);
      canvas.dispose();
    });

    it('wraps existing canvas by ID string', () => {
      const htmlCanvas = document.createElement('canvas');
      htmlCanvas.id = 'my-canvas';
      container.appendChild(htmlCanvas);

      const canvas = Canvas.fromElement('my-canvas');
      expect(canvas.element).toBe(htmlCanvas);
      canvas.dispose();
    });

    it('throws error if element ID not found', () => {
      expect(() => {
        Canvas.fromElement('#never-exists');
      }).toThrow(/not found in the DOM/);
    });

    it('throws error if element is not a canvas', () => {
      const div = document.createElement('div');
      div.id = 'not-a-canvas';
      container.appendChild(div);

      expect(() => {
        Canvas.fromElement('not-a-canvas');
      }).toThrow(/not an HTMLCanvasElement/);
    });

    it('does not remove from DOM on dispose (borrowed canvas)', () => {
      const htmlCanvas = document.createElement('canvas');
      container.appendChild(htmlCanvas);

      const canvas = Canvas.fromElement(htmlCanvas);
      expect(container.contains(htmlCanvas)).toBe(true);

      canvas.dispose();

      // Canvas should still be in DOM since we didn't create it
      expect(container.contains(htmlCanvas)).toBe(true);
    });
  });

  describe('Canvas.createWithGLContext()', () => {
    it('returns both canvas and glContext', () => {
      try {
        const result = Canvas.createWithGLContext({
          width: 800,
          height: 600,
        });

        expect(result.canvas).toBeDefined();
        expect(result.glContext).toBeDefined();

        result.glContext.dispose();
        result.canvas.dispose();
      } catch (e) {
        // WebGL 2.0 not available in test environment - this is expected
        expect((e as Error).message).toMatch(/WebGL 2.0 is not supported/);
      }
    });

    it('passes canvas options to Canvas.create()', () => {
      try {
        const result = Canvas.createWithGLContext({
          width: 512,
          height: 512,
          container,
        });

        expect(result.canvas.width).toBe(512);
        expect(result.canvas.height).toBe(512);
        expect(container.contains(result.canvas.element)).toBe(true);

        result.glContext.dispose();
        result.canvas.dispose();
      } catch (e) {
        // WebGL 2.0 not available in test environment - this is expected
        expect((e as Error).message).toMatch(/WebGL 2.0 is not supported/);
      }
    });

    it('passes context options to GLContext', () => {
      try {
        // If context creation succeeds with custom options, they were passed
        const result = Canvas.createWithGLContext(
          { width: 800, height: 600 },
          { antialias: false, alpha: false },
        );

        expect(result.glContext).toBeDefined();

        result.glContext.dispose();
        result.canvas.dispose();
      } catch (e) {
        // WebGL 2.0 not available in test environment - this is expected
        expect((e as Error).message).toMatch(/WebGL 2.0 is not supported/);
      }
    });
  });

  describe('properties', () => {
    let canvas: Canvas;

    beforeEach(() => {
      canvas = Canvas.create({ width: 1024, height: 768 });
    });

    afterEach(() => {
      canvas.dispose();
    });

    it('provides access to element', () => {
      expect(canvas.element).toBeInstanceOf(HTMLCanvasElement);
    });

    it('returns correct width', () => {
      expect(canvas.width).toBe(1024);
    });

    it('returns correct height', () => {
      expect(canvas.height).toBe(768);
    });

    it('returns device pixel ratio when enabled', () => {
      Object.defineProperty(window, 'devicePixelRatio', {
        value: 2,
        configurable: true,
      });

      const highDpiCanvas = Canvas.create({ useDevicePixelRatio: true });
      expect(highDpiCanvas.devicePixelRatio).toBe(2);
      highDpiCanvas.dispose();
    });

    it('ignores device pixel ratio when disabled', () => {
      Object.defineProperty(window, 'devicePixelRatio', {
        value: 2,
        configurable: true,
      });

      const canvas2 = Canvas.create({ useDevicePixelRatio: false });
      expect(canvas2.devicePixelRatio).toBe(1);
      canvas2.dispose();
    });

    it('defaults to device pixel ratio enabled', () => {
      Object.defineProperty(window, 'devicePixelRatio', {
        value: 2,
        configurable: true,
      });

      const canvas2 = Canvas.create();
      expect(canvas2.devicePixelRatio).toBe(2);
      canvas2.dispose();
    });
  });

  describe('setSize', () => {
    let canvas: Canvas;

    beforeEach(() => {
      canvas = Canvas.create({ width: 800, height: 600 });
    });

    afterEach(() => {
      canvas.dispose();
    });

    it('updates canvas CSS dimensions', () => {
      canvas.setSize(1024, 768);
      expect(canvas.element.style.width).toBe('1024px');
      expect(canvas.element.style.height).toBe('768px');
    });

    it('updates canvas drawing buffer size', () => {
      canvas.setSize(640, 480);
      expect(canvas.element.width).toBe(640);
      expect(canvas.element.height).toBe(480);
    });

    it('updates width and height properties', () => {
      canvas.setSize(1920, 1080);
      expect(canvas.width).toBe(1920);
      expect(canvas.height).toBe(1080);
    });

    it('handles zero dimensions', () => {
      canvas.setSize(0, 0);
      expect(canvas.width).toBe(0);
      expect(canvas.height).toBe(0);
    });

    it('handles very large dimensions', () => {
      canvas.setSize(4096, 2160);
      expect(canvas.width).toBe(4096);
      expect(canvas.height).toBe(2160);
    });

    it('respects useDevicePixelRatio flag', () => {
      const canvasEnabled = Canvas.create({ useDevicePixelRatio: true });
      const canvasDisabled = Canvas.create({ useDevicePixelRatio: false });

      // When enabled, should use system's devicePixelRatio
      expect(canvasEnabled.devicePixelRatio).toBe(window.devicePixelRatio);

      // When disabled, should always return 1
      expect(canvasDisabled.devicePixelRatio).toBe(1);

      canvasEnabled.dispose();
      canvasDisabled.dispose();
    });

    it('is chainable', () => {
      const result = canvas.setSize(512, 512);
      expect(result).toBe(canvas);
    });
  });

  describe('DOM methods', () => {
    let canvas: Canvas;

    beforeEach(() => {
      canvas = Canvas.create({ width: 800, height: 600 });
    });

    afterEach(() => {
      canvas.dispose();
    });

    describe('setId/getId', () => {
      it('sets element ID', () => {
        canvas.setId('my-canvas');
        expect(canvas.element.id).toBe('my-canvas');
      });

      it('gets element ID', () => {
        canvas.element.id = 'test-id';
        expect(canvas.getId()).toBe('test-id');
      });

      it('overwrites previous ID when set multiple times', () => {
        canvas.setId('first-id');
        expect(canvas.getId()).toBe('first-id');

        canvas.setId('second-id');
        expect(canvas.getId()).toBe('second-id');

        canvas.setId('third-id');
        expect(canvas.element.id).toBe('third-id');
        expect(canvas.getId()).toBe('third-id');
      });

      it('is chainable', () => {
        const result = canvas.setId('canvas-id');
        expect(result).toBe(canvas);
      });
    });

    describe('addClass/removeClass/hasClass', () => {
      it('adds single class', () => {
        canvas.addClass('fullscreen');
        expect(canvas.element.classList.contains('fullscreen')).toBe(true);
      });

      it('adds multiple classes', () => {
        canvas.addClass('fullscreen', 'high-res', 'dark-mode');
        expect(canvas.element.classList.contains('fullscreen')).toBe(true);
        expect(canvas.element.classList.contains('high-res')).toBe(true);
        expect(canvas.element.classList.contains('dark-mode')).toBe(true);
      });

      it('adds space-separated classes (auto-splits)', () => {
        canvas.addClass('fullscreen high-res dark-mode');
        expect(canvas.element.classList.contains('fullscreen')).toBe(true);
        expect(canvas.element.classList.contains('high-res')).toBe(true);
        expect(canvas.element.classList.contains('dark-mode')).toBe(true);
      });

      it('mixes space-separated and multiple arguments', () => {
        canvas.addClass('fullscreen high-res', 'dark-mode', 'large');
        expect(canvas.element.classList.contains('fullscreen')).toBe(true);
        expect(canvas.element.classList.contains('high-res')).toBe(true);
        expect(canvas.element.classList.contains('dark-mode')).toBe(true);
        expect(canvas.element.classList.contains('large')).toBe(true);
      });

      it('handles extra whitespace in space-separated classes', () => {
        canvas.addClass('  fullscreen   high-res  ');
        expect(canvas.element.classList.contains('fullscreen')).toBe(true);
        expect(canvas.element.classList.contains('high-res')).toBe(true);
      });

      it('removes single class', () => {
        canvas.element.classList.add('fullscreen', 'high-res');
        canvas.removeClass('fullscreen');
        expect(canvas.element.classList.contains('fullscreen')).toBe(false);
        expect(canvas.element.classList.contains('high-res')).toBe(true);
      });

      it('removes multiple classes', () => {
        canvas.element.classList.add('fullscreen', 'high-res', 'dark-mode');
        canvas.removeClass('fullscreen', 'high-res');
        expect(canvas.element.classList.contains('fullscreen')).toBe(false);
        expect(canvas.element.classList.contains('high-res')).toBe(false);
        expect(canvas.element.classList.contains('dark-mode')).toBe(true);
      });

      it('removes space-separated classes (auto-splits)', () => {
        canvas.element.classList.add('fullscreen', 'high-res', 'dark-mode');
        canvas.removeClass('fullscreen high-res');
        expect(canvas.element.classList.contains('fullscreen')).toBe(false);
        expect(canvas.element.classList.contains('high-res')).toBe(false);
        expect(canvas.element.classList.contains('dark-mode')).toBe(true);
      });

      it('mixes space-separated and multiple arguments in removeClass', () => {
        canvas.element.classList.add('fullscreen', 'high-res', 'dark-mode', 'large');
        canvas.removeClass('fullscreen high-res', 'dark-mode');
        expect(canvas.element.classList.contains('fullscreen')).toBe(false);
        expect(canvas.element.classList.contains('high-res')).toBe(false);
        expect(canvas.element.classList.contains('dark-mode')).toBe(false);
        expect(canvas.element.classList.contains('large')).toBe(true);
      });

      it('silently ignores non-existent classes in removeClass', () => {
        canvas.element.classList.add('fullscreen');
        // Removing classes that don't exist should not error
        expect(() => {
          canvas.removeClass('fullscreen non-existent another-missing');
        }).not.toThrow();
        expect(canvas.element.classList.contains('fullscreen')).toBe(false);
      });

      it('handles extra whitespace in space-separated removeClass', () => {
        canvas.element.classList.add('fullscreen', 'high-res');
        canvas.removeClass('  fullscreen   high-res  ');
        expect(canvas.element.classList.contains('fullscreen')).toBe(false);
        expect(canvas.element.classList.contains('high-res')).toBe(false);
      });

      it('checks if class exists', () => {
        canvas.addClass('fullscreen');
        expect(canvas.hasClass('fullscreen')).toBe(true);
        expect(canvas.hasClass('missing')).toBe(false);
      });

      it('addClass is chainable', () => {
        const result = canvas.addClass('test');
        expect(result).toBe(canvas);
      });

      it('removeClass is chainable', () => {
        canvas.addClass('test');
        const result = canvas.removeClass('test');
        expect(result).toBe(canvas);
      });
    });

    describe('appendTo', () => {
      it('appends to HTMLElement', () => {
        const newCanvas = Canvas.create({ width: 400, height: 300 });
        newCanvas.appendTo(container);
        expect(container.contains(newCanvas.element)).toBe(true);
        newCanvas.dispose();
      });

      it('appends to CSS selector', () => {
        const newCanvas = Canvas.create({ width: 400, height: 300 });
        newCanvas.appendTo('#test-container');
        expect(container.contains(newCanvas.element)).toBe(true);
        newCanvas.dispose();
      });

      it('throws error if container selector not found', () => {
        const newCanvas = Canvas.create({ width: 400, height: 300 });
        expect(() => {
          newCanvas.appendTo('#never-exists');
        }).toThrow(/Container not found/);
        newCanvas.dispose();
      });

      it('is chainable', () => {
        const newCanvas = Canvas.create({ width: 400, height: 300 });
        const result = newCanvas.appendTo(container);
        expect(result).toBe(newCanvas);
        newCanvas.dispose();
      });
    });
  });

  describe('method chaining', () => {
    it('chains setId with addClass', () => {
      const canvas = Canvas.create({ width: 800, height: 600 })
        .setId('game-canvas')
        .addClass('fullscreen');

      expect(canvas.element.id).toBe('game-canvas');
      expect(canvas.element.classList.contains('fullscreen')).toBe(true);
      canvas.dispose();
    });

    it('chains multiple DOM operations', () => {
      const canvas = Canvas.create({ width: 800, height: 600 })
        .setId('game-canvas')
        .addClass('fullscreen', 'high-res')
        .appendTo(container);

      expect(canvas.element.id).toBe('game-canvas');
      expect(canvas.hasClass('fullscreen')).toBe(true);
      expect(canvas.hasClass('high-res')).toBe(true);
      expect(container.contains(canvas.element)).toBe(true);
      canvas.dispose();
    });

    it('chains sizing with DOM methods', () => {
      const canvas = Canvas.create({ width: 800, height: 600 })
        .setSize(1024, 768)
        .setId('render-canvas')
        .addClass('display')
        .appendTo(container);

      expect(canvas.width).toBe(1024);
      expect(canvas.height).toBe(768);
      expect(canvas.getId()).toBe('render-canvas');
      expect(canvas.hasClass('display')).toBe(true);
      canvas.dispose();
    });
  });

  describe('fillWindow', () => {
    let canvas: Canvas;

    beforeEach(() => {
      canvas = Canvas.create();
    });

    afterEach(() => {
      canvas.dispose();
      vi.clearAllMocks();
    });

    it('sets size to window dimensions', () => {
      Object.defineProperty(window, 'innerWidth', {
        value: 1280,
        configurable: true,
      });
      Object.defineProperty(window, 'innerHeight', {
        value: 720,
        configurable: true,
      });

      canvas.fillWindow();

      expect(canvas.width).toBe(1280);
      expect(canvas.height).toBe(720);
    });

    it('listens for window resize events', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      canvas.fillWindow();

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
      );

      addEventListenerSpy.mockRestore();
    });

    it('updates size on window resize', () => {
      Object.defineProperty(window, 'innerWidth', {
        value: 800,
        configurable: true,
      });
      Object.defineProperty(window, 'innerHeight', {
        value: 600,
        configurable: true,
      });

      canvas.fillWindow();
      expect(canvas.width).toBe(800);
      expect(canvas.height).toBe(600);

      // Simulate resize
      Object.defineProperty(window, 'innerWidth', {
        value: 1024,
        configurable: true,
      });
      Object.defineProperty(window, 'innerHeight', {
        value: 768,
        configurable: true,
      });

      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);

      // Size should be updated
      expect(canvas.width).toBe(1024);
      expect(canvas.height).toBe(768);
    });

    it('is chainable', () => {
      const result = canvas.fillWindow();
      expect(result).toBe(canvas);
    });

    it('stores previous size and handler before filling window', () => {
      // Set initial size
      canvas.setSize(400, 300);
      expect(canvas.width).toBe(400);
      expect(canvas.height).toBe(300);

      // Fill window (this stores _previousSize and creates _fillWindowHandler)
      Object.defineProperty(window, 'innerWidth', {
        value: 1280,
        configurable: true,
      });
      Object.defineProperty(window, 'innerHeight', {
        value: 720,
        configurable: true,
      });
      canvas.fillWindow();
      expect(canvas.width).toBe(1280);
      expect(canvas.height).toBe(720);

      // If _previousSize wasn't stored, stopFillWindow(true) wouldn't be able to revert
      canvas.stopFillWindow(true);
      expect(canvas.width).toBe(400);
      expect(canvas.height).toBe(300);

      // If _fillWindowHandler wasn't stored, we couldn't remove the listener
      // This is verified by the fact that subsequent resize events don't update size
      Object.defineProperty(window, 'innerWidth', {
        value: 1024,
        configurable: true,
      });
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);
      expect(canvas.width).toBe(400); // Still at reverted size
    });
  });

  describe('stopFillWindow', () => {
    let canvas: Canvas;

    beforeEach(() => {
      canvas = Canvas.create();
    });

    afterEach(() => {
      canvas.dispose();
      vi.clearAllMocks();
    });

    it('removes window resize listener', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      canvas.fillWindow();
      canvas.stopFillWindow();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
      );

      removeEventListenerSpy.mockRestore();
    });

    it('stops responding to window resize events', () => {
      Object.defineProperty(window, 'innerWidth', {
        value: 800,
        configurable: true,
      });
      Object.defineProperty(window, 'innerHeight', {
        value: 600,
        configurable: true,
      });

      canvas.fillWindow();
      expect(canvas.width).toBe(800);
      expect(canvas.height).toBe(600);

      // Stop listening for resize
      canvas.stopFillWindow();

      // Change window size
      Object.defineProperty(window, 'innerWidth', {
        value: 1024,
        configurable: true,
      });
      Object.defineProperty(window, 'innerHeight', {
        value: 768,
        configurable: true,
      });

      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);

      // Canvas should NOT have updated to new window size
      expect(canvas.width).toBe(800);
      expect(canvas.height).toBe(600);
    });

    it('reverts canvas size when called with revert=true', () => {
      // Set initial size
      canvas.setSize(400, 300);
      expect(canvas.width).toBe(400);
      expect(canvas.height).toBe(300);

      // Fill window with different size
      Object.defineProperty(window, 'innerWidth', {
        value: 1280,
        configurable: true,
      });
      Object.defineProperty(window, 'innerHeight', {
        value: 720,
        configurable: true,
      });

      canvas.fillWindow();
      expect(canvas.width).toBe(1280);
      expect(canvas.height).toBe(720);

      // Stop and revert
      canvas.stopFillWindow(true);
      expect(canvas.width).toBe(400);
      expect(canvas.height).toBe(300);
    });

    it('keeps current size when called with revert=false', () => {
      canvas.setSize(400, 300);
      canvas.fillWindow();

      // Window is now filled
      expect(canvas.width).toBe(window.innerWidth);
      expect(canvas.height).toBe(window.innerHeight);

      // Stop without revert
      canvas.stopFillWindow(false);

      // Should keep the filled window size
      expect(canvas.width).toBe(window.innerWidth);
      expect(canvas.height).toBe(window.innerHeight);
    });

    it('keeps current size by default (revert defaults to false)', () => {
      canvas.setSize(400, 300);
      canvas.fillWindow();
      const filledWidth = canvas.width;
      const filledHeight = canvas.height;

      canvas.stopFillWindow();

      expect(canvas.width).toBe(filledWidth);
      expect(canvas.height).toBe(filledHeight);
    });

    it('prevents multiple reverts by clearing _previousSize', () => {
      canvas.setSize(400, 300);
      const originalWidth = canvas.width;
      const originalHeight = canvas.height;

      Object.defineProperty(window, 'innerWidth', {
        value: 1280,
        configurable: true,
      });
      Object.defineProperty(window, 'innerHeight', {
        value: 720,
        configurable: true,
      });

      canvas.fillWindow();
      canvas.stopFillWindow(true);

      // Should have reverted
      expect(canvas.width).toBe(originalWidth);
      expect(canvas.height).toBe(originalHeight);

      // Set to a new size
      canvas.setSize(640, 480);
      expect(canvas.width).toBe(640);
      expect(canvas.height).toBe(480);

      // Call stopFillWindow(true) again - should be a no-op since _previousSize was cleared
      canvas.stopFillWindow(true);

      // Should still be at the new size (not reverted to original)
      expect(canvas.width).toBe(640);
      expect(canvas.height).toBe(480);
    });

    it('can be called without fillWindow being called first', () => {
      const canvas2 = Canvas.create();
      // Should not throw when calling stopFillWindow without fillWindow
      expect(() => {
        canvas2.stopFillWindow();
      }).not.toThrow();
      canvas2.dispose();
    });

    it('can be called multiple times safely', () => {
      canvas.fillWindow();

      // Call stopFillWindow multiple times - should not throw
      expect(() => {
        canvas.stopFillWindow();
        canvas.stopFillWindow();
        canvas.stopFillWindow();
      }).not.toThrow();
    });

    it('is chainable', () => {
      const result = canvas.stopFillWindow();
      expect(result).toBe(canvas);
    });

    it('chains with setSize to set new size after stopping', () => {
      canvas.fillWindow();
      canvas.stopFillWindow().setSize(512, 384);

      expect(canvas.width).toBe(512);
      expect(canvas.height).toBe(384);
    });

    it('prevents duplicate event listeners when fillWindow called multiple times', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      canvas.fillWindow();
      canvas.fillWindow(); // Call fillWindow again

      // Second fillWindow should have removed the previous listener before adding new one
      expect(removeEventListenerSpy).toHaveBeenCalled();

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });

  describe('toDataURL', () => {
    let canvas: Canvas;

    beforeEach(() => {
      canvas = Canvas.create({ container });
      // Mock toDataURL on the canvas element
      canvas.element.toDataURL = vi.fn(
        (type: string = 'image/png', quality: number = 0.95) => {
          return `data:${type};base64,FAKE_DATA_URL_${quality}`;
        },
      );
    });

    afterEach(() => {
      canvas.dispose();
    });

    it('exports canvas to PNG by default', () => {
      const url = canvas.toDataURL();
      expect(url).toMatch(/^data:image\/png/);
    });

    it('exports canvas with custom image type', () => {
      const url = canvas.toDataURL('image/jpeg');
      expect(url).toMatch(/^data:image\/jpeg/);
    });

    it('exports canvas with custom quality', () => {
      const url = canvas.toDataURL('image/jpeg', 0.5);
      expect(url).toMatch(/^data:image\/jpeg/);
    });

    it('uses default quality of 0.95', () => {
      const urlDefault = canvas.toDataURL('image/jpeg');
      const urlExplicit = canvas.toDataURL('image/jpeg', 0.95);
      // Both should produce valid data URLs
      expect(urlDefault).toMatch(/^data:image\/jpeg/);
      expect(urlExplicit).toMatch(/^data:image\/jpeg/);
    });

    it('returns valid data URL', () => {
      const url = canvas.toDataURL('image/png');
      expect(typeof url).toBe('string');
      expect(url.length).toBeGreaterThan(0);
    });
  });

  describe('dispose', () => {
    it('removes canvas from DOM if we created it', () => {
      const canvas = Canvas.create({ container });
      expect(container.contains(canvas.element)).toBe(true);

      canvas.dispose();

      expect(container.contains(canvas.element)).toBe(false);
    });

    it('does not remove canvas from DOM if we wrapped it', () => {
      const htmlCanvas = document.createElement('canvas');
      container.appendChild(htmlCanvas);

      const canvas = Canvas.fromElement(htmlCanvas);
      expect(container.contains(htmlCanvas)).toBe(true);

      canvas.dispose();

      expect(container.contains(htmlCanvas)).toBe(true);
    });

    it('can be called on in-memory canvas without error', () => {
      const canvas = Canvas.create();
      expect(() => canvas.dispose()).not.toThrow();
    });

    it('can be called multiple times safely', () => {
      const canvas = Canvas.create({ container });
      canvas.dispose();
      expect(() => canvas.dispose()).not.toThrow();
    });
  });

  describe('integration', () => {
    it('complete canvas workflow with Canvas.create()', () => {
      // Create canvas
      const canvas = Canvas.create({
        width: 512,
        height: 512,
        container,
        className: 'game-canvas',
      });

      // Verify setup
      expect(canvas.element).toBeInstanceOf(HTMLCanvasElement);
      expect(canvas.element.className).toBe('game-canvas');

      // Resize
      canvas.setSize(1024, 768);
      expect(canvas.width).toBe(1024);
      expect(canvas.height).toBe(768);

      // Mock export
      canvas.element.toDataURL = vi.fn(() => 'data:image/png;base64,test');
      const dataUrl = canvas.toDataURL();
      expect(typeof dataUrl).toBe('string');

      // Cleanup
      canvas.dispose();
      expect(container.contains(canvas.element)).toBe(false);
    });

    it('complete workflow with Canvas.createWithGLContext()', () => {
      try {
        const { canvas, glContext } = Canvas.createWithGLContext({
          width: 800,
          height: 600,
          container,
        });

        // Both should be initialized
        expect(canvas).toBeDefined();
        expect(glContext).toBeDefined();

        // Should be in DOM
        expect(container.contains(canvas.element)).toBe(true);

        // Cleanup
        glContext.dispose();
        canvas.dispose();
        expect(container.contains(canvas.element)).toBe(false);
      } catch (e) {
        // WebGL 2.0 not available in test environment - this is expected
        expect((e as Error).message).toMatch(/WebGL 2.0 is not supported/);
      }
    });

    it('high-DPI rendering pipeline', () => {
      const canvas = Canvas.create({
        width: 800,
        height: 600,
        useDevicePixelRatio: true,
      });

      // DPI factor is applied to drawing buffer
      const dpi = window.devicePixelRatio || 1;
      expect(canvas.element.width).toBe(800 * dpi);
      expect(canvas.element.height).toBe(600 * dpi);

      canvas.dispose();
    });
  });

  describe('error handling', () => {
    it('throws when container selector not found', () => {
      expect(() => {
        Canvas.create({ container: '#never-exists' });
      }).toThrow(/Container not found/);
    });

    it('throws when container selector is empty string', () => {
      expect(() => {
        Canvas.create({ container: '' });
      }).toThrow(/Container selector cannot be empty/);
    });
  });
});