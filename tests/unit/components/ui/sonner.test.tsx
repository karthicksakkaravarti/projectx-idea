/**
 * Unit Tests: Sonner Component
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { Toaster } from '@/components/ui/sonner'

// Mock next-themes
jest.mock('next-themes', () => ({
    useTheme: () => ({ theme: 'light' }),
}))

describe('Sonner Component', () => {
    it('should render toaster', () => {
        render(<Toaster />)
        // Sonner's Toaster renders an ordered list (ol)
        expect(screen.getByRole('list')).toBeInTheDocument()
    })
})
