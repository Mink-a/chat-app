import { useState } from "react";
import { socket } from "../socket/socket";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";

export function MyForm({ isConnected }: { isConnected: boolean }) {
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
      !isConnected && toast.error("Please connect to the server!");
    });
    setValue("");
  }

  return (
    <form onSubmit={onSubmit}>
      <footer className="border-t">
        <div className=" md:max-w-[70%] lg:max-w-[60%] mx-auto flex items-center space-x-2 p-2 ">
          <Input
            placeholder="Type a message"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <Button type="submit" disabled={isLoading} variant="secondary">
            <PaperPlaneIcon className="h-4 w-4 -rotate-45" />
          </Button>
        </div>
      </footer>
    </form>
  );
}
