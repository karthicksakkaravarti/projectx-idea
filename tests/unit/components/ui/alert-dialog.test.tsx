/**
 * Unit Tests: AlertDialog Component
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

describe('AlertDialog Component', () => {
    it('should render trigger', () => {
        render(
            <AlertDialog>
                <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )

        expect(screen.getByRole('button', { name: 'Open Dialog' })).toBeInTheDocument()
    })

    it('should open dialog when trigger is clicked', async () => {
        const user = userEvent.setup()
        render(
            <AlertDialog>
                <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )

        await user.click(screen.getByRole('button', { name: 'Open Dialog' }))

        expect(screen.getByRole('alertdialog')).toBeInTheDocument()
        expect(screen.getByText('Are you sure?')).toBeInTheDocument()
        expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument()
    })

    it('should close dialog when cancel is clicked', async () => {
        const user = userEvent.setup()
        render(
            <AlertDialog>
                <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )

        await user.click(screen.getByRole('button', { name: 'Open Dialog' }))
        expect(screen.getByRole('alertdialog')).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: 'Cancel' }))

        // Wait for animation or removal
        expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    })

    it('should execute action when action button is clicked', async () => {
        const user = userEvent.setup()
        const handleAction = jest.fn()

        render(
            <AlertDialog>
                <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleAction}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )

        await user.click(screen.getByRole('button', { name: 'Open Dialog' }))
        await user.click(screen.getByRole('button', { name: 'Continue' }))

        expect(handleAction).toHaveBeenCalledTimes(1)
    })
})
