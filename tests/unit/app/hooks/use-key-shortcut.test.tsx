/**
 * Unit Tests: app/hooks/use-key-shortcut.tsx
 */

import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import { useKeyShortcut } from '@/app/hooks/use-key-shortcut'

describe('useKeyShortcut hook', () => {
    const mockAction = jest.fn()

    beforeEach(() => {
        mockAction.mockClear()
    })

    describe('Key detection', () => {
        it('should call action when key combo matches', () => {
            const keyCombo = (e: KeyboardEvent) => e.key === 'Enter'

            renderHook(() => useKeyShortcut(keyCombo, mockAction))

            act(() => {
                fireEvent.keyDown(window, { key: 'Enter' })
            })

            expect(mockAction).toHaveBeenCalledTimes(1)
        })

        it('should not call action when key combo does not match', () => {
            const keyCombo = (e: KeyboardEvent) => e.key === 'Enter'

            renderHook(() => useKeyShortcut(keyCombo, mockAction))

            act(() => {
                fireEvent.keyDown(window, { key: 'Escape' })
            })

            expect(mockAction).not.toHaveBeenCalled()
        })

        it('should handle modifier keys', () => {
            const keyCombo = (e: KeyboardEvent) => e.ctrlKey && e.key === 's'

            renderHook(() => useKeyShortcut(keyCombo, mockAction))

            act(() => {
                fireEvent.keyDown(window, { key: 's', ctrlKey: true })
            })

            expect(mockAction).toHaveBeenCalledTimes(1)
        })

        it('should not trigger when only partial combo is pressed', () => {
            const keyCombo = (e: KeyboardEvent) => e.ctrlKey && e.key === 's'

            renderHook(() => useKeyShortcut(keyCombo, mockAction))

            // Only press 's' without ctrl
            act(() => {
                fireEvent.keyDown(window, { key: 's' })
            })

            expect(mockAction).not.toHaveBeenCalled()
        })
    })

    describe('Complex key combinations', () => {
        it('should handle Ctrl+Shift combinations', () => {
            const keyCombo = (e: KeyboardEvent) => e.ctrlKey && e.shiftKey && e.key === 'P'

            renderHook(() => useKeyShortcut(keyCombo, mockAction))

            act(() => {
                fireEvent.keyDown(window, { key: 'P', ctrlKey: true, shiftKey: true })
            })

            expect(mockAction).toHaveBeenCalledTimes(1)
        })

        it('should handle Meta (Cmd) key', () => {
            const keyCombo = (e: KeyboardEvent) => e.metaKey && e.key === 'k'

            renderHook(() => useKeyShortcut(keyCombo, mockAction))

            act(() => {
                fireEvent.keyDown(window, { key: 'k', metaKey: true })
            })

            expect(mockAction).toHaveBeenCalledTimes(1)
        })

        it('should handle Alt key combinations', () => {
            const keyCombo = (e: KeyboardEvent) => e.altKey && e.key === 'n'

            renderHook(() => useKeyShortcut(keyCombo, mockAction))

            act(() => {
                fireEvent.keyDown(window, { key: 'n', altKey: true })
            })

            expect(mockAction).toHaveBeenCalledTimes(1)
        })
    })

    describe('Event prevention', () => {
        it('should prevent default when key combo matches', () => {
            const keyCombo = (e: KeyboardEvent) => e.key === 'Enter'

            renderHook(() => useKeyShortcut(keyCombo, mockAction))

            const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
            const preventDefaultSpy = jest.spyOn(event, 'preventDefault')

            act(() => {
                window.dispatchEvent(event)
            })

            expect(preventDefaultSpy).toHaveBeenCalled()
        })
    })

    describe('Multiple shortcuts', () => {
        it('should handle multiple shortcuts without interference', () => {
            const mockAction1 = jest.fn()
            const mockAction2 = jest.fn()

            const keyCombo1 = (e: KeyboardEvent) => e.key === 'Escape'
            const keyCombo2 = (e: KeyboardEvent) => e.key === 'Enter'

            renderHook(() => useKeyShortcut(keyCombo1, mockAction1))
            renderHook(() => useKeyShortcut(keyCombo2, mockAction2))

            act(() => {
                fireEvent.keyDown(window, { key: 'Escape' })
            })

            expect(mockAction1).toHaveBeenCalledTimes(1)
            expect(mockAction2).not.toHaveBeenCalled()

            act(() => {
                fireEvent.keyDown(window, { key: 'Enter' })
            })

            expect(mockAction1).toHaveBeenCalledTimes(1)
            expect(mockAction2).toHaveBeenCalledTimes(1)
        })
    })

    describe('Cleanup', () => {
        it('should remove event listener on unmount', () => {
            const keyCombo = (e: KeyboardEvent) => e.key === 'Enter'
            const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')

            const { unmount } = renderHook(() => useKeyShortcut(keyCombo, mockAction))

            unmount()

            expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
            removeEventListenerSpy.mockRestore()
        })
    })

    describe('Hook updates', () => {
        it('should update when action changes', () => {
            const keyCombo = (e: KeyboardEvent) => e.key === 'Enter'
            const action1 = jest.fn()
            const action2 = jest.fn()

            const { rerender } = renderHook(
                ({ action }) => useKeyShortcut(keyCombo, action),
                { initialProps: { action: action1 } }
            )

            act(() => {
                fireEvent.keyDown(window, { key: 'Enter' })
            })

            expect(action1).toHaveBeenCalledTimes(1)
            expect(action2).not.toHaveBeenCalled()

            rerender({ action: action2 })

            act(() => {
                fireEvent.keyDown(window, { key: 'Enter' })
            })

            expect(action1).toHaveBeenCalledTimes(1)
            expect(action2).toHaveBeenCalledTimes(1)
        })
    })
})
