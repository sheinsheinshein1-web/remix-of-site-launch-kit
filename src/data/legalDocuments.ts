import cookiesSource from "@/content/legal/cookies.txt?raw";
import privacySource from "@/content/legal/privacy.txt?raw";
import rulesSource from "@/content/legal/rules.txt?raw";
import termsSource from "@/content/legal/terms.txt?raw";

export type LegalDocumentSlug = "rules" | "terms" | "privacy" | "cookies";

export type LegalDocument = {
  slug: LegalDocumentSlug;
  path: `/legal/${LegalDocumentSlug}/`;
  navigationTitle: string;
  title: string;
  subtitle: string;
  seoDescription: string;
  source: string;
};

export type LegalDocumentSection = {
  id: string;
  title: string;
  paragraphs: string[];
};

export type ParsedLegalDocument = {
  title: string;
  subtitle: string;
  metadata: string[];
  introduction: string[];
  sections: LegalDocumentSection[];
};

export const legalDocuments: LegalDocument[] = [
  {
    slug: "rules",
    path: "/legal/rules/",
    navigationTitle: "Правила размещения справочной информации",
    title: "Правила размещения справочной информации",
    subtitle: "О компаниях и проектах на платформе многоместа.рф",
    seoDescription: "Правила размещения справочной информации о компаниях и проектах на платформе многоместа.рф.",
    source: rulesSource,
  },
  {
    slug: "terms",
    path: "/legal/terms/",
    navigationTitle: "Пользовательское соглашение",
    title: "Пользовательское соглашение",
    subtitle: "Об использовании платформы многоместа.рф",
    seoDescription: "Пользовательское соглашение об использовании платформы многоместа.рф.",
    source: termsSource,
  },
  {
    slug: "privacy",
    path: "/legal/privacy/",
    navigationTitle: "Политика обработки персональных данных",
    title: "Политика обработки персональных данных",
    subtitle: "На платформе многоместа.рф",
    seoDescription: "Политика обработки и защиты персональных данных на платформе многоместа.рф.",
    source: privacySource,
  },
  {
    slug: "cookies",
    path: "/legal/cookies/",
    navigationTitle: "Использование файлов cookie",
    title: "Использование файлов cookie",
    subtitle: "Необходимые и аналитические технологии платформы многоместа.рф",
    seoDescription: "Политика использования файлов cookie и аналогичных технологий на платформе многоместа.рф.",
    source: cookiesSource,
  },
];

export const getLegalDocument = (slug?: string) => (
  legalDocuments.find((document) => document.slug === slug)
);

const sectionHeadingPattern = /^(\d+)\.\s+[А-ЯЁ0-9][А-ЯЁ0-9\s«»„“”\-—,.()]+$/u;

export const parseLegalDocument = (source: string): ParsedLegalDocument => {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const title = lines[0]?.trim() ?? "";
  const subtitle = lines[1]?.trim() ?? "";
  const metadata = lines.slice(2, 4).map((line) => line.trim()).filter(Boolean);
  const bodyLines = lines.slice(4).map((line) => line.trim()).filter(Boolean);
  const introduction: string[] = [];
  const sections: LegalDocumentSection[] = [];
  let currentSection: LegalDocumentSection | undefined;

  bodyLines.forEach((line) => {
    const headingMatch = line.match(sectionHeadingPattern);
    if (headingMatch) {
      currentSection = {
        id: `section-${headingMatch[1]}`,
        title: line,
        paragraphs: [],
      };
      sections.push(currentSection);
      return;
    }

    if (currentSection) {
      currentSection.paragraphs.push(line);
    } else {
      introduction.push(line);
    }
  });

  return { title, subtitle, metadata, introduction, sections };
};
