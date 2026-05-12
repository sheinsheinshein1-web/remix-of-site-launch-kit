import { Factory } from "lucide-react";
import { manufacturers as makers } from "@/data/projects";
import { useCity } from "@/components/CitySelector";

const ManufacturersList = () => {
  const { city } = useCity();
  const filtered = makers.filter((m) => m.location === city);
  const list = filtered.length > 0 ? filtered : makers;
  return (
    <section>
      <div className="py-2 md:px-6 md:py-7">
        <div className="flex items-baseline justify-between mb-2.5 md:mb-4">
          <h2 className="text-[17px] md:text-lg font-medium text-foreground">Производители</h2>
          <a href="#" className="text-[14px] md:text-[13px] font-light text-primary hover:underline shrink-0 inline-flex items-center gap-1">
            Смотреть все <span className="text-[12px]">›</span>
          </a>
        </div>

        {/* Desktop: 3-col grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-3">
          {list.map((m) => (
            <MakerCardDesktop key={m.name} {...m} />
          ))}
        </div>

        {/* Mobile: vertical list */}
        <div className="flex flex-col gap-2 md:hidden">
          {list.map((m) => (
            <button key={m.name} className="flex items-center gap-3.5 bg-card border border-border rounded-2xl p-3.5 text-left">
              <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center shrink-0">
                <Factory className="w-[18px] h-[18px] text-muted-foreground" strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-medium text-foreground">{m.name}</div>
                <div className="text-[12px] font-light text-muted-foreground">{m.location} · {m.count}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 md:mt-5 text-center hidden md:block">
          <button className="text-sm font-light text-muted-foreground border border-border rounded-lg px-7 py-2.5 hover:border-primary hover:text-primary transition-colors">
            Смотреть всех — 80+ производителей
          </button>
        </div>
      </div>
    </section>
  );
};

const MakerCardMobile = ({ name, location, count }: { name: string; location: string; count: string }) => (
  <div className="shrink-0 w-[140px] bg-secondary rounded-[10px] p-3 cursor-pointer">
    <div className="w-[30px] h-[30px] rounded-[7px] bg-background flex items-center justify-center mb-2">
      <Factory className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
    </div>
    <div className="text-[12px] font-medium text-foreground mb-0.5">{name}</div>
    <div className="text-[10px] font-light text-muted-foreground mb-1">{location}</div>
    <div className="text-[10px] font-light text-primary">{count}</div>
  </div>
);

const MakerCardDesktop = ({ name, location, count }: { name: string; location: string; count: string }) => (
  <button className="flex items-center gap-3.5 bg-background border border-border rounded-xl p-5 text-left hover:border-primary transition-colors">
    <div className="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center shrink-0">
      <Factory className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
    </div>
    <div className="min-w-0">
      <div className="text-sm font-medium text-foreground">{name}</div>
      <div className="text-xs font-light text-muted-foreground">{location}</div>
      <div className="text-xs font-light text-primary mt-0.5">{count}</div>
    </div>
  </button>
);

export default ManufacturersList;
