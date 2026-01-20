/**
 * Unit Tests: components/ui/skeleton.tsx
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { Skeleton } from '@/components/ui/skeleton'

describe('Skeleton Component', () => {
    describe('Rendering', () => {
        it('should render a skeleton element', () => {
            render(<Skeleton data-testid="skeleton" />)
            expect(screen.getByTestId('skeleton')).toBeInTheDocument()
        })

        it('should render as a div', () => {
            render(<Skeleton data-testid="skeleton" />)
            expect(screen.getByTestId('skeleton').tagName.toLowerCase()).toBe('div')
        })
    })

    describe('Animation', () => {
        it('should have animate-pulse class', () => {
            render(<Skeleton data-testid="skeleton" />)
            expect(screen.getByTestId('skeleton')).toHaveClass('animate-pulse')
        })
    })

    describe('Styling', () => {
        it('should have rounded corners', () => {
            render(<Skeleton data-testid="skeleton" />)
            expect(screen.getByTestId('skeleton')).toHaveClass('rounded-md')
        })

        it('should have background color', () => {
            render(<Skeleton data-testid="skeleton" />)
            expect(screen.getByTestId('skeleton')).toHaveClass('bg-accent')
        })
    })

    describe('Custom className', () => {
        it('should merge custom className', () => {
            render(<Skeleton className="h-20 w-full" data-testid="skeleton" />)
            const skeleton = screen.getByTestId('skeleton')
            expect(skeleton).toHaveClass('h-20')
            expect(skeleton).toHaveClass('w-full')
        })

        it('should maintain base classes with custom classes', () => {
            render(<Skeleton className="h-20" data-testid="skeleton" />)
            const skeleton = screen.getByTestId('skeleton')
            expect(skeleton).toHaveClass('animate-pulse')
            expect(skeleton).toHaveClass('h-20')
        })
    })

    describe('Common use cases', () => {
        it('should render text skeleton', () => {
            render(<Skeleton className="h-4 w-[250px]" data-testid="skeleton" />)
            const skeleton = screen.getByTestId('skeleton')
            expect(skeleton).toHaveClass('h-4')
        })

        it('should render avatar skeleton', () => {
            render(<Skeleton className="h-12 w-12 rounded-full" data-testid="skeleton" />)
            const skeleton = screen.getByTestId('skeleton')
            expect(skeleton).toHaveClass('h-12')
            expect(skeleton).toHaveClass('w-12')
            expect(skeleton).toHaveClass('rounded-full')
        })

        it('should render card skeleton', () => {
            render(<Skeleton className="h-[125px] w-[250px]" data-testid="skeleton" />)
            const skeleton = screen.getByTestId('skeleton')
            expect(skeleton).toBeInTheDocument()
        })
    })

    describe('Multiple skeletons', () => {
        it('should render multiple skeletons for list', () => {
            render(
                <div data-testid="skeleton-list">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            )

            const container = screen.getByTestId('skeleton-list')
            expect(container.children).toHaveLength(3)
        })
    })

    describe('Props pass-through', () => {
        it('should pass data attributes', () => {
            render(<Skeleton data-testid="skeleton" data-custom="value" />)
            expect(screen.getByTestId('skeleton')).toHaveAttribute('data-custom', 'value')
        })

        it('should pass aria-hidden for decorative skeletons', () => {
            render(<Skeleton aria-hidden="true" data-testid="skeleton" />)
            expect(screen.getByTestId('skeleton')).toHaveAttribute('aria-hidden', 'true')
        })
    })
})
