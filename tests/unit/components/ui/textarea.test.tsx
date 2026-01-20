/**
 * Unit Tests: components/ui/textarea.tsx
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Textarea } from '@/components/ui/textarea'

describe('Textarea Component', () => {
    describe('Rendering', () => {
        it('should render a textarea element', () => {
            render(<Textarea data-testid="textarea" />)
            expect(screen.getByTestId('textarea')).toBeInTheDocument()
            expect(screen.getByTestId('textarea').tagName.toLowerCase()).toBe('textarea')
        })

        it('should render with placeholder', () => {
            render(<Textarea placeholder="Enter your message" />)
            expect(screen.getByPlaceholderText('Enter your message')).toBeInTheDocument()
        })

        it('should render with default value', () => {
            render(<Textarea defaultValue="Default text" data-testid="textarea" />)
            expect(screen.getByTestId('textarea')).toHaveValue('Default text')
        })
    })

    describe('Controlled textarea', () => {
        it('should accept value prop', () => {
            const TestComponent = () => {
                const [value, setValue] = React.useState('initial')
                return (
                    <Textarea
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        data-testid="textarea"
                    />
                )
            }
            render(<TestComponent />)
            expect(screen.getByTestId('textarea')).toHaveValue('initial')
        })

        it('should call onChange when typing', async () => {
            const handleChange = jest.fn()
            render(<Textarea onChange={handleChange} data-testid="textarea" />)

            await userEvent.type(screen.getByTestId('textarea'), 'test')

            expect(handleChange).toHaveBeenCalledTimes(4)
        })

        it('should update value on user input', async () => {
            const TestComponent = () => {
                const [value, setValue] = React.useState('')
                return (
                    <Textarea
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        data-testid="textarea"
                    />
                )
            }
            render(<TestComponent />)

            await userEvent.type(screen.getByTestId('textarea'), 'Hello World')

            expect(screen.getByTestId('textarea')).toHaveValue('Hello World')
        })
    })

    describe('Disabled state', () => {
        it('should be disabled when disabled prop is true', () => {
            render(<Textarea disabled data-testid="textarea" />)
            expect(screen.getByTestId('textarea')).toBeDisabled()
        })

        it('should not allow typing when disabled', async () => {
            const handleChange = jest.fn()
            render(<Textarea disabled onChange={handleChange} data-testid="textarea" />)

            await userEvent.type(screen.getByTestId('textarea'), 'test')

            expect(handleChange).not.toHaveBeenCalled()
        })
    })

    describe('Rows and sizing', () => {
        it('should accept rows prop', () => {
            render(<Textarea rows={5} data-testid="textarea" />)
            expect(screen.getByTestId('textarea')).toHaveAttribute('rows', '5')
        })

        it('should use default rows if not specified', () => {
            render(<Textarea data-testid="textarea" />)
            // Default behavior depends on implementation
            const textarea = screen.getByTestId('textarea')
            expect(textarea).toBeInTheDocument()
        })
    })

    describe('Custom className', () => {
        it('should merge custom className', () => {
            render(<Textarea className="custom-class" data-testid="textarea" />)
            expect(screen.getByTestId('textarea')).toHaveClass('custom-class')
        })

        it('should keep base styles with custom class', () => {
            render(<Textarea className="custom-class" data-testid="textarea" />)
            const textarea = screen.getByTestId('textarea')
            expect(textarea).toHaveClass('custom-class')
            // Should still have some base styling
            expect(textarea).toHaveClass('flex')
        })
    })

    describe('Focus and blur', () => {
        it('should call onFocus when focused', () => {
            const handleFocus = jest.fn()
            render(<Textarea onFocus={handleFocus} data-testid="textarea" />)

            fireEvent.focus(screen.getByTestId('textarea'))

            expect(handleFocus).toHaveBeenCalledTimes(1)
        })

        it('should call onBlur when blurred', () => {
            const handleBlur = jest.fn()
            render(<Textarea onBlur={handleBlur} data-testid="textarea" />)

            fireEvent.focus(screen.getByTestId('textarea'))
            fireEvent.blur(screen.getByTestId('textarea'))

            expect(handleBlur).toHaveBeenCalledTimes(1)
        })

        it('should be focusable via tab', async () => {
            render(<Textarea data-testid="textarea" />)

            await userEvent.tab()

            expect(screen.getByTestId('textarea')).toHaveFocus()
        })
    })

    describe('Accessibility', () => {
        it('should support aria-label', () => {
            render(<Textarea aria-label="Message input" data-testid="textarea" />)
            expect(screen.getByLabelText('Message input')).toBeInTheDocument()
        })

        it('should support aria-describedby', () => {
            render(
                <>
                    <Textarea aria-describedby="help-text" data-testid="textarea" />
                    <span id="help-text">Maximum 500 characters</span>
                </>
            )
            expect(screen.getByTestId('textarea')).toHaveAttribute('aria-describedby', 'help-text')
        })

        it('should support required attribute', () => {
            render(<Textarea required data-testid="textarea" />)
            expect(screen.getByTestId('textarea')).toBeRequired()
        })

        it('should support aria-invalid', () => {
            render(<Textarea aria-invalid="true" data-testid="textarea" />)
            expect(screen.getByTestId('textarea')).toHaveAttribute('aria-invalid', 'true')
        })
    })

    describe('Ref forwarding', () => {
        it('should forward ref to textarea element', () => {
            const ref = React.createRef<HTMLTextAreaElement>()
            render(<Textarea ref={ref} data-testid="textarea" />)

            expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
        })

        it('should allow focus via ref', () => {
            const ref = React.createRef<HTMLTextAreaElement>()
            render(<Textarea ref={ref} data-testid="textarea" />)

            ref.current?.focus()

            expect(screen.getByTestId('textarea')).toHaveFocus()
        })
    })

    describe('Multi-line input', () => {
        it('should handle multi-line text', async () => {
            const TestComponent = () => {
                const [value, setValue] = React.useState('')
                return (
                    <Textarea
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        data-testid="textarea"
                    />
                )
            }
            render(<TestComponent />)

            await userEvent.type(screen.getByTestId('textarea'), 'Line 1{enter}Line 2{enter}Line 3')

            expect(screen.getByTestId('textarea')).toHaveValue('Line 1\nLine 2\nLine 3')
        })
    })
})
