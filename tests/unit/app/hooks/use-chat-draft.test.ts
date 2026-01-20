/**
 * Unit Tests: app/hooks/use-chat-draft.ts
 */

import { renderHook, act } from '@testing-library/react'
import { useChatDraft } from '@/app/hooks/use-chat-draft'

describe('useChatDraft hook', () => {
    let mockLocalStorage: { [key: string]: string } = {}

    beforeEach(() => {
        mockLocalStorage = {}

        // Clear all mocks first
        jest.clearAllMocks()

        // Setup localStorage mocks
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn((key) => mockLocalStorage[key] || null),
                setItem: jest.fn((key, value) => {
                    mockLocalStorage[key] = value
                }),
                removeItem: jest.fn((key) => {
                    delete mockLocalStorage[key]
                }),
                clear: jest.fn(() => {
                    mockLocalStorage = {}
                }),
            },
            writable: true
        })
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    describe('Initial state', () => {
        it('should return empty string when no draft exists', () => {
            const { result } = renderHook(() => useChatDraft('test-chat-id'))
            expect(result.current.draftValue).toBe('')
        })

        it('should return existing draft from localStorage', () => {
            mockLocalStorage['chat-draft-test-chat-id'] = 'Hello world'

            const { result } = renderHook(() => useChatDraft('test-chat-id'))
            expect(result.current.draftValue).toBe('Hello world')
        })

        it('should use correct storage key for chatId', () => {
            renderHook(() => useChatDraft('my-chat-123'))

            expect(localStorage.getItem).toHaveBeenCalledWith('chat-draft-my-chat-123')
        })

        it('should use "chat-draft-new" key when chatId is null', () => {
            renderHook(() => useChatDraft(null))

            expect(localStorage.getItem).toHaveBeenCalledWith('chat-draft-new')
        })
    })

    describe('setDraftValue', () => {
        it('should update draft value in state', () => {
            const { result } = renderHook(() => useChatDraft('test-chat'))

            act(() => {
                result.current.setDraftValue('New draft content')
            })

            expect(result.current.draftValue).toBe('New draft content')
        })

        it('should save draft to localStorage when value is not empty', () => {
            const { result } = renderHook(() => useChatDraft('test-chat'))

            act(() => {
                result.current.setDraftValue('My draft message')
            })

            expect(localStorage.setItem).toHaveBeenCalledWith(
                'chat-draft-test-chat',
                'My draft message'
            )
        })

        it('should remove draft from localStorage when value is empty', () => {
            mockLocalStorage['chat-draft-test-chat'] = 'Existing draft'
            const { result } = renderHook(() => useChatDraft('test-chat'))

            act(() => {
                result.current.setDraftValue('')
            })

            expect(localStorage.removeItem).toHaveBeenCalledWith('chat-draft-test-chat')
        })

        it('should handle updating draft multiple times', () => {
            const { result } = renderHook(() => useChatDraft('test-chat'))

            act(() => {
                result.current.setDraftValue('First draft')
            })
            expect(result.current.draftValue).toBe('First draft')

            act(() => {
                result.current.setDraftValue('Second draft')
            })
            expect(result.current.draftValue).toBe('Second draft')

            act(() => {
                result.current.setDraftValue('Third draft')
            })
            expect(result.current.draftValue).toBe('Third draft')
        })
    })

    describe('clearDraft', () => {
        it('should clear draft value from state', () => {
            const { result } = renderHook(() => useChatDraft('test-chat'))

            act(() => {
                result.current.setDraftValue('Some content')
            })
            expect(result.current.draftValue).toBe('Some content')

            act(() => {
                result.current.clearDraft()
            })
            expect(result.current.draftValue).toBe('')
        })

        it('should remove draft from localStorage', () => {
            const { result } = renderHook(() => useChatDraft('test-chat'))

            act(() => {
                result.current.setDraftValue('Some content')
            })

            act(() => {
                result.current.clearDraft()
            })

            expect(localStorage.removeItem).toHaveBeenCalledWith('chat-draft-test-chat')
        })
    })

    describe('Different chat IDs', () => {
        it('should maintain separate drafts for different chats', () => {
            const { result: result1 } = renderHook(() => useChatDraft('chat-1'))
            const { result: result2 } = renderHook(() => useChatDraft('chat-2'))

            act(() => {
                result1.current.setDraftValue('Draft for chat 1')
            })

            act(() => {
                result2.current.setDraftValue('Draft for chat 2')
            })

            expect(result1.current.draftValue).toBe('Draft for chat 1')
            expect(result2.current.draftValue).toBe('Draft for chat 2')
        })
    })

    describe('Return value structure', () => {
        it('should return object with draftValue, setDraftValue, and clearDraft', () => {
            const { result } = renderHook(() => useChatDraft('test-chat'))

            expect(result.current).toHaveProperty('draftValue')
            expect(result.current).toHaveProperty('setDraftValue')
            expect(result.current).toHaveProperty('clearDraft')
            expect(typeof result.current.setDraftValue).toBe('function')
            expect(typeof result.current.clearDraft).toBe('function')
        })
    })
})
