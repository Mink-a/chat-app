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
    <header className="flex items-center justify-between px-4 py-2 border-b">
      <h1 className="text-lg font-semibold">Quote Generator</h1>
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
        <ThemeToggle />
      </div>
    </header>
  );
}
