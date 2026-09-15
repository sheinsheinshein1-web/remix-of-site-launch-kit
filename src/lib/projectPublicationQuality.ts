import type { ProjectSourceFacts } from "@/data/projectSourceFacts";
import type { Project } from "@/data/projects";

export type ProjectPublicationContract = Readonly<{
  minimumGalleryItems: number;
  minimumDescriptionWords: number;
  expectedProductionAddress: string;
}>;

export type ProjectPublicationIssue = Readonly<{
  code:
    | "missing-source-facts"
    | "missing-room-fact"
    | "room-count-mismatch"
    | "missing-floor-fact"
    | "missing-media-audit"
    | "gallery-too-small"
    | "missing-published-plan"
    | "thin-description"
    | "production-address-mismatch";
  message: string;
}>;

export const projectPublicationContracts: Readonly<Record<string, ProjectPublicationContract>> = {
  bygge: {
    minimumGalleryItems: 8,
    minimumDescriptionWords: 24,
    expectedProductionAddress: "г. Екатеринбург",
  },
  platforma: {
    minimumGalleryItems: 3,
    minimumDescriptionWords: 24,
    expectedProductionAddress: "Свердловская область, г. Березовский, территория Южная промышленная зона, д. 21",
  },
};

const countWords = (value: string) => value.trim().split(/\s+/u).filter(Boolean).length;

/**
 * Проверка готовности проекта к публикации. Она не оценивает дизайн и не
 * придумывает отсутствующие данные: только сопоставляет карточку с уже
 * зафиксированным аудитом официального источника.
 */
export const auditProjectPublicationQuality = (
  project: Project,
  sourceFacts: ProjectSourceFacts | undefined,
  contract: ProjectPublicationContract,
): ProjectPublicationIssue[] => {
  const issues: ProjectPublicationIssue[] = [];

  if (!sourceFacts) {
    return [{ code: "missing-source-facts", message: "Нет проверенного слоя фактов проекта." }];
  }

  if (project.productType !== "bath") {
    const hasBedrooms = sourceFacts.bedrooms.status === "verified" || sourceFacts.bedrooms.status === "derived";
    const hasRoomCount = sourceFacts.roomCount.status === "verified";
    if (!hasBedrooms && !hasRoomCount) {
      issues.push({ code: "missing-room-fact", message: "Не подтверждены ни спальни, ни общее количество комнат." });
    }

    if (hasRoomCount && sourceFacts.roomCount.value && !project.rooms.includes(sourceFacts.roomCount.value)) {
      issues.push({ code: "room-count-mismatch", message: "Количество комнат в карточке расходится с источником." });
    }

    if (sourceFacts.floors.status !== "verified" && sourceFacts.floors.status !== "derived") {
      issues.push({ code: "missing-floor-fact", message: "Этажность жилого проекта не подтверждена." });
    }
  }

  if (!sourceFacts.media) {
    issues.push({ code: "missing-media-audit", message: "Не зафиксирована полнота официальной галереи." });
  } else {
    const requiredGalleryItems = Math.min(
      contract.minimumGalleryItems,
      sourceFacts.media.publishedImageCount,
    );
    if (project.gallery.length < requiredGalleryItems) {
      issues.push({
        code: "gallery-too-small",
        message: `В карточке ${project.gallery.length} изображений при минимуме ${requiredGalleryItems}.`,
      });
    }
    if (
      sourceFacts.media.planStatus === "published"
      && !project.gallery.some((item) => item.type === "plan")
    ) {
      issues.push({ code: "missing-published-plan", message: "У производителя есть планировка, но в карточке её нет." });
    }
  }

  if (countWords(project.descriptionLong) < contract.minimumDescriptionWords) {
    issues.push({ code: "thin-description", message: "Описание не проходит минимальный порог содержательности." });
  }

  if (
    sourceFacts.productionAddress.status !== "verified"
    || sourceFacts.productionAddress.value !== contract.expectedProductionAddress
  ) {
    issues.push({ code: "production-address-mismatch", message: "Место производства расходится с правилом производителя." });
  }

  return issues;
};
