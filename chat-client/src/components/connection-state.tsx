type Props = {
  isConnected: boolean;
};

const Connected = () => {
  return (
    <div className="flex space-x-2 items-baseline">
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      <div>Online</div>
    </div>
  );
};

const Disconnected = () => {
  return (
    <div className="flex space-x-2 items-baseline">
      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
      <div>Offline</div>
    </div>
  );
};

export function ConnectionState({ isConnected }: Props) {
  return <div>{isConnected ? <Connected /> : <Disconnected />}</div>;
}
