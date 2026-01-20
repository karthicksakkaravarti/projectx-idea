/**
 * Unit Tests: app/api/chat/db.ts
 * Tests for chat database helpers
 */

import { saveFinalAssistantMessage } from '@/app/api/chat/db'
import type { Message } from '@/app/types/api.types'

// Mock Supabase client
const createMockSupabase = (insertResult: { error: Error | null }) => ({
    from: jest.fn().mockReturnValue({
        insert: jest.fn().mockResolvedValue(insertResult)
    })
})

describe('Chat DB Helpers', () => {
    describe('saveFinalAssistantMessage', () => {
        const baseChatId = 'chat-123'
        const messageGroupId = 'group-456'
        const model = 'gpt-4'

        describe('Message processing', () => {
            it('should process text content from assistant messages', async () => {
                const mockSupabase = createMockSupabase({ error: null })
                const messages: Message[] = [
                    {
                        role: 'assistant',
                        content: [
                            { type: 'text', text: 'Hello, world!' }
                        ]
                    }
                ]

                await saveFinalAssistantMessage(
                    mockSupabase as never,
                    baseChatId,
                    messages,
                    messageGroupId,
                    model
                )

                expect(mockSupabase.from).toHaveBeenCalledWith('messages')
                expect(mockSupabase.from().insert).toHaveBeenCalledWith(
                    expect.objectContaining({
                        chat_id: baseChatId,
                        role: 'assistant',
                        content: 'Hello, world!',
                        message_group_id: messageGroupId,
                        model
                    })
                )
            })

            it('should combine multiple text parts', async () => {
                const mockSupabase = createMockSupabase({ error: null })
                const messages: Message[] = [
                    {
                        role: 'assistant',
                        content: [
                            { type: 'text', text: 'First part' },
                            { type: 'text', text: 'Second part' }
                        ]
                    }
                ]

                await saveFinalAssistantMessage(
                    mockSupabase as never,
                    baseChatId,
                    messages,
                    messageGroupId,
                    model
                )

                expect(mockSupabase.from().insert).toHaveBeenCalledWith(
                    expect.objectContaining({
                        content: expect.stringContaining('First part')
                    })
                )
            })

            it('should process tool invocations', async () => {
                const mockSupabase = createMockSupabase({ error: null })
                const messages: Message[] = [
                    {
                        role: 'assistant',
                        content: [
                            {
                                type: 'tool-invocation',
                                toolInvocation: {
                                    toolCallId: 'call-1',
                                    state: 'result',
                                    toolName: 'search',
                                    args: { query: 'test' }
                                }
                            }
                        ]
                    }
                ]

                await saveFinalAssistantMessage(
                    mockSupabase as never,
                    baseChatId,
                    messages,
                    messageGroupId,
                    model
                )

                expect(mockSupabase.from().insert).toHaveBeenCalledWith(
                    expect.objectContaining({
                        parts: expect.arrayContaining([
                            expect.objectContaining({
                                type: 'tool-invocation'
                            })
                        ])
                    })
                )
            })

            it('should process reasoning parts', async () => {
                const mockSupabase = createMockSupabase({ error: null })
                const messages: Message[] = [
                    {
                        role: 'assistant',
                        content: [
                            { type: 'reasoning', text: 'Thinking about this...' }
                        ]
                    }
                ]

                await saveFinalAssistantMessage(
                    mockSupabase as never,
                    baseChatId,
                    messages,
                    messageGroupId,
                    model
                )

                expect(mockSupabase.from().insert).toHaveBeenCalledWith(
                    expect.objectContaining({
                        parts: expect.arrayContaining([
                            expect.objectContaining({
                                type: 'reasoning'
                            })
                        ])
                    })
                )
            })

            it('should process tool role messages', async () => {
                const mockSupabase = createMockSupabase({ error: null })
                const messages: Message[] = [
                    {
                        role: 'tool',
                        content: [
                            {
                                type: 'tool-result',
                                toolCallId: 'call-1',
                                toolName: 'search',
                                result: { data: 'results' }
                            }
                        ]
                    }
                ]

                await saveFinalAssistantMessage(
                    mockSupabase as never,
                    baseChatId,
                    messages,
                    messageGroupId,
                    model
                )

                expect(mockSupabase.from().insert).toHaveBeenCalledWith(
                    expect.objectContaining({
                        parts: expect.arrayContaining([
                            expect.objectContaining({
                                type: 'tool-invocation'
                            })
                        ])
                    })
                )
            })

            it('should skip messages with non-array content', async () => {
                const mockSupabase = createMockSupabase({ error: null })
                const messages: Message[] = [
                    {
                        role: 'assistant',
                        content: 'Plain string content'
                    }
                ]

                await saveFinalAssistantMessage(
                    mockSupabase as never,
                    baseChatId,
                    messages,
                    messageGroupId,
                    model
                )

                expect(mockSupabase.from().insert).toHaveBeenCalledWith(
                    expect.objectContaining({
                        content: ''
                    })
                )
            })
        })

        describe('Error handling', () => {
            it('should throw error when insert fails', async () => {
                const mockSupabase = createMockSupabase({
                    error: new Error('Database error')
                })
                const messages: Message[] = []

                await expect(
                    saveFinalAssistantMessage(
                        mockSupabase as never,
                        baseChatId,
                        messages,
                        messageGroupId,
                        model
                    )
                ).rejects.toThrow('Failed to save assistant message')
            })
        })

        describe('Tool deduplication', () => {
            it('should only keep the latest state for each tool call', async () => {
                const mockSupabase = createMockSupabase({ error: null })
                const messages: Message[] = [
                    {
                        role: 'assistant',
                        content: [
                            {
                                type: 'tool-invocation',
                                toolInvocation: {
                                    toolCallId: 'call-1',
                                    state: 'call',
                                    toolName: 'search',
                                    args: { query: 'test' }
                                }
                            },
                            {
                                type: 'tool-invocation',
                                toolInvocation: {
                                    toolCallId: 'call-1',
                                    state: 'result',
                                    toolName: 'search',
                                    result: { data: 'results' }
                                }
                            }
                        ]
                    }
                ]

                await saveFinalAssistantMessage(
                    mockSupabase as never,
                    baseChatId,
                    messages,
                    messageGroupId,
                    model
                )

                // Should only have one tool invocation with state 'result'
                const insertCall = mockSupabase.from().insert.mock.calls[0][0]
                const toolParts = insertCall.parts.filter(
                    (p: { type: string }) => p.type === 'tool-invocation'
                )
                expect(toolParts.length).toBe(1)
            })
        })
    })
})
