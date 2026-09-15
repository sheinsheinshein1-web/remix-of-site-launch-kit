import { createHash } from 'node:crypto';
import type { CollectorResult } from '../../src/features/agent-office/collector-contract';
import { manufacturerPackageSchema, type CompanyData, type ManufacturerPackage, type PackageIssue } from '../../src/features/agent-office/manufacturer-package-contract';
import type { PreparationContext } from './preparation';
import { normalizeDomain, normalizeIdentity, sameDomain } from './scout';
import { canonicalUrl } from './collector';
export const hashProjects=(raw:CollectorResult)=>createHash('sha256').update(JSON.stringify(raw.projects)).digest('hex');
export function buildManufacturerPackage(raw:CollectorResult,company:CompanyData,context:PreparationContext,lineage:ManufacturerPackage['lineage']):ManufacturerPackage {
  const missingData:PackageIssue[]=[],conflicts:PackageIssue[]=[],matches:PackageIssue[]=[];
  const issue=(field:string,reason:string,values:PackageIssue['values']):PackageIssue=>({field,reason,values,sourceUrls:[...new Set(values.map(v=>v.sourceUrl))]});
  for(const [key,f] of Object.entries(company.fields)){
    if(f.value===null)missingData.push({...issue('company.'+key,f.note,f.observations),sourceUrls:[...new Set([f.sourceUrl,...f.observations.map(o=>o.sourceUrl)])]});
    if(f.status==='conflict')conflicts.push(issue('company.'+key,f.note,f.observations));
  }
  for(const p of raw.projects){
    for(const key of p.missingFields)missingData.push({...issue(`projects.${p.sourceProductId}.${key}`,'Не указано в сохранённом официальном результате',[]),sourceUrls:[p.officialPage]});
    const areas=[p.area,...p.characteristics.filter(c=>/площадь/i.test(c.label))].filter(c=>c.value!==null);
    if(/\d\s*[-–]\s*\d/.test(p.area.value??''))conflicts.push(issue(`projects.${p.sourceProductId}.area`,'Диапазон площади нельзя однозначно перенести в числовую площадь',areas.map(a=>({value:a.value!,sourceUrl:a.sourceUrl}))));
    // Preserve alternatives as evidence; they are not automatically contradictions.
    if(p.variations?.value.length)conflicts.push(issue(`projects.${p.sourceProductId}.completion`,'Несколько комплектаций и цен: выбор варианта для единственной записи Project требует решения',[{value:JSON.stringify(p.variations.value),sourceUrl:p.variations.sourceUrl}]));
  }
  const domain=normalizeDomain(raw.manufacturer.officialWebsite),name=normalizeIdentity(raw.manufacturer.name);
  for(const m of context.manufacturers)if(sameDomain(domain,normalizeDomain(m.siteUrl??''))||name===normalizeIdentity(m.name))matches.push(issue('company','Совпадение с существующим производителем '+m.id,[{value:m.name,sourceUrl:m.siteUrl??raw.manufacturer.sourceUrl}]));
  for(let i=0;i<raw.projects.length;i++){
    const p=raw.projects[i];
    for(const other of raw.projects.slice(0,i))if(p.sourceProductId===other.sourceProductId||canonicalUrl(p.officialPage)===canonicalUrl(other.officialPage)||normalizeIdentity(p.name.value??'')===normalizeIdentity(other.name.value??''))matches.push(issue(`projects.${p.sourceProductId}`,'Возможный дубль внутри пакета',[{value:other.name.value??String(other.sourceProductId),sourceUrl:other.officialPage},{value:p.name.value??String(p.sourceProductId),sourceUrl:p.officialPage}]));
    for(const other of context.projects)if(other.sourceUrl&&canonicalUrl(other.sourceUrl)===canonicalUrl(p.officialPage))matches.push(issue(`projects.${p.sourceProductId}`,'Официальный URL уже существует в каталоге: '+other.id,[{value:other.name,sourceUrl:other.sourceUrl}]));
  }
  const images=[...company.images.map(i=>({url:i.url,sourceUrl:i.sourceUrl,projectId:null})),...raw.projects.flatMap(p=>(p.photos??[]).map(i=>({url:i.url,sourceUrl:i.sourceUrl,projectId:p.sourceProductId})))];
  const imageGroups=new Map<string,typeof images>();
  for(const i of images){const key=i.url.replace(/-\d+x\d+(?=\.[a-z]+(?:\?|$))/i,'');imageGroups.set(key,[...(imageGroups.get(key)??[]),i]);}
  for(const list of imageGroups.values())if(list.length>1)matches.push(issue('images','Возможные повторения изображения или варианты размеров; автоматически не удалялись',list.map(i=>({value:i.url,sourceUrl:i.sourceUrl}))));
  const blockers=[...(!company.coverage.complete?['Обход страниц компании не завершён']:[]),...(!raw.coverage.complete?['Охват каталога не подтверждён']:[]),...conflicts.map(c=>c.field+': '+c.reason),...(missingData.length?[`Неизвестных или непроверенных полей: ${missingData.length}`]:[]),...(matches.length?[`Возможные дубли/варианты изображений: ${matches.length}`]:[])];
  return manufacturerPackageSchema.parse({version:1,unit:'manufacturer',company,lineage,catalog:{discoveredCount:raw.discoveredCount,parsedCount:raw.parsedCount,complete:raw.coverage.complete,checkedAt:raw.completedAt,sourceUrls:raw.coverage.catalogUrls},missingData,conflicts,images,duplicates:{checkedAt:new Date().toISOString(),registryManufacturerCount:context.manufacturers.length,registryProjectCount:context.projects.length,matches,limitations:['Сравнены домены и названия компаний, ID/URL/названия внутри пакета и URL существующих проектов. Изображения проверены по URL и суффиксам размеров; визуальное совпадение не проверялось.']},readiness:{envelopeComplete:company.coverage.complete&&raw.coverage.complete,dataComplete:missingData.length===0&&conflicts.length===0,ready:false,status:'awaiting-preparation',blockers}});
}
