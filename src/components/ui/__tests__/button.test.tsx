/**
 * Button Component Tests
 *
 * Tests Button variants, sizes, accessibility, and mobileSize prop.
 * Uses existing vitest-setup.js mocks.
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button, buttonVariants } from '../button'

describe('Button', () => {
  it('renders default button with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies variant classes correctly', () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('bg-destructive')
  })

  it('applies size classes correctly', () => {
    render(<Button size="lg">Large</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('h-11')
  })

  it('applies mobileSize prop correctly - large', () => {
    render(<Button mobileSize="large">Mobile Large</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('min-h-[44px]')
    expect(button.className).toContain('px-6')
  })

  it('applies mobileSize prop correctly - icon', () => {
    render(<Button mobileSize="icon" aria-label="Icon button" />)
    const button = screen.getByRole('button')
    expect(button.className).toContain('min-h-[44px]')
    expect(button.className).toContain('min-w-[44px]')
  })

  it('handles disabled state', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('passes aria attributes', () => {
    render(<Button aria-label="Custom label">Test</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Custom label')
  })

  it('renders as child when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )
    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveTextContent('Link Button')
  })
})

describe('buttonVariants', () => {
  it('returns default variant classes', () => {
    const classes = buttonVariants()
    expect(classes).toContain('h-10')
  })

  it('returns destructive variant', () => {
    const classes = buttonVariants({ variant: 'destructive' })
    expect(classes).toContain('bg-destructive')
  })

  it('returns small size', () => {
    const classes = buttonVariants({ size: 'sm' })
    expect(classes).toContain('h-9')
  })
})
