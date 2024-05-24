import { useState } from "react";
import { socket } from "../socket/socket";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { IMessage } from "@/types/chat-types";

export function MyForm({ isConnected }: { isConnected: boolean }) {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user] = useState<{ name: string; id: string }>(() => {
    const userInfo = sessionStorage.getItem("user-info");
    return userInfo ? JSON.parse(userInfo) : { name: null, id: null };
  });
  const [room] = useState<{ name: string; id: string }>(() => {
    const roomInfo = sessionStorage.getItem("room-info");
    return roomInfo ? JSON.parse(roomInfo) : { name: null, id: null };
  });

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    const message: IMessage = {
      message: value,
      user: {
        name: "User",
        id: user.id,
        socketId: socket.id ?? "user-socket-id",
      },
      id: `${socket.id}${Math.random()}`,
      roomName: room.name,
      timeSent: new Date().toISOString(),
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

          <Button
            type="submit"
            disabled={isLoading || value.length === 0}
            variant="secondary"
          >
            <PaperPlaneIcon className="h-4 w-4 -rotate-45" />
          </Button>
        </div>
      </footer>
    </form>
  );
}
