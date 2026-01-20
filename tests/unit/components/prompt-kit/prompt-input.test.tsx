/**
 * Unit Tests: components/prompt-kit/prompt-input.tsx
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
    PromptInput,
    PromptInputTextarea,
    PromptInputActions,
    PromptInputAction
} from '@/components/prompt-kit/prompt-input'
import { TooltipProvider } from '@/components/ui/tooltip'

// Wrapper with TooltipProvider
const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <TooltipProvider>{children}</TooltipProvider>
)

describe('PromptInput Components', () => {
    describe('PromptInput', () => {
        it('should render container with children', () => {
            render(
                <PromptInput>
                    <span>Content</span>
                </PromptInput>
            )
            expect(screen.getByText('Content')).toBeInTheDocument()
        })

        it('should apply base styles', () => {
            render(
                <PromptInput data-testid="prompt-input">
                    <span>Content</span>
                </PromptInput>
            )
            // The container should have the specified styles
            const container = screen.getByText('Content').parentElement
            expect(container).toHaveClass('rounded-3xl')
        })

        it('should merge custom className', () => {
            render(
                <PromptInput className="custom-class">
                    <span>Content</span>
                </PromptInput>
            )
            const container = screen.getByText('Content').parentElement
            expect(container).toHaveClass('custom-class')
        })

        it('should focus textarea when container is clicked', () => {
            render(
                <PromptInput>
                    <PromptInputTextarea data-testid="textarea" />
                </PromptInput>
            )

            const container = screen.getByTestId('textarea').closest('div')
            fireEvent.click(container!)

            expect(screen.getByTestId('textarea')).toHaveFocus()
        })
    })

    describe('PromptInputTextarea', () => {
        it('should render a textarea', () => {
            render(
                <PromptInput>
                    <PromptInputTextarea data-testid="textarea" />
                </PromptInput>
            )
            expect(screen.getByTestId('textarea')).toBeInTheDocument()
            expect(screen.getByTestId('textarea').tagName.toLowerCase()).toBe('textarea')
        })

        it('should render textarea element', () => {
            render(
                <PromptInput>
                    <PromptInputTextarea data-testid="textarea" />
                </PromptInput>
            )
            // Textarea should be present and focusable
            expect(screen.getByTestId('textarea')).toBeInTheDocument()
        })

        it('should be controlled by PromptInput value', () => {
            render(
                <PromptInput value="test value">
                    <PromptInputTextarea data-testid="textarea" />
                </PromptInput>
            )
            expect(screen.getByTestId('textarea')).toHaveValue('test value')
        })

        it('should call onValueChange when typing', async () => {
            const handleChange = jest.fn()
            render(
                <PromptInput onValueChange={handleChange}>
                    <PromptInputTextarea data-testid="textarea" />
                </PromptInput>
            )

            await userEvent.type(screen.getByTestId('textarea'), 'hello')

            expect(handleChange).toHaveBeenCalled()
        })

        it('should call onSubmit when Enter is pressed', () => {
            const handleSubmit = jest.fn()
            render(
                <PromptInput onSubmit={handleSubmit}>
                    <PromptInputTextarea data-testid="textarea" />
                </PromptInput>
            )

            fireEvent.keyDown(screen.getByTestId('textarea'), { key: 'Enter' })

            expect(handleSubmit).toHaveBeenCalled()
        })

        it('should not call onSubmit when Shift+Enter is pressed', () => {
            const handleSubmit = jest.fn()
            render(
                <PromptInput onSubmit={handleSubmit}>
                    <PromptInputTextarea data-testid="textarea" />
                </PromptInput>
            )

            fireEvent.keyDown(screen.getByTestId('textarea'), { key: 'Enter', shiftKey: true })

            expect(handleSubmit).not.toHaveBeenCalled()
        })

        it('should prevent default on Enter', () => {
            render(
                <PromptInput onSubmit={jest.fn()}>
                    <PromptInputTextarea data-testid="textarea" />
                </PromptInput>
            )

            const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
            const preventDefaultSpy = jest.spyOn(event, 'preventDefault')

            screen.getByTestId('textarea').dispatchEvent(event)

            expect(preventDefaultSpy).toHaveBeenCalled()
        })

        it('should call custom onKeyDown handler', () => {
            const handleKeyDown = jest.fn()
            render(
                <PromptInput>
                    <PromptInputTextarea data-testid="textarea" onKeyDown={handleKeyDown} />
                </PromptInput>
            )

            fireEvent.keyDown(screen.getByTestId('textarea'), { key: 'a' })

            expect(handleKeyDown).toHaveBeenCalled()
        })

        it('should apply maxHeight style', () => {
            render(
                <PromptInput maxHeight={300}>
                    <PromptInputTextarea data-testid="textarea" />
                </PromptInput>
            )

            expect(screen.getByTestId('textarea')).toHaveStyle({ maxHeight: '300px' })
        })

        it('should handle string maxHeight', () => {
            render(
                <PromptInput maxHeight="50vh">
                    <PromptInputTextarea data-testid="textarea" />
                </PromptInput>
            )

            expect(screen.getByTestId('textarea')).toHaveStyle({ maxHeight: '50vh' })
        })

        it('should merge custom className', () => {
            render(
                <PromptInput>
                    <PromptInputTextarea className="custom-class" data-testid="textarea" />
                </PromptInput>
            )

            expect(screen.getByTestId('textarea')).toHaveClass('custom-class')
        })
    })

    describe('PromptInputActions', () => {
        it('should render children', () => {
            render(
                <PromptInput>
                    <PromptInputActions>
                        <button>Action 1</button>
                        <button>Action 2</button>
                    </PromptInputActions>
                </PromptInput>
            )

            expect(screen.getByText('Action 1')).toBeInTheDocument()
            expect(screen.getByText('Action 2')).toBeInTheDocument()
        })

        it('should apply flex styles', () => {
            render(
                <PromptInput>
                    <PromptInputActions data-testid="actions">
                        <button>Action</button>
                    </PromptInputActions>
                </PromptInput>
            )

            expect(screen.getByTestId('actions')).toHaveClass('flex')
            expect(screen.getByTestId('actions')).toHaveClass('gap-2')
        })

        it('should merge custom className', () => {
            render(
                <PromptInput>
                    <PromptInputActions className="custom-class" data-testid="actions">
                        <button>Action</button>
                    </PromptInputActions>
                </PromptInput>
            )

            expect(screen.getByTestId('actions')).toHaveClass('custom-class')
        })
    })

    describe('PromptInputAction', () => {
        it('should render with tooltip', async () => {
            render(
                <Wrapper>
                    <PromptInput>
                        <PromptInputAction tooltip="Send message">
                            <button>Send</button>
                        </PromptInputAction>
                    </PromptInput>
                </Wrapper>
            )

            expect(screen.getByText('Send')).toBeInTheDocument()
        })

        it('should stop propagation on click', async () => {
            const containerClick = jest.fn()

            render(
                <Wrapper>
                    <PromptInput>
                        <div onClick={containerClick}>
                            <PromptInputAction tooltip="Action">
                                <button data-testid="action-button">Click</button>
                            </PromptInputAction>
                        </div>
                    </PromptInput>
                </Wrapper>
            )

            fireEvent.click(screen.getByTestId('action-button'))

            // The container click should not be triggered due to stopPropagation
            expect(containerClick).not.toHaveBeenCalled()
        })
    })

    describe('Full composition', () => {
        it('should render complete prompt input with textarea and actions', () => {
            render(
                <Wrapper>
                    <PromptInput value="Test message">
                        <PromptInputTextarea placeholder="Type a message..." data-testid="textarea" />
                        <PromptInputActions>
                            <PromptInputAction tooltip="Send">
                                <button data-testid="send-button">Send</button>
                            </PromptInputAction>
                        </PromptInputActions>
                    </PromptInput>
                </Wrapper>
            )

            expect(screen.getByTestId('textarea')).toHaveValue('Test message')
            expect(screen.getByTestId('send-button')).toBeInTheDocument()
        })
    })
})
