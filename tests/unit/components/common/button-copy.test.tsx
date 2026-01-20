/**
 * Unit Tests: components/common/button-copy.tsx
 */

import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ButtonCopy } from '@/components/common/button-copy'

// Mock the TextMorph component
jest.mock('@/components/motion-primitives/text-morph', () => ({
    TextMorph: ({ children }: { children: React.ReactNode }) => <span>{children}</span>
}))

describe('ButtonCopy Component', () => {
    const mockClipboard = {
        writeText: jest.fn().mockResolvedValue(undefined)
    }

    beforeEach(() => {
        Object.defineProperty(navigator, 'clipboard', {
            value: mockClipboard,
            writable: true
        })
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.useRealTimers()
    })

    describe('Rendering', () => {
        it('should render a button element', () => {
            render(<ButtonCopy code="test code" />)
            expect(screen.getByRole('button')).toBeInTheDocument()
        })

        it('should display "Copy" initially', () => {
            render(<ButtonCopy code="test code" />)
            expect(screen.getByText('Copy')).toBeInTheDocument()
        })

        it('should have correct button type', () => {
            render(<ButtonCopy code="test code" />)
            expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
        })
    })

    describe('Copy functionality', () => {
        it('should copy code to clipboard when clicked', async () => {
            const testCode = 'const hello = "world";'
            render(<ButtonCopy code={testCode} />)

            await act(async () => {
                fireEvent.click(screen.getByRole('button'))
            })

            expect(mockClipboard.writeText).toHaveBeenCalledWith(testCode)
        })

        it('should copy multi-line code', async () => {
            const multiLineCode = `function test() {
  return true;
}`
            render(<ButtonCopy code={multiLineCode} />)

            await act(async () => {
                fireEvent.click(screen.getByRole('button'))
            })

            expect(mockClipboard.writeText).toHaveBeenCalledWith(multiLineCode)
        })
    })

    describe('Label change', () => {
        it('should show "Copied" after clicking', async () => {
            render(<ButtonCopy code="test" />)

            await act(async () => {
                fireEvent.click(screen.getByRole('button'))
            })

            expect(screen.getByText('Copied')).toBeInTheDocument()
        })

        it('should revert to "Copy" after 1 second', async () => {
            render(<ButtonCopy code="test" />)

            await act(async () => {
                fireEvent.click(screen.getByRole('button'))
            })

            expect(screen.getByText('Copied')).toBeInTheDocument()

            act(() => {
                jest.advanceTimersByTime(1000)
            })

            expect(screen.getByText('Copy')).toBeInTheDocument()
        })

        it('should not revert before 1 second', async () => {
            render(<ButtonCopy code="test" />)

            await act(async () => {
                fireEvent.click(screen.getByRole('button'))
            })

            act(() => {
                jest.advanceTimersByTime(500)
            })

            expect(screen.getByText('Copied')).toBeInTheDocument()
        })
    })

    describe('Multiple clicks', () => {
        it('should handle multiple clicks', async () => {
            render(<ButtonCopy code="test" />)

            // First click
            await act(async () => {
                fireEvent.click(screen.getByRole('button'))
            })

            expect(screen.getByText('Copied')).toBeInTheDocument()

            // Second click
            await act(async () => {
                fireEvent.click(screen.getByRole('button'))
            })

            // Should still show "Copied" after second click
            expect(screen.getByText('Copied')).toBeInTheDocument()

            // Complete the timeout
            act(() => {
                jest.advanceTimersByTime(1000)
            })

            expect(screen.getByText('Copy')).toBeInTheDocument()
        })
    })

    describe('Styling', () => {
        it('should have base button styles', () => {
            render(<ButtonCopy code="test" />)
            const button = screen.getByRole('button')
            expect(button).toHaveClass('text-muted-foreground')
            expect(button).toHaveClass('rounded-md')
        })

        it('should have hover styles', () => {
            render(<ButtonCopy code="test" />)
            const button = screen.getByRole('button')
            expect(button).toHaveClass('hover:bg-muted')
        })
    })

    describe('Different code types', () => {
        it('should handle empty string', async () => {
            render(<ButtonCopy code="" />)

            await act(async () => {
                fireEvent.click(screen.getByRole('button'))
            })

            expect(mockClipboard.writeText).toHaveBeenCalledWith('')
        })

        it('should handle special characters', async () => {
            const specialCode = '<script>alert("xss")</script>'
            render(<ButtonCopy code={specialCode} />)

            await act(async () => {
                fireEvent.click(screen.getByRole('button'))
            })

            expect(mockClipboard.writeText).toHaveBeenCalledWith(specialCode)
        })

        it('should handle very long code', async () => {
            const longCode = 'a'.repeat(10000)
            render(<ButtonCopy code={longCode} />)

            await act(async () => {
                fireEvent.click(screen.getByRole('button'))
            })

            expect(mockClipboard.writeText).toHaveBeenCalledWith(longCode)
        })
    })
})
