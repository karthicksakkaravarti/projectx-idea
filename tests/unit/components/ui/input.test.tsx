/**
 * Unit Tests: Input Component
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '@/components/ui/input'

describe('Input Component', () => {
    describe('Rendering', () => {
        it('should render an input element', () => {
            render(<Input />)
            const input = screen.getByRole('textbox')
            expect(input).toBeInTheDocument()
        })

        it('should render with placeholder', () => {
            render(<Input placeholder="Enter text" />)
            const input = screen.getByPlaceholderText('Enter text')
            expect(input).toBeInTheDocument()
        })

        it('should render with value', () => {
            render(<Input value="test value" onChange={() => {}} />)
            const input = screen.getByRole('textbox')
            expect(input).toHaveValue('test value')
        })

        it('should render with default value', () => {
            render(<Input defaultValue="default text" />)
            const input = screen.getByRole('textbox')
            expect(input).toHaveValue('default text')
        })
    })

    describe('Types', () => {
        it('should render as text input by default', () => {
            render(<Input />)
            const input = screen.getByRole('textbox')
            expect(input).toBeInTheDocument()
        })

        it('should render as email input', () => {
            render(<Input type="email" />)
            const input = document.querySelector('input[type="email"]')
            expect(input).toBeInTheDocument()
        })

        it('should render as password input', () => {
            render(<Input type="password" />)
            const input = document.querySelector('input[type="password"]')
            expect(input).toBeInTheDocument()
        })

        it('should render as number input', () => {
            render(<Input type="number" />)
            const input = document.querySelector('input[type="number"]')
            expect(input).toBeInTheDocument()
        })
    })

    describe('Interactions', () => {
        it('should handle onChange event', async () => {
            const user = userEvent.setup()
            const handleChange = jest.fn()

            render(<Input onChange={handleChange} />)
            const input = screen.getByRole('textbox')

            await user.type(input, 'test')

            expect(handleChange).toHaveBeenCalled()
        })

        it('should update value on typing', async () => {
            const user = userEvent.setup()

            render(<Input />)
            const input = screen.getByRole('textbox') as HTMLInputElement

            await user.type(input, 'Hello')

            expect(input.value).toBe('Hello')
        })

        it('should handle onFocus event', async () => {
            const user = userEvent.setup()
            const handleFocus = jest.fn()

            render(<Input onFocus={handleFocus} />)
            const input = screen.getByRole('textbox')

            await user.click(input)

            expect(handleFocus).toHaveBeenCalled()
        })

        it('should handle onBlur event', async () => {
            const user = userEvent.setup()
            const handleBlur = jest.fn()

            render(<Input onBlur={handleBlur} />)
            const input = screen.getByRole('textbox')

            await user.click(input)
            await user.tab()

            expect(handleBlur).toHaveBeenCalled()
        })
    })

    describe('States', () => {
        it('should be disabled when disabled prop is true', () => {
            render(<Input disabled />)
            const input = screen.getByRole('textbox')
            expect(input).toBeDisabled()
        })

        it('should not be disabled by default', () => {
            render(<Input />)
            const input = screen.getByRole('textbox')
            expect(input).not.toBeDisabled()
        })

        it('should be readonly when readOnly prop is true', () => {
            render(<Input readOnly />)
            const input = screen.getByRole('textbox')
            expect(input).toHaveAttribute('readonly')
        })

        it('should not accept input when disabled', async () => {
            const user = userEvent.setup()

            render(<Input disabled />)
            const input = screen.getByRole('textbox') as HTMLInputElement

            await user.type(input, 'test')

            expect(input.value).toBe('')
        })
    })

    describe('Attributes', () => {
        it('should support maxLength attribute', () => {
            render(<Input maxLength={10} />)
            const input = screen.getByRole('textbox')
            expect(input).toHaveAttribute('maxLength', '10')
        })

        it('should support required attribute', () => {
            render(<Input required />)
            const input = screen.getByRole('textbox')
            expect(input).toBeRequired()
        })

        it('should support autoFocus attribute', () => {
            render(<Input autoFocus />)
            const input = screen.getByRole('textbox')
            expect(input).toHaveFocus()
        })

        it('should support autoComplete attribute', () => {
            render(<Input autoComplete="email" />)
            const input = screen.getByRole('textbox')
            expect(input).toHaveAttribute('autoComplete', 'email')
        })

        it('should support name attribute', () => {
            render(<Input name="username" />)
            const input = screen.getByRole('textbox')
            expect(input).toHaveAttribute('name', 'username')
        })

        it('should support id attribute', () => {
            render(<Input id="test-input" />)
            const input = screen.getByRole('textbox')
            expect(input).toHaveAttribute('id', 'test-input')
        })
    })

    describe('Custom className', () => {
        it('should apply custom className', () => {
            render(<Input className="custom-class" />)
            const input = screen.getByRole('textbox')
            expect(input).toHaveClass('custom-class')
        })

        it('should merge custom className with default classes', () => {
            render(<Input className="my-input" />)
            const input = screen.getByRole('textbox')
            expect(input.className).toContain('my-input')
        })
    })

    describe('Accessibility', () => {
        it('should have correct role', () => {
            render(<Input />)
            const input = screen.getByRole('textbox')
            expect(input).toBeInTheDocument()
        })

        it('should support aria-label', () => {
            render(<Input aria-label="Username input" />)
            const input = screen.getByLabelText('Username input')
            expect(input).toBeInTheDocument()
        })

        it('should support aria-describedby', () => {
            render(<Input aria-describedby="help-text" />)
            const input = screen.getByRole('textbox')
            expect(input).toHaveAttribute('aria-describedby', 'help-text')
        })

        it('should support aria-invalid', () => {
            render(<Input aria-invalid={true} />)
            const input = screen.getByRole('textbox')
            expect(input).toHaveAttribute('aria-invalid', 'true')
        })
    })
})
