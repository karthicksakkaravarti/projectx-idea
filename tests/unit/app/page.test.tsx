/**
 * Unit Tests: Home Page
 */

import React from 'react'
import { render } from '@testing-library/react'
import Home from '@/app/page'

// Mock the child components
jest.mock('@/app/components/chat/chat-container', () => ({
    ChatContainer: () => <div data-testid="chat-container">Chat Container</div>,
}))

jest.mock('@/app/components/layout/layout-app', () => ({
    LayoutApp: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="layout-app">{children}</div>
    ),
}))

jest.mock('@/lib/chat-store/messages/provider', () => ({
    MessagesProvider: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="messages-provider">{children}</div>
    ),
}))

describe('Home Page', () => {
    it('should render without crashing', () => {
        const { container } = render(<Home />)
        expect(container).toBeInTheDocument()
    })

    it('should render MessagesProvider', () => {
        const { getByTestId } = render(<Home />)
        expect(getByTestId('messages-provider')).toBeInTheDocument()
    })

    it('should render LayoutApp', () => {
        const { getByTestId } = render(<Home />)
        expect(getByTestId('layout-app')).toBeInTheDocument()
    })

    it('should render ChatContainer', () => {
        const { getByTestId } = render(<Home />)
        expect(getByTestId('chat-container')).toBeInTheDocument()
    })

    it('should have correct component hierarchy', () => {
        const { getByTestId } = render(<Home />)
        const messagesProvider = getByTestId('messages-provider')
        const layoutApp = getByTestId('layout-app')
        const chatContainer = getByTestId('chat-container')

        expect(messagesProvider).toContainElement(layoutApp)
        expect(layoutApp).toContainElement(chatContainer)
    })
})
