import { render, screen, fireEvent, waitFor, within } from "@testing-library/react"
import { DrawerHistory } from "@/app/components/history/drawer-history"
import { useChats } from "@/lib/chat-store/chats/provider"
import { useParams } from "next/navigation"

jest.mock("@/lib/chat-store/persist", () => ({
    ensureDbReady: jest.fn(),
    readFromIndexedDB: jest.fn(),
    writeToIndexedDB: jest.fn(),
    deleteFromIndexedDB: jest.fn(),
    clearAllIndexedDBStores: jest.fn(),
}))

jest.mock("@/components/ui/tooltip", () => ({
    Tooltip: ({ children }: any) => <>{children}</>,
    TooltipTrigger: ({ children }: any) => <>{children}</>,
    TooltipContent: ({ children }: any) => <div data-testid="tooltip-content">{children}</div>,
    TooltipProvider: ({ children }: any) => <>{children}</>,
}))

jest.mock("@/lib/chat-store/chats/provider")
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
    usePathname: jest.fn(),
    useSearchParams: jest.fn(),
    useParams: jest.fn(),
}))

// Mocking Drawer component
jest.mock("@/components/ui/drawer", () => ({
    Drawer: ({ children, open }: any) => (open ? <div data-testid="drawer">{children}</div> : null),
    DrawerContent: ({ children }: any) => <div data-testid="drawer-content">{children}</div>,
    DrawerTrigger: ({ children }: any) => <div>{children}</div>,
}))

describe("DrawerHistory", () => {
    const mockOnSaveEdit = jest.fn()
    const mockOnConfirmDelete = jest.fn()
    const mockTogglePinned = jest.fn()
    const mockSetIsOpen = jest.fn()

    const mockChats = [
        { id: "1", title: "Chat 1", updated_at: new Date().toISOString() },
        { id: "2", title: "Chat 2", updated_at: new Date().toISOString() },
    ] as any

    beforeEach(() => {
        jest.clearAllMocks()
            ; (useChats as jest.Mock).mockReturnValue({
                pinnedChats: [],
                togglePinned: mockTogglePinned,
            })
            ; (useParams as jest.Mock).mockReturnValue({ chatId: "current" })
    })

    it("should render chat items when open", () => {
        render(
            <DrawerHistory
                chatHistory={mockChats}
                onSaveEdit={mockOnSaveEdit}
                onConfirmDelete={mockOnConfirmDelete}
                trigger={<button>Trigger</button>}
                isOpen={true}
                setIsOpen={mockSetIsOpen}
            />
        )

        expect(screen.getByText("Chat 1")).toBeInTheDocument()
        expect(screen.getByText("Chat 2")).toBeInTheDocument()
    })

    it("should filter chats based on search query", () => {
        render(
            <DrawerHistory
                chatHistory={mockChats}
                onSaveEdit={mockOnSaveEdit}
                onConfirmDelete={mockOnConfirmDelete}
                trigger={<button>Trigger</button>}
                isOpen={true}
                setIsOpen={mockSetIsOpen}
            />
        )

        const input = screen.getByPlaceholderText("Search...")
        fireEvent.change(input, { target: { value: "Chat 1" } })

        expect(screen.getByText("Chat 1")).toBeInTheDocument()
        expect(screen.queryByText("Chat 2")).not.toBeInTheDocument()
    })

    it("should enter edit mode and save changes", async () => {
        render(
            <DrawerHistory
                chatHistory={mockChats}
                onSaveEdit={mockOnSaveEdit}
                onConfirmDelete={mockOnConfirmDelete}
                trigger={<button>Trigger</button>}
                isOpen={true}
                setIsOpen={mockSetIsOpen}
            />
        )

        const chat1Text = screen.getByText("Chat 1")
        const itemContainer = chat1Text.closest(".group")!
        const editButton = within(itemContainer).getByLabelText("Edit")
        fireEvent.click(editButton)

        const input = await screen.findByDisplayValue("Chat 1")
        fireEvent.change(input, { target: { value: "New Title" } })

        const confirmButton = screen.getByLabelText("Confirm")
        fireEvent.click(confirmButton)

        await waitFor(() => {
            expect(mockOnSaveEdit).toHaveBeenCalledWith("1", "New Title")
        })
    })

    it("should enter delete mode and confirm", async () => {
        render(
            <DrawerHistory
                chatHistory={mockChats}
                onSaveEdit={mockOnSaveEdit}
                onConfirmDelete={mockOnConfirmDelete}
                trigger={<button>Trigger</button>}
                isOpen={true}
                setIsOpen={mockSetIsOpen}
            />
        )

        const chat1Text = screen.getByText("Chat 1")
        const itemContainer = chat1Text.closest(".group")!
        const deleteButton = within(itemContainer).getByLabelText("Delete")
        fireEvent.click(deleteButton)

        const confirmDeleteButton = await screen.findByLabelText("Confirm delete")
        fireEvent.click(confirmDeleteButton)

        await waitFor(() => {
            expect(mockOnConfirmDelete).toHaveBeenCalledWith("1")
        })
    })

    it("should toggle pin status", () => {
        render(
            <DrawerHistory
                chatHistory={mockChats}
                onSaveEdit={mockOnSaveEdit}
                onConfirmDelete={mockOnConfirmDelete}
                trigger={<button>Trigger</button>}
                isOpen={true}
                setIsOpen={mockSetIsOpen}
            />
        )

        const chat1Text = screen.getByText("Chat 1")
        const itemContainer = chat1Text.closest(".group")!
        const pinButton = within(itemContainer).getByLabelText("Pin")
        fireEvent.click(pinButton)

        expect(mockTogglePinned).toHaveBeenCalledWith("1", true)
    })
})
