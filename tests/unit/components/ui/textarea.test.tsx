/**
 * Unit Tests: Textarea Component
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Textarea } from '@/components/ui/textarea'

describe('Textarea Component', () => {
    describe('Rendering', () => {
        it('should render a textarea element', () => {
            render(<Textarea />)
            const textarea = screen.getByRole('textbox')
            expect(textarea).toBeInTheDocument()
            expect(textarea.tagName).toBe('TEXTAREA')
        })

        it('should render with placeholder', () => {
            render(<Textarea placeholder="Enter your message" />)
            const textarea = screen.getByPlaceholderText('Enter your message')
            expect(textarea).toBeInTheDocument()
        })

        it('should render with value', () => {
            render(<Textarea value="test content" onChange={() => {}} />)
            const textarea = screen.getByRole('textbox')
            expect(textarea).toHaveValue('test content')
        })

        it('should render with default value', () => {
            render(<Textarea defaultValue="default content" />)
            const textarea = screen.getByRole('textbox')
            expect(textarea).toHaveValue('default content')
        })
    })

    describe('Interactions', () => {
        it('should handle onChange event', async () => {
            const user = userEvent.setup()
            const handleChange = jest.fn()

            render(<Textarea onChange={handleChange} />)
            const textarea = screen.getByRole('textbox')

            await user.type(textarea, 'test')

            expect(handleChange).toHaveBeenCalled()
        })

        it('should update value on typing', async () => {
            const user = userEvent.setup()

            render(<Textarea />)
            const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

            await user.type(textarea, 'Hello World')

            expect(textarea.value).toBe('Hello World')
        })

        it('should handle multiline text', async () => {
            const user = userEvent.setup()

            render(<Textarea />)
            const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

            await user.type(textarea, 'Line 1{Enter}Line 2')

            expect(textarea.value).toContain('\n')
        })

        it('should handle onFocus event', async () => {
            const user = userEvent.setup()
            const handleFocus = jest.fn()

            render(<Textarea onFocus={handleFocus} />)
            const textarea = screen.getByRole('textbox')

            await user.click(textarea)

            expect(handleFocus).toHaveBeenCalled()
        })

        it('should handle onBlur event', async () => {
            const user = userEvent.setup()
            const handleBlur = jest.fn()

            render(<Textarea onBlur={handleBlur} />)
            const textarea = screen.getByRole('textbox')

            await user.click(textarea)
            await user.tab()

            expect(handleBlur).toHaveBeenCalled()
        })
    })

    describe('States', () => {
        it('should be disabled when disabled prop is true', () => {
            render(<Textarea disabled />)
            const textarea = screen.getByRole('textbox')
            expect(textarea).toBeDisabled()
        })

        it('should not be disabled by default', () => {
            render(<Textarea />)
            const textarea = screen.getByRole('textbox')
            expect(textarea).not.toBeDisabled()
        })

        it('should be readonly when readOnly prop is true', () => {
            render(<Textarea readOnly />)
            const textarea = screen.getByRole('textbox')
            expect(textarea).toHaveAttribute('readonly')
        })

        it('should not accept input when disabled', async () => {
            const user = userEvent.setup()

            render(<Textarea disabled />)
            const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

            await user.type(textarea, 'test')

            expect(textarea.value).toBe('')
        })
    })

    describe('Attributes', () => {
        it('should support maxLength attribute', () => {
            render(<Textarea maxLength={100} />)
            const textarea = screen.getByRole('textbox')
            expect(textarea).toHaveAttribute('maxLength', '100')
        })

        it('should support required attribute', () => {
            render(<Textarea required />)
            const textarea = screen.getByRole('textbox')
            expect(textarea).toBeRequired()
        })

        it('should support rows attribute', () => {
            render(<Textarea rows={5} />)
            const textarea = screen.getByRole('textbox')
            expect(textarea).toHaveAttribute('rows', '5')
        })

        it('should support cols attribute', () => {
            render(<Textarea cols={50} />)
            const textarea = screen.getByRole('textbox')
            expect(textarea).toHaveAttribute('cols', '50')
        })

        it('should support name attribute', () => {
            render(<Textarea name="message" />)
            const textarea = screen.getByRole('textbox')
            expect(textarea).toHaveAttribute('name', 'message')
        })

        it('should support id attribute', () => {
            render(<Textarea id="test-textarea" />)
            const textarea = screen.getByRole('textbox')
            expect(textarea).toHaveAttribute('id', 'test-textarea')
        })
    })

    describe('Custom className', () => {
        it('should apply custom className', () => {
            render(<Textarea className="custom-textarea" />)
            const textarea = screen.getByRole('textbox')
            expect(textarea).toHaveClass('custom-textarea')
        })

        it('should merge custom className with default classes', () => {
            render(<Textarea className="my-textarea" />)
            const textarea = screen.getByRole('textbox')
            expect(textarea.className).toContain('my-textarea')
        })
    })

    describe('Accessibility', () => {
        it('should have correct role', () => {
            render(<Textarea />)
            const textarea = screen.getByRole('textbox')
            expect(textarea).toBeInTheDocument()
        })

        it('should support aria-label', () => {
            render(<Textarea aria-label="Message textarea" />)
            const textarea = screen.getByLabelText('Message textarea')
            expect(textarea).toBeInTheDocument()
        })

        it('should support aria-describedby', () => {
            render(<Textarea aria-describedby="help-text" />)
            const textarea = screen.getByRole('textbox')
            expect(textarea).toHaveAttribute('aria-describedby', 'help-text')
        })

        it('should support aria-invalid', () => {
            render(<Textarea aria-invalid={true} />)
            const textarea = screen.getByRole('textbox')
            expect(textarea).toHaveAttribute('aria-invalid', 'true')
        })
    })
})
