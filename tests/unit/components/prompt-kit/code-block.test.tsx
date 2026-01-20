/**
 * Unit Tests: components/prompt-kit/code-block.tsx
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { CodeBlock, CodeBlockCode, CodeBlockGroup } from '@/components/prompt-kit/code-block'

// Mock next-themes
jest.mock('next-themes', () => ({
    useTheme: () => ({
        resolvedTheme: 'light',
        theme: 'light',
        setTheme: jest.fn()
    })
}))

// Mock shiki
jest.mock('shiki', () => ({
    codeToHtml: jest.fn().mockResolvedValue('<pre><code class="highlighted">const x = 1;</code></pre>')
}))

describe('CodeBlock Components', () => {
    describe('CodeBlock', () => {
        it('should render a container div', () => {
            render(<CodeBlock data-testid="code-block">Content</CodeBlock>)
            expect(screen.getByTestId('code-block')).toBeInTheDocument()
        })

        it('should render children', () => {
            render(<CodeBlock>Test Content</CodeBlock>)
            expect(screen.getByText('Test Content')).toBeInTheDocument()
        })

        it('should apply base styles', () => {
            render(<CodeBlock data-testid="code-block">Content</CodeBlock>)
            const block = screen.getByTestId('code-block')
            expect(block).toHaveClass('rounded-xl')
            expect(block).toHaveClass('border')
        })

        it('should merge custom className', () => {
            render(<CodeBlock className="custom-class" data-testid="code-block">Content</CodeBlock>)
            expect(screen.getByTestId('code-block')).toHaveClass('custom-class')
        })

        it('should pass through additional HTML props', () => {
            render(<CodeBlock data-custom="value" data-testid="code-block">Content</CodeBlock>)
            expect(screen.getByTestId('code-block')).toHaveAttribute('data-custom', 'value')
        })
    })

    describe('CodeBlockCode', () => {
        const testCode = 'const hello = "world";'

        it('should render code content', () => {
            render(<CodeBlockCode code={testCode} data-testid="code-block-code" />)
            // Initially shows plain code fallback
            expect(screen.getByText(testCode)).toBeInTheDocument()
        })

        it('should render plain code as fallback initially', () => {
            render(<CodeBlockCode code={testCode} />)
            expect(screen.getByText(testCode)).toBeInTheDocument()
        })

        it('should apply base styles', () => {
            render(<CodeBlockCode code={testCode} data-testid="code-block-code" />)
            const codeBlock = screen.getByTestId('code-block-code')
            expect(codeBlock).toHaveClass('w-full')
            expect(codeBlock).toHaveClass('overflow-x-auto')
        })

        it('should merge custom className', () => {
            render(
                <CodeBlockCode
                    code={testCode}
                    className="custom-class"
                    data-testid="code-block-code"
                />
            )
            expect(screen.getByTestId('code-block-code')).toHaveClass('custom-class')
        })

        it('should default to tsx language', async () => {
            const { codeToHtml } = require('shiki')
            render(<CodeBlockCode code={testCode} />)

            await waitFor(() => {
                expect(codeToHtml).toHaveBeenCalledWith(
                    testCode,
                    expect.objectContaining({
                        lang: 'tsx'
                    })
                )
            })
        })

        it('should use specified language', async () => {
            const { codeToHtml } = require('shiki')
            render(<CodeBlockCode code={testCode} language="python" />)

            await waitFor(() => {
                expect(codeToHtml).toHaveBeenCalledWith(
                    testCode,
                    expect.objectContaining({
                        lang: 'python'
                    })
                )
            })
        })

        it('should handle different languages', () => {
            const languages = ['javascript', 'typescript', 'python', 'rust', 'go']

            languages.forEach(lang => {
                const { unmount } = render(
                    <CodeBlockCode code="code" language={lang} data-testid={`code-${lang}`} />
                )
                expect(screen.getByTestId(`code-${lang}`)).toBeInTheDocument()
                unmount()
            })
        })

        it('should use light theme for light mode', async () => {
            const { codeToHtml } = require('shiki')
            render(<CodeBlockCode code={testCode} />)

            await waitFor(() => {
                expect(codeToHtml).toHaveBeenCalledWith(
                    testCode,
                    expect.objectContaining({
                        theme: 'github-light'
                    })
                )
            })
        })

        it('should render highlighted code after async load', async () => {
            render(<CodeBlockCode code={testCode} data-testid="code-block-code" />)

            await waitFor(() => {
                expect(screen.getByTestId('code-block-code').innerHTML).toContain('highlighted')
            })
        })
    })

    describe('CodeBlockGroup', () => {
        it('should render children', () => {
            render(
                <CodeBlockGroup>
                    <span>Language Label</span>
                    <button>Copy</button>
                </CodeBlockGroup>
            )
            expect(screen.getByText('Language Label')).toBeInTheDocument()
            expect(screen.getByText('Copy')).toBeInTheDocument()
        })

        it('should apply flex styles', () => {
            render(<CodeBlockGroup data-testid="group">Content</CodeBlockGroup>)
            const group = screen.getByTestId('group')
            expect(group).toHaveClass('flex')
            expect(group).toHaveClass('items-center')
            expect(group).toHaveClass('justify-between')
        })

        it('should merge custom className', () => {
            render(
                <CodeBlockGroup className="custom-class" data-testid="group">
                    Content
                </CodeBlockGroup>
            )
            expect(screen.getByTestId('group')).toHaveClass('custom-class')
        })

        it('should pass through HTML props', () => {
            render(
                <CodeBlockGroup data-testid="group" aria-label="Code header">
                    Content
                </CodeBlockGroup>
            )
            expect(screen.getByTestId('group')).toHaveAttribute('aria-label', 'Code header')
        })
    })

    describe('Full composition', () => {
        it('should render complete code block with header and code', () => {
            const code = 'console.log("Hello")'

            render(
                <CodeBlock data-testid="full-block">
                    <CodeBlockGroup>
                        <span>javascript</span>
                        <button>Copy</button>
                    </CodeBlockGroup>
                    <CodeBlockCode code={code} language="javascript" />
                </CodeBlock>
            )

            expect(screen.getByTestId('full-block')).toBeInTheDocument()
            expect(screen.getByText('javascript')).toBeInTheDocument()
            expect(screen.getByText('Copy')).toBeInTheDocument()
            expect(screen.getByText(code)).toBeInTheDocument()
        })
    })
})
