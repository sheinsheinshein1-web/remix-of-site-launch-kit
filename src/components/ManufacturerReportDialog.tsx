import ReportDialog from "@/components/ReportDialog";

const REPORT_REASONS = [
  "Недостоверная информация в профиле",
  "Компания закрылась или не существует",
  "Подозрение на мошенничество",
  "Нарушение авторских или иных прав",
  "Оскорбительный или запрещённый контент",
  "Другое",
] as const;

interface ManufacturerReportDialogProps {
  manufacturerName: string;
  children: React.ReactNode;
}

const ManufacturerReportDialog = ({ manufacturerName, children }: ManufacturerReportDialogProps) => (
  <ReportDialog
    title="Пожаловаться на компанию"
    description={`Выберите причину. Мы проверим профиль компании «${manufacturerName}».`}
    reasons={REPORT_REASONS}
    subjectPrefix={`Жалоба на профиль ${manufacturerName}`}
    contextLines={[`Компания: ${manufacturerName}`]}
  >
    {children}
  </ReportDialog>
);

export default ManufacturerReportDialog;
