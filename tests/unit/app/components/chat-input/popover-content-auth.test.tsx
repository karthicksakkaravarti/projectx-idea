/**
 * Unit Tests: PopoverContentAuth Component
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PopoverContentAuth } from '@/app/components/chat-input/popover-content-auth'
import { signInWithGoogle } from '@/lib/api'
import { createClient } from '@/lib/supabase/client'

// Mock dependencies
const mockSignInWithGoogle = jest.fn()

jest.mock('@/lib/supabase/config', () => ({
    isSupabaseEnabled: true,
}))

jest.mock('@/lib/supabase/client', () => ({
    createClient: () => ({
        auth: {
            signInWithOAuth: jest.fn(),
        },
    }),
}))

jest.mock('@/lib/api', () => ({
    signInWithGoogle: (supabase: any) => mockSignInWithGoogle(supabase),
}))

jest.mock('@/components/ui/button', () => ({
    Button: ({ children, onClick, disabled }: any) => (
        <button onClick={onClick} disabled={disabled}>{children}</button>
    ),
}))

jest.mock('@/components/ui/popover', () => ({
    PopoverContent: ({ children, className }: any) => (
        <div data-testid="popover-content" className={className}>{children}</div>
    ),
}))

describe('PopoverContentAuth Component', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockSignInWithGoogle.mockResolvedValue({ url: 'https://auth.google.com' })
    })

    it('should render correctly', () => {
        render(<PopoverContentAuth />)
        expect(screen.getByText(/Login to try more features for free/i)).toBeInTheDocument()
        expect(screen.getByText(/Continue with Google/i)).toBeInTheDocument()
    })

    it('should call signInWithGoogle when button is clicked', async () => {
        render(<PopoverContentAuth />)
        fireEvent.click(screen.getByText('Continue with Google'))

        expect(screen.getByText('Connecting...')).toBeInTheDocument()
        expect(mockSignInWithGoogle).toHaveBeenCalled()
    })

    it('should display error message on sign-in failure', async () => {
        mockSignInWithGoogle.mockRejectedValue(new Error('Sign-in failed'))

        render(<PopoverContentAuth />)
        fireEvent.click(screen.getByText('Continue with Google'))

        await waitFor(() => {
            expect(screen.getByText('Sign-in failed')).toBeInTheDocument()
        })
    })
})
