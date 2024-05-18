export type IEvent = {
  text: string;
  name: string;
  id: string;
  socketID: string | undefined;
};

export type EventsProps = {
  events: IEvent[];
  isGenerating: boolean;
};

export function Events({ events, isGenerating }: EventsProps) {
  return (
    <ul>
      {events.map((e) => (
        <li key={e.id}>
          <pre>{JSON.stringify(e, null, 2)}</pre>
        </li>
      ))}
      {isGenerating && <li>Loading....</li>}
    </ul>
  );
}
