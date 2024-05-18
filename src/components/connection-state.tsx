type Props = {
  isConnected: boolean;
};

export function ConnectionState({ isConnected }: Props) {
  return <p>State: {"" + isConnected}</p>;
}
