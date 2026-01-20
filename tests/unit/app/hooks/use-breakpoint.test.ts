/**
 * Unit Tests: app/hooks/use-breakpoint.ts
 */

import { renderHook, act } from '@testing-library/react'
import { useBreakpoint } from '@/app/hooks/use-breakpoint'

describe('useBreakpoint hook', () => {
    let matchMediaMock: jest.Mock
    let listeners: Map<string, () => void>

    beforeEach(() => {
        listeners = new Map()
        matchMediaMock = jest.fn((query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn((event: string, callback: () => void) => {
                if (event === 'change') {
                    listeners.set(query, callback)
                }
            }),
            removeEventListener: jest.fn((event: string) => {
                if (event === 'change') {
                    listeners.delete(query)
                }
            }),
            dispatchEvent: jest.fn(),
        }))
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: matchMediaMock,
        })
    })

    afterEach(() => {
        jest.restoreAllMocks()
        listeners.clear()
    })

    describe('Initial state', () => {
        it('should return false when window width is above breakpoint', () => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                value: 1024,
            })

            const { result } = renderHook(() => useBreakpoint(768))
            expect(result.current).toBe(false)
        })

        it('should return true when window width is below breakpoint', () => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                value: 500,
            })

            const { result } = renderHook(() => useBreakpoint(768))
            expect(result.current).toBe(true)
        })

        it('should return false when window width equals breakpoint', () => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                value: 768,
            })

            const { result } = renderHook(() => useBreakpoint(768))
            expect(result.current).toBe(false)
        })
    })

    describe('matchMedia query construction', () => {
        it('should create correct media query for breakpoint', () => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                value: 1024,
            })

            renderHook(() => useBreakpoint(768))
            expect(matchMediaMock).toHaveBeenCalledWith('(max-width: 767px)')
        })

        it('should create correct media query for different breakpoint', () => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                value: 1024,
            })

            renderHook(() => useBreakpoint(1024))
            expect(matchMediaMock).toHaveBeenCalledWith('(max-width: 1023px)')
        })
    })

    describe('Responsive behavior', () => {
        it('should update state when window resizes below breakpoint', () => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                value: 1024,
            })

            const { result } = renderHook(() => useBreakpoint(768))
            expect(result.current).toBe(false)

            act(() => {
                Object.defineProperty(window, 'innerWidth', {
                    writable: true,
                    value: 500,
                })
                const listener = listeners.get('(max-width: 767px)')
                if (listener) listener()
            })

            expect(result.current).toBe(true)
        })

        it('should update state when window resizes above breakpoint', () => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                value: 500,
            })

            const { result } = renderHook(() => useBreakpoint(768))
            expect(result.current).toBe(true)

            act(() => {
                Object.defineProperty(window, 'innerWidth', {
                    writable: true,
                    value: 1024,
                })
                const listener = listeners.get('(max-width: 767px)')
                if (listener) listener()
            })

            expect(result.current).toBe(false)
        })
    })

    describe('Cleanup', () => {
        it('should remove event listener on unmount', () => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                value: 1024,
            })

            const { unmount } = renderHook(() => useBreakpoint(768))
            const mediaQueryList = matchMediaMock.mock.results[0].value

            unmount()

            expect(mediaQueryList.removeEventListener).toHaveBeenCalledWith(
                'change',
                expect.any(Function)
            )
        })
    })

    describe('Breakpoint changes', () => {
        it('should re-evaluate when breakpoint prop changes', () => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                value: 900,
            })

            const { result, rerender } = renderHook(
                ({ breakpoint }) => useBreakpoint(breakpoint),
                { initialProps: { breakpoint: 768 } }
            )

            expect(result.current).toBe(false) // 900 > 768

            rerender({ breakpoint: 1024 })
            expect(result.current).toBe(true) // 900 < 1024
        })
    })
})
