import { createContext, useContext } from "react";

export interface MessagesNavigationContextValue {
  exitMessages: () => void;
  backFromChat: () => void;
}

export const MessagesNavigationContext = createContext<MessagesNavigationContextValue | null>(null);

export const useMessagesNavigation = () => {
  const context = useContext(MessagesNavigationContext);
  if (!context) throw new Error("useMessagesNavigation must be used inside MessagesLayout");
  return context;
};
