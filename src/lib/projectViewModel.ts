import { manufacturerRegistry } from "@/data/manufacturers";
import { projectMobileThumbs, projectThumbs } from "@/data/projectThumbs";
import { projects, type Project } from "@/data/projects";
import {
  getProjectSourceFacts,
  resolveOptionalProjectFact,
  resolveOptionalProjectFactNumber,
  resolveRequiredProjectFact,
} from "@/data/projectSourceFacts";
import { isVerifiedMaker } from "@/lib/verifiedMakers";
import {
  formatProjectPriceLabel,
  getProjectAreaAmount,
  getProjectFactLabels,
  getProjectObjectType,
  getProjectPriceAmount,
  getProjectTermDays,
  isBathProject,
} from "@/lib/projectDomain";
import { getProjectPath } from "@/lib/siteRoutes";

const projectsById = new Map(projects.map((project) => [project.id, project]));

export const getProject = (projectId: number) => projectsById.get(projectId);

const getProjectManufacturer = (project: Project) => manufacturerRegistry[project.manufacturerId];

export const getProjectCardViewModel = (projectId: number) => {
  const project = getProject(projectId);
  if (!project) return null;

  const manufacturer = getProjectManufacturer(project);
  if (!manufacturer) return null;

  const sourceFacts = getProjectSourceFacts(project.id);
  const displayArea = resolveRequiredProjectFact(sourceFacts?.area, project.area);
  const displayPrice = resolveRequiredProjectFact(sourceFacts?.price, project.price);
  const displayProductionTerm = resolveRequiredProjectFact(sourceFacts?.productionTerm, project.term);
  const displayBeds = resolveOptionalProjectFactNumber(sourceFacts?.bedrooms, project.beds) ?? 0;
  const displayBaths = resolveOptionalProjectFactNumber(sourceFacts?.bathrooms, project.baths) ?? 0;
  const displayFloors = resolveOptionalProjectFactNumber(sourceFacts?.floors, project.floors) ?? 0;
  const displayProject = {
    ...project,
    area: displayArea,
    beds: displayBeds,
    baths: displayBaths,
    floors: displayFloors,
  };

  const galleryImages = project.gallery.map((item) => item.image);
  const firstImage = galleryImages[0] ?? "";

  return {
    id: project.id,
    name: project.name,
    badge: project.badge,
    href: getProjectPath(project),
    price: {
      raw: displayPrice,
      amount: getProjectPriceAmount(displayPrice),
      label: formatProjectPriceLabel(displayPrice),
    },
    area: {
      raw: displayArea,
      amount: getProjectAreaAmount({ area: displayArea }),
    },
    termDays: getProjectTermDays(displayProductionTerm),
    objectType: getProjectObjectType(project),
    isBath: isBathProject(project),
    facts: getProjectFactLabels(displayProject),
    manufacturer: {
      id: manufacturer.id,
      name: manufacturer.name,
      verified: isVerifiedMaker(manufacturer.id),
    },
    gallery: {
      desktop: firstImage
        ? [projectThumbs[project.id] ?? firstImage, ...galleryImages.slice(1)]
        : [],
      mobile: firstImage
        ? [projectMobileThumbs[project.id], ...galleryImages.slice(1).map(() => undefined)]
        : [],
      fits: project.gallery.map((item) => item.fit ?? "cover"),
      objectPositions: project.gallery.map((item) => item.objectPosition),
      firstImage,
    },
    favorite: {
      id: project.id,
      badge: project.badge,
      maker: manufacturer.name,
      name: project.name,
      price: displayPrice,
      area: displayArea,
      beds: displayBeds,
      baths: displayBaths,
      term: displayProductionTerm,
      image: firstImage,
      likes: project.likes,
      city: project.city,
    },
    likes: project.likes,
  };
};

export const getProjectDetailViewModel = (projectId: number) => {
  const project = getProject(projectId);
  if (!project) return null;

  const manufacturer = getProjectManufacturer(project);
  if (!manufacturer) return null;

  const sourceFacts = getProjectSourceFacts(project.id);
  const displayArea = resolveRequiredProjectFact(sourceFacts?.area, project.area);
  const displayPrice = resolveRequiredProjectFact(sourceFacts?.price, project.price);
  const displayProductionTerm = resolveRequiredProjectFact(sourceFacts?.productionTerm, project.term);
  const displayProductionAddress = resolveRequiredProjectFact(
    sourceFacts?.productionAddress,
    manufacturer.productionAddress,
  );
  const displayBeds = resolveOptionalProjectFactNumber(sourceFacts?.bedrooms, project.beds) ?? 0;
  const displayRoomCount = resolveOptionalProjectFactNumber(sourceFacts?.roomCount) ?? 0;
  const displayBaths = resolveOptionalProjectFactNumber(sourceFacts?.bathrooms, project.baths) ?? 0;
  const displayFloors = resolveOptionalProjectFactNumber(sourceFacts?.floors, project.floors) ?? 0;

  return {
    project,
    manufacturer,
    sourceFacts,
    canonicalPath: getProjectPath(project),
    price: {
      raw: displayPrice,
      amount: getProjectPriceAmount(displayPrice),
      label: formatProjectPriceLabel(displayPrice),
    },
    area: {
      raw: displayArea,
      amount: getProjectAreaAmount({ area: displayArea }),
    },
    termDays: getProjectTermDays(displayProductionTerm),
    production: {
      term: displayProductionTerm,
      address: displayProductionAddress,
    },
    rooms: {
      count: displayRoomCount,
      beds: displayBeds,
      baths: displayBaths,
      floors: displayFloors,
      kitchens: project.kitchens,
    },
    specifications: {
      technology: resolveRequiredProjectFact(sourceFacts?.technology, project.technology),
      insulation: resolveRequiredProjectFact(sourceFacts?.insulation, project.insulation),
      completion: resolveRequiredProjectFact(sourceFacts?.completion, project.completion),
      delivery: resolveRequiredProjectFact(sourceFacts?.delivery),
      style: resolveOptionalProjectFact(sourceFacts?.style, project.style),
      dimensions: resolveRequiredProjectFact(sourceFacts?.dimensions, project.dimensions),
    },
    editorialFacts: {
      productionTerm: resolveOptionalProjectFact(sourceFacts?.productionTerm, project.term),
      productionAddress: resolveOptionalProjectFact(
        sourceFacts?.productionAddress,
        manufacturer.productionAddress,
      ),
      technology: resolveOptionalProjectFact(sourceFacts?.technology, project.technology),
      insulation: resolveOptionalProjectFact(sourceFacts?.insulation, project.insulation),
      completion: resolveOptionalProjectFact(sourceFacts?.completion, project.completion),
      delivery: resolveOptionalProjectFact(sourceFacts?.delivery),
      style: resolveOptionalProjectFact(sourceFacts?.style, project.style),
    },
    objectType: getProjectObjectType(project),
    isBath: isBathProject(project),
    facts: getProjectFactLabels({
      ...project,
      area: displayArea,
      beds: displayBeds,
      baths: displayBaths,
      floors: displayFloors,
    }),
  };
};
