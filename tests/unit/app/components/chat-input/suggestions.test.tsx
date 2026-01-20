import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { Suggestions } from "@/app/components/chat-input/suggestions"

// Mock motion
jest.mock("motion/react", () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        create: (comp: any) => comp,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Mock components
jest.mock("@/components/prompt-kit/prompt-suggestion", () => ({
    PromptSuggestion: ({ children, onClick }: any) => (
        <button onClick={onClick} data-testid="suggestion">
            {children}
        </button>
    ),
}))

// Mock config
jest.mock("@/lib/config", () => ({
    SUGGESTIONS: [
        {
            label: "Category 1",
            prompt: "Prompt 1",
            icon: ({ className }: any) => <div className={className} data-testid="icon-1" />,
            items: ["Item 1a", "Item 1b"],
            highlight: true,
        },
        {
            label: "Category 2",
            prompt: "Prompt 2",
            icon: ({ className }: any) => <div className={className} data-testid="icon-2" />,
            items: ["Item 2a"],
        },
    ],
}))

describe("Suggestions", () => {
    const mockOnSuggestion = jest.fn()

    const TestWrapper = ({ initialValue = "" }) => {
        const [value, setValue] = React.useState(initialValue)
        return (
            <Suggestions
                onValueChange={setValue}
                onSuggestion={mockOnSuggestion}
                value={value}
            />
        )
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("renders suggestions grid initially", () => {
        render(<TestWrapper />)
        expect(screen.getByText("Category 1")).toBeInTheDocument()
        expect(screen.getByText("Category 2")).toBeInTheDocument()
    })

    it("switches to items list when a category is clicked", async () => {
        render(<TestWrapper />)

        fireEvent.click(screen.getByText("Category 1"))

        expect(await screen.findByText("Item 1a")).toBeInTheDocument()
        expect(screen.getByText("Item 1b")).toBeInTheDocument()
    })

    it("calls onSuggestion and resets when an item is clicked", async () => {
        render(<TestWrapper />)

        // Trigger category switch
        fireEvent.click(screen.getByText("Category 1"))

        const item = await screen.findByText("Item 1a")
        fireEvent.click(item)

        expect(mockOnSuggestion).toHaveBeenCalledWith("Item 1a")
        expect(screen.queryByText("Item 1a")).not.toBeInTheDocument()
        expect(screen.getByText("Category 1")).toBeInTheDocument()
    })

    it("resets category when value is cleared externally", async () => {
        const { rerender } = render(<TestWrapper initialValue="Prompt 1" />)

        // Wait for first render to settle
        expect(screen.getByText("Category 1")).toBeInTheDocument()

        // Click category
        fireEvent.click(screen.getByText("Category 1"))
        expect(await screen.findByText("Item 1a")).toBeInTheDocument()

        // Re-render with empty value
        rerender(
            <Suggestions
                onValueChange={jest.fn()}
                onSuggestion={mockOnSuggestion}
                value=""
            />
        )

        expect(screen.getByText("Category 1")).toBeInTheDocument()
        expect(screen.queryByText("Item 1a")).not.toBeInTheDocument()
    })
})
