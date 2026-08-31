import { Link } from "react-router-dom";
import ReportDialog from "@/components/ReportDialog";

const PROJECT_REPORT_REASONS = [
  "Недостоверная цена или характеристики",
  "Проект больше не продаётся",
  "Проект размещён без согласия собственника или правообладателя",
  "Проект дублируется в каталоге",
  "Подозрение на мошенничество",
  "Нарушение авторских или иных прав",
  "Другое",
] as const;

type ProjectReportDialogProps = {
  projectId: number;
  projectName: string;
  manufacturerName: string;
  children: React.ReactNode;
};

const ProjectReportDialog = ({
  projectId,
  projectName,
  manufacturerName,
  children,
}: ProjectReportDialogProps) => (
  <ReportDialog
    title="Пожаловаться на проект"
    description={`Выберите причину. Мы проверим проект «${projectName}» и свяжемся с производителем при необходимости.`}
    reasons={PROJECT_REPORT_REASONS}
    subjectPrefix={`Жалоба на проект ${projectName}`}
    contextLines={[
      `Проект: ${projectName}`,
      `ID проекта: ${projectId}`,
      `Производитель: ${manufacturerName}`,
    ]}
    additionalContent={(
      <div className="mt-5 text-[14px] leading-relaxed text-[#717b8e]">
        <span>Этот проект принадлежит вашей компании? </span>
        <Link
          to={`/messages/support?topic=claim-project&project=${projectId}`}
          className="inline-flex min-h-11 items-center font-medium text-[#342d27] transition-colors hover:text-primary focus-visible:rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:text-foreground"
        >
          Подтвердить профиль
        </Link>
      </div>
    )}
  >
    {children}
  </ReportDialog>
);

export default ProjectReportDialog;
