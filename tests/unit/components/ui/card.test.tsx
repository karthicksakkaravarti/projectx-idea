/**
 * Unit Tests: components/ui/card.tsx
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
} from '@/components/ui/card'

describe('Card Components', () => {
    describe('Card', () => {
        it('should render a card container', () => {
            render(<Card data-testid="card">Card Content</Card>)
            expect(screen.getByTestId('card')).toBeInTheDocument()
        })

        it('should render children', () => {
            render(<Card>Test Content</Card>)
            expect(screen.getByText('Test Content')).toBeInTheDocument()
        })

        it('should apply base card styles', () => {
            render(<Card data-testid="card">Content</Card>)
            const card = screen.getByTestId('card')
            expect(card).toHaveClass('rounded-xl')
        })

        it('should merge custom className', () => {
            render(<Card className="custom-class" data-testid="card">Content</Card>)
            expect(screen.getByTestId('card')).toHaveClass('custom-class')
        })

        it('should have data-slot attribute', () => {
            render(<Card data-testid="card">Content</Card>)
            expect(screen.getByTestId('card')).toHaveAttribute('data-slot', 'card')
        })
    })

    describe('CardHeader', () => {
        it('should render card header', () => {
            render(<CardHeader data-testid="header">Header</CardHeader>)
            expect(screen.getByTestId('header')).toBeInTheDocument()
        })

        it('should have data-slot attribute', () => {
            render(<CardHeader data-testid="header">Header</CardHeader>)
            expect(screen.getByTestId('header')).toHaveAttribute('data-slot', 'card-header')
        })

        it('should apply padding styles', () => {
            render(<CardHeader data-testid="header">Header</CardHeader>)
            const header = screen.getByTestId('header')
            expect(header).toHaveClass('px-6')
        })
    })

    describe('CardTitle', () => {
        it('should render card title', () => {
            render(<CardTitle>Title Text</CardTitle>)
            expect(screen.getByText('Title Text')).toBeInTheDocument()
        })

        it('should have data-slot attribute', () => {
            render(<CardTitle data-testid="title">Title</CardTitle>)
            expect(screen.getByTestId('title')).toHaveAttribute('data-slot', 'card-title')
        })

        it('should apply typography styles', () => {
            render(<CardTitle data-testid="title">Title</CardTitle>)
            const title = screen.getByTestId('title')
            expect(title).toHaveClass('font-semibold')
        })
    })

    describe('CardDescription', () => {
        it('should render card description', () => {
            render(<CardDescription>Description text</CardDescription>)
            expect(screen.getByText('Description text')).toBeInTheDocument()
        })

        it('should have data-slot attribute', () => {
            render(<CardDescription data-testid="desc">Desc</CardDescription>)
            expect(screen.getByTestId('desc')).toHaveAttribute('data-slot', 'card-description')
        })

        it('should apply muted text styles', () => {
            render(<CardDescription data-testid="desc">Desc</CardDescription>)
            const desc = screen.getByTestId('desc')
            expect(desc).toHaveClass('text-muted-foreground')
        })
    })

    describe('CardContent', () => {
        it('should render card content', () => {
            render(<CardContent>Main content here</CardContent>)
            expect(screen.getByText('Main content here')).toBeInTheDocument()
        })

        it('should have data-slot attribute', () => {
            render(<CardContent data-testid="content">Content</CardContent>)
            expect(screen.getByTestId('content')).toHaveAttribute('data-slot', 'card-content')
        })

        it('should apply padding styles', () => {
            render(<CardContent data-testid="content">Content</CardContent>)
            const content = screen.getByTestId('content')
            expect(content).toHaveClass('px-6')
        })
    })

    describe('CardFooter', () => {
        it('should render card footer', () => {
            render(<CardFooter>Footer content</CardFooter>)
            expect(screen.getByText('Footer content')).toBeInTheDocument()
        })

        it('should have data-slot attribute', () => {
            render(<CardFooter data-testid="footer">Footer</CardFooter>)
            expect(screen.getByTestId('footer')).toHaveAttribute('data-slot', 'card-footer')
        })

        it('should apply flex styles', () => {
            render(<CardFooter data-testid="footer">Footer</CardFooter>)
            const footer = screen.getByTestId('footer')
            expect(footer).toHaveClass('flex')
        })
    })

    describe('Full Card composition', () => {
        it('should render complete card structure', () => {
            render(
                <Card data-testid="card">
                    <CardHeader>
                        <CardTitle>Card Title</CardTitle>
                        <CardDescription>Card description</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Card content goes here</p>
                    </CardContent>
                    <CardFooter>
                        <button>Action</button>
                    </CardFooter>
                </Card>
            )

            expect(screen.getByText('Card Title')).toBeInTheDocument()
            expect(screen.getByText('Card description')).toBeInTheDocument()
            expect(screen.getByText('Card content goes here')).toBeInTheDocument()
            expect(screen.getByText('Action')).toBeInTheDocument()
        })

        it('should maintain proper hierarchy', () => {
            render(
                <Card data-testid="card">
                    <CardHeader data-testid="header">
                        <CardTitle data-testid="title">Title</CardTitle>
                    </CardHeader>
                </Card>
            )

            const card = screen.getByTestId('card')
            const header = screen.getByTestId('header')
            const title = screen.getByTestId('title')

            expect(card).toContainElement(header)
            expect(header).toContainElement(title)
        })
    })
})
