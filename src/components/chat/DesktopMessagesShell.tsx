import type { ReactNode } from "react";
import Header from "@/components/Header";

interface DesktopMessagesShellProps {
  children: ReactNode;
  title?: string;
  innerClassName?: string;
}

const DesktopMessagesShell = ({
  children,
  title,
  innerClassName = "",
}: DesktopMessagesShellProps) => {
  return (
    <div className="min-h-screen bg-secondary font-sans">
      <Header />
      <main className="pt-[108px] pb-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-background rounded-2xl px-6 py-6 min-h-[calc(100vh-140px)]">
            <div className={`max-w-[920px] mx-auto ${innerClassName}`.trim()}>
              {title ? (
                <h1 className="text-[26px] font-medium tracking-tight text-foreground mb-5">
                  {title}
                </h1>
              ) : null}
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DesktopMessagesShell;
