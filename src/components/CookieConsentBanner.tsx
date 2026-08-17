import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  COOKIE_SETTINGS_OPEN_EVENT,
  getCookieConsent,
  saveCookieConsent,
  type CookieConsentChoice,
} from "@/lib/cookieConsent";

const CookieConsentBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getCookieConsent() === null);

    const openSettings = () => setVisible(true);
    window.addEventListener(COOKIE_SETTINGS_OPEN_EVENT, openSettings);
    return () => window.removeEventListener(COOKIE_SETTINGS_OPEN_EVENT, openSettings);
  }, []);

  const choose = (choice: CookieConsentChoice) => {
    saveCookieConsent(choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      role="region"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      className="fixed inset-x-0 bottom-0 z-[80] px-3 pb-[calc(env(safe-area-inset-bottom)+12px)] sm:px-6 sm:pb-5"
    >
      <div className="mx-auto grid w-full max-w-[1120px] gap-4 rounded-[3px] border border-border bg-background p-4 shadow-[0_14px_40px_rgba(31,36,43,0.14)] sm:p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-8">
        <div className="min-w-0">
          <h2 id="cookie-consent-title" className="text-[16px] font-semibold leading-snug text-foreground md:text-[17px]">
            Настройки cookie
          </h2>
          <p id="cookie-consent-description" className="mt-1.5 max-w-[720px] text-[13px] leading-relaxed text-muted-foreground md:text-[14px]">
            Мы используем необходимые cookie и похожие технологии, чтобы сайт работал и запоминал настройки. С вашего согласия сможем подключать аналитику для улучшения сервиса.
          </p>
          <Link
            to="/legal/cookies"
            className="mt-2 inline-flex min-h-11 items-center text-[13px] font-medium text-foreground transition-colors hover:text-primary focus-visible:rounded-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 md:min-h-9 md:text-[14px]"
          >
            Подробнее об использовании cookie
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:min-w-[330px]">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => choose("necessary")}
            className="min-h-11 rounded-[3px] px-5"
          >
            Только необходимые
          </Button>
          <Button
            type="button"
            size="lg"
            onClick={() => choose("all")}
            className="min-h-11 rounded-[3px] px-5"
          >
            Принять все
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default CookieConsentBanner;
