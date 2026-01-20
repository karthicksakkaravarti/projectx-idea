/**
 * Unit Tests: app/hooks/use-click-outside.tsx
 */

import React, { useRef } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import useClickOutside from '@/app/hooks/use-click-outside'

// Test component that uses the hook
function TestComponent({ onClickOutside }: { onClickOutside: jest.Mock }) {
    const ref = useRef<HTMLDivElement>(null)
    useClickOutside(ref, onClickOutside)

    return (
        <div>
            <div ref={ref} data-testid="inside-element">
                Inside Element
                <button data-testid="inside-button">Click me</button>
            </div>
            <div data-testid="outside-element">Outside Element</div>
        </div>
    )
}

describe('useClickOutside hook', () => {
    const mockHandler = jest.fn()

    beforeEach(() => {
        mockHandler.mockClear()
    })

    describe('Outside clicks', () => {
        it('should call handler when clicking outside the element', () => {
            render(<TestComponent onClickOutside={mockHandler} />)

            fireEvent.mouseDown(screen.getByTestId('outside-element'))

            expect(mockHandler).toHaveBeenCalledTimes(1)
        })

        it('should call handler when clicking on document body', () => {
            render(<TestComponent onClickOutside={mockHandler} />)

            fireEvent.mouseDown(document.body)

            expect(mockHandler).toHaveBeenCalledTimes(1)
        })

        it('should pass the event to the handler', () => {
            render(<TestComponent onClickOutside={mockHandler} />)

            fireEvent.mouseDown(screen.getByTestId('outside-element'))

            expect(mockHandler).toHaveBeenCalledWith(expect.any(Object))
            expect(mockHandler.mock.calls[0][0].type).toBe('mousedown')
        })
    })

    describe('Inside clicks', () => {
        it('should not call handler when clicking inside the element', () => {
            render(<TestComponent onClickOutside={mockHandler} />)

            fireEvent.mouseDown(screen.getByTestId('inside-element'))

            expect(mockHandler).not.toHaveBeenCalled()
        })

        it('should not call handler when clicking on child elements', () => {
            render(<TestComponent onClickOutside={mockHandler} />)

            fireEvent.mouseDown(screen.getByTestId('inside-button'))

            expect(mockHandler).not.toHaveBeenCalled()
        })
    })

    describe('Touch events', () => {
        it('should call handler on touchstart outside the element', () => {
            render(<TestComponent onClickOutside={mockHandler} />)

            fireEvent.touchStart(screen.getByTestId('outside-element'))

            expect(mockHandler).toHaveBeenCalledTimes(1)
        })

        it('should not call handler on touchstart inside the element', () => {
            render(<TestComponent onClickOutside={mockHandler} />)

            fireEvent.touchStart(screen.getByTestId('inside-element'))

            expect(mockHandler).not.toHaveBeenCalled()
        })
    })

    describe('Multiple clicks', () => {
        it('should call handler for each outside click', () => {
            render(<TestComponent onClickOutside={mockHandler} />)

            fireEvent.mouseDown(screen.getByTestId('outside-element'))
            fireEvent.mouseDown(screen.getByTestId('outside-element'))
            fireEvent.mouseDown(screen.getByTestId('outside-element'))

            expect(mockHandler).toHaveBeenCalledTimes(3)
        })
    })

    describe('Cleanup', () => {
        it('should remove event listeners on unmount', () => {
            const addEventListenerSpy = jest.spyOn(document, 'addEventListener')
            const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener')

            const { unmount } = render(<TestComponent onClickOutside={mockHandler} />)

            expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function))
            expect(addEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function))

            unmount()

            expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function))
            expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function))

            addEventListenerSpy.mockRestore()
            removeEventListenerSpy.mockRestore()
        })
    })

    describe('Null ref handling', () => {
        function TestComponentWithNullRef({ onClickOutside }: { onClickOutside: jest.Mock }) {
            const ref = useRef<HTMLDivElement>(null)
            useClickOutside(ref, onClickOutside)
            // Don't attach ref to any element
            return <div data-testid="test-element">Test</div>
        }

        it('should not call handler when ref is not attached', () => {
            render(<TestComponentWithNullRef onClickOutside={mockHandler} />)

            fireEvent.mouseDown(screen.getByTestId('test-element'))

            expect(mockHandler).not.toHaveBeenCalled()
        })
    })
})
