import type { ReactNode } from "react";
import PartnerApplicationForm from "@/components/PartnerApplicationForm";
import SiteBreadcrumbs, { siteBreadcrumbPageContainerClassName, type SiteBreadcrumbItem } from "@/components/SiteBreadcrumbs";

type PartnerApplicationContentProps = {
  breadcrumbItems: SiteBreadcrumbItem[];
  initialInterest: string;
  onBack: () => void;
  visual?: ReactNode;
};

const PartnerApplicationContent = ({
  breadcrumbItems,
  initialInterest,
  onBack,
  visual,
}: PartnerApplicationContentProps) => (
  <main className={`${siteBreadcrumbPageContainerClassName} pb-16 md:pb-24`}>
    <SiteBreadcrumbs items={breadcrumbItems} />
    <div className={visual ? "xl:grid xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:items-start xl:gap-16" : undefined}>
      <div className="max-w-[620px]">
        <PartnerApplicationForm onBack={onBack} initialInterest={initialInterest} />
      </div>
      {visual && (
        <aside className="hidden xl:block" aria-label="Пример размещения на платформе">
          <div className="sticky top-[96px]">{visual}</div>
        </aside>
      )}
    </div>
  </main>
);

export default PartnerApplicationContent;
