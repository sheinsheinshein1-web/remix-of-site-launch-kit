import type { Manufacturer } from "@/data/manufacturers";
import type { Project } from "@/data/projects";
import { getProjectSourceFacts, type ProjectSourceFact } from "@/data/projectSourceFacts";

export type ManufacturerReadinessStatus = "ready" | "source-limited" | "needs-work";
export type ManufacturerReadinessSeverity = "blocking" | "source-limited";

export type ManufacturerReadinessIssue = Readonly<{
  code: string;
  severity: ManufacturerReadinessSeverity;
  message: string;
  projectId?: number;
}>;

export type ManufacturerReadiness = Readonly<{
  manufacturerId: string;
  status: ManufacturerReadinessStatus;
  projectCount: number;
  issues: readonly ManufacturerReadinessIssue[];
}>;

const REQUIRED_PROJECT_FACTS = [
  "area",
  "price",
  "productionTerm",
  "productionAddress",
  "technology",
  "insulation",
  "completion",
  "delivery",
  "style",
  "roomCount",
  "bedrooms",
  "bathrooms",
  "floors",
  "dimensions",
] as const;

const hasValue = (fact: ProjectSourceFact) => (
  (fact.status === "verified" || fact.status === "derived") && Boolean(fact.value?.trim())
);

const countWords = (value: string) => value.trim().split(/\s+/u).filter(Boolean).length;

/**
 * Единый барьер готовности профиля производителя.
 *
 * `ready` означает, что данные не только существуют, но и связаны с аудитом.
 * `source-limited` означает, что официальный источник проверен, но часть фактов
 * в нём не опубликована. `needs-work` означает нашу недоделку или конфликт.
 */
export const auditManufacturerPublicationQuality = (
  manufacturer: Manufacturer,
  projects: readonly Project[],
): ManufacturerReadiness => {
  const issues: ManufacturerReadinessIssue[] = [];
  const profile = manufacturer.profile;
  const audit = profile?.sourceAudit;
  const blocking = (code: string, message: string, projectId?: number) => {
    issues.push({ code, severity: "blocking", message, projectId });
  };
  const limited = (code: string, message: string, projectId?: number) => {
    issues.push({ code, severity: "source-limited", message, projectId });
  };

  if (!profile || !audit) {
    blocking("missing-source-audit", "Нет полного аудита официальных источников производителя.");
    return { manufacturerId: manufacturer.id, status: "needs-work", projectCount: projects.length, issues };
  }

  if (!profile.intro?.trim() || !profile.about?.length || !profile.seo || !profile.projectTabs?.length) {
    blocking("incomplete-profile", "Не заполнена обязательная структура профиля производителя.");
  }

  if (projects.length !== audit.catalog.expectedProjectCount) {
    blocking(
      "catalog-count-mismatch",
      `Локально ${projects.length} проектов, в контракте источника ${audit.catalog.expectedProjectCount}.`,
    );
  }

  const sourceUrls = projects.map((project) => project.sourceUrl?.trim()).filter(Boolean);
  if (audit.catalog.sourceMode !== "shared-catalog-page" && new Set(sourceUrls).size !== sourceUrls.length) {
    blocking("duplicate-project-source", "Несколько проектов используют один и тот же официальный URL.");
  }

  if (audit.legal.status === "imported" && !profile.legal) {
    blocking("missing-imported-legal", "Юридические данные отмечены импортированными, но отсутствуют в профиле.");
  } else if (audit.legal.status === "unverified") {
    limited("unverified-legal", "Связь бренда с юридическим лицом ещё не подтверждена; реквизиты не публикуются.");
  } else if (audit.legal.status === "not-found") {
    limited("legal-not-published", "Юридические реквизиты не найдены в проверенных источниках.");
  }

  if (audit.builtObjects.status === "imported" && !profile.builtObjects?.length) {
    blocking("missing-imported-objects", "Выполненные объекты отмечены импортированными, но галерея пуста.");
  } else if (audit.builtObjects.status === "not-imported") {
    blocking("objects-not-imported", "Найденные выполненные объекты ещё не импортированы.");
  } else if (audit.builtObjects.status === "not-found") {
    limited("objects-not-published", "Официальная галерея выполненных объектов не найдена.");
  }

  if (audit.reviews.status === "imported" && !manufacturer.externalRating) {
    blocking("missing-imported-reviews", "Отзывы отмечены импортированными, но рейтинг отсутствует.");
  } else if (audit.reviews.status !== "imported") {
    limited("external-reviews-unavailable", "Независимые отзывы не подключены.");
  }

  if (audit.production.status === "imported" && !manufacturer.productionAddress) {
    blocking("missing-imported-production", "Подтверждённая локация производства не подключена.");
  } else if (audit.production.status === "unverified") {
    blocking("unverified-production", "Локация производства ещё не подтверждена.");
  } else if (audit.production.status === "not-found") {
    limited("production-not-published", "Локация производства не опубликована официальным источником.");
  }

  const socialChecks = [
    {
      kind: "youtube",
      status: audit.social.youtube.status,
      imported: Boolean(profile.social?.youtubeVideos.length),
    },
    {
      kind: "telegram",
      status: audit.social.telegram.status,
      imported: Boolean(profile.social?.telegramChannel && profile.social.telegramPosts.length),
    },
  ] as const;
  for (const social of socialChecks) {
    if (social.status === "imported" && !social.imported) {
      blocking(`missing-imported-${social.kind}`, `${social.kind} отмечен импортированным, но данные отсутствуют.`);
    } else if (social.status === "unverified") {
      limited(`unverified-${social.kind}`, `${social.kind} найден, но ещё не подтверждён и не публикуется как официальный.`);
    } else if (social.status === "not-found") {
      limited(`${social.kind}-not-published`, `${social.kind} не найден в официальных источниках.`);
    }
  }

  for (const project of projects) {
    if (!project.sourceUrl?.trim()) blocking("missing-project-source", "У проекта нет официального URL.", project.id);
    if (!project.gallery.length) blocking("empty-project-gallery", "У проекта пустая галерея.", project.id);
    if (countWords(project.descriptionLong) < 24) {
      blocking("thin-project-description", "Описание проекта короче минимального содержательного порога.", project.id);
    }

    const facts = getProjectSourceFacts(project.id);
    if (!facts) {
      blocking("missing-project-facts", "У проекта отсутствует паспорт источников.", project.id);
      continue;
    }
    for (const field of REQUIRED_PROJECT_FACTS) {
      if (!facts[field]) blocking("missing-project-fact-state", `Не зафиксирован статус поля ${field}.`, project.id);
    }
    if (!facts.media) {
      blocking("missing-project-media-audit", "Не зафиксирован аудит изображений проекта.", project.id);
    } else {
      const requiredImages = Math.min(2, facts.media.publishedImageCount);
      if (project.gallery.length < requiredImages) {
        blocking("project-gallery-incomplete", "Галерея короче подтверждённого минимума источника.", project.id);
      }
      if (facts.media.planStatus === "published" && !project.gallery.some((item) => item.type === "plan")) {
        blocking("missing-published-plan", "Опубликованная производителем планировка не импортирована.", project.id);
      }
    }

    if (!hasValue(facts.area)) limited("project-area-not-published", "Площадь проекта не подтверждена источником.", project.id);
    if (!hasValue(facts.technology)) limited("project-technology-not-published", "Технология проекта не подтверждена источником.", project.id);
  }

  const status: ManufacturerReadinessStatus = issues.some((issue) => issue.severity === "blocking")
    ? "needs-work"
    : issues.length > 0
      ? "source-limited"
      : "ready";

  return { manufacturerId: manufacturer.id, status, projectCount: projects.length, issues };
};
