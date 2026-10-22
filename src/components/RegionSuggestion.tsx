import { type ReactNode, useId } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { getGeoSelectionLabel } from "@/lib/geoSelection";

type Props = {
  children: ReactNode;
  suggestion: string | null;
  onConfirm: (slug: string) => void;
  onChange: () => void;
  onDismiss: () => void;
};

export default function RegionSuggestion({ children, suggestion, onConfirm, onChange, onDismiss }: Props) {
  const titleId = useId();
  return (
    <Popover open={Boolean(suggestion)} onOpenChange={(open) => { if (!open) onDismiss(); }}>
      <PopoverAnchor asChild>{children}</PopoverAnchor>
      <PopoverContent
        align="start" sideOffset={8} collisionPadding={16}
        className="z-[60] w-[320px] max-w-[calc(100vw-32px)] rounded-[3px] p-4"
        aria-labelledby={titleId}
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        <button type="button" onClick={onDismiss} aria-label="Закрыть подсказку региона"
          className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" aria-hidden />
        </button>
        <p id={titleId} className="pr-7 text-base font-semibold leading-6">
          Ваш регион — {suggestion ? getGeoSelectionLabel(suggestion) : ""}?
        </p>
        <p className="mt-2 text-sm leading-5 text-muted-foreground">Покажем дома с доставкой в ваш регион.</p>
        <div className="mt-4 flex gap-2">
          <Button className="h-11 flex-1" onClick={() => { if (suggestion) onConfirm(suggestion); }}>Да, верно</Button>
          <Button variant="outline" className="h-11 flex-1" onClick={onChange}>Изменить</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
