import { Button } from "@/components/ui/button";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export function Messages() {
  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between px-4 py-2 border-b">
        <h1 className="text-lg font-semibold">Chat Room</h1>
        <Button size="sm" variant="outline">
          Leave Chat
        </Button>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex items-end space-x-2">
          <Avatar>
            <AvatarImage alt="User Avatar" src="/placeholder-avatar.jpg" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
            <p className="text-sm">Hello everyone!</p>
          </div>
        </div>
        <div className="flex items-end space-x-2">
          <Avatar>
            <AvatarImage alt="User Avatar" src="/placeholder-avatar.jpg" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
            <p className="text-sm">How's it going?</p>
          </div>
        </div>
        <div className="flex items-end justify-end space-x-2">
          <div className="p-2 rounded-lg bg-blue-500 text-white">
            <p className="text-sm">
              Hello! It's going well, thanks for asking.
            </p>
          </div>
          <Avatar>
            <AvatarImage alt="User Avatar" src="/placeholder-avatar.jpg" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex items-end justify-end space-x-2">
          <div className="p-2 rounded-lg bg-blue-500 text-white">
            <p className="text-sm">What about you?</p>
          </div>
          <Avatar>
            <AvatarImage alt="User Avatar" src="/placeholder-avatar.jpg" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </main>
      <footer className="flex items-center space-x-2 p-2 border-t">
        <Input className="flex-1" placeholder="Type a message" />
        <Button size="sm" variant="outline">
          Send
        </Button>
      </footer>
    </div>
  );
}
