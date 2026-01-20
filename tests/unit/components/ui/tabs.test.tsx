/**
 * Unit Tests: components/ui/tabs.tsx
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

describe('Tabs Components', () => {
    describe('Tabs Container', () => {
        it('should render tabs container', () => {
            render(
                <Tabs defaultValue="tab1" data-testid="tabs">
                    <TabsList>
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1">Content 1</TabsContent>
                </Tabs>
            )
            expect(screen.getByTestId('tabs')).toBeInTheDocument()
        })

        it('should show default tab content', () => {
            render(
                <Tabs defaultValue="tab1">
                    <TabsList>
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1">Content 1</TabsContent>
                    <TabsContent value="tab2">Content 2</TabsContent>
                </Tabs>
            )
            expect(screen.getByText('Content 1')).toBeInTheDocument()
            expect(screen.queryByText('Content 2')).not.toBeInTheDocument()
        })
    })

    describe('TabsList', () => {
        it('should render tab list', () => {
            render(
                <Tabs defaultValue="tab1">
                    <TabsList data-testid="tabs-list">
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1">Content</TabsContent>
                </Tabs>
            )
            expect(screen.getByTestId('tabs-list')).toBeInTheDocument()
        })

        it('should have tablist role', () => {
            render(
                <Tabs defaultValue="tab1">
                    <TabsList>
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1">Content</TabsContent>
                </Tabs>
            )
            expect(screen.getByRole('tablist')).toBeInTheDocument()
        })

        it('should apply custom className', () => {
            render(
                <Tabs defaultValue="tab1">
                    <TabsList className="custom-class" data-testid="tabs-list">
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1">Content</TabsContent>
                </Tabs>
            )
            expect(screen.getByTestId('tabs-list')).toHaveClass('custom-class')
        })
    })

    describe('TabsTrigger', () => {
        it('should render tab triggers', () => {
            render(
                <Tabs defaultValue="tab1">
                    <TabsList>
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1">Content 1</TabsContent>
                    <TabsContent value="tab2">Content 2</TabsContent>
                </Tabs>
            )
            expect(screen.getByText('Tab 1')).toBeInTheDocument()
            expect(screen.getByText('Tab 2')).toBeInTheDocument()
        })

        it('should have tab role', () => {
            render(
                <Tabs defaultValue="tab1">
                    <TabsList>
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1">Content</TabsContent>
                </Tabs>
            )
            expect(screen.getByRole('tab')).toBeInTheDocument()
        })

        it('should switch content when clicked', async () => {
            render(
                <Tabs defaultValue="tab1">
                    <TabsList>
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1">Content 1</TabsContent>
                    <TabsContent value="tab2">Content 2</TabsContent>
                </Tabs>
            )

            await userEvent.click(screen.getByText('Tab 2'))

            expect(screen.getByText('Content 2')).toBeInTheDocument()
            expect(screen.queryByText('Content 1')).not.toBeInTheDocument()
        })

        it('should mark active tab as selected', () => {
            render(
                <Tabs defaultValue="tab1">
                    <TabsList>
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1">Content 1</TabsContent>
                    <TabsContent value="tab2">Content 2</TabsContent>
                </Tabs>
            )

            const tabs = screen.getAllByRole('tab')
            expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
            expect(tabs[1]).toHaveAttribute('aria-selected', 'false')
        })

        it('should be disabled when disabled prop is true', () => {
            render(
                <Tabs defaultValue="tab1">
                    <TabsList>
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                        <TabsTrigger value="tab2" disabled>Tab 2</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1">Content 1</TabsContent>
                    <TabsContent value="tab2">Content 2</TabsContent>
                </Tabs>
            )

            expect(screen.getByText('Tab 2')).toBeDisabled()
        })
    })

    describe('TabsContent', () => {
        it('should render active tab content', () => {
            render(
                <Tabs defaultValue="tab1">
                    <TabsList>
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1">Active Content</TabsContent>
                </Tabs>
            )
            expect(screen.getByText('Active Content')).toBeInTheDocument()
        })

        it('should have tabpanel role', () => {
            render(
                <Tabs defaultValue="tab1">
                    <TabsList>
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1">Content</TabsContent>
                </Tabs>
            )
            expect(screen.getByRole('tabpanel')).toBeInTheDocument()
        })

        it('should apply custom className', () => {
            render(
                <Tabs defaultValue="tab1">
                    <TabsList>
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1" className="custom-class" data-testid="content">
                        Content
                    </TabsContent>
                </Tabs>
            )
            expect(screen.getByTestId('content')).toHaveClass('custom-class')
        })
    })

    describe('Controlled mode', () => {
        it('should work with value and onValueChange', async () => {
            const handleChange = jest.fn()
            render(
                <Tabs value="tab1" onValueChange={handleChange}>
                    <TabsList>
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1">Content 1</TabsContent>
                    <TabsContent value="tab2">Content 2</TabsContent>
                </Tabs>
            )

            await userEvent.click(screen.getByText('Tab 2'))

            expect(handleChange).toHaveBeenCalledWith('tab2')
        })
    })

    describe('Keyboard navigation', () => {
        it('should support arrow key navigation', async () => {
            render(
                <Tabs defaultValue="tab1">
                    <TabsList>
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1">Content 1</TabsContent>
                    <TabsContent value="tab2">Content 2</TabsContent>
                </Tabs>
            )

            const firstTab = screen.getByText('Tab 1')
            firstTab.focus()

            await userEvent.keyboard('{ArrowRight}')

            expect(screen.getByText('Tab 2')).toHaveFocus()
        })
    })
})
