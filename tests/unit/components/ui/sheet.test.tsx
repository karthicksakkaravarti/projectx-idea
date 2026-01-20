/**
 * Unit Tests: Sheet Component
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'

describe('Sheet Component', () => {
    it('should render trigger', () => {
        render(
            <Sheet>
                <SheetTrigger>Open Sheet</SheetTrigger>
                <SheetContent>Content</SheetContent>
            </Sheet>
        )
        expect(screen.getByRole('button', { name: 'Open Sheet' })).toBeInTheDocument()
    })

    it('should open sheet on trigger click', async () => {
        const user = userEvent.setup()
        render(
            <Sheet>
                <SheetTrigger>Open Sheet</SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Sheet Title</SheetTitle>
                        <SheetDescription>Sheet Description</SheetDescription>
                    </SheetHeader>
                    <div>Sheet Body</div>
                    <SheetFooter>
                        <SheetClose>Close</SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        )

        expect(screen.queryByText('Sheet Title')).not.toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: 'Open Sheet' }))

        expect(screen.getByRole('dialog')).toBeInTheDocument()
        expect(screen.getByText('Sheet Title')).toBeInTheDocument()
    })
})
