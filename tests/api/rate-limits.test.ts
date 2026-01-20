/**
 * API Tests: Rate Limits Logic
 */

import { checkDailyMessageLimit, checkProModelLimit } from '@/lib/usage'

jest.mock('@/lib/supabase/server', () => {
    const mockSupabaseChain = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockImplementation(function (this: any, col, val) {
            if (col === 'id') {
                this._userId = val
            }
            return this
        }),
        maybeSingle: jest.fn().mockImplementation(function (this: any) {
            const isGuest = this._userId === 'guest-user'
            return Promise.resolve({
                data: {
                    message_count: 5,
                    daily_message_count: 5,
                    daily_pro_message_count: 5,
                    daily_reset: new Date().toISOString(),
                    daily_pro_reset: new Date().toISOString(),
                    anonymous: isGuest,
                    premium: false,
                },
                error: null,
            })
        }),
    }

    return {
        createServerClient: jest.fn().mockReturnValue(mockSupabaseChain),
        createClient: jest.fn().mockResolvedValue(mockSupabaseChain),
    }
})

describe('Rate Limits Logic', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('checkDailyMessageLimit', () => {
        it('should return allowed=true when under limit', async () => {
            const result = await checkDailyMessageLimit('test-user', true)

            expect(result).toHaveProperty('allowed')
            expect(result).toHaveProperty('remaining')
            expect(result).toHaveProperty('limit')
            expect(result).toHaveProperty('resetTime')
            expect(result.allowed).toBe(true)
        })

        it('should have higher limit for authenticated users', async () => {
            const authResult = await checkDailyMessageLimit('auth-user', true)
            const guestResult = await checkDailyMessageLimit('guest-user', false)

            expect(authResult.limit).toBeGreaterThan(guestResult.limit)
        })
    })

    describe('checkProModelLimit', () => {
        it('should return allowed=true when under pro model limit', async () => {
            const result = await checkProModelLimit('test-user')

            expect(result).toHaveProperty('allowed')
            expect(result).toHaveProperty('remaining')
            expect(result).toHaveProperty('limit')
            expect(result).toHaveProperty('resetTime')
            expect(result.allowed).toBe(true)
        })

        it('should have a specific limit for pro models', async () => {
            const result = await checkProModelLimit('test-user')

            expect(result.limit).toBeGreaterThan(0)
            expect(typeof result.limit).toBe('number')
        })
    })
})
