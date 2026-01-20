/**
 * Unit Tests: Avatar Component
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

describe('Avatar Component', () => {
    it('should render fallback when no image provided', () => {
        render(
            <Avatar>
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        )
        expect(screen.getByText('CN')).toBeInTheDocument()
    })

    it('should render image when src is valid', () => {
        // Since we can't easily mock image loading in jsdom without extra setup,
        // we mainly check if the img element renders.
        // Radix Avatar renders the image if it successfully loads, otherwise fallback.
        // In JSDOM, image loading doesn't really happen unless mocked.
        // We will just assume if we render both, and the image component is there, it's correct structure.

        render(
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        )
        // Image tag should be present
        const img = screen.getByRole('img', { name: '@shadcn' })
        expect(img).toBeInTheDocument()
        expect(img).toHaveAttribute('src', 'https://github.com/shadcn.png')
    })

    it('should apply custom classes', () => {
        render(
            <Avatar className="h-20 w-20">
                <AvatarFallback>LG</AvatarFallback>
            </Avatar>
        )
        // The root element (Avatar) usually doesn't have a role, so we might need to find it by text's container parent?
        // Or we can add a data-testid or just check the container.
        // The Avatar component has `data-slot="avatar"`.

        // Let's use a container to find the element
        const fallback = screen.getByText('LG')
        // The Avatar is the parent of fallback
        const avatar = fallback.parentElement
        expect(avatar).toHaveClass('h-20')
        expect(avatar).toHaveClass('w-20')
    })

    it('should render with correct structure', () => {
        const { container } = render(
            <Avatar>
                <AvatarImage src="/avatar.png" alt="Avatar" />
                <AvatarFallback>AB</AvatarFallback>
            </Avatar>
        )

        // Expect root to be a span (radix default) with rounded-full
        const root = container.firstChild
        expect(root).toHaveClass('rounded-full')
        expect(root).toHaveClass('overflow-hidden')
    })
})
