import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'
import { afterEach, afterAll } from 'vitest'
import { cleanup } from '@testing-library/react'

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock matchMedia for responsive testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock Intersection Observer
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.IntersectionObserver = MockIntersectionObserver as any

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Cleanup after all tests
afterAll(() => {
  vi.restoreAllMocks()
})
