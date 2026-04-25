declare module "@fullcalendar/interaction" {
  type DateClickArg = {
    dateStr: string;
  };

  type DateSelectArg = {
    startStr: string;
    endStr: string;
    view: {
      calendar: {
        unselect: () => void;
      };
    };
  };

  const interactionPlugin: unknown;

  export default interactionPlugin;
  export type { DateClickArg, DateSelectArg };
}
