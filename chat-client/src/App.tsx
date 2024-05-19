import { useEffect, useState } from "react";
import { ConnectionManager } from "@/components/connection-manager";
import { Events, IEvent } from "@/components/events";
import { MyForm } from "@/components/form";
import { socket } from "./socket/socket";

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isGenerating, setIsGenerating] = useState(false);
  const [messageReceiveEventsList, setMessageReceiveEventsList] = useState<
    IEvent[]
  >(() => {
    const storedEvents = localStorage.getItem("messages-list");
    return storedEvents ? JSON.parse(storedEvents) : [];
  });

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function messageReceiveEvent(value: IEvent) {
      setMessageReceiveEventsList((previous) => {
        const newList = [...previous, value];
        localStorage.setItem(
          "messages-list",
          JSON.stringify(newList.slice(-10))
        );
        return newList;
      });
    }

    function generatingEvent(value: boolean) {
      setIsGenerating(value);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message", messageReceiveEvent);
    socket.on("generating", generatingEvent);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message", messageReceiveEvent);
      socket.off("generating", generatingEvent);
    };
  }, []);
  return (
    <div className="flex flex-col h-screen">
      <ConnectionManager isConnected={isConnected} />
      <Events events={messageReceiveEventsList} isGenerating={isGenerating} />
      <MyForm isConnected={isConnected} />
    </div>
  );
}

export default App;
