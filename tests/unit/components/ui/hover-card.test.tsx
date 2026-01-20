/**
 * Unit Tests: HoverCard Component
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card'

describe('HoverCard Component', () => {
    it('should render trigger', () => {
        render(
            <HoverCard>
                <HoverCardTrigger>Hover me</HoverCardTrigger>
                <HoverCardContent>Content</HoverCardContent>
            </HoverCard>
        )
        expect(screen.getByText('Hover me')).toBeInTheDocument()
    })

    it('should show content on hover', async () => {
        const user = userEvent.setup()
        render(
            <HoverCard>
                <HoverCardTrigger>Hover me</HoverCardTrigger>
                <HoverCardContent>
                    <p>Details</p>
                </HoverCardContent>
            </HoverCard>
        )

        expect(screen.queryByText('Details')).not.toBeInTheDocument()

        await user.hover(screen.getByText('Hover me'))

        // Radix HoverCard has a default delay. We might need to wait.
        await waitFor(() => {
            expect(screen.getByText('Details')).toBeInTheDocument()
        }, { timeout: 2000 })
    })
})
