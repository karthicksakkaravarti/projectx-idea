/**
 * Unit Tests: Toast Component
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { toast } from '@/components/ui/toast'
import { Toaster } from '@/components/ui/sonner'

// Mock sonner properties if needed, but since we are testing the `toast` function
// and our `Toast` component is internal, we can check if calling toast triggers something.
// However, validating that `sonnerToast.custom` was called with the right component is better.

jest.mock('sonner', () => ({
    toast: {
        custom: jest.fn(),
        dismiss: jest.fn(),
    },
    Toaster: (props: any) => <div data-testid="toaster" {...props} />,
}))

import { toast as sonnerToast } from 'sonner'

describe('Toast Helper', () => {
    it('should call sonner.custom when toast is called', () => {
        toast({
            title: 'Test Toast',
            description: 'Test Description',
            status: 'success',
        })

        expect(sonnerToast.custom).toHaveBeenCalled()
    })
})
