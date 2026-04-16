import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import MobileTabBar from "@/components/MobileTabBar";

type Request = {
  id: string;
  project: string;
  status: "answered" | "waiting" | "done";
  statusLabel: string;
  maker: string;
  config: string;
  region: string;
  date: string;
  priceLabel?: string;
  priceValue?: string;
  priceColor?: string;
};

const activeRequests: Request[] = [
  {
    id: "1", project: "Тайга 72", status: "answered", statusLabel: "Ответили",
    maker: "СибМодуль · Новосибирск", config: "Стандарт", region: "Москва и МО",
    date: "22 марта 2026", priceLabel: "Цена производителя", priceValue: "2 630 000 ₽",
    priceColor: "text-primary font-semibold",
  },
  {
    id: "2", project: "Кедр 24", status: "waiting", statusLabel: "Ожидает",
    maker: "УралДом · Екатеринбург", config: "Под ключ", region: "Краснодарский край",
    date: "24 марта 2026", priceLabel: "Ответ производителя", priceValue: "Обычно отвечают за 24ч",
    priceColor: "text-amber-600",
  },
];

const archiveRequests: Request[] = [
  {
    id: "3", project: "Модуль Лайт 36", status: "done", statusLabel: "Завершена",
    maker: "ЭкоДом · Казань", config: "Базовая", region: "Москва и МО",
    date: "10 февраля 2026",
  },
];

const statusStyles: Record<string, string> = {
  answered: "bg-green-50 text-green-700",
  waiting: "bg-amber-50 text-amber-700",
  done: "bg-blue-50 text-primary",
};

const RequestCard = ({ req }: { req: Request }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-card rounded-xl p-4 mb-3 mx-5">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[15px] font-semibold text-foreground">{req.project}</span>
        <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${statusStyles[req.status]}`}>
          {req.statusLabel}
        </span>
      </div>
      <div className="text-xs font-light text-muted-foreground mb-2">{req.maker}</div>
      <div className="space-y-1 mb-1">
        {[
          ["Комплектация", req.config],
          ["Регион", req.region],
          ["Отправлено", req.date],
        ].map(([label, val]) => (
          <div key={label} className="flex gap-4">
            <span className="text-xs font-light text-muted-foreground">{label}</span>
            <span className="text-xs font-normal text-foreground">{val}</span>
          </div>
        ))}
        {req.priceLabel && (
          <div className="flex gap-4">
            <span className="text-xs font-light text-muted-foreground">{req.priceLabel}</span>
            <span className={`text-xs ${req.priceColor}`}>{req.priceValue}</span>
          </div>
        )}
      </div>
      <div className="flex gap-2 mt-3">
        <Button variant="outline" size="sm" className="flex-1 text-[13px] font-normal">
          Смотреть проект
        </Button>
        {req.status === "answered" ? (
          <Button size="sm" className="flex-1 text-[13px] font-medium" onClick={() => navigate("/messages")}>
            Открыть чат →
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="flex-1 text-[13px] font-normal">
            Открыть чат
          </Button>
        )}
      </div>
    </div>
  );
};

const Requests = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-secondary pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-14 pb-3">
        <button onClick={() => navigate("/profile")} className="flex items-center gap-1 text-sm text-primary">
          <ArrowLeft className="w-4 h-4" />
          Назад
        </button>
        <span className="text-[17px] font-bold text-foreground">Мои заявки</span>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="w-full bg-transparent border-b border-border rounded-none h-auto p-0 px-5">
          <TabsTrigger
            value="active"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none pb-3 pt-2 text-sm font-semibold data-[state=active]:text-foreground text-muted-foreground"
          >
            Активные <span className="ml-1 text-xs text-primary font-semibold">2</span>
          </TabsTrigger>
          <TabsTrigger
            value="archive"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none pb-3 pt-2 text-sm font-light data-[state=active]:font-semibold data-[state=active]:text-foreground text-muted-foreground"
          >
            Архив <span className="ml-1 text-xs">1</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="pt-3.5">
          {activeRequests.map((r) => <RequestCard key={r.id} req={r} />)}
        </TabsContent>
        <TabsContent value="archive" className="pt-3.5">
          {archiveRequests.map((r) => <RequestCard key={r.id} req={r} />)}
        </TabsContent>
      </Tabs>

      <MobileTabBar />
    </div>
  );
};

export default Requests;
