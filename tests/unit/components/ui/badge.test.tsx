/**
 * Unit Tests: components/ui/badge.tsx
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { Badge, badgeVariants } from '@/components/ui/badge'

describe('Badge Component', () => {
    describe('Rendering', () => {
        it('should render a badge element', () => {
            render(<Badge>Badge Text</Badge>)
            expect(screen.getByText('Badge Text')).toBeInTheDocument()
        })

        it('should render children correctly', () => {
            render(<Badge>Test Content</Badge>)
            expect(screen.getByText('Test Content')).toBeInTheDocument()
        })

        it('should render as a span by default', () => {
            render(<Badge data-testid="badge">Badge</Badge>)
            const badge = screen.getByTestId('badge')
            expect(badge.tagName.toLowerCase()).toBe('span')
        })
    })

    describe('Variants', () => {
        it('should apply default variant', () => {
            render(<Badge data-testid="badge">Default</Badge>)
            const badge = screen.getByTestId('badge')
            expect(badge).toHaveClass('bg-primary')
        })

        it('should apply secondary variant', () => {
            render(<Badge variant="secondary" data-testid="badge">Secondary</Badge>)
            const badge = screen.getByTestId('badge')
            expect(badge).toHaveClass('bg-secondary')
        })

        it('should apply destructive variant', () => {
            render(<Badge variant="destructive" data-testid="badge">Destructive</Badge>)
            const badge = screen.getByTestId('badge')
            expect(badge).toHaveClass('bg-destructive')
        })

        it('should apply outline variant', () => {
            render(<Badge variant="outline" data-testid="badge">Outline</Badge>)
            const badge = screen.getByTestId('badge')
            expect(badge).toHaveClass('text-foreground')
        })
    })

    describe('Custom className', () => {
        it('should merge custom className', () => {
            render(<Badge className="custom-class" data-testid="badge">Custom</Badge>)
            const badge = screen.getByTestId('badge')
            expect(badge).toHaveClass('custom-class')
        })

        it('should allow overriding default classes', () => {
            render(<Badge className="rounded-full" data-testid="badge">Round</Badge>)
            const badge = screen.getByTestId('badge')
            expect(badge).toHaveClass('rounded-full')
        })
    })

    describe('badgeVariants', () => {
        it('should export badgeVariants function', () => {
            expect(typeof badgeVariants).toBe('function')
        })

        it('should return class string for default variant', () => {
            const classes = badgeVariants({ variant: 'default' })
            expect(typeof classes).toBe('string')
            expect(classes).toContain('bg-primary')
        })

        it('should return different classes for different variants', () => {
            const defaultClasses = badgeVariants({ variant: 'default' })
            const destructiveClasses = badgeVariants({ variant: 'destructive' })
            expect(defaultClasses).not.toBe(destructiveClasses)
        })
    })

    describe('Common use cases', () => {
        it('should render status badge', () => {
            render(<Badge variant="default">Active</Badge>)
            expect(screen.getByText('Active')).toBeInTheDocument()
        })

        it('should render count badge', () => {
            render(<Badge>12</Badge>)
            expect(screen.getByText('12')).toBeInTheDocument()
        })

        it('should render with icon', () => {
            render(
                <Badge data-testid="badge">
                    <span data-testid="icon">✓</span> Complete
                </Badge>
            )
            expect(screen.getByTestId('icon')).toBeInTheDocument()
            expect(screen.getByText('Complete')).toBeInTheDocument()
        })
    })

    describe('Props pass-through', () => {
        it('should pass data attributes to element', () => {
            render(<Badge data-testid="badge" data-custom="value">Badge</Badge>)
            expect(screen.getByTestId('badge')).toHaveAttribute('data-custom', 'value')
        })

        it('should pass aria attributes', () => {
            render(<Badge aria-label="Status badge" data-testid="badge">Active</Badge>)
            expect(screen.getByTestId('badge')).toHaveAttribute('aria-label', 'Status badge')
        })
    })
})
