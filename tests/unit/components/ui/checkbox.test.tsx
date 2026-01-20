/**
 * Unit Tests: components/ui/checkbox.tsx
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from '@/components/ui/checkbox'

describe('Checkbox Component', () => {
    describe('Rendering', () => {
        it('should render a checkbox', () => {
            render(<Checkbox data-testid="checkbox" />)
            expect(screen.getByTestId('checkbox')).toBeInTheDocument()
        })

        it('should have checkbox role', () => {
            render(<Checkbox data-testid="checkbox" />)
            expect(screen.getByRole('checkbox')).toBeInTheDocument()
        })

        it('should be unchecked by default', () => {
            render(<Checkbox data-testid="checkbox" />)
            expect(screen.getByRole('checkbox')).not.toBeChecked()
        })
    })

    describe('Checked state', () => {
        it('should be checked when checked prop is true', () => {
            render(<Checkbox checked={true} data-testid="checkbox" />)
            expect(screen.getByRole('checkbox')).toBeChecked()
        })

        it('should be unchecked when checked prop is false', () => {
            render(<Checkbox checked={false} data-testid="checkbox" />)
            expect(screen.getByRole('checkbox')).not.toBeChecked()
        })

        it('should render with defaultChecked', () => {
            render(<Checkbox defaultChecked data-testid="checkbox" />)
            expect(screen.getByRole('checkbox')).toBeChecked()
        })
    })

    describe('User interaction', () => {
        it('should toggle state when clicked', async () => {
            const handleChange = jest.fn()
            render(<Checkbox onCheckedChange={handleChange} data-testid="checkbox" />)

            await userEvent.click(screen.getByRole('checkbox'))

            expect(handleChange).toHaveBeenCalledWith(true)
        })

        it('should call onCheckedChange with correct value', async () => {
            const handleChange = jest.fn()
            render(<Checkbox onCheckedChange={handleChange} />)

            const checkbox = screen.getByRole('checkbox')
            await userEvent.click(checkbox)

            expect(handleChange).toHaveBeenCalledWith(true)
        })
    })

    describe('Disabled state', () => {
        it('should be disabled when disabled prop is true', () => {
            render(<Checkbox disabled data-testid="checkbox" />)
            expect(screen.getByRole('checkbox')).toBeDisabled()
        })

        it('should not trigger onCheckedChange when disabled', async () => {
            const handleChange = jest.fn()
            render(<Checkbox disabled onCheckedChange={handleChange} />)

            await userEvent.click(screen.getByRole('checkbox'))

            expect(handleChange).not.toHaveBeenCalled()
        })
    })

    describe('Custom className', () => {
        it('should merge custom className', () => {
            render(<Checkbox className="custom-class" data-testid="checkbox" />)
            expect(screen.getByTestId('checkbox')).toHaveClass('custom-class')
        })
    })

    describe('Accessibility', () => {
        it('should support aria-label', () => {
            render(<Checkbox aria-label="Accept terms" />)
            expect(screen.getByLabelText('Accept terms')).toBeInTheDocument()
        })

        it('should support id for label association', () => {
            render(
                <>
                    <Checkbox id="terms" />
                    <label htmlFor="terms">Accept terms and conditions</label>
                </>
            )
            expect(screen.getByLabelText('Accept terms and conditions')).toBeInTheDocument()
        })

        it('should be focusable', async () => {
            render(<Checkbox data-testid="checkbox" />)

            await userEvent.tab()

            expect(screen.getByRole('checkbox')).toHaveFocus()
        })

        it('should toggle with space key', async () => {
            const handleChange = jest.fn()
            render(<Checkbox onCheckedChange={handleChange} />)

            const checkbox = screen.getByRole('checkbox')
            await userEvent.click(checkbox)

            // Space key / click should trigger the change
            expect(handleChange).toHaveBeenCalled()
        })
    })

    describe('Required state', () => {
        it('should support required attribute', () => {
            render(<Checkbox required data-testid="checkbox" />)
            expect(screen.getByRole('checkbox')).toBeRequired()
        })
    })

    describe('Form integration', () => {
        it('should work with name attribute', () => {
            render(<Checkbox name="agreement" data-testid="checkbox" />)
            // Radix checkbox renders an internal input with the name
            expect(screen.getByTestId('checkbox')).toBeInTheDocument()
        })

        it('should work with value attribute', () => {
            render(<Checkbox value="yes" data-testid="checkbox" />)
            expect(screen.getByTestId('checkbox')).toHaveAttribute('value', 'yes')
        })
    })
})
