import { useState } from "react";
import { socket } from "../socket/socket";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PaperPlaneIcon } from "@radix-ui/react-icons";

export function MyForm() {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    const message = {
      text: value,
      name: "User",
      id: `${socket.id}${Math.random()}`,
      socketID: socket.id,
    };

    socket.timeout(1000).emit("message", message, () => {
      setIsLoading(false);
    });
    setValue("");
  }

  return (
    <form onSubmit={onSubmit}>
      <footer className="flex items-center space-x-2 p-2 border-t">
        <Input
          placeholder="Type a message"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <Button type="submit" disabled={isLoading} variant="secondary">
          <PaperPlaneIcon className="h-6 w-4 -rotate-45" />
        </Button>
      </footer>
    </form>
  );
}
