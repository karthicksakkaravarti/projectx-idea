
import { POST } from '@/app/api/chat/route'
import { validateAndTrackUsage } from '@/app/api/chat/api'
import { getAllModels } from '@/lib/models'

// Mock dependencies
jest.mock('@/lib/models', () => ({
    getAllModels: jest.fn().mockResolvedValue([
        {
            id: 'gpt-4',
            name: 'GPT-4',
            provider: 'openai',
            apiSdk: jest.fn().mockReturnValue({}),
        },
    ]),
}))

jest.mock('@/lib/openproviders/provider-map', () => ({
    getProviderForModel: jest.fn().mockReturnValue('openai'),
}))

jest.mock('@/lib/user-keys', () => ({
    getEffectiveApiKey: jest.fn().mockResolvedValue('test-api-key'),
}))

jest.mock('@/app/api/chat/api', () => ({
    validateAndTrackUsage: jest.fn(),
    incrementMessageCount: jest.fn(),
    logUserMessage: jest.fn(),
    storeAssistantMessage: jest.fn(),
}))

jest.mock('@/app/api/chat/utils', () => ({
    createErrorResponse: jest.fn().mockImplementation((err) => new Response(JSON.stringify(err), { status: 500 })),
    extractErrorMessage: jest.fn().mockReturnValue('error'),
}))

jest.mock('ai', () => ({
    streamText: jest.fn().mockReturnValue({
        toDataStreamResponse: jest.fn().mockReturnValue(new Response('stream-data')),
    }),
}))

describe('Chat Route API', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should return 400 if fields are missing', async () => {
        const req = new Request('http://localhost:3000/api/chat', {
            method: 'POST',
            body: JSON.stringify({}),
        })

        const res = await POST(req)
        expect(res.status).toBe(400)
        expect(await res.json()).toEqual({ error: 'Error, missing information' })
    })

    it('should process valid request successfully', async () => {
        const mockSupabase = { from: jest.fn() }
            ; (validateAndTrackUsage as jest.Mock).mockResolvedValue(mockSupabase)

        const req = new Request('http://localhost:3000/api/chat', {
            method: 'POST',
            body: JSON.stringify({
                messages: [{ role: 'user', content: 'hello' }],
                chatId: 'chat-1',
                userId: 'user-1',
                model: 'gpt-4',
                isAuthenticated: true,
            }),
        })

        const res = await POST(req)
        expect(res.status).toBe(200)
        expect(await res.text()).toBe('stream-data')

        expect(validateAndTrackUsage).toHaveBeenCalledWith({
            userId: 'user-1',
            model: 'gpt-4',
            isAuthenticated: true
        })
    })

    it('should handle errors', async () => {
        // Mock request parsing failure or logic failure
        const req = new Request('http://localhost:3000/api/chat', {
            method: 'POST',
            body: 'invalid-json',
        })

        // POST calls req.json(), which will fail if body is invalid json
        // createErrorResponse mock handles it

        const res = await POST(req)
        expect(res.status).toBe(500)
    })
})
