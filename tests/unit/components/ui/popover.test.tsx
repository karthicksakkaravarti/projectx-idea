/**
 * Unit Tests: Popover Component
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

describe('Popover Component', () => {
    it('should render trigger', () => {
        render(
            <Popover>
                <PopoverTrigger>Open Popover</PopoverTrigger>
                <PopoverContent>Popover Content</PopoverContent>
            </Popover>
        )
        expect(screen.getByRole('button', { name: 'Open Popover' })).toBeInTheDocument()
    })

    it('should open popover content on click', async () => {
        const user = userEvent.setup()
        render(
            <Popover>
                <PopoverTrigger>Open Popover</PopoverTrigger>
                <PopoverContent>
                    <p>My Content</p>
                </PopoverContent>
            </Popover>
        )

        expect(screen.queryByText('My Content')).not.toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: 'Open Popover' }))

        expect(screen.getByText('My Content')).toBeInTheDocument()
    })

    it('should close on outside click (implicit radix behavior)', async () => {
        const user = userEvent.setup()
        render(
            <div>
                <button>Outside</button>
                <Popover>
                    <PopoverTrigger>Open</PopoverTrigger>
                    <PopoverContent>Content</PopoverContent>
                </Popover>
            </div>
        )

        await user.click(screen.getByRole('button', { name: 'Open' }))
        expect(screen.getByText('Content')).toBeInTheDocument()

        await user.click(screen.getByText('Outside'))

        // Waiting for animation/state update
        await waitFor(() => {
            expect(screen.queryByText('Content')).not.toBeInTheDocument()
        })
    })
})
