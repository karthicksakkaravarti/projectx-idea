/**
 * Unit Tests: Label Component
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { Label } from '@/components/ui/label'

describe('Label Component', () => {
    describe('Rendering', () => {
        it('should render a label element', () => {
            render(<Label>Test Label</Label>)
            const label = screen.getByText('Test Label')
            expect(label).toBeInTheDocument()
            expect(label.tagName).toBe('LABEL')
        })

        it('should render children correctly', () => {
            render(<Label>Username</Label>)
            expect(screen.getByText('Username')).toBeInTheDocument()
        })

        it('should render with htmlFor attribute', () => {
            render(<Label htmlFor="username">Username</Label>)
            const label = screen.getByText('Username')
            expect(label).toHaveAttribute('for', 'username')
        })

        it('should render with multiple children', () => {
            render(
                <Label>
                    <span>Email</span>
                    <span className="required">*</span>
                </Label>
            )
            expect(screen.getByText('Email')).toBeInTheDocument()
            expect(screen.getByText('*')).toBeInTheDocument()
        })
    })

    describe('Custom className', () => {
        it('should apply custom className', () => {
            render(<Label className="custom-label">Label Text</Label>)
            const label = screen.getByText('Label Text')
            expect(label).toHaveClass('custom-label')
        })

        it('should merge custom className with default classes', () => {
            render(<Label className="my-label">Text</Label>)
            const label = screen.getByText('Text')
            expect(label.className).toContain('my-label')
        })
    })

    describe('Accessibility', () => {
        it('should associate with input using htmlFor', () => {
            render(
                <div>
                    <Label htmlFor="test-input">Test Label</Label>
                    <input id="test-input" />
                </div>
            )
            const label = screen.getByText('Test Label')
            const input = screen.getByRole('textbox')

            expect(label).toHaveAttribute('for', 'test-input')
            expect(input).toHaveAttribute('id', 'test-input')
        })

    })

    describe('Styling variants', () => {
        it('should render without errors when no className is provided', () => {
            render(<Label>No Class</Label>)
            expect(screen.getByText('No Class')).toBeInTheDocument()
        })

        it('should handle empty children', () => {
            render(<Label></Label>)
            const label = document.querySelector('label')
            expect(label).toBeInTheDocument()
        })
    })
})
