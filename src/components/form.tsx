import { useState } from "react";
import { socket } from "../socket/socket";

export function MyForm() {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    const message = {
      text: value,
      name: "user",
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
      <input onChange={(e) => setValue(e.target.value)} />

      <button type="submit" disabled={isLoading}>
        Submit
      </button>
    </form>
  );
}
