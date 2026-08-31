import { FormEvent, ReactNode, useId, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { sendSupportMessage } from "@/lib/supportChat";

type ReportDialogProps = {
  title: string;
  description: string;
  reasons: readonly string[];
  subjectPrefix: string;
  contextLines: readonly string[];
  children: ReactNode;
  additionalContent?: ReactNode;
};

const ReportDialog = ({
  title,
  description,
  reasons,
  subjectPrefix,
  contextLines,
  children,
  additionalContent,
}: ReportDialogProps) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const idPrefix = useId().replaceAll(":", "");

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setReason("");
      setComment("");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reason || sending) return;

    const body = [
      subjectPrefix,
      ...contextLines,
      `Страница: ${window.location.href}`,
      `Причина: ${reason}`,
      comment.trim() ? `Комментарий: ${comment.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    setSending(true);
    try {
      await sendSupportMessage(body);
      toast.success("Жалоба отправлена оператору поддержки");
      handleOpenChange(false);
    } catch {
      toast.error("Не удалось отправить жалобу. Попробуйте ещё раз");
    } finally {
      setSending(false);
    }
  };

  const commentId = `${idPrefix}-report-comment`;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90dvh] w-[calc(100%-24px)] max-w-[560px] overflow-y-auto rounded-[var(--radius)] border-[#dfe5f5] bg-white p-5 shadow-xl sm:p-7 dark:border-border dark:bg-background">
        <DialogHeader className="pr-8 text-left">
          <DialogTitle className="text-[24px] font-semibold leading-tight tracking-[-0.025em] text-[#342d27] dark:text-foreground">
            {title}
          </DialogTitle>
          <DialogDescription className="pt-2 text-[14px] leading-relaxed text-[#717b8e]">
            {description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2">
          <RadioGroup value={reason} onValueChange={setReason} aria-label="Причина жалобы" className="gap-1">
            {reasons.map((item, index) => {
              const itemId = `${idPrefix}-report-reason-${index}`;
              return (
                <Label
                  key={item}
                  htmlFor={itemId}
                  className="group flex min-h-11 cursor-pointer items-center gap-3 rounded-[var(--radius)] px-2.5 py-2.5 text-[15px] font-normal leading-snug text-[#342d27] transition-colors hover:bg-secondary focus-within:bg-secondary dark:text-foreground"
                >
                  <RadioGroupItem id={itemId} value={item} className="h-5 w-5 shrink-0 border-[#9aa4b7]" />
                  <span>{item}</span>
                </Label>
              );
            })}
          </RadioGroup>

          <div className="mt-5">
            <Label htmlFor={commentId} className="text-[14px] font-medium text-[#342d27] dark:text-foreground">
              Комментарий <span className="font-normal text-[#717b8e]">(необязательно)</span>
            </Label>
            <Textarea
              id={commentId}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              maxLength={800}
              placeholder="Расскажите подробнее, что не так"
              className="mt-2 min-h-[104px] resize-y rounded-[var(--radius)] border-[#dfe5f5] bg-white px-3 py-3 text-[16px] text-[#342d27] focus-visible:ring-primary/30 focus-visible:ring-offset-0 dark:border-border dark:bg-background dark:text-foreground"
            />
          </div>

          {additionalContent}

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="min-h-11 rounded-[var(--radius)] px-5 text-[14px] font-medium text-[#342d27] transition-colors hover:bg-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:text-foreground"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={!reason || sending}
              className="min-h-11 rounded-[var(--radius)] bg-primary px-5 text-[14px] font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {sending ? "Отправляем…" : "Отправить"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;
