import type { Project } from "../../src/data/projects";
import type { Maker } from "../../src/data/manufacturers";
import type { ProjectSourceFact, ProjectSourceFacts } from "../../src/data/projectSourceFacts";
import { PROJECT_TECHNOLOGY } from "../../src/lib/projectTechnology";
import { completeCollectorResultSchema, type CollectorResult, type RawProject } from "../../src/features/agent-office/collector-contract";
import type { PreparedProject, PreparationReport, ProjectDraft, PreparationResult } from "../../src/features/agent-office/preparation-contract";

export interface PreparationContext {
  manufacturers: Maker[]; projects: Project[]; referenceFacts: Record<number, ProjectSourceFacts>;
  validateManufacturer: (record: Maker) => boolean;
}
const count = (value: string | null, noun: string): number | null => {
  if (value === null) return null;
  const match = value.match(new RegExp(`(?:^|[^\\d])([1-9]\\d*)\\s+(?:отдельных\\s+|изолированных\\s+)?${noun}`, "i"));
  return match ? Number(match[1]) : null;
};
export function unambiguousArea(value: string | null): number | null {
  if (value === null) return null;
  const match = value.trim().match(/^(\d+(?:[.,]\d+)?)\s*м(?:²|2)$/i);
  return match && Number(match[1].replace(",", ".")) > 0 ? Number(match[1].replace(",", ".")) : null;
}

export function prepareCatalog(raw: CollectorResult, context: PreparationContext) {
  completeCollectorResultSchema.parse(raw);
  const manufacturerPackage = structuredClone(raw.manufacturerPackage!);
  const manufacturerId = "ir365";
  if (new URL(raw.manufacturer.officialWebsite).hostname !== "ir365.ru") throw new Error("Этот этап предназначен для сохранённого каталога ИР365");
  const references = context.manufacturers.filter(m => m.id === "platforma" || m.id === "bygge");
  if (references.length !== 2) throw new Error("Не найдены оба эталонных производителя");
  const referenceProjects = context.projects.filter(p => p.manufacturerId === "platforma" || p.manufacturerId === "bygge");
  if (!referenceProjects.some(p=>p.manufacturerId==='platforma') || !referenceProjects.some(p=>p.manufacturerId==='bygge')) throw new Error("Не найдены проекты обоих эталонов");
  const checkedAtIso = raw.completedAt.slice(0,10);
  const sourceFact = (value: string | null, sourceUrl: string, evidence: string): ProjectSourceFact => ({ value, status: value === null ? "not-published" : "derived", sourceUrl, checkedAtIso, evidence });
  const manufacturer: PreparationResult["manufacturer"] = {
    record: { id: manufacturerId, name: raw.manufacturer.name, initials: "ИР", siteUrl: raw.manufacturer.officialWebsite, verified: false },
    fieldSources: {
      name: sourceFact(raw.manufacturer.name,raw.manufacturer.sourceUrl,"Название перенесено из сохранённого результата; новая проверка не выполнялась."),
      siteUrl: sourceFact(raw.manufacturer.officialWebsite,raw.manufacturer.sourceUrl,"Официальный сайт из сохранённого результата Scout/Collector."),
    },
    unknownFields: Object.fromEntries(["logo","productionAddress","phone","email","telegram","externalRating","profile.intro","profile.about","profile.coordinates","profile.legal","profile.builtObjects","profile.social","profile.sourceAudit","profile.seo"].map(k=>[k,null])),
    schemaCompatible: false, ready: false,
  };
  const company = manufacturerPackage.company;
  for (const key of ["name","siteUrl","phone","email","logo","telegram"] as const) {
    const fact=company.fields[key]; if(fact?.value!==null && fact?.value!==undefined) {
      manufacturer.record[key]=fact.value;
      manufacturer.fieldSources[key]={value:fact.value,status:"derived",sourceUrl:fact.sourceUrl,checkedAtIso:company.collectedAt.slice(0,10),evidence:fact.note};
    }
  }
  const additionalPhones=company.fields.additionalPhones;
  if(additionalPhones.value) {manufacturer.record.additionalPhones=additionalPhones.value.split('; ');manufacturer.fieldSources.additionalPhones={value:additionalPhones.value,status:'derived',sourceUrl:additionalPhones.sourceUrl,checkedAtIso:company.collectedAt.slice(0,10),evidence:additionalPhones.note};}
  const intro=company.fields['profile.intro'],about=company.fields['profile.about'];
  if(intro.value||about.value)manufacturer.record.profile={...(intro.value?{intro:intro.value}:{}),...(about.value?{about:about.value.split('\n\n')}:{})};
  for(const key of ['profile.intro','profile.about']){const f=company.fields[key];if(f.value)manufacturer.fieldSources[key]={value:f.value,status:'derived',sourceUrl:f.sourceUrl,checkedAtIso:company.collectedAt.slice(0,10),evidence:f.note};}
  manufacturer.unknownFields=Object.fromEntries(Object.entries(company.fields).filter(([,f])=>f.value===null).map(([k])=>[k,null]));
  manufacturer.unknownFields['profile.sourceAudit']=null;
  manufacturer.schemaCompatible = context.validateManufacturer(manufacturer.record);
  const idBase = Math.max(...context.projects.map(p=>p.id)) + 1;
  if (!Number.isSafeInteger(idBase) || idBase < 1) throw new Error("Нельзя предложить уникальные ID проектов");
  const projects: PreparedProject[] = raw.projects.map((p,index) => {
    const fieldSources: Record<string,ProjectSourceFact> = {};
    const transfer = (field: string, value: string | null, source: RawProject["name"], note = "Исходная строка из сохранённого JSON, без новой проверки сайта.") => {
      fieldSources[field] = sourceFact(value,source.sourceUrl,`${note} Исходное значение: ${source.value ?? "null"}`); return value;
    };
    const ambiguities: string[] = [];
    // short_description is decoded already in the Collector's sections.
    const short = p.sections.find(s=>s.heading==='short_description');
    const bedCount = count(p.bedrooms.value,"спальн"), bathCount = count(p.bathrooms.value,"сануз"), floorCount = count(p.floors.value,"этаж");
    for (const [field,value,source] of [["beds",bedCount,p.bedrooms],["baths",bathCount,p.bathrooms],["floors",floorCount,p.floors]] as const) {
      transfer(field,value === null ? null : String(value),source,"Число переносится только при явно записанном количестве; упоминание комнаты не считается числом.");
      if (value === null && source.value !== null) ambiguities.push(`${field}: есть описание, но однозначное числовое количество не выделено.`);
    }
    const productType = p.type.value === "дом" ? "house" : p.type.value === "баня" ? "bath" : null;
    transfer("productType",productType,p.type,"Соответствие существующему Project.productType: дом → house, баня → bath.");
    const area = transfer("area",p.area.value,p.area); const area_m2 = unambiguousArea(area);
    transfer("area_m2",area_m2 === null ? null : String(area_m2),p.area,"Нормализация однозначного числа м², без выбора значения из диапазона.");
    if (area && area_m2 === null) ambiguities.push(`area_m2: площадь «${area}» не является единственным числом; выбор значения и SEO-адрес требуют решения человека.`);
    const additionalArea = p.characteristics.filter(c=>/площадь/i.test(c.label) && c.value!==area);
    if (additionalArea.length) ambiguities.push(`Дополнительные площади сохраняются в сырье: ${additionalArea.map(c=>`${c.label}: ${c.value}`).join('; ')}. Их нельзя смешивать с площадью дома.`);
    let technology: string | null = null;
    // A null Collector technology must remain unknown, even if a category looks modular.
    if (p.technology.value !== null) {
      const evidence = `${p.name.value ?? ""} ${p.technology.value}`;
      if (/каркас/i.test(evidence) && /модуль/i.test(p.name.value ?? "")) technology = PROJECT_TECHNOLOGY.frameModular.value;
      else ambiguities.push("technology: исходное описание материалов не даёт однозначного значения фильтра технологии.");
    }
    transfer("technology",technology,p.technology,"Сопоставление с существующим PROJECT_TECHNOLOGY; исходный null не заполняется по категории.");
    let completion: string | null = null;
    if (p.configuration.value !== null) {
      if (p.variations?.value.length) ambiguities.push("completion/price: есть несколько комплектаций и цен; Project не имеет модели вариантов. Базовую цену сохраняем с «от», комплектацию не выбираем.");
      else if (/^Комфорт$/i.test(p.configuration.value)) completion=p.configuration.value;
      else ambiguities.push("completion: подробная комплектация не соответствует однозначно короткому полю Project.completion; таблицы остаются в сырье и descriptionLong.");
    }
    transfer("completion",completion,p.configuration,"Не выбирается комплектация по умолчанию и не предполагается «Под ключ».");
    const roomsSource = p.characteristics.find(c=>/^(Особенности|Состав)$/i.test(c.label));
    const insulationSource = p.characteristics.find(c=>/^Изоляционные материалы$|^Утепление$/i.test(c.label));
    const materialSection = p.sections.find(s=>s.heading === 'Конструкция и материалы');
    const materialFact = (field: string, expression: RegExp) => {
      const value = materialSection?.text.match(expression)?.[0] ?? null;
      return value && materialSection ? transfer(field,value,{value,sourceUrl:materialSection.sourceUrl},"Точная выдержка из сохранённого раздела «Конструкция и материалы».") : null;
    };
    const deliverySource = p.characteristics.find(c=>c.label === 'Доставка и установка');
    const steamArea = roomsSource?.value.match(/парная\s*\((\d+(?:[.,]\d+)?\s*м(?:²|2))\)/i)?.[1] ?? null;
    const gallery = p.photos ? [...new Set(p.photos.map(i=>i.url))].map(image=>({image})) : null;
    if (gallery) {
      fieldSources.gallery=sourceFact(String(gallery.length),p.officialPage,"Перенесены URL из сохранённой галереи. Фото/рендер/план и дубли размеров не классифицированы.");
      gallery.forEach((item,i)=>{ fieldSources[`gallery.${i}.image`]=sourceFact(item.image,p.photos!.find(photo=>photo.url===item.image)!.sourceUrl,"Исходный URL изображения из сохранённого каталога."); });
      ambiguities.push("gallery/hasRealPhotos: требуется отличить фото, рендеры и планы, проверить дубли размеров. Тип изображения не угадан.");
    }
    const record: ProjectDraft = {
      id:idBase+index,name:transfer("name",p.name.value,p.name),manufacturerId,
      badge:transfer("badge",productType==='house'?'Модульный дом':productType==='bath'?'Модульная баня':null,p.name,"Обозначение типа из исходного названия; не подтверждает неизвестную технологию."),
      productType,price:transfer("price",p.price.value,p.price),area,area_m2,
      beds:bedCount,baths:bathCount,floors:floorCount,
      term:transfer("term",p.manufacturingTime.value,p.manufacturingTime),
      rooms:roomsSource ? transfer("rooms",roomsSource.value,roomsSource) : null,
      purpose:null,city:transfer("city",raw.city,{value:raw.city,sourceUrl:raw.manufacturer.sourceUrl},"Город исходной задачи и выбранного кандидата; не адрес производства."),sourceUrl:p.officialPage,
      dimensions:transfer("dimensions",p.dimensions.value,p.dimensions),
      description:short ? transfer("description",short.text,{value:short.text,sourceUrl:short.sourceUrl}) : null,
      descriptionLong:transfer("descriptionLong",p.description.value,p.description),gallery,
      likes:null,rating:null,suitableFor:null,technology,completion,
      insulation:insulationSource ? transfer("insulation",insulationSource.value,insulationSource) : materialFact("insulation",/Утепление[^.]+\.?/i),
      features:null,style:null,landSize:null,hasRealPhotos:null,hasShowroom:null,hasInstallment:null,
      deliveryRegionSlugs:null,routeArea_m2:null,kitchens:null,useCases:null,
      steamRoomArea:steamArea && roomsSource ? transfer("steamRoomArea",steamArea,roomsSource,"Площадь парной явно приведена в исходном составе помещений.") : null,
      steamRoomFinish:materialFact("steamRoomFinish",/Парная\s*[—–-][^.]+\.?/i),
      floorFinish:materialFact("floorFinish",/Пол\s*[—–-][^.]+\.?/i),
    };
    if (p.manufacturingTime.value && /месяц|монтаж/i.test(p.manufacturingTime.value)) ambiguities.push("term: сохранён полный исходный срок; месяцы не заменены условными 30 днями, производство не смешано с монтажом.");
    const missingFields = Object.entries(record).filter(([,v])=>v===null).map(([k])=>k);
    const fs = (field:string, fallback:RawProject["name"]) => fieldSources[field] ?? sourceFact(null,fallback.sourceUrl,"В сохранённом пакете нет однозначного значения. Повторный поиск не выполнялся.");
    const sourceFacts: ProjectSourceFacts = {
      area:fs('area',p.area),price:fs('price',p.price),productionTerm:fs('term',p.manufacturingTime),
      productionAddress:sourceFact(null,company.fields.productionAddress.sourceUrl,"Сведения компании собраны. Город не является точным адресом производства; адрес остаётся неизвестным до разрешения расхождений."),
      technology:fs('technology',p.technology),insulation:fs('insulation',p.technology),completion:fs('completion',p.configuration),
      delivery:deliverySource ? sourceFact(deliverySource.value,deliverySource.sourceUrl,"Исходные условия доставки и установки; география по реестру regions не установлена.") : sourceFact(null,p.officialPage,"В сырье нет отдельно выделенных условий доставки; география по реестру regions не установлена."),
      style:sourceFact(null,p.officialPage,"Стиль не определяется из названия серии."),
      roomCount:sourceFact(null,p.officialPage,"Общее количество комнат не суммируется из описания планировки."),
      bedrooms:fs('beds',p.bedrooms),bathrooms:fs('baths',p.bathrooms),floors:fs('floors',p.floors),dimensions:fs('dimensions',p.dimensions),
    };
    const required:(keyof Project)[]=['id','name','badge','price','area','beds','baths','floors','term','rooms','purpose','city','manufacturerId','description','descriptionLong','gallery','likes','rating','suitableFor','technology','completion','insulation','features','style','landSize','hasRealPhotos','hasShowroom','hasInstallment'];
    const ready=required.every(key=>record[key]!==null&&record[key]!==undefined)&&ambiguities.length===0;
    return { record,sourceProductId:p.sourceProductId,sourceFacts,fieldSources,missingFields,ambiguities,ready };
  });
  const report: PreparationReport = {
    preparedCount:projects.length,readyCount:projects.filter(p=>p.ready).length,manufacturerSchemaCompatible:manufacturer.schemaCompatible,manufacturerReady:manufacturer.ready,
    fullyReadyData:["Данные компании, для которых найдено однозначное соответствие, перенесены в существующие поля Maker с источниками.","Все проекты связаны через manufacturerId; типы house/bath разделены.","Названия, исходные цены с «от», описания, размеры, URL изображений и источники перенесены из сохранённого пакета."],
    missingFields:[...Object.keys(manufacturer.unknownFields).map(k=>`manufacturer.${k}`),...new Set(projects.flatMap(p=>p.missingFields).map(k=>`Project.${k}`))],
    ambiguousMappings:[...new Set(projects.flatMap(p=>p.ambiguities)),"Предложенные ID не зарезервированы в каталоге; перед применением требуется повторная проверка коллизий."],
    referenceDifferences:[
      "В отличие от эталонных записей, неизвестные числа, логические признаки и рейтинги остаются null. Нули и значения Platforma/BYGGE не копируются.",
      "Project требует beds/baths/floors и другие поля без null; черновики имеют его существующие поля, но пока не являются допустимыми записями Project.",
      "createManufacturerCatalogProjects подставляет 0 и значения по умолчанию — для этого пакета он намеренно не вызывается.",
      "Полный sourceAudit производителя не заполнен: исходный пакет не содержит юридического аудита, независимых отзывов, точного адреса производства, построенных объектов и социальных каналов. Статус «не найдено» не заменяет «не проверено».",
      "ProjectSourceFacts используется в существующем формате. Нормализация помечена derived, неизвестное — not-published с пояснением; новая внешняя верификация не выполнялась.",
      "Галерея эталонов различает фото и планы; в сырье ИР365 эти типы не подтверждены. Короткие настройки комплектации, доставки, SEO и назначения требуют решения человека.",
    ],
  };
  if (context.manufacturers.some(m=>m.id===manufacturerId || m.siteUrl?.replace(/\/$/,'')===raw.manufacturer.officialWebsite.replace(/\/$/,''))) report.ambiguousMappings.push("Идентификатор или домен производителя уже присутствует в реестре; требуется решить обновление/дубль.");
  report.ambiguousMappings.push(...manufacturerPackage.conflicts.map(c=>c.field+": "+c.reason));
  report.referenceDifferences.push("Эталонные записи содержат полный профиль компании. Новая единица передачи — пакет производителя; сведения о компании больше не подменяются метаданными кандидата Scout.");
  manufacturerPackage.readiness.status='needs-review';
  manufacturerPackage.readiness.blockers.push(...report.referenceDifferences.filter(s=>s.startsWith('Project требует')), ...report.ambiguousMappings);
  manufacturerPackage.readiness.ready=manufacturer.ready&&projects.every(p=>p.ready)&&manufacturerPackage.conflicts.length===0&&manufacturerPackage.duplicates.matches.length===0;
  manufacturerPackage.readiness.dataComplete=manufacturerPackage.missingData.length===0&&projects.every(p=>p.missingFields.length===0)&&manufacturerPackage.conflicts.length===0;
  return { manufacturerPackage,rawProjects:raw.projects,manufacturer,projects,links:projects.map(p=>({manufacturerId,projectId:p.record.id!,sourceProductId:p.sourceProductId})),
    references:{files:['src/data/manufacturers.ts','src/data/projects.ts','src/data/manufacturerCatalogProjects.ts','src/data/projectSourceFacts.ts','src/lib/projectTechnology.ts','src/lib/projectPublicationQuality.ts'],manufacturerIds:['platforma','bygge'],projectIds:referenceProjects.map(p=>p.id)},report,
    referenceSnapshot:{manufacturers:references,projects:referenceProjects,sourceFacts:Object.fromEntries(referenceProjects.map(p=>[p.id,context.referenceFacts[p.id]??null]))},
  };
}
