import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, ChevronDown } from "lucide-react";
import { partnerInterestOptions } from "@/data/partnerProgram";
import { submitPartnerApplication } from "@/lib/partnerApplication";

interface PartnerApplicationFormProps {
  onBack: () => void;
  variant?: "page" | "drawer";
  initialInterest?: string;
}

const PartnerApplicationForm = ({ onBack, variant = "page", initialInterest = "" }: PartnerApplicationFormProps) => {
  const [form, setForm] = useState({
    companyName: "",
    inn: "",
    activityType: "Модульные дома" as const,
    interest: initialInterest,
    website: "",
    contactName: "",
    phone: "",
    fax: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("");

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    if (submitState === "error") {
      setSubmitState("idle");
      setSubmitError("");
    }
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

  const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!validate() || submitState === "submitting") return;

    setSubmitState("submitting");
    setSubmitError("");

    try {
      await submitPartnerApplication({
        ...form,
        sourceUrl: window.location.href,
      });
      setSubmitState("success");
    } catch {
      setSubmitState("error");
      setSubmitError("Не удалось отправить заявку. Проверьте соединение и попробуйте ещё раз.");
    }
  };

  const inputClass = (field: string) =>
    `h-12 w-full rounded-[3px] border bg-background px-4 text-[14px] text-foreground outline-none transition-colors ${
      errors[field] ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10" : "border-border focus:border-primary focus:ring-2 focus:ring-primary/10"
    }`;

  const inputStyle = { fontSize: "16px" } as const;

  if (submitState === "success") {
    return (
      <div className={variant === "drawer" ? "px-4 py-5" : ""} role="status" aria-live="polite">
        <div className="flex h-11 w-11 items-center justify-center rounded-[3px] bg-primary text-primary-foreground">
          <Check className="h-5 w-5" aria-hidden="true" />
        </div>
        <h2 className="mt-5 text-[24px] font-semibold leading-tight text-foreground md:text-[30px]">Заявка отправлена</h2>
        <p className="mt-2 max-w-[480px] text-[15px] leading-relaxed text-muted-foreground">
          Мы получили данные компании. Менеджер свяжется с вами по указанному телефону.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-6 min-h-11 rounded-[3px] bg-secondary px-5 text-[14px] font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          Вернуться к размещению
        </button>
      </div>
    );
  }

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
        <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor="partner-fax">Факс</label>
          <input
            id="partner-fax"
            type="text"
            name="fax"
            value={form.fax}
            onChange={(event) => update("fax", event.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        {/* Company name */}
        <div>
          <label htmlFor="partner-company-name" className="text-[13px] font-medium text-foreground mb-1.5 block">Название компании *</label>
          <input
            id="partner-company-name"
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
          <label htmlFor="partner-inn" className="text-[13px] font-medium text-foreground mb-1.5 block">ИНН *</label>
          <input
            id="partner-inn"
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
          <label htmlFor="partner-interest" className="text-[13px] font-medium text-foreground mb-1.5 block">Что вас интересует *</label>
          <div className="relative">
            <select
              id="partner-interest"
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
          <label htmlFor="partner-website" className="text-[13px] font-medium text-foreground mb-1.5 block">Сайт компании</label>
          <input
            id="partner-website"
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
          <label htmlFor="partner-contact-name" className="text-[13px] font-medium text-foreground mb-1.5 block">Контактное лицо *</label>
          <input
            id="partner-contact-name"
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
          <label htmlFor="partner-phone" className="text-[13px] font-medium text-foreground mb-1.5 block">Телефон *</label>
          <input
            id="partner-phone"
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
        disabled={submitState === "submitting"}
        className="mt-6 h-[52px] w-full rounded-[3px] bg-primary text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
      >
        {submitState === "submitting" ? "Отправляем…" : submitState === "error" ? "Повторить отправку" : "Отправить заявку"}
      </button>

      {submitError && (
        <p className="mt-3 text-center text-[13px] leading-relaxed text-red-500" role="alert">
          {submitError}
        </p>
      )}

      <p className="text-[11px] text-muted-foreground text-center mt-3 leading-relaxed">
        Нажимая «Отправить заявку», вы соглашаетесь с{" "}
        <Link to="/legal/terms" className="text-foreground transition-colors hover:text-primary">условиями использования сервиса</Link>
        {" "}и{" "}
        <Link to="/legal/privacy" className="text-foreground transition-colors hover:text-primary">политикой обработки персональных данных</Link>
      </p>
    </form>
  );
};

export default PartnerApplicationForm;
