import React, { createContext, useState, useContext } from "react";

const EventContext = createContext({
  eventsData: {},
  addEvent: (eventName, eventData) => {},
  getEventData: (eventName) => {},
});

export const EventProvider = ({ children }) => {
  const [eventsData, setEventsData] = useState({});

  const addEvent = (eventName, eventData) => {
    setEventsData((prevEventsData) => ({
      ...prevEventsData,
      [eventName]: eventData,
    }));
  };

  const getEventData = (eventName) => {
    return eventsData[eventName];
  };

  return (
    <EventContext.Provider value={{ eventsData, addEvent, getEventData }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => useContext(EventContext);