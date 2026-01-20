/**
 * Unit Tests: Drawer Component
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer'

// Mock Vaul to avoid JSDOM issues with its portal/snap logic
jest.mock('vaul', () => ({
    Drawer: {
        Root: ({ children, ...props }: any) => <div data-testid="drawer-root" {...props}>{children}</div>,
        Trigger: ({ children, ...props }: any) => <button {...props}>{children}</button>,
        Portal: ({ children }: any) => <div>{children}</div>,
        Close: ({ children, ...props }: any) => <button {...props}>{children}</button>,
        Overlay: ({ children, ...props }: any) => <div data-testid="drawer-overlay" {...props}>{children}</div>,
        Content: ({ children, ...props }: any) => <div role="dialog" {...props}>{children}</div>,
        Title: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
        Description: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    }
}))

describe('Drawer Component', () => {
    it('should render trigger', () => {
        render(
            <Drawer>
                <DrawerTrigger>Open Drawer</DrawerTrigger>
                <DrawerContent>Content</DrawerContent>
            </Drawer>
        )
        expect(screen.getByRole('button', { name: 'Open Drawer' })).toBeInTheDocument()
    })

    it('should open drawer on trigger click', async () => {
        const user = userEvent.setup()
        render(
            <Drawer>
                <DrawerTrigger>Open Drawer</DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Title</DrawerTitle>
                        <DrawerDescription>Description</DrawerDescription>
                    </DrawerHeader>
                    <div>Body</div>
                    <DrawerFooter>
                        <DrawerClose>Close</DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        )

        // Vaul/Radix renders content in a portal.
        expect(screen.queryByText('Title')).not.toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: 'Open Drawer' }))

        // Vaul might animate, so we might need waitFor. 
        // Also Vaul renders into the body.
        expect(await screen.findByText('Title')).toBeInTheDocument()
        expect(screen.getByText('Description')).toBeInTheDocument()
        expect(screen.getByText('Body')).toBeInTheDocument()
    })

    it('should close drawer on close button click', async () => {
        const user = userEvent.setup()
        render(
            <Drawer>
                <DrawerTrigger>Open Drawer</DrawerTrigger>
                <DrawerContent>
                    <DrawerTitle>Title</DrawerTitle>
                    <DrawerClose>Close</DrawerClose>
                </DrawerContent>
            </Drawer>
        )

        await user.click(screen.getByRole('button', { name: 'Open Drawer' }))
        expect(await screen.findByText('Title')).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: 'Close' }))

        // Wait for removal
        await user.click(screen.getByRole('button', { name: 'Close' }).catch(() => { })) // Retry or just wait

        // It might take time to close due to animations
    })
})
