import { render, screen, fireEvent } from "@testing-library/react"
import { HistoryTrigger } from "@/app/components/history/history-trigger"
import { useBreakpoint } from "@/app/hooks/use-breakpoint"
import { useChats } from "@/lib/chat-store/chats/provider"
import { useChatSession } from "@/lib/chat-store/session/provider"
import { useRouter } from "next/navigation"

jest.mock("@/app/hooks/use-breakpoint")
jest.mock("@/lib/chat-store/chats/provider")
jest.mock("@/lib/chat-store/messages/provider", () => ({
    useMessages: () => ({ deleteMessages: jest.fn() }),
}))
jest.mock("@/lib/chat-store/session/provider")
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
    usePathname: jest.fn(),
    useSearchParams: jest.fn(),
    useParams: jest.fn(),
}))
jest.mock("@/lib/chat-store/persist", () => ({
    ensureDbReady: jest.fn(),
    readFromIndexedDB: jest.fn(),
    writeToIndexedDB: jest.fn(),
    deleteFromIndexedDB: jest.fn(),
    clearAllIndexedDBStores: jest.fn(),
}))
jest.mock("@/app/components/history/command-history", () => ({
    CommandHistory: ({ trigger, isOpen, setIsOpen }: any) => (
        <>
            {trigger}
            {isOpen && (
                <div data-testid="command-history">
                    Command History <button onClick={() => setIsOpen(false)}>Close</button>
                </div>
            )}
        </>
    ),
}))
jest.mock("@/app/components/history/drawer-history", () => ({
    DrawerHistory: ({ trigger, isOpen, setIsOpen }: any) => (
        <>
            {trigger}
            {isOpen && (
                <div data-testid="drawer-history">
                    Drawer History <button onClick={() => setIsOpen(false)}>Close</button>
                </div>
            )}
        </>
    ),
}))

describe("HistoryTrigger", () => {
    const mockUpdateTitle = jest.fn()
    const mockDeleteChat = jest.fn()
    const mockRouter = { push: jest.fn() }

    beforeEach(() => {
        jest.clearAllMocks()
            ; (useRouter as jest.Mock).mockReturnValue(mockRouter)
            ; (useChats as jest.Mock).mockReturnValue({
                chats: [],
                updateTitle: mockUpdateTitle,
                deleteChat: mockDeleteChat,
            })
            ; (useChatSession as jest.Mock).mockReturnValue({ chatId: "current-chat" })
    })

    it("should render desktop version by default", () => {
        ; (useBreakpoint as jest.Mock).mockReturnValue(false)
        render(<HistoryTrigger hasSidebar={false} />)

        const trigger = screen.getByLabelText("Search")
        fireEvent.click(trigger)

        expect(screen.getByTestId("command-history")).toBeInTheDocument()
    })

    it("should render mobile version when isMobile is true", () => {
        ; (useBreakpoint as jest.Mock).mockReturnValue(true)
        render(<HistoryTrigger hasSidebar={false} />)

        const trigger = screen.getByLabelText("Search")
        fireEvent.click(trigger)

        expect(screen.getByTestId("drawer-history")).toBeInTheDocument()
    })

    it("should hide trigger button when hasSidebar is true", () => {
        ; (useBreakpoint as jest.Mock).mockReturnValue(false)
        render(<HistoryTrigger hasSidebar={true} />)

        const trigger = screen.getByLabelText("Search")
        expect(trigger).toHaveClass("hidden")
    })

    it("should render custom label and icon", () => {
        render(
            <HistoryTrigger
                hasSidebar={false}
                label="Open History"
                icon={<span data-testid="custom-icon" />}
            />
        )
        expect(screen.getByText("Open History")).toBeInTheDocument()
        expect(screen.getByTestId("custom-icon")).toBeInTheDocument()
    })
})
