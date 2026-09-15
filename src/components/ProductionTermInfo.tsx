import { CircleHelp } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const ProductionTermInfo = () => (
  <span className="inline-flex items-center gap-1.5">
    <span>Срок производства</span>
    <span className="relative h-4 w-4 shrink-0">
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="Что означает срок производства"
            className="absolute left-1/2 top-1/2 inline-flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[var(--radius)] text-[#717b8e] transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <CircleHelp className="h-4 w-4" strokeWidth={1.7} aria-hidden />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={6}
          aria-label="Пояснение о сроке производства"
          className="w-[min(300px,calc(100vw-32px))] rounded-[var(--radius)] p-4"
        >
          <p className="text-[14px] font-semibold leading-snug text-[#342d27] dark:text-foreground">
            О сроке производства
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-[#595653] dark:text-muted-foreground">
            Указанный срок производства ориентировочный. Он зависит от текущей загрузки производства и выбранной комплектации. Подтвердите актуальный срок у производителя перед заказом.
          </p>
        </PopoverContent>
      </Popover>
    </span>
  </span>
);

export default ProductionTermInfo;
