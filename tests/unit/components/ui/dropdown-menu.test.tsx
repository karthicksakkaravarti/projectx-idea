/**
 * Unit Tests: DropdownMenu Component
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

describe('DropdownMenu Component', () => {
    it('should open menu on trigger click', async () => {
        const user = userEvent.setup()
        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )

        expect(screen.queryByText('My Account')).not.toBeInTheDocument()

        await user.click(screen.getByText('Open Menu'))

        expect(screen.getByRole('menu')).toBeInTheDocument()
        expect(screen.getByText('My Account')).toBeInTheDocument()
        expect(screen.getByText('Profile')).toBeInTheDocument()
    })

    it('should handle interactions on items', async () => {
        const user = userEvent.setup()
        const handleSelect = jest.fn()

        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onSelect={handleSelect}>Click Me</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )

        await user.click(screen.getByText('Open Menu'))
        await user.click(screen.getByText('Click Me'))

        expect(handleSelect).toHaveBeenCalledTimes(1)
    })

    it('should render checkbox items', async () => {
        const user = userEvent.setup()

        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuCheckboxItem checked>Checked Item</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={false}>Unchecked Item</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )

        await user.click(screen.getByText('Open Menu'))

        const checkedItem = screen.getByRole('menuitemcheckbox', { name: 'Checked Item' })
        const uncheckedItem = screen.getByRole('menuitemcheckbox', { name: 'Unchecked Item' })

        expect(checkedItem).toHaveAttribute('aria-checked', 'true')
        expect(uncheckedItem).toHaveAttribute('aria-checked', 'false')
    })

    it('should render radio items', async () => {
        const user = userEvent.setup()

        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuRadioGroup value="top">
                        <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        )

        await user.click(screen.getByText('Open Menu'))

        const topItem = screen.getByRole('menuitemradio', { name: 'Top' })
        const bottomItem = screen.getByRole('menuitemradio', { name: 'Bottom' })

        expect(topItem).toHaveAttribute('aria-checked', 'true')
        expect(bottomItem).toHaveAttribute('aria-checked', 'false')
    })
})
