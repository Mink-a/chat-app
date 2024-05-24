import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function Login() {
  const [user, setUser] = useState("");
  const [roomName, setRoomName] = useState("");

  const handleSignIn = () => {
    sessionStorage.setItem(
      "user-info",
      JSON.stringify({ name: user, id: `${user}${Math.random()}` })
    );
    sessionStorage.setItem(
      "room-info",
      JSON.stringify({ name: roomName, id: `${roomName}${Math.random()}` })
    );
    // should not use
    location.assign("/");
  };

  return (
    <div className="grid place-content-center h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your username and choose room.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Mink"
              required
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Choose Room</Label>
            <Select value={roomName} onValueChange={(e) => setRoomName(e)}>
              <SelectTrigger className="">
                <SelectValue placeholder="Select a room" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Rooms</SelectLabel>
                  <SelectItem value="room-1">Room 1</SelectItem>
                  <SelectItem value="room-2">Room 2</SelectItem>
                  <SelectItem value="room-3">Room 3</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSignIn}>
            Sign in
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
