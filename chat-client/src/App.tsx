import { useEffect, useState } from "react";
import { ConnectionManager } from "@/components/connection-manager";
import { Events } from "@/components/events";
import { MyForm } from "@/components/form";
import { socket } from "./socket/socket";
import { IMessage } from "./types/chat-types";
import { Login } from "./components/login";
import { AppLayout } from "./components/layout/app-layout";

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isGenerating, setIsGenerating] = useState(false);
  const [messageReceiveEventsList, setMessageReceiveEventsList] = useState<
    IMessage[]
  >([]);
  const [user] = useState<{ name: string; id: string }>(() => {
    const userInfo = sessionStorage.getItem("user-info");
    return userInfo ? JSON.parse(userInfo) : { name: null, id: null };
  });
  const [room] = useState<{ name: string; id: string }>(() => {
    const roomInfo = sessionStorage.getItem("room-info");
    return roomInfo ? JSON.parse(roomInfo) : { name: null, id: null };
  });

  useEffect(() => {
    function onConnect() {
      if (!user || !room) {
        location.assign("/");
      } else {
        socket.emit("join_room", {
          roomName: room.name,
          user: { ...user, socketId: socket.id },
        });
        setIsConnected(true);
      }
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function messageReceiveEvent(value: IMessage) {
      setMessageReceiveEventsList((previous) => {
        const newList = [...previous, value];
        // localStorage.setItem(
        //   "messages-list",
        //   JSON.stringify(newList.slice(-10))
        // );
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
  }, [room, user]);

  if (!user.id || !user.name) {
    return <Login />;
  }
  return (
    <AppLayout>
      <div className="flex flex-col h-screen">
        <ConnectionManager isConnected={isConnected} />
        <Events events={messageReceiveEventsList} isGenerating={isGenerating} />
        <MyForm isConnected={isConnected} />
      </div>
    </AppLayout>
  );
}

export default App;
