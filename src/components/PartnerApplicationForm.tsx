import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { partnerInterestOptions } from "@/data/partnerProgram";

interface PartnerApplicationFormProps {
  onBack: () => void;
  variant?: "page" | "drawer";
  initialInterest?: string;
}

const PartnerApplicationForm = ({ onBack, variant = "page", initialInterest = "" }: PartnerApplicationFormProps) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: "",
    inn: "",
    activityType: "Модульные дома",
    interest: initialInterest,
    website: "",
    contactName: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.companyName.trim()) e.companyName = "Укажите название компании";
    if (!form.inn.trim()) e.inn = "Укажите ИНН";
    else if (!/^\d{10}$|^\d{12}$/.test(form.inn.trim())) e.inn = "ИНН должен содержать 10 или 12 цифр";
    if (!form.interest) e.interest = "Выберите интересующий формат";
    if (!form.contactName.trim()) e.contactName = "Укажите контактное лицо";
    if (!form.phone.trim()) e.phone = "Укажите телефон";
    else if (form.phone.replace(/\D/g, "").length < 10) e.phone = "Введите корректный номер";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!validate()) return;
    const submittedAt = new Date().toISOString();
    // Save to localStorage for now
    localStorage.setItem("partner_application", JSON.stringify({ ...form, submittedAt }));

    // Отправка уведомления в Telegram через тот же мост, что и поддержка
    const API = "https://sheinsheinshein1-web-chat-telegram-bridge-77c4.twc1.net";
    const sessionKey = "partner_application_session";
    let session = localStorage.getItem(sessionKey);
    if (!session) {
      session = `partner_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      localStorage.setItem(sessionKey, session);
    }

    const text =
      `🆕 Новая заявка на партнёрство\n\n` +
      `Компания: ${form.companyName}\n` +
      `ИНН: ${form.inn}\n` +
      `Вид деятельности: ${form.activityType}\n` +
      `Интересует: ${form.interest}\n` +
      (form.website ? `Сайт: ${form.website}\n` : "") +
      `Контактное лицо: ${form.contactName}\n` +
      `Телефон: ${form.phone}\n` +
      `Время: ${new Date(submittedAt).toLocaleString("ru-RU")}`;

    // fire-and-forget — не блокируем переход в чат
    fetch(`${API}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session, text }),
    }).catch(() => {
      // сеть недоступна — заявка уже сохранена локально
    });

    navigate("/messages/partner?start=1");
  };

  const inputClass = (field: string) =>
    `h-12 w-full rounded-[3px] border bg-background px-4 text-[14px] text-foreground outline-none transition-colors ${
      errors[field] ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10" : "border-border focus:border-primary focus:ring-2 focus:ring-primary/10"
    }`;

  const inputStyle = { fontSize: "16px" } as const;

  return (
    <form className={variant === "drawer" ? "px-4 py-5" : ""} onSubmit={handleSubmit} noValidate>
      {/* Header */}
      <div className={variant === "drawer" ? "mb-6 flex items-center gap-3" : "mb-6"}>
        {variant === "drawer" && (
          <button type="button" onClick={onBack} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[3px] text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30" aria-label="Вернуться к информации для производителей">
            <ArrowLeft className="h-4 w-4 text-foreground" />
          </button>
        )}
        <div>
          <h2 className="text-[24px] font-semibold leading-tight text-foreground md:text-[30px]">Заявка для производителя</h2>
          <p className="text-[13px] text-muted-foreground">Заполните данные о компании</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-4">
        {/* Company name */}
        <div>
          <label className="text-[13px] font-medium text-foreground mb-1.5 block">Название компании *</label>
          <input
            type="text"
            placeholder='ООО "Модульные решения"'
            value={form.companyName}
            onChange={(e) => update("companyName", e.target.value)}
            className={inputClass("companyName")}
            maxLength={200}
            style={inputStyle}
            autoComplete="organization"
            aria-invalid={Boolean(errors.companyName)}
            aria-describedby={errors.companyName ? "partner-company-error" : undefined}
          />
          {errors.companyName && <p id="partner-company-error" role="alert" className="mt-1 text-[12px] text-red-500">{errors.companyName}</p>}
        </div>

        {/* INN */}
        <div>
          <label className="text-[13px] font-medium text-foreground mb-1.5 block">ИНН *</label>
          <input
            type="text"
            placeholder="1234567890"
            value={form.inn}
            onChange={(e) => update("inn", e.target.value.replace(/\D/g, "").slice(0, 12))}
            className={inputClass("inn")}
            inputMode="numeric"
            style={inputStyle}
            aria-invalid={Boolean(errors.inn)}
            aria-describedby={errors.inn ? "partner-inn-error" : undefined}
          />
          {errors.inn && <p id="partner-inn-error" role="alert" className="mt-1 text-[12px] text-red-500">{errors.inn}</p>}
        </div>

        <div>
          <label className="text-[13px] font-medium text-foreground mb-1.5 block">Что вас интересует *</label>
          <div className="relative">
            <select
              value={form.interest}
              onChange={(e) => update("interest", e.target.value)}
              className={`${inputClass("interest")} appearance-none pr-10 ${!form.interest ? "text-muted-foreground" : ""}`}
              style={inputStyle}
              aria-invalid={Boolean(errors.interest)}
              aria-describedby={errors.interest ? "partner-interest-error" : undefined}
            >
              <option value="" disabled>Выберите формат</option>
              {partnerInterestOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          {errors.interest && <p id="partner-interest-error" role="alert" className="mt-1 text-[12px] text-red-500">{errors.interest}</p>}
        </div>

        <div>
          <label className="text-[13px] font-medium text-foreground mb-1.5 block">Сайт компании</label>
          <input
            type="url"
            placeholder="https://example.ru"
            value={form.website}
            onChange={(e) => update("website", e.target.value)}
            className={inputClass("website")}
            maxLength={300}
            style={inputStyle}
            autoComplete="url"
          />
        </div>

        {/* Contact name */}
        <div>
          <label className="text-[13px] font-medium text-foreground mb-1.5 block">Контактное лицо *</label>
          <input
            type="text"
            placeholder="Иван Петров"
            value={form.contactName}
            onChange={(e) => update("contactName", e.target.value)}
            className={inputClass("contactName")}
            maxLength={100}
            style={inputStyle}
            autoComplete="name"
            aria-invalid={Boolean(errors.contactName)}
            aria-describedby={errors.contactName ? "partner-contact-error" : undefined}
          />
          {errors.contactName && <p id="partner-contact-error" role="alert" className="mt-1 text-[12px] text-red-500">{errors.contactName}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="text-[13px] font-medium text-foreground mb-1.5 block">Телефон *</label>
          <input
            type="tel"
            placeholder="+7 (999) 123-45-67"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={inputClass("phone")}
            maxLength={20}
            style={inputStyle}
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "partner-phone-error" : undefined}
          />
          {errors.phone && <p id="partner-phone-error" role="alert" className="mt-1 text-[12px] text-red-500">{errors.phone}</p>}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="mt-6 h-[52px] w-full rounded-[3px] bg-primary text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        Отправить заявку
      </button>

      <p className="text-[11px] text-muted-foreground text-center mt-3 leading-relaxed">
        Нажимая «Отправить заявку», вы соглашаетесь с условиями использования сервиса
      </p>
    </form>
  );
};

export default PartnerApplicationForm;
