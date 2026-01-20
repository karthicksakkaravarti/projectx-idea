/**
 * Unit Tests: app/hooks/use-mobile.ts
 */

import { renderHook, act } from '@testing-library/react'
import { useIsMobile } from '@/app/hooks/use-mobile'

describe('useIsMobile hook', () => {
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
        it('should return false when window width is above mobile breakpoint (768px)', () => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                value: 1024,
            })

            const { result } = renderHook(() => useIsMobile())
            expect(result.current).toBe(false)
        })

        it('should return true when window width is below mobile breakpoint', () => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                value: 375,
            })

            const { result } = renderHook(() => useIsMobile())
            expect(result.current).toBe(true)
        })

        it('should return false when window width equals mobile breakpoint', () => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                value: 768,
            })

            const { result } = renderHook(() => useIsMobile())
            expect(result.current).toBe(false)
        })

        it('should return true at 767px (edge case)', () => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                value: 767,
            })

            const { result } = renderHook(() => useIsMobile())
            expect(result.current).toBe(true)
        })
    })

    describe('Media query', () => {
        it('should create media query with correct breakpoint', () => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                value: 1024,
            })

            renderHook(() => useIsMobile())
            expect(matchMediaMock).toHaveBeenCalledWith('(max-width: 767px)')
        })
    })

    describe('Responsive behavior', () => {
        it('should update state when resizing from desktop to mobile', () => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                value: 1024,
            })

            const { result } = renderHook(() => useIsMobile())
            expect(result.current).toBe(false)

            act(() => {
                Object.defineProperty(window, 'innerWidth', {
                    writable: true,
                    value: 375,
                })
                const listener = listeners.get('(max-width: 767px)')
                if (listener) listener()
            })

            expect(result.current).toBe(true)
        })

        it('should update state when resizing from mobile to desktop', () => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                value: 375,
            })

            const { result } = renderHook(() => useIsMobile())
            expect(result.current).toBe(true)

            act(() => {
                Object.defineProperty(window, 'innerWidth', {
                    writable: true,
                    value: 1200,
                })
                const listener = listeners.get('(max-width: 767px)')
                if (listener) listener()
            })

            expect(result.current).toBe(false)
        })
    })

    describe('Tablet sizes', () => {
        it('should return false for iPad (768px)', () => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                value: 768,
            })

            const { result } = renderHook(() => useIsMobile())
            expect(result.current).toBe(false)
        })

        it('should return false for iPad Pro (1024px)', () => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                value: 1024,
            })

            const { result } = renderHook(() => useIsMobile())
            expect(result.current).toBe(false)
        })
    })

    describe('Common mobile device sizes', () => {
        it('should return true for iPhone SE (375px)', () => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                value: 375,
            })

            const { result } = renderHook(() => useIsMobile())
            expect(result.current).toBe(true)
        })

        it('should return true for iPhone 12 Pro (390px)', () => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                value: 390,
            })

            const { result } = renderHook(() => useIsMobile())
            expect(result.current).toBe(true)
        })

        it('should return true for Samsung Galaxy S8 (360px)', () => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                value: 360,
            })

            const { result } = renderHook(() => useIsMobile())
            expect(result.current).toBe(true)
        })
    })

    describe('Cleanup', () => {
        it('should remove event listener on unmount', () => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                value: 1024,
            })

            const { unmount } = renderHook(() => useIsMobile())
            const mediaQueryList = matchMediaMock.mock.results[0].value

            unmount()

            expect(mediaQueryList.removeEventListener).toHaveBeenCalledWith(
                'change',
                expect.any(Function)
            )
        })
    })
})
