/**
 * Unit Tests: components/ui/input.tsx
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '@/components/ui/input'

describe('Input Component', () => {
    describe('Rendering', () => {
        it('should render an input element', () => {
            render(<Input data-testid="input" />)
            expect(screen.getByTestId('input')).toBeInTheDocument()
        })

        it('should have correct type attribute', () => {
            render(<Input type="email" data-testid="input" />)
            expect(screen.getByTestId('input')).toHaveAttribute('type', 'email')
        })

        it('should render with placeholder', () => {
            render(<Input placeholder="Enter text" />)
            expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
        })

        it('should render with default value', () => {
            render(<Input defaultValue="Hello" data-testid="input" />)
            expect(screen.getByTestId('input')).toHaveValue('Hello')
        })
    })

    describe('Controlled input', () => {
        it('should accept value prop', () => {
            const TestComponent = () => {
                const [value, setValue] = React.useState('initial')
                return (
                    <Input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        data-testid="input"
                    />
                )
            }
            render(<TestComponent />)
            expect(screen.getByTestId('input')).toHaveValue('initial')
        })

        it('should call onChange when typing', async () => {
            const handleChange = jest.fn()
            render(<Input onChange={handleChange} data-testid="input" />)

            await userEvent.type(screen.getByTestId('input'), 'test')

            expect(handleChange).toHaveBeenCalledTimes(4)
        })
    })

    describe('Disabled state', () => {
        it('should be disabled when disabled prop is true', () => {
            render(<Input disabled data-testid="input" />)
            expect(screen.getByTestId('input')).toBeDisabled()
        })

        it('should not allow typing when disabled', async () => {
            const handleChange = jest.fn()
            render(<Input disabled onChange={handleChange} data-testid="input" />)

            await userEvent.type(screen.getByTestId('input'), 'test')

            expect(handleChange).not.toHaveBeenCalled()
        })
    })

    describe('Input types', () => {
        it('should render text input by default', () => {
            render(<Input type="text" data-testid="input" />)
            expect(screen.getByTestId('input')).toHaveAttribute('type', 'text')
        })

        it('should render password input', () => {
            render(<Input type="password" data-testid="input" />)
            expect(screen.getByTestId('input')).toHaveAttribute('type', 'password')
        })

        it('should render number input', () => {
            render(<Input type="number" data-testid="input" />)
            expect(screen.getByTestId('input')).toHaveAttribute('type', 'number')
        })

        it('should render email input', () => {
            render(<Input type="email" data-testid="input" />)
            expect(screen.getByTestId('input')).toHaveAttribute('type', 'email')
        })
    })

    describe('Custom className', () => {
        it('should merge custom className', () => {
            render(<Input className="custom-class" data-testid="input" />)
            expect(screen.getByTestId('input')).toHaveClass('custom-class')
        })
    })

    describe('Focus and blur', () => {
        it('should call onFocus when focused', () => {
            const handleFocus = jest.fn()
            render(<Input onFocus={handleFocus} data-testid="input" />)

            fireEvent.focus(screen.getByTestId('input'))

            expect(handleFocus).toHaveBeenCalledTimes(1)
        })

        it('should call onBlur when blurred', () => {
            const handleBlur = jest.fn()
            render(<Input onBlur={handleBlur} data-testid="input" />)

            fireEvent.focus(screen.getByTestId('input'))
            fireEvent.blur(screen.getByTestId('input'))

            expect(handleBlur).toHaveBeenCalledTimes(1)
        })

        it('should be focusable via tab', async () => {
            render(<Input data-testid="input" />)

            await userEvent.tab()

            expect(screen.getByTestId('input')).toHaveFocus()
        })
    })

    describe('Accessibility', () => {
        it('should support aria-label', () => {
            render(<Input aria-label="Search" data-testid="input" />)
            expect(screen.getByLabelText('Search')).toBeInTheDocument()
        })

        it('should support aria-describedby', () => {
            render(
                <>
                    <Input aria-describedby="help-text" data-testid="input" />
                    <span id="help-text">Help text</span>
                </>
            )
            expect(screen.getByTestId('input')).toHaveAttribute('aria-describedby', 'help-text')
        })

        it('should support required attribute', () => {
            render(<Input required data-testid="input" />)
            expect(screen.getByTestId('input')).toBeRequired()
        })
    })

    describe('Ref forwarding', () => {
        it('should forward ref to input element', () => {
            const ref = React.createRef<HTMLInputElement>()
            render(<Input ref={ref} data-testid="input" />)

            expect(ref.current).toBeInstanceOf(HTMLInputElement)
        })

        it('should allow focus via ref', () => {
            const ref = React.createRef<HTMLInputElement>()
            render(<Input ref={ref} data-testid="input" />)

            ref.current?.focus()

            expect(screen.getByTestId('input')).toHaveFocus()
        })
    })
})
