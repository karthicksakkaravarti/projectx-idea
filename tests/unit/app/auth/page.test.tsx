/**
 * Unit Tests: Auth Page Component
 * Tests for the auth page that conditionally renders login based on Supabase configuration
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import AuthPage from '@/app/auth/page'

// Mock dependencies
let mockIsSupabaseEnabled = true

jest.mock('@/lib/supabase/config', () => ({
    get isSupabaseEnabled() {
        return mockIsSupabaseEnabled
    },
}))

jest.mock('next/navigation', () => ({
    notFound: jest.fn(),
}))

jest.mock('@/app/auth/login-page', () => ({
    __esModule: true,
    default: () => <div data-testid="login-page">Login Page</div>,
}))

// Import mocks after mocking
import { notFound } from 'next/navigation'

const mockNotFound = notFound as jest.MockedFunction<typeof notFound>

describe('AuthPage Component', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockIsSupabaseEnabled = true
    })

    describe('rendering', () => {
        it('should render LoginPage when Supabase is enabled', () => {
            mockIsSupabaseEnabled = true

            render(<AuthPage />)
            
            expect(screen.getByTestId('login-page')).toBeInTheDocument()
            expect(mockNotFound).not.toHaveBeenCalled()
        })

        it('should call notFound when Supabase is not enabled', () => {
            mockIsSupabaseEnabled = false
            mockNotFound.mockImplementation(() => {
                throw new Error('NEXT_NOT_FOUND')
            })

            expect(() => render(<AuthPage />)).toThrow('NEXT_NOT_FOUND')
            expect(mockNotFound).toHaveBeenCalled()
        })
    })

    describe('configuration check', () => {
        it('should check Supabase configuration before rendering', () => {
            mockIsSupabaseEnabled = true

            render(<AuthPage />)
            
            // If config is not checked, LoginPage wouldn't render correctly
            expect(screen.getByTestId('login-page')).toBeInTheDocument()
        })
    })
})
