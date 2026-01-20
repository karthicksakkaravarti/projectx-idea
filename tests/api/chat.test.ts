/**
 * Integration Tests: Chat API Logic
 */

import {
    validateAndTrackUsage,
    incrementMessageCount,
    logUserMessage,
    storeAssistantMessage
} from '@/app/api/chat/api'
jest.mock('@/app/api/chat/db', () => ({
    saveFinalAssistantMessage: jest.fn().mockResolvedValue(undefined),
}))
import { getAllModels } from '@/lib/models'
import { getProviderForModel } from '@/lib/openproviders/provider-map'

// Mock dependencies
jest.mock('@/lib/models', () => ({
    getAllModels: jest.fn().mockResolvedValue([
        {
            id: 'gpt-4.1-nano',
            name: 'GPT-4.1 Nano',
            provider: 'openai',
            apiSdk: jest.fn().mockReturnValue({}),
        },
    ]),
}))

jest.mock('@/lib/openproviders/provider-map', () => ({
    getProviderForModel: jest.fn().mockReturnValue('openai'),
}))

jest.mock('@/lib/usage', () => ({
    checkDailyMessageLimit: jest.fn().mockResolvedValue({
        allowed: true,
        remaining: 995,
        limit: 1000,
        resetTime: new Date().toISOString(),
    }),
    checkProModelLimit: jest.fn().mockResolvedValue({
        allowed: true,
        remaining: 495,
        limit: 500,
        resetTime: new Date().toISOString(),
    }),
    checkUsageByModel: jest.fn().mockResolvedValue({}),
    incrementUsage: jest.fn().mockResolvedValue({}),
}))

jest.mock('@/lib/user-keys', () => ({
    getUserKey: jest.fn().mockResolvedValue('test-api-key'),
}))

const mockSupabaseClient = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({
        data: { id: 'test-user', email: 'test@example.com' },
        error: null
    }),
    maybeSingle: jest.fn().mockResolvedValue({
        data: { id: 'test-user', email: 'test@example.com' },
        error: null
    }),
}

jest.mock('@/lib/supabase/server', () => ({
    createClient: jest.fn().mockResolvedValue({
        auth: {
            getUser: jest.fn().mockResolvedValue({
                data: { user: { id: 'test-user', email: 'test@example.com' } },
                error: null
            })
        },
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
            data: { id: 'test-user', email: 'test@example.com' },
            error: null
        }),
        maybeSingle: jest.fn().mockResolvedValue({
            data: { id: 'test-user', email: 'test@example.com' },
            error: null
        }),
    }),
    createServerClient: jest.fn().mockReturnValue({
        auth: {
            getUser: jest.fn().mockResolvedValue({
                data: { user: { id: 'test-user', email: 'test@example.com' } },
                error: null
            })
        },
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
            data: { id: 'test-user', email: 'test@example.com' },
            error: null
        }),
        maybeSingle: jest.fn().mockResolvedValue({
            data: { id: 'test-user', email: 'test@example.com' },
            error: null
        }),
    }),
}))

jest.mock('@/lib/supabase/server-guest', () => ({
    createGuestServerClient: jest.fn().mockResolvedValue({
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
            data: { id: 'test-user', email: 'test@example.com' },
            error: null
        }),
        maybeSingle: jest.fn().mockResolvedValue({
            data: { id: 'test-user', email: 'test@example.com' },
            error: null
        }),
    }),
}))

describe('Chat API Logic', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('validateAndTrackUsage', () => {
        it('should return client for valid authenticated user', async () => {
            const result = await validateAndTrackUsage({
                userId: 'test-user',
                model: 'gpt-4.1-nano',
                isAuthenticated: true
            })

            expect(result).toBeTruthy()
        })

        it('should throw error for rate limit exceeded', async () => {
            const { checkUsageByModel } = require('@/lib/usage')
            checkUsageByModel.mockRejectedValueOnce(new Error('Daily message limit exceeded'))

            await expect(validateAndTrackUsage({
                userId: 'guest-user',
                model: 'gpt-4.1-nano',
                isAuthenticated: false
            })).rejects.toThrow('Daily message limit')
        })

        it('should throw error for pro model limit exceeded', async () => {
            const { checkUsageByModel } = require('@/lib/usage')
            checkUsageByModel.mockRejectedValueOnce(new Error('Daily Pro model limit reached'))

            await expect(validateAndTrackUsage({
                userId: 'test-user',
                model: 'gpt-4o',
                isAuthenticated: true
            })).rejects.toThrow('Pro model')
        })
    })

    describe('incrementMessageCount', () => {
        it('should increment usage', async () => {
            const { incrementUsage } = require('@/lib/usage')
            const mockClient = { from: jest.fn() }
            await incrementMessageCount({ supabase: mockClient as any, userId: 'test-user' })
            expect(incrementUsage).toHaveBeenCalledWith(mockClient, 'test-user')
        })

        it('should handle errors gracefully', async () => {
            const { incrementUsage } = require('@/lib/usage')
            incrementUsage.mockRejectedValueOnce(new Error('Update failed'))
            const mockClient = { from: jest.fn() }
            await expect(incrementMessageCount({ supabase: mockClient as any, userId: 'test-user' })).resolves.not.toThrow()
        })
    })

    describe('logUserMessage', () => {
        it('should insert user message', async () => {
            const mockInsert = jest.fn().mockResolvedValue({ error: null })
            const mockFrom = jest.fn().mockReturnValue({ insert: mockInsert })
            const mockClient = { from: mockFrom }

            await logUserMessage({
                supabase: mockClient as any,
                userId: 'test-user',
                chatId: 'chat-123',
                content: 'Hello',
                model: 'gpt-4',
                isAuthenticated: true,
                attachments: []
            })

            expect(mockFrom).toHaveBeenCalledWith('messages')
            expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
                chat_id: 'chat-123',
                role: 'user',
                content: 'Hello',
                user_id: 'test-user'
            }))
        })
    })

    describe('storeAssistantMessage', () => {
        it('should call saveFinalAssistantMessage', async () => {
            const { saveFinalAssistantMessage } = require('@/app/api/chat/db')
            const mockClient = { from: jest.fn() }

            await storeAssistantMessage({
                supabase: mockClient as any,
                chatId: 'chat-123',
                messages: [],
                model: 'gpt-4'
            })

            expect(saveFinalAssistantMessage).toHaveBeenCalledWith(
                mockClient,
                'chat-123',
                [],
                undefined,
                'gpt-4'
            )
        })
    })

    describe('getAllModels', () => {
        it('should return available models', async () => {
            const models = await getAllModels()

            expect(Array.isArray(models)).toBe(true)
            expect(models.length).toBeGreaterThan(0)
            expect(models[0]).toHaveProperty('id')
            expect(models[0]).toHaveProperty('name')
            expect(models[0]).toHaveProperty('provider')
        })
    })

    describe('getProviderForModel', () => {
        it('should return correct provider for model', () => {
            const provider = getProviderForModel('gpt-4.1-nano')

            expect(provider).toBe('openai')
        })
    })
})
