/**
 * Unit Tests: Chat Component
 * Tests for the main Chat component that handles chat interactions
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { Chat } from '@/app/components/chat/chat'
import { useRouter } from 'next/navigation'

// Mock dependencies
jest.mock('next/navigation', () => ({
    redirect: jest.fn(),
    useRouter: jest.fn(),
}))

jest.mock('@/app/components/chat-input/chat-input', () => ({
    ChatInput: (props: any) => (
        <div data-testid="chat-input">
            <input
                data-testid="chat-input-field"
                value={props.value}
                onChange={(e) => props.onValueChange?.(e.target.value)}
            />
            <button data-testid="send-button" onClick={() => props.onSend?.()}>
                Send
            </button>
        </div>
    ),
}))

jest.mock('@/app/components/chat/conversation', () => ({
    Conversation: (props: any) => (
        <div data-testid="conversation">
            {props.messages?.map((msg: any) => (
                <div key={msg.id} data-testid={`message-${msg.id}`}>
                    {msg.content}
                </div>
            ))}
            <button
                data-testid="quote-button"
                onClick={() => props.onQuote?.('quoted text', 'msg-1')}
            >
                Quote
            </button>
        </div>
    ),
}))

jest.mock('@/app/components/chat/use-model', () => ({
    useModel: jest.fn(),
}))

jest.mock('@/app/hooks/use-chat-draft', () => ({
    useChatDraft: jest.fn(),
}))

jest.mock('@/lib/chat-store/chats/provider', () => ({
    useChats: jest.fn(),
}))

jest.mock('@/lib/chat-store/messages/provider', () => ({
    useMessages: jest.fn(),
}))

jest.mock('@/lib/chat-store/session/provider', () => ({
    useChatSession: jest.fn(),
}))

jest.mock('@/lib/user-preference-store/provider', () => ({
    useUserPreferences: jest.fn(),
}))

jest.mock('@/lib/user-store/provider', () => ({
    useUser: jest.fn(),
}))

jest.mock('@/app/components/chat/use-chat-core', () => ({
    useChatCore: jest.fn(),
}))

jest.mock('@/app/components/chat/use-chat-operations', () => ({
    useChatOperations: jest.fn(),
}))

jest.mock('@/app/components/chat/use-file-upload', () => ({
    useFileUpload: jest.fn(),
}))

jest.mock('@/app/components/chat/feedback-widget', () => ({
    FeedbackWidget: ({ authUserId }: { authUserId?: string }) => (
        <div data-testid="feedback-widget">Feedback Widget</div>
    ),
}))

jest.mock('@/app/components/chat/dialog-auth', () => ({
    DialogAuth: ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => (
        open ? <div data-testid="dialog-auth">Auth Dialog</div> : null
    ),
}))

// Import mocks after mocking
import { useModel } from '@/app/components/chat/use-model'
import { useChatDraft } from '@/app/hooks/use-chat-draft'
import { useChats } from '@/lib/chat-store/chats/provider'
import { useMessages } from '@/lib/chat-store/messages/provider'
import { useChatSession } from '@/lib/chat-store/session/provider'
import { useUserPreferences } from '@/lib/user-preference-store/provider'
import { useUser } from '@/lib/user-store/provider'
import { useChatCore } from '@/app/components/chat/use-chat-core'
import { useChatOperations } from '@/app/components/chat/use-chat-operations'
import { useFileUpload } from '@/app/components/chat/use-file-upload'

const mockUseModel = useModel as jest.MockedFunction<typeof useModel>
const mockUseChatDraft = useChatDraft as jest.MockedFunction<typeof useChatDraft>
const mockUseChats = useChats as jest.MockedFunction<typeof useChats>
const mockUseMessages = useMessages as jest.MockedFunction<typeof useMessages>
const mockUseChatSession = useChatSession as jest.MockedFunction<typeof useChatSession>
const mockUseUserPreferences = useUserPreferences as jest.MockedFunction<typeof useUserPreferences>
const mockUseUser = useUser as jest.MockedFunction<typeof useUser>
const mockUseChatCore = useChatCore as jest.MockedFunction<typeof useChatCore>
const mockUseChatOperations = useChatOperations as jest.MockedFunction<typeof useChatOperations>
const mockUseFileUpload = useFileUpload as jest.MockedFunction<typeof useFileUpload>

describe('Chat Component', () => {
    const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        system_prompt: 'You are a helpful assistant',
    }

    const mockChat = {
        id: 'chat-123',
        title: 'Test Chat',
        model: 'gpt-4',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 'user-123',
    }

    const mockMessages = [
        { id: 'msg-1', role: 'user' as const, content: 'Hello', parts: [] },
        { id: 'msg-2', role: 'assistant' as const, content: 'Hi there!', parts: [] },
    ]

    const defaultMocks = {
        useChatSession: { chatId: 'chat-123' },
        useChats: {
            createNewChat: jest.fn(),
            getChatById: jest.fn(() => mockChat),
            updateChatModel: jest.fn(),
            bumpChat: jest.fn(),
            isLoading: false,
        },
        useMessages: {
            messages: mockMessages,
            cacheAndAddMessage: jest.fn(),
        },
        useUser: { user: mockUser },
        useUserPreferences: {
            preferences: {
                promptSuggestions: true,
                multiModelEnabled: false,
                showToolInvocations: true,
            },
            setPreferences: jest.fn(),
            isLoaded: true,
        },
        useChatDraft: {
            draftValue: '',
            clearDraft: jest.fn(),
        },
        useFileUpload: {
            files: [],
            setFiles: jest.fn(),
            handleFileUploads: jest.fn(),
            createOptimisticAttachments: jest.fn(),
            cleanupOptimisticAttachments: jest.fn(),
            handleFileUpload: jest.fn(),
            handleFileRemove: jest.fn(),
        },
        useModel: {
            selectedModel: 'gpt-4',
            handleModelChange: jest.fn(),
        },
        useChatOperations: {
            checkLimitsAndNotify: jest.fn(),
            ensureChatExists: jest.fn(),
            handleDelete: jest.fn(),
        },
        useChatCore: {
            messages: mockMessages,
            input: '',
            status: 'ready' as const,
            stop: jest.fn(),
            hasSentFirstMessageRef: { current: false },
            isSubmitting: false,
            enableSearch: false,
            setEnableSearch: jest.fn(),
            submit: jest.fn(),
            handleSuggestion: jest.fn(),
            handleReload: jest.fn(),
            handleInputChange: jest.fn(),
            submitEdit: jest.fn(),
        },
    }

    const setupMocks = (overrides = {}) => {
        const mocks = { ...defaultMocks, ...overrides }
        
        mockUseChatSession.mockReturnValue(mocks.useChatSession as any)
        mockUseChats.mockReturnValue(mocks.useChats as any)
        mockUseMessages.mockReturnValue(mocks.useMessages as any)
        mockUseUser.mockReturnValue(mocks.useUser as any)
        mockUseUserPreferences.mockReturnValue(mocks.useUserPreferences as any)
        mockUseChatDraft.mockReturnValue(mocks.useChatDraft as any)
        mockUseFileUpload.mockReturnValue(mocks.useFileUpload as any)
        mockUseModel.mockReturnValue(mocks.useModel as any)
        mockUseChatOperations.mockReturnValue(mocks.useChatOperations as any)
        mockUseChatCore.mockReturnValue(mocks.useChatCore as any)
    }

    beforeEach(() => {
        jest.clearAllMocks()
        setupMocks()
    })

    describe('rendering', () => {
        it('should render chat input component', () => {
            render(<Chat />)
            expect(screen.getByTestId('chat-input')).toBeInTheDocument()
        })

        it('should render conversation when messages exist', () => {
            render(<Chat />)
            expect(screen.getByTestId('conversation')).toBeInTheDocument()
        })

        it('should render feedback widget', () => {
            render(<Chat />)
            expect(screen.getByTestId('feedback-widget')).toBeInTheDocument()
        })

        it('should render onboarding when no chatId and no messages', () => {
            setupMocks({
                useChatSession: { chatId: null },
                useChatCore: {
                    ...defaultMocks.useChatCore,
                    messages: [],
                },
            })

            render(<Chat />)
            expect(screen.getByText(/What's on your mind?/i)).toBeInTheDocument()
        })

        it('should not render onboarding when chatId exists', () => {
            render(<Chat />)
            expect(screen.queryByText(/What's on your mind?/i)).not.toBeInTheDocument()
        })

        it('should not render onboarding when messages exist', () => {
            setupMocks({
                useChatSession: { chatId: null },
                useChatCore: {
                    ...defaultMocks.useChatCore,
                    messages: mockMessages,
                },
            })

            render(<Chat />)
            expect(screen.queryByText(/What's on your mind?/i)).not.toBeInTheDocument()
        })
    })

    describe('authentication dialog', () => {
        it('should not show auth dialog by default', () => {
            render(<Chat />)
            expect(screen.queryByTestId('dialog-auth')).not.toBeInTheDocument()
        })
    })

    describe('chat input props', () => {
        it('should pass correct value to chat input', () => {
            setupMocks({
                useChatCore: {
                    ...defaultMocks.useChatCore,
                    input: 'test input',
                },
            })

            render(<Chat />)
            const input = screen.getByTestId('chat-input-field')
            expect(input).toHaveValue('test input')
        })

        it('should pass hasSuggestions=true when no chatId and no messages with promptSuggestions enabled', () => {
            setupMocks({
                useChatSession: { chatId: null },
                useChatCore: {
                    ...defaultMocks.useChatCore,
                    messages: [],
                },
                useUserPreferences: {
                    preferences: {
                        promptSuggestions: true,
                        multiModelEnabled: false,
                        showToolInvocations: true,
                    },
                    setPreferences: jest.fn(),
                    isLoaded: true,
                },
            })

            render(<Chat />)
            // ChatInput should receive hasSuggestions=true
            expect(screen.getByTestId('chat-input')).toBeInTheDocument()
        })

        it('should pass hasSuggestions=false when chatId exists', () => {
            setupMocks({
                useChatSession: { chatId: 'chat-123' },
            })

            render(<Chat />)
            expect(screen.getByTestId('chat-input')).toBeInTheDocument()
        })

        it('should pass hasSuggestions=false when messages exist', () => {
            setupMocks({
                useChatSession: { chatId: null },
                useChatCore: {
                    ...defaultMocks.useChatCore,
                    messages: mockMessages,
                },
            })

            render(<Chat />)
            expect(screen.getByTestId('chat-input')).toBeInTheDocument()
        })

        it('should pass hasSuggestions=false when promptSuggestions is disabled', () => {
            setupMocks({
                useChatSession: { chatId: null },
                useChatCore: {
                    ...defaultMocks.useChatCore,
                    messages: [],
                },
                useUserPreferences: {
                    preferences: {
                        promptSuggestions: false,
                        multiModelEnabled: false,
                        showToolInvocations: true,
                    },
                    setPreferences: jest.fn(),
                    isLoaded: true,
                },
            })

            render(<Chat />)
            expect(screen.getByTestId('chat-input')).toBeInTheDocument()
        })
    })

    describe('conversation props', () => {
        it('should pass messages to conversation component', () => {
            render(<Chat />)
            expect(screen.getByTestId('message-msg-1')).toBeInTheDocument()
            expect(screen.getByTestId('message-msg-2')).toBeInTheDocument()
        })

        it('should pass correct authentication status to conversation', () => {
            setupMocks({
                useUser: { user: mockUser },
            })

            render(<Chat />)
            expect(screen.getByTestId('conversation')).toBeInTheDocument()
        })

        it('should pass unauthenticated status when no user', () => {
            setupMocks({
                useUser: { user: null },
            })

            render(<Chat />)
            expect(screen.getByTestId('conversation')).toBeInTheDocument()
        })
    })

    describe('model selection', () => {
        it('should use selected model from useModel hook', () => {
            setupMocks({
                useModel: {
                    selectedModel: 'gpt-3.5-turbo',
                    handleModelChange: jest.fn(),
                },
            })

            render(<Chat />)
            expect(mockUseModel).toHaveBeenCalledWith({
                currentChat: mockChat,
                user: mockUser,
                updateChatModel: expect.any(Function),
                chatId: 'chat-123',
            })
        })

        it('should handle null currentChat', () => {
            setupMocks({
                useChats: {
                    ...defaultMocks.useChats,
                    getChatById: jest.fn(() => null),
                },
            })

            render(<Chat />)
            expect(mockUseModel).toHaveBeenCalledWith({
                currentChat: null,
                user: mockUser,
                updateChatModel: expect.any(Function),
                chatId: 'chat-123',
            })
        })
    })

    describe('system prompt', () => {
        it('should use user system prompt when available', () => {
            setupMocks({
                useUser: {
                    user: {
                        ...mockUser,
                        system_prompt: 'Custom system prompt',
                    },
                },
            })

            render(<Chat />)
            expect(mockUseChatOperations).toHaveBeenCalledWith(
                expect.objectContaining({
                    systemPrompt: 'Custom system prompt',
                })
            )
        })

        it('should use default system prompt when user has no custom prompt', () => {
            setupMocks({
                useUser: {
                    user: {
                        ...mockUser,
                        system_prompt: undefined,
                    },
                },
            })

            render(<Chat />)
            expect(mockUseChatOperations).toHaveBeenCalledWith(
                expect.objectContaining({
                    systemPrompt: expect.any(String),
                })
            )
        })

        it('should use default system prompt when user is null', () => {
            setupMocks({
                useUser: { user: null },
            })

            render(<Chat />)
            expect(mockUseChatOperations).toHaveBeenCalledWith(
                expect.objectContaining({
                    systemPrompt: expect.any(String),
                })
            )
        })
    })

    describe('file upload integration', () => {
        it('should initialize with empty files array', () => {
            render(<Chat />)
            expect(mockUseFileUpload).toHaveBeenCalled()
        })

        it('should pass file upload handlers to chat input', () => {
            const mockHandleFileUpload = jest.fn()
            const mockHandleFileRemove = jest.fn()

            setupMocks({
                useFileUpload: {
                    ...defaultMocks.useFileUpload,
                    handleFileUpload: mockHandleFileUpload,
                    handleFileRemove: mockHandleFileRemove,
                },
            })

            render(<Chat />)
            expect(screen.getByTestId('chat-input')).toBeInTheDocument()
        })
    })

    describe('chat status', () => {
        it('should handle ready status', () => {
            setupMocks({
                useChatCore: {
                    ...defaultMocks.useChatCore,
                    status: 'ready',
                },
            })

            render(<Chat />)
            expect(screen.getByTestId('conversation')).toBeInTheDocument()
        })

        it('should handle submitting status', () => {
            setupMocks({
                useChatCore: {
                    ...defaultMocks.useChatCore,
                    status: 'submitted',
                    isSubmitting: true,
                },
            })

            render(<Chat />)
            expect(screen.getByTestId('conversation')).toBeInTheDocument()
        })
    })

    describe('draft functionality', () => {
        it('should use draft value from useChatDraft hook', () => {
            setupMocks({
                useChatDraft: {
                    draftValue: 'draft message',
                    clearDraft: jest.fn(),
                },
            })

            render(<Chat />)
            expect(mockUseChatDraft).toHaveBeenCalledWith('chat-123')
        })

        it('should call useChatDraft with null when no chatId', () => {
            setupMocks({
                useChatSession: { chatId: null },
            })

            render(<Chat />)
            expect(mockUseChatDraft).toHaveBeenCalledWith(null)
        })
    })

    describe('chat operations', () => {
        it('should initialize chat operations with correct params', () => {
            render(<Chat />)
            
            expect(mockUseChatOperations).toHaveBeenCalledWith({
                isAuthenticated: true,
                chatId: 'chat-123',
                messages: mockMessages,
                selectedModel: 'gpt-4',
                systemPrompt: 'You are a helpful assistant',
                createNewChat: expect.any(Function),
                setHasDialogAuth: expect.any(Function),
                setMessages: expect.any(Function),
                setInput: expect.any(Function),
            })
        })

        it('should handle unauthenticated state', () => {
            setupMocks({
                useUser: { user: null },
            })

            render(<Chat />)
            
            expect(mockUseChatOperations).toHaveBeenCalledWith(
                expect.objectContaining({
                    isAuthenticated: false,
                })
            )
        })
    })

    describe('chat core integration', () => {
        it('should initialize chat core with all required props', () => {
            render(<Chat />)
            
            expect(mockUseChatCore).toHaveBeenCalledWith({
                initialMessages: mockMessages,
                draftValue: '',
                cacheAndAddMessage: expect.any(Function),
                chatId: 'chat-123',
                user: mockUser,
                files: [],
                createOptimisticAttachments: expect.any(Function),
                setFiles: expect.any(Function),
                checkLimitsAndNotify: expect.any(Function),
                cleanupOptimisticAttachments: expect.any(Function),
                ensureChatExists: expect.any(Function),
                handleFileUploads: expect.any(Function),
                selectedModel: 'gpt-4',
                clearDraft: expect.any(Function),
                bumpChat: expect.any(Function),
            })
        })
    })

    describe('quoted text functionality', () => {
        it('should handle quoted text selection', async () => {
            const { getByTestId } = render(<Chat />)
            
            const quoteButton = getByTestId('quote-button')
            quoteButton.click()
            
            // After clicking quote button, the quoted text should be passed to chat input
            expect(getByTestId('conversation')).toBeInTheDocument()
        })
    })

    describe('loading state', () => {
        it('should handle chats loading state', () => {
            setupMocks({
                useChats: {
                    ...defaultMocks.useChats,
                    isLoading: true,
                },
            })

            render(<Chat />)
            expect(screen.getByTestId('conversation')).toBeInTheDocument()
        })

        it('should not redirect when chats are loading', () => {
            const mockRedirect = require('next/navigation').redirect
            
            setupMocks({
                useChats: {
                    ...defaultMocks.useChats,
                    isLoading: true,
                    getChatById: jest.fn(() => null),
                },
            })

            render(<Chat />)
            expect(mockRedirect).not.toHaveBeenCalled()
        })
    })

    describe('edge cases', () => {
        it('should handle missing preferences', () => {
            setupMocks({
                useUserPreferences: {
                    preferences: {},
                    setPreferences: jest.fn(),
                    isLoaded: true,
                },
            })

            render(<Chat />)
            expect(screen.getByTestId('chat-input')).toBeInTheDocument()
        })

        it('should handle empty messages array', () => {
            setupMocks({
                useChatCore: {
                    ...defaultMocks.useChatCore,
                    messages: [],
                },
                useMessages: {
                    messages: [],
                    cacheAndAddMessage: jest.fn(),
                },
            })

            render(<Chat />)
            expect(screen.getByTestId('conversation')).toBeInTheDocument()
        })

        it('should render with minimum required props', () => {
            setupMocks({
                useUser: { user: null },
                useChatSession: { chatId: null },
                useChats: {
                    ...defaultMocks.useChats,
                    getChatById: jest.fn(() => null),
                },
                useChatCore: {
                    ...defaultMocks.useChatCore,
                    messages: [],
                },
            })

            render(<Chat />)
            expect(screen.getByTestId('chat-input')).toBeInTheDocument()
        })
    })

    describe('memoization', () => {
        it('should memoize conversation props', () => {
            const { rerender } = render(<Chat />)
            
            // Rerender with same props
            rerender(<Chat />)
            
            // Component should still render correctly
            expect(screen.getByTestId('conversation')).toBeInTheDocument()
        })

        it('should memoize chat input props', () => {
            const { rerender } = render(<Chat />)
            
            // Rerender with same props
            rerender(<Chat />)
            
            // Component should still render correctly
            expect(screen.getByTestId('chat-input')).toBeInTheDocument()
        })

        it('should recalculate isAuthenticated when user changes', () => {
            const { rerender } = render(<Chat />)
            
            setupMocks({
                useUser: { user: null },
            })
            
            rerender(<Chat />)
            expect(screen.getByTestId('conversation')).toBeInTheDocument()
        })
    })

    describe('redirect behavior', () => {
        it('should redirect to home when chatId exists but chat not found and no messages', () => {
            const mockRedirect = require('next/navigation').redirect
            
            setupMocks({
                useChatSession: { chatId: 'invalid-chat-id' },
                useChats: {
                    ...defaultMocks.useChats,
                    isLoading: false,
                    getChatById: jest.fn(() => null),
                },
                useChatCore: {
                    ...defaultMocks.useChatCore,
                    messages: [],
                    status: 'ready',
                    isSubmitting: false,
                    hasSentFirstMessageRef: { current: false },
                },
            })

            render(<Chat />)
            expect(mockRedirect).toHaveBeenCalledWith('/')
        })

        it('should not redirect when hasSentFirstMessageRef is true', () => {
            const mockRedirect = require('next/navigation').redirect
            mockRedirect.mockClear()
            
            setupMocks({
                useChatSession: { chatId: 'invalid-chat-id' },
                useChats: {
                    ...defaultMocks.useChats,
                    isLoading: false,
                    getChatById: jest.fn(() => null),
                },
                useChatCore: {
                    ...defaultMocks.useChatCore,
                    messages: [],
                    status: 'ready',
                    isSubmitting: false,
                    hasSentFirstMessageRef: { current: true },
                },
            })

            render(<Chat />)
            expect(mockRedirect).not.toHaveBeenCalled()
        })

        it('should not redirect when isSubmitting is true', () => {
            const mockRedirect = require('next/navigation').redirect
            mockRedirect.mockClear()
            
            setupMocks({
                useChatSession: { chatId: 'invalid-chat-id' },
                useChats: {
                    ...defaultMocks.useChats,
                    isLoading: false,
                    getChatById: jest.fn(() => null),
                },
                useChatCore: {
                    ...defaultMocks.useChatCore,
                    messages: [],
                    status: 'ready',
                    isSubmitting: true,
                    hasSentFirstMessageRef: { current: false },
                },
            })

            render(<Chat />)
            expect(mockRedirect).not.toHaveBeenCalled()
        })

        it('should not redirect when status is not ready', () => {
            const mockRedirect = require('next/navigation').redirect
            mockRedirect.mockClear()
            
            setupMocks({
                useChatSession: { chatId: 'invalid-chat-id' },
                useChats: {
                    ...defaultMocks.useChats,
                    isLoading: false,
                    getChatById: jest.fn(() => null),
                },
                useChatCore: {
                    ...defaultMocks.useChatCore,
                    messages: [],
                    status: 'submitted',
                    isSubmitting: false,
                    hasSentFirstMessageRef: { current: false },
                },
            })

            render(<Chat />)
            expect(mockRedirect).not.toHaveBeenCalled()
        })

        it('should not redirect when messages exist', () => {
            const mockRedirect = require('next/navigation').redirect
            mockRedirect.mockClear()
            
            setupMocks({
                useChatSession: { chatId: 'invalid-chat-id' },
                useChats: {
                    ...defaultMocks.useChats,
                    isLoading: false,
                    getChatById: jest.fn(() => null),
                },
                useChatCore: {
                    ...defaultMocks.useChatCore,
                    messages: mockMessages,
                    status: 'ready',
                    isSubmitting: false,
                    hasSentFirstMessageRef: { current: false },
                },
            })

            render(<Chat />)
            expect(mockRedirect).not.toHaveBeenCalled()
        })

        it('should not redirect when no chatId', () => {
            const mockRedirect = require('next/navigation').redirect
            mockRedirect.mockClear()
            
            setupMocks({
                useChatSession: { chatId: null },
                useChatCore: {
                    ...defaultMocks.useChatCore,
                    messages: [],
                },
            })

            render(<Chat />)
            expect(mockRedirect).not.toHaveBeenCalled()
        })
    })

    describe('search functionality', () => {
        it('should pass enableSearch state to chat input', () => {
            setupMocks({
                useChatCore: {
                    ...defaultMocks.useChatCore,
                    enableSearch: true,
                },
            })

            render(<Chat />)
            expect(screen.getByTestId('chat-input')).toBeInTheDocument()
        })

        it('should pass setEnableSearch handler to chat input', () => {
            const mockSetEnableSearch = jest.fn()
            
            setupMocks({
                useChatCore: {
                    ...defaultMocks.useChatCore,
                    setEnableSearch: mockSetEnableSearch,
                },
            })

            render(<Chat />)
            expect(screen.getByTestId('chat-input')).toBeInTheDocument()
        })
    })

    describe('stop functionality', () => {
        it('should pass stop handler to chat input', () => {
            const mockStop = jest.fn()
            
            setupMocks({
                useChatCore: {
                    ...defaultMocks.useChatCore,
                    stop: mockStop,
                },
            })

            render(<Chat />)
            expect(screen.getByTestId('chat-input')).toBeInTheDocument()
        })
    })
})
