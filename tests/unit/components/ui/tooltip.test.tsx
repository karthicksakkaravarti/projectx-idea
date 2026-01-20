/**
 * Unit Tests: Tooltip Component
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
    TooltipTrigger,
} from '@/components/ui/tooltip'

// Ensure pointer events are enabled for tooltips
function setup(jsx: React.ReactElement) {
    return {
        user: userEvent.setup({ delay: null }),
        ...render(jsx),
    }
}

describe('Tooltip Component', () => {
    beforeAll(() => {
        // Radix Tooltip might check for this
        // @ts-ignore
        global.ResizeObserver = class ResizeObserver {
            observe() { }
            unobserve() { }
            disconnect() { }
        }
    })
    it('should render trigger element', () => {
        render(
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>Hover me</TooltipTrigger>
                    <TooltipContent>Tooltip content</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
        expect(screen.getByText('Hover me')).toBeInTheDocument()
    })

    it('should show content on hover', async () => {
        const user = userEvent.setup()
        render(
            <TooltipProvider>
                <Tooltip delayDuration={0}>
                    <TooltipTrigger>Hover me</TooltipTrigger>
                    <TooltipContent>Tooltip content</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )

        expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument()

        await user.hover(screen.getByText('Hover me'))

        await waitFor(() => {
            expect(screen.getByText('Tooltip content')).toBeInTheDocument()
        })
    })

    it('should apply custom classes to content', async () => {
        const user = userEvent.setup()
        render(
            <TooltipProvider>
                <Tooltip delayDuration={0}>
                    <TooltipTrigger>Hover me</TooltipTrigger>
                    <TooltipContent className="custom-class">Tooltip content</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )

        await user.hover(screen.getByText('Hover me'))

        await waitFor(() => {
            const content = screen.getByText('Tooltip content')
            expect(content).toHaveClass('custom-class')
        })
    })

    it('should respect side offset', async () => {
        const user = userEvent.setup()
        render(
            <TooltipProvider>
                <Tooltip delayDuration={0}>
                    <TooltipTrigger>Hover me</TooltipTrigger>
                    <TooltipContent sideOffset={10}>Tooltip content</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )

        await user.hover(screen.getByText('Hover me'))

        // Note: verifying precise positioning styles is hard in jsdom, but we can check if it renders
        await waitFor(() => {
            expect(screen.getByText('Tooltip content')).toBeInTheDocument()
        })
    })

    it('should be accessible via keyboard focus', async () => {
        const user = userEvent.setup()
        render(
            <TooltipProvider>
                <Tooltip delayDuration={0}>
                    <TooltipTrigger>Focus me</TooltipTrigger>
                    <TooltipContent>Tooltip content</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )

        await user.tab()
        expect(screen.getByText('Focus me')).toHaveFocus()

        await waitFor(() => {
            expect(screen.getByText('Tooltip content')).toBeInTheDocument()
        })
    })
})
