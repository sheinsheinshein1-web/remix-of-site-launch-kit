import { Outlet } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import DesktopMessagesLayout from "@/components/chat/DesktopMessagesLayout";

const MessagesLayout = () => {
  const isMobile = useIsMobile();

  // On mobile, just render the child route directly (full-screen pages)
  if (isMobile) {
    return <Outlet />;
  }

  // On desktop, render two-column layout
  return <DesktopMessagesLayout />;
};

export default MessagesLayout;
