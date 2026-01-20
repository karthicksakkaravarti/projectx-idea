/**
 * Unit Tests: Sidebar Component
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar'

// Mock use-mobile hook
jest.mock('@/app/hooks/use-mobile', () => ({
    useIsMobile: () => false,
}))

describe('Sidebar Component', () => {
    it('should render sidebar structure', () => {
        render(
            <SidebarProvider>
                <Sidebar>
                    <SidebarHeader>Header</SidebarHeader>
                    <SidebarContent>Content</SidebarContent>
                    <SidebarFooter>Footer</SidebarFooter>
                </Sidebar>
            </SidebarProvider>
        )

        expect(screen.getByText('Header')).toBeInTheDocument()
        expect(screen.getByText('Content')).toBeInTheDocument()
        expect(screen.getByText('Footer')).toBeInTheDocument()
    })

    it('should render sidebar trigger', () => {
        render(
            <SidebarProvider>
                <SidebarTrigger />
            </SidebarProvider>
        )
        expect(screen.getByRole('button', { name: 'Toggle Sidebar' })).toBeInTheDocument()
    })
})
