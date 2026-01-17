/**
 * Unit Tests: Badge Component
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/badge'

describe('Badge Component', () => {
    describe('Rendering', () => {
        it('should render badge with text', () => {
            render(<Badge>New</Badge>)
            expect(screen.getByText('New')).toBeInTheDocument()
        })

        it('should render badge with children', () => {
            render(<Badge>Premium</Badge>)
            expect(screen.getByText('Premium')).toBeInTheDocument()
        })

        it('should render badge with number', () => {
            render(<Badge>5</Badge>)
            expect(screen.getByText('5')).toBeInTheDocument()
        })

        it('should render badge with icon and text', () => {
            render(
                <Badge>
                    <span>★</span> Featured
                </Badge>
            )
            expect(screen.getByText('★')).toBeInTheDocument()
            expect(screen.getByText('Featured')).toBeInTheDocument()
        })
    })

    describe('Variants', () => {
        it('should render default variant', () => {
            const { container } = render(<Badge>Default</Badge>)
            const badge = container.firstChild
            expect(badge).toBeInTheDocument()
        })

        it('should render secondary variant', () => {
            const { container } = render(<Badge variant="secondary">Secondary</Badge>)
            const badge = container.firstChild
            expect(badge).toBeInTheDocument()
        })

        it('should render destructive variant', () => {
            const { container } = render(<Badge variant="destructive">Error</Badge>)
            const badge = container.firstChild
            expect(badge).toBeInTheDocument()
        })

        it('should render outline variant', () => {
            const { container } = render(<Badge variant="outline">Outline</Badge>)
            const badge = container.firstChild
            expect(badge).toBeInTheDocument()
        })
    })

    describe('Custom className', () => {
        it('should apply custom className', () => {
            const { container } = render(<Badge className="custom-badge">Text</Badge>)
            const badge = container.firstChild as HTMLElement
            expect(badge).toHaveClass('custom-badge')
        })

        it('should merge custom className with default classes', () => {
            const { container } = render(<Badge className="my-badge">Text</Badge>)
            const badge = container.firstChild as HTMLElement
            expect(badge.className).toContain('my-badge')
        })
    })

    describe('Edge cases', () => {
        it('should handle empty children', () => {
            const { container } = render(<Badge></Badge>)
            expect(container.firstChild).toBeInTheDocument()
        })

        it('should handle very long text', () => {
            const longText = 'This is a very long badge text that might overflow'
            render(<Badge>{longText}</Badge>)
            expect(screen.getByText(longText)).toBeInTheDocument()
        })

        it('should handle special characters', () => {
            render(<Badge>★ ⚡ ✓</Badge>)
            expect(screen.getByText(/★ ⚡ ✓/)).toBeInTheDocument()
        })
    })

    describe('HTML attributes', () => {
        it('should support data attributes', () => {
            const { container } = render(
                <Badge data-testid="test-badge">Badge</Badge>
            )
            const badge = screen.getByTestId('test-badge')
            expect(badge).toBeInTheDocument()
        })

        it('should support aria attributes', () => {
            const { container } = render(
                <Badge aria-label="Status badge">Active</Badge>
            )
            const badge = screen.getByLabelText('Status badge')
            expect(badge).toBeInTheDocument()
        })

        it('should support onClick handler', () => {
            const handleClick = jest.fn()
            render(<Badge onClick={handleClick}>Click me</Badge>)
            const badge = screen.getByText('Click me')

            badge.click()

            expect(handleClick).toHaveBeenCalledTimes(1)
        })
    })
})
