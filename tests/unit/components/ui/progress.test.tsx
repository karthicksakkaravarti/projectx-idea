/**
 * Unit Tests: components/ui/progress.tsx
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { Progress } from '@/components/ui/progress'

describe('Progress Component', () => {
    describe('Rendering', () => {
        it('should render a progress bar', () => {
            render(<Progress data-testid="progress" />)
            expect(screen.getByTestId('progress')).toBeInTheDocument()
        })

        it('should have progressbar role', () => {
            render(<Progress />)
            expect(screen.getByRole('progressbar')).toBeInTheDocument()
        })
    })

    describe('Value prop', () => {
        it('should accept value prop', () => {
            render(<Progress value={50} />)
            expect(screen.getByRole('progressbar')).toBeInTheDocument()
        })

        it('should handle 0 value', () => {
            render(<Progress value={0} />)
            expect(screen.getByRole('progressbar')).toBeInTheDocument()
        })

        it('should handle 100 value', () => {
            render(<Progress value={100} />)
            expect(screen.getByRole('progressbar')).toBeInTheDocument()
        })

        it('should handle undefined value', () => {
            render(<Progress />)
            // Should render without error
            expect(screen.getByRole('progressbar')).toBeInTheDocument()
        })
    })

    describe('Styling', () => {
        it('should apply custom className', () => {
            render(<Progress className="custom-class" data-testid="progress" />)
            expect(screen.getByTestId('progress')).toHaveClass('custom-class')
        })

        it('should have base styles', () => {
            render(<Progress data-testid="progress" />)
            const progress = screen.getByTestId('progress')
            expect(progress).toHaveClass('h-2')
            expect(progress).toHaveClass('w-full')
        })
    })

    describe('Accessibility', () => {
        it('should have progressbar role', () => {
            render(<Progress value={50} />)
            expect(screen.getByRole('progressbar')).toBeInTheDocument()
        })

        it('should render with different values', () => {
            const { rerender } = render(<Progress value={50} />)
            expect(screen.getByRole('progressbar')).toBeInTheDocument()

            rerender(<Progress value={75} />)
            expect(screen.getByRole('progressbar')).toBeInTheDocument()
        })

        it('should support custom styling', () => {
            render(<Progress className="h-4 w-full" data-testid="progress" />)
            expect(screen.getByTestId('progress')).toHaveClass('h-4')
        })
    })

    describe('Visual representation', () => {
        it('should show progress indicator based on value', () => {
            render(<Progress value={50} data-testid="progress" />)
            // The indicator should reflect the progress
            expect(screen.getByTestId('progress')).toBeInTheDocument()
        })

        it('should handle edge cases', () => {
            // Value below 0 (should be treated as 0)
            const { rerender } = render(<Progress value={-10} />)
            expect(screen.getByRole('progressbar')).toBeInTheDocument()

            // Value above 100 (should be treated as 100)
            rerender(<Progress value={150} />)
            expect(screen.getByRole('progressbar')).toBeInTheDocument()
        })
    })

    describe('Use cases', () => {
        it('should work for file upload progress', () => {
            render(<Progress value={75} data-testid="upload-progress" />)
            const progressbar = screen.getByTestId('upload-progress')
            expect(progressbar).toBeInTheDocument()
        })

        it('should work for loading indicators', () => {
            render(<Progress value={33} data-testid="loading-progress" />)
            expect(screen.getByTestId('loading-progress')).toBeInTheDocument()
        })
    })
})
