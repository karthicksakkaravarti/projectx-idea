/**
 * Unit Tests: Dialog Component
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'

describe('Dialog Component', () => {
    it('should render trigger', () => {
        render(
            <Dialog>
                <DialogTrigger>Open Dialog</DialogTrigger>
                <DialogContent>Dialog Content</DialogContent>
            </Dialog>
        )
        expect(screen.getByRole('button', { name: 'Open Dialog' })).toBeInTheDocument()
    })

    it('should open dialog on trigger click', async () => {
        const user = userEvent.setup()
        render(
            <Dialog>
                <DialogTrigger>Open Dialog</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Dialog Title</DialogTitle>
                        <DialogDescription>Dialog Description</DialogDescription>
                    </DialogHeader>
                    <div>Main Content</div>
                </DialogContent>
            </Dialog>
        )

        expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: 'Open Dialog' }))

        expect(screen.getByRole('dialog')).toBeInTheDocument()
        expect(screen.getByText('Dialog Title')).toBeInTheDocument()
        expect(screen.getByText('Dialog Description')).toBeInTheDocument()
    })

    it('should close dialog when close button is clicked', async () => {
        const user = userEvent.setup()
        render(
            <Dialog>
                <DialogTrigger>Open Dialog</DialogTrigger>
                <DialogContent>
                    <DialogTitle>Title</DialogTitle>
                    <DialogClose>Close Me</DialogClose>
                </DialogContent>
            </Dialog>
        )

        await user.click(screen.getByRole('button', { name: 'Open Dialog' }))
        expect(screen.getByRole('dialog')).toBeInTheDocument()

        // Radix Dialog adds a close button by default if we don't suppress it, 
        // but our component adds one too if `hasCloseButton` is true (default).
        // Plus we added an explicit DialogClose button.
        await user.click(screen.getByRole('button', { name: 'Close Me' }))

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        })
    })

    it('should render footer content', async () => {
        const user = userEvent.setup()
        render(
            <Dialog>
                <DialogTrigger>Open</DialogTrigger>
                <DialogContent>
                    <DialogTitle>Title</DialogTitle>
                    <DialogFooter>
                        <button>Action</button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )

        await user.click(screen.getByRole('button', { name: 'Open' }))
        expect(screen.getByText('Action')).toBeInTheDocument()
    })
})
