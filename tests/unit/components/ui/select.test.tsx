/**
 * Unit Tests: Select Component
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

describe('Select Component', () => {
    beforeAll(() => {
        // Radix primitives sometimes set pointer-events: none on body
        document.body.style.pointerEvents = 'auto'
    })
    it('should render trigger with placeholder', () => {
        render(
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="apple">Apple</SelectItem>
                </SelectContent>
            </Select>
        )
        expect(screen.getByText('Select a fruit')).toBeInTheDocument()
        expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('should open content on click and allow selection', async () => {
        const user = userEvent.setup()
        render(
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Fruits</SelectLabel>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        )

        const trigger = screen.getByRole('combobox')
        await user.click(trigger)

        expect(screen.getByRole('listbox')).toBeInTheDocument()
        expect(screen.getByText('Fruits')).toBeInTheDocument()

        const appleItem = screen.getByRole('option', { name: 'Apple' })
        await user.click(appleItem)

        // After selection, the trigger should show the selected value
        expect(screen.getByText('Apple')).toBeInTheDocument()
        // And the listbox should be closed (or closing)
        await waitFor(() => {
            expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
        })
    })

    it('should handle disabled state', () => {
        render(
            <Select disabled>
                <SelectTrigger>
                    <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                </SelectContent>
            </Select>
        )
        expect(screen.getByRole('combobox')).toBeDisabled()
    })
})
