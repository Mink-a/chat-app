import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { ChatBubbleIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";

import { socket } from "../socket/socket";
import { Button } from "@/components/ui/button";
import { ConnectionState } from "./connection-state";
import { ThemeToggle } from "./theme-toggle";

export function ConnectionManager({ isConnected }: { isConnected: boolean }) {
  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  return (
    <header className="sticky top-0 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <h1 className="text-lg font-semibold hidden md:block">Quote Generator</h1>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <HamburgerMenuIcon className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <a
              href="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <ChatBubbleIcon className="h-6 w-6" />
              <span className="sr-only">Quote Generator</span>
            </a>
            {/* to show channel list */}
            <a href="#" className="hover:text-foreground">
              Settings
            </a>
            <div className="flex justify-end">
              <ThemeToggle />
            </div>
          </nav>
        </SheetContent>
      </Sheet>
      <ConnectionState isConnected={isConnected} />
      <div className="space-x-2 flex items-center">
        {isConnected ? (
          <Button variant="outline" onClick={disconnect}>
            Disconnect
          </Button>
        ) : (
          <Button variant="outline" onClick={connect}>
            Connect
          </Button>
        )}
        <div className="hidden md:block">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
