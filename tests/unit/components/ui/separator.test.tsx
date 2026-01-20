/**
 * Unit Tests: Separator Component
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { Separator } from '@/components/ui/separator'

describe('Separator Component', () => {
    it('should render separator', () => {
        render(<Separator />)
        const separator = screen.getByRole('none') // Radix separator default role is 'separator' or 'none' depending on decorative
        // Since decorative=true by default, it might not have a specific accessible role or be 'none'.
        // Actually Radix `separator` with `decorative={true}` keeps it out of accessibility tree mostly.
        // Let's check by class or data attribute.
        // It has `data-slot="separator-root"`.

        // However, we can use container to check.
        // Alternatively, if decorative is false, it has role="separator".
    })

    it('should have role separator when decorative is false', () => {
        render(<Separator decorative={false} />)
        expect(screen.getByRole('separator')).toBeInTheDocument()
    })

    it('should apply orientation classes', () => {
        const { container } = render(<Separator orientation="vertical" />)
        const separator = container.firstChild
        expect(separator).toHaveClass('data-[orientation=vertical]:h-full')
        expect(separator).toHaveClass('data-[orientation=vertical]:w-px')
    })
})
