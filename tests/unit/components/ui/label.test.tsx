/**
 * Unit Tests: components/ui/label.tsx
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { Label } from '@/components/ui/label'

describe('Label Component', () => {
    describe('Rendering', () => {
        it('should render a label element', () => {
            render(<Label>Label Text</Label>)
            const label = screen.getByText('Label Text')
            expect(label).toBeInTheDocument()
            expect(label.tagName.toLowerCase()).toBe('label')
        })

        it('should render children correctly', () => {
            render(<Label>Username</Label>)
            expect(screen.getByText('Username')).toBeInTheDocument()
        })
    })

    describe('htmlFor association', () => {
        it('should associate with input via htmlFor', () => {
            render(
                <>
                    <Label htmlFor="username">Username</Label>
                    <input id="username" data-testid="input" />
                </>
            )

            expect(screen.getByText('Username')).toHaveAttribute('for', 'username')
        })

        it('should render without htmlFor', () => {
            render(<Label data-testid="label">Label</Label>)
            expect(screen.getByTestId('label')).not.toHaveAttribute('for')
        })
    })

    describe('Custom className', () => {
        it('should merge custom className', () => {
            render(<Label className="custom-class" data-testid="label">Label</Label>)
            expect(screen.getByTestId('label')).toHaveClass('custom-class')
        })

        it('should keep base styles with custom class', () => {
            render(<Label className="custom-class" data-testid="label">Label</Label>)
            const label = screen.getByTestId('label')
            expect(label).toHaveClass('text-sm')
        })
    })

    describe('Typography styles', () => {
        it('should have font-medium class', () => {
            render(<Label data-testid="label">Label</Label>)
            expect(screen.getByTestId('label')).toHaveClass('font-medium')
        })

        it('should have text-sm class', () => {
            render(<Label data-testid="label">Label</Label>)
            expect(screen.getByTestId('label')).toHaveClass('text-sm')
        })
    })

    describe('Disabled peer styling', () => {
        it('should have peer-disabled styles', () => {
            render(<Label data-testid="label">Label</Label>)
            const label = screen.getByTestId('label')
            expect(label).toHaveClass('peer-disabled:cursor-not-allowed')
            expect(label).toHaveClass('peer-disabled:opacity-50')
        })
    })

    describe('With form controls', () => {
        it('should work with checkbox', () => {
            render(
                <>
                    <input type="checkbox" id="terms" />
                    <Label htmlFor="terms">Accept terms</Label>
                </>
            )

            expect(screen.getByLabelText('Accept terms')).toBeInTheDocument()
        })

        it('should work with text input', () => {
            render(
                <>
                    <Label htmlFor="email">Email</Label>
                    <input type="email" id="email" />
                </>
            )

            expect(screen.getByLabelText('Email')).toBeInTheDocument()
        })

        it('should work with textarea', () => {
            render(
                <>
                    <Label htmlFor="message">Message</Label>
                    <textarea id="message" />
                </>
            )

            expect(screen.getByLabelText('Message')).toBeInTheDocument()
        })
    })

    describe('Complex content', () => {
        it('should render with icon', () => {
            render(
                <Label data-testid="label">
                    <span data-testid="icon">📧</span> Email
                </Label>
            )

            expect(screen.getByTestId('icon')).toBeInTheDocument()
            expect(screen.getByText('Email')).toBeInTheDocument()
        })

        it('should render with required indicator', () => {
            render(
                <Label data-testid="label">
                    Username <span className="text-red-500">*</span>
                </Label>
            )

            expect(screen.getByText('*')).toHaveClass('text-red-500')
        })
    })

    describe('Props pass-through', () => {
        it('should pass data attributes', () => {
            render(<Label data-testid="label" data-custom="value">Label</Label>)
            expect(screen.getByTestId('label')).toHaveAttribute('data-custom', 'value')
        })

        it('should pass aria attributes', () => {
            render(<Label aria-hidden="true" data-testid="label">Hidden Label</Label>)
            expect(screen.getByTestId('label')).toHaveAttribute('aria-hidden', 'true')
        })
    })
})
