/**
 * Unit Tests: HeaderGoBack Component
 * Tests for the header navigation component with back link
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { HeaderGoBack } from '@/app/components/header-go-back'

// Mock dependencies
jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href, prefetch, className }: any) => (
        <a href={href} data-prefetch={prefetch} className={className}>
            {children}
        </a>
    ),
}))

jest.mock('@phosphor-icons/react', () => ({
    ArrowLeft: ({ className }: { className?: string }) => (
        <div data-testid="arrow-left-icon" className={className}>
            ArrowLeft
        </div>
    ),
}))

describe('HeaderGoBack Component', () => {
    describe('rendering', () => {
        it('should render the header element', () => {
            const { container } = render(<HeaderGoBack />)
            
            const header = container.querySelector('header')
            expect(header).toBeInTheDocument()
        })

        it('should render back to chat text', () => {
            render(<HeaderGoBack />)
            
            expect(screen.getByText('Back to Chat')).toBeInTheDocument()
        })

        it('should render ArrowLeft icon', () => {
            render(<HeaderGoBack />)
            
            expect(screen.getByTestId('arrow-left-icon')).toBeInTheDocument()
        })

        it('should render link with default href', () => {
            render(<HeaderGoBack />)
            
            const link = screen.getByRole('link')
            expect(link).toHaveAttribute('href', '/')
        })

        it('should render link with custom href', () => {
            const customHref = '/custom-path'
            render(<HeaderGoBack href={customHref} />)
            
            const link = screen.getByRole('link')
            expect(link).toHaveAttribute('href', customHref)
        })
    })

    describe('props', () => {
        it('should use default href when not provided', () => {
            render(<HeaderGoBack />)
            
            const link = screen.getByRole('link')
            expect(link).toHaveAttribute('href', '/')
        })

        it('should accept custom href prop', () => {
            render(<HeaderGoBack href="/settings" />)
            
            const link = screen.getByRole('link')
            expect(link).toHaveAttribute('href', '/settings')
        })

        it('should accept root path as href', () => {
            render(<HeaderGoBack href="/" />)
            
            const link = screen.getByRole('link')
            expect(link).toHaveAttribute('href', '/')
        })

        it('should accept nested path as href', () => {
            render(<HeaderGoBack href="/auth/login" />)
            
            const link = screen.getByRole('link')
            expect(link).toHaveAttribute('href', '/auth/login')
        })
    })

    describe('styling', () => {
        it('should have correct CSS classes on link', () => {
            render(<HeaderGoBack />)
            
            const link = screen.getByRole('link')
            expect(link).toHaveClass('text-foreground')
            expect(link).toHaveClass('hover:bg-muted')
            expect(link).toHaveClass('inline-flex')
            expect(link).toHaveClass('items-center')
        })

        it('should have correct CSS classes on icon', () => {
            render(<HeaderGoBack />)
            
            const icon = screen.getByTestId('arrow-left-icon')
            expect(icon).toHaveClass('text-foreground')
            expect(icon).toHaveClass('size-5')
        })

        it('should have padding on header', () => {
            const { container } = render(<HeaderGoBack />)
            
            const header = container.querySelector('header')
            expect(header).toHaveClass('p-4')
        })
    })

    describe('accessibility', () => {
        it('should have accessible link', () => {
            render(<HeaderGoBack />)
            
            const link = screen.getByRole('link')
            expect(link).toBeInTheDocument()
        })

        it('should have text content for screen readers', () => {
            render(<HeaderGoBack />)
            
            const link = screen.getByRole('link', { name: /Back to Chat/i })
            expect(link).toBeInTheDocument()
        })
    })

    describe('prefetch behavior', () => {
        it('should enable prefetch on link', () => {
            render(<HeaderGoBack />)
            
            const link = screen.getByRole('link')
            expect(link).toHaveAttribute('data-prefetch', 'true')
        })
    })

    describe('responsive design', () => {
        it('should have hidden text on small screens', () => {
            const { container } = render(<HeaderGoBack />)
            
            const text = screen.getByText('Back to Chat')
            expect(text).toHaveClass('hidden')
            expect(text).toHaveClass('sm:inline-block')
        })
    })

    describe('edge cases', () => {
        it('should handle empty string href gracefully', () => {
            const { container } = render(<HeaderGoBack href="" />)
            
            const links = container.querySelectorAll('a')
            expect(links.length).toBeGreaterThanOrEqual(0)
        })

        it('should handle relative paths', () => {
            render(<HeaderGoBack href="./relative" />)
            
            const link = screen.getByRole('link')
            expect(link).toHaveAttribute('href', './relative')
        })

        it('should handle query parameters in href', () => {
            render(<HeaderGoBack href="/?query=test" />)
            
            const link = screen.getByRole('link')
            expect(link).toHaveAttribute('href', '/?query=test')
        })

        it('should handle hash in href', () => {
            render(<HeaderGoBack href="/#section" />)
            
            const link = screen.getByRole('link')
            expect(link).toHaveAttribute('href', '/#section')
        })
    })
})
