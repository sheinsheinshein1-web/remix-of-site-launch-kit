import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export const articleSectionClassName = "scroll-mt-8 [&+section]:mt-12 sm:[&+section]:mt-14";
export const articleHeadingClassName = "text-[25px] font-semibold leading-[1.15] tracking-[-0.02em] text-[#342d27] dark:text-foreground md:text-[30px]";
export const articleParagraphClassName = "mt-5 text-[16px] leading-[1.75] text-[#342d27]/78 dark:text-foreground/80 md:text-[17px]";

export const ArticleStrong = ({ children }: { children: ReactNode }) => (
  <strong className="font-semibold text-[#342d27] dark:text-foreground">{children}</strong>
);

export const ArticleTextLink = ({ children, to }: { children: ReactNode; to: string }) => (
  <Link className="text-foreground underline decoration-foreground/25 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary/50" to={to}>
    {children}
  </Link>
);
