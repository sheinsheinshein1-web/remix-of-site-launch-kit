import { useCallback, useRef, type ReactNode } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import DesktopMessagesLayout from "@/components/chat/DesktopMessagesLayout";
import { MessagesNavigationContext } from "@/contexts/MessagesNavigationContext";

const getHistoryIndex = () => {
  if (typeof window === "undefined") return 0;
  const index = window.history.state?.idx;
  return typeof index === "number" && Number.isFinite(index) ? index : 0;
};

const MessagesNavigationProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const entryHistoryIndexRef = useRef(getHistoryIndex());

  const exitMessages = useCallback(() => {
    const entryIndex = entryHistoryIndexRef.current;
    const currentIndex = getHistoryIndex();

    if (entryIndex > 0 && currentIndex >= entryIndex) {
      navigate(-(currentIndex - entryIndex + 1));
      return;
    }

    navigate("/", { replace: currentIndex === 0 });
  }, [navigate]);

  const backFromChat = useCallback(() => {
    const currentIndex = getHistoryIndex();
    if (currentIndex > entryHistoryIndexRef.current) {
      navigate(-1);
      return;
    }

    exitMessages();
  }, [exitMessages, navigate]);

  return (
    <MessagesNavigationContext.Provider value={{ exitMessages, backFromChat }}>
      {children}
    </MessagesNavigationContext.Provider>
  );
};

const MessagesLayout = () => {
  const isMobile = useIsMobile();

  return (
    <MessagesNavigationProvider>
      {isMobile ? <Outlet /> : <DesktopMessagesLayout />}
    </MessagesNavigationProvider>
  );
};

export default MessagesLayout;
