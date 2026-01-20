/**
 * Unit Tests: components/ui/switch.tsx
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Switch } from '@/components/ui/switch'

describe('Switch Component', () => {
    describe('Rendering', () => {
        it('should render a switch', () => {
            render(<Switch data-testid="switch" />)
            expect(screen.getByTestId('switch')).toBeInTheDocument()
        })

        it('should have switch role', () => {
            render(<Switch />)
            expect(screen.getByRole('switch')).toBeInTheDocument()
        })

        it('should be unchecked by default', () => {
            render(<Switch />)
            expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
        })
    })

    describe('Checked state', () => {
        it('should be checked when checked prop is true', () => {
            render(<Switch checked={true} />)
            expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
        })

        it('should be unchecked when checked prop is false', () => {
            render(<Switch checked={false} />)
            expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
        })

        it('should render with defaultChecked', () => {
            render(<Switch defaultChecked />)
            expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
        })
    })

    describe('User interaction', () => {
        it('should toggle state when clicked', async () => {
            const handleChange = jest.fn()
            render(<Switch onCheckedChange={handleChange} />)

            await userEvent.click(screen.getByRole('switch'))

            expect(handleChange).toHaveBeenCalledWith(true)
        })

        it('should call onCheckedChange with correct values', async () => {
            const handleChange = jest.fn()
            const { rerender } = render(<Switch checked={false} onCheckedChange={handleChange} />)

            await userEvent.click(screen.getByRole('switch'))
            expect(handleChange).toHaveBeenCalledWith(true)

            rerender(<Switch checked={true} onCheckedChange={handleChange} />)
            await userEvent.click(screen.getByRole('switch'))
            expect(handleChange).toHaveBeenCalledWith(false)
        })
    })

    describe('Disabled state', () => {
        it('should be disabled when disabled prop is true', () => {
            render(<Switch disabled />)
            expect(screen.getByRole('switch')).toBeDisabled()
        })

        it('should not trigger onCheckedChange when disabled', async () => {
            const handleChange = jest.fn()
            render(<Switch disabled onCheckedChange={handleChange} />)

            await userEvent.click(screen.getByRole('switch'))

            expect(handleChange).not.toHaveBeenCalled()
        })
    })

    describe('Custom className', () => {
        it('should merge custom className', () => {
            render(<Switch className="custom-class" data-testid="switch" />)
            expect(screen.getByTestId('switch')).toHaveClass('custom-class')
        })
    })

    describe('Accessibility', () => {
        it('should support aria-label', () => {
            render(<Switch aria-label="Toggle feature" />)
            expect(screen.getByLabelText('Toggle feature')).toBeInTheDocument()
        })

        it('should be focusable', async () => {
            render(<Switch data-testid="switch" />)

            await userEvent.tab()

            expect(screen.getByRole('switch')).toHaveFocus()
        })

        it('should toggle with keyboard', async () => {
            const handleChange = jest.fn()
            render(<Switch onCheckedChange={handleChange} />)

            const switchEl = screen.getByRole('switch')
            switchEl.focus()
            await userEvent.keyboard(' ')

            expect(handleChange).toHaveBeenCalled()
        })
    })

    describe('Form integration', () => {
        it('should work with name attribute', () => {
            render(<Switch name="notifications" data-testid="switch" />)
            // Name should be on the internal input
            expect(screen.getByTestId('switch')).toBeInTheDocument()
        })
    })
})
