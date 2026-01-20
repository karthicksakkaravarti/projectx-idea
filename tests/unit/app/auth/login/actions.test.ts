/**
 * Unit Tests: Login Actions
 * Tests for server actions related to authentication
 */

import { signOut } from '@/app/auth/login/actions'

// Mock variable for isSupabaseEnabled
let mockIsSupabaseEnabled = true

// Mock dependencies
jest.mock('@/components/ui/toast', () => ({
    toast: jest.fn(),
}))

jest.mock('@/lib/supabase/config', () => ({
    get isSupabaseEnabled() {
        return mockIsSupabaseEnabled
    },
}))

jest.mock('@/lib/supabase/server', () => ({
    createClient: jest.fn(),
}))

jest.mock('next/cache', () => ({
    revalidatePath: jest.fn(),
}))

jest.mock('next/navigation', () => ({
    redirect: jest.fn(() => {
        throw new Error('NEXT_REDIRECT')
    }),
}))

// Import mocks after mocking
import { toast } from '@/components/ui/toast'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const mockToast = toast as jest.MockedFunction<typeof toast>
const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>
const mockRevalidatePath = revalidatePath as jest.MockedFunction<typeof revalidatePath>
const mockRedirect = redirect as jest.MockedFunction<typeof redirect>

describe('Login Actions', () => {
    const mockSupabase = {
        auth: {
            signOut: jest.fn(),
        },
    }

    beforeEach(() => {
        jest.clearAllMocks()
        mockIsSupabaseEnabled = true
        mockCreateClient.mockResolvedValue(mockSupabase as any)
    })

    describe('signOut', () => {
        describe('when Supabase is enabled', () => {
            it('should call Supabase signOut', async () => {
                mockSupabase.auth.signOut.mockResolvedValue({} as any)

                try {
                    await signOut()
                } catch (error: any) {
                    expect(error.message).toBe('NEXT_REDIRECT')
                }

                expect(mockSupabase.auth.signOut).toHaveBeenCalled()
            })

            it('should revalidate root path', async () => {
                mockSupabase.auth.signOut.mockResolvedValue({} as any)

                try {
                    await signOut()
                } catch (error: any) {
                    expect(error.message).toBe('NEXT_REDIRECT')
                }

                expect(mockRevalidatePath).toHaveBeenCalledWith('/', 'layout')
            })

            it('should redirect to login page', async () => {
                mockSupabase.auth.signOut.mockResolvedValue({} as any)

                try {
                    await signOut()
                } catch (error: any) {
                    expect(error.message).toBe('NEXT_REDIRECT')
                }

                expect(mockRedirect).toHaveBeenCalledWith('/auth/login')
            })

            it('should not show toast when sign out succeeds', async () => {
                mockSupabase.auth.signOut.mockResolvedValue({} as any)

                try {
                    await signOut()
                } catch (error: any) {
                    expect(error.message).toBe('NEXT_REDIRECT')
                }

                expect(mockToast).not.toHaveBeenCalled()
            })

            it('should handle sign out errors gracefully', async () => {
                mockSupabase.auth.signOut.mockRejectedValue(new Error('Sign out failed'))

                await expect(signOut()).rejects.toThrow()
            })
        })

        describe('when Supabase is not enabled', () => {
            beforeEach(() => {
                mockIsSupabaseEnabled = false
            })

            it('should show info toast', async () => {
                await signOut()

                expect(mockToast).toHaveBeenCalledWith({
                    title: 'Sign out is not supported in this deployment',
                    status: 'info',
                })
            })

            it('should not call Supabase signOut', async () => {
                await signOut()

                expect(mockSupabase.auth.signOut).not.toHaveBeenCalled()
            })

            it('should not redirect', async () => {
                await signOut()

                expect(mockRedirect).not.toHaveBeenCalled()
            })

            it('should not revalidate path', async () => {
                await signOut()

                expect(mockRevalidatePath).not.toHaveBeenCalled()
            })
        })

        describe('when Supabase client is null', () => {
            beforeEach(() => {
                mockIsSupabaseEnabled = true
                mockCreateClient.mockResolvedValue(null as any)
            })

            it('should show info toast', async () => {
                await signOut()

                expect(mockToast).toHaveBeenCalledWith({
                    title: 'Sign out is not supported in this deployment',
                    status: 'info',
                })
            })

            it('should not call signOut', async () => {
                await signOut()

                expect(mockSupabase.auth.signOut).not.toHaveBeenCalled()
            })

            it('should not redirect', async () => {
                await signOut()

                expect(mockRedirect).not.toHaveBeenCalled()
            })
        })

        describe('error handling', () => {
            it('should handle createClient errors', async () => {
                mockCreateClient.mockRejectedValue(new Error('Client creation failed'))

                await expect(signOut()).rejects.toThrow('Client creation failed')
            })
        })
    })
})
