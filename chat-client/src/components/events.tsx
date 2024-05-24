import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { IMessage } from "../types/chat-types";

export type EventsProps = {
  events: IMessage[];
  isGenerating: boolean;
};

const UserMessage = ({ data }: { data: IMessage }) => {
  return (
    <div className="flex items-end justify-end space-x-2">
      <div className="p-2 rounded-lg bg-blue-500 text-white">
        <p className="text-sm">{data.message}</p>
      </div>
      <Avatar>
        <AvatarImage alt="User Avatar" src="/placeholder-avatar.jpg" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    </div>
  );
};

const BotMessage = ({ data }: { data: IMessage }) => {
  return (
    <div className="flex items-end space-x-2">
      <Avatar>
        <AvatarImage alt="Bot Avatar" src="/placeholder-avatar.jpg" />
        <AvatarFallback>B</AvatarFallback>
      </Avatar>
      <div className="bg-gray-200 dark:bg-gray-800 px-4 py-2 rounded-lg max-w-[70%]">
        <p className="text-sm">{data.message}</p>
      </div>
    </div>
  );
};

const BotIsGenerating = () => {
  return (
    <div className="flex items-end space-x-2">
      <Avatar>
        <AvatarImage alt="Bpt Avatar" src="/placeholder-avatar.jpg" />
        <AvatarFallback>B</AvatarFallback>
      </Avatar>
      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
        <div className="flex items-center space-x-2 h-4">
          <div className="h-2 w-2 rounded-full animate-bounce bg-slate-500 dark:bg-white" />
          <div className="h-2 w-2 rounded-full animate-bounce delay-100 bg-slate-500 dark:bg-white" />
          <div className="h-2 w-2 rounded-full animate-bounce delay-200 bg-slate-500 dark:bg-white" />
        </div>
      </div>
    </div>
  );
};

const EmptyChat = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center text-gray-500 dark:text-gray-400">
        <p className="text-2xl font-medium">No quotes yet</p>
        <p className="mt-2 text-sm">Ask for a new quote</p>
      </div>
    </div>
  );
};

export function Events({ events, isGenerating }: EventsProps) {
  if (events.length === 0) {
    return <EmptyChat />;
  }
  return (
    <main className="flex-1 overflow-y-auto p-4">
      <div className="mx-auto md:max-w-[70%] lg:max-w-[60%]  space-y-4">
        {events.map((e) => {
          if (e.user.name === "User") {
            return <UserMessage key={e.id} data={e} />;
          } else if (e.user.name === "Bot") {
            return <BotMessage key={e.id} data={e} />;
          } else {
            return null;
          }
        })}
        {isGenerating && <BotIsGenerating />}
      </div>
    </main>
  );
}
