import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { companyDataSchema, companyFieldPaths, type CompanyData } from '../../src/features/agent-office/manufacturer-package-contract';
import type { ScoutCandidate } from '../../src/features/agent-office/runtime-contract';
interface Element { textContent:string|null;tagName:string;getAttribute(name:string):string|null;querySelectorAll(selector:string):Iterable<Element>;querySelector(selector:string):Element|null; }
const {JSDOM,VirtualConsole}=createRequire(import.meta.url)('jsdom') as {JSDOM:new(html:string,options:{virtualConsole:unknown})=>{window:{document:Element}},VirtualConsole:new()=>unknown};
export interface CompanyInput {manufacturer:ScoutCandidate;directory:string;signal:AbortSignal;onSource:(url:string)=>Promise<void>}
export interface CompanyProvider {collect(input:CompanyInput):Promise<CompanyData>}
export function parseCompanyPages(pages:{url:string;html:string;snapshot:string}[],manufacturer:ScoutCandidate,failures:{url:string;error:string}[]=[]):CompanyData {
  const home=manufacturer.officialWebsite,origin=new URL(home).origin;
  const fields:CompanyData['fields']=Object.fromEntries(companyFieldPaths.map(k=>[k,{value:null,sourceUrl:home,status:'missing',observations:[],note:'В проверенных официальных страницах однозначное значение не найдено; это не ноль и не отрицание существования.'}]));
  const images:CompanyData['images']=[];
  const documents=pages.map(p=>{const doc=new JSDOM(p.html,{virtualConsole:new VirtualConsole()}).window.document;let heading:string|null=null;const sections:CompanyData['pages'][number]['sections']=[];for(const el of doc.querySelectorAll('h1,h2,h3,h4,h5,p,li')){const text=el.textContent?.trim();if(!text)continue;if(/^H/.test(el.tagName))heading=text;else sections.push({heading,text});}return {...p,doc,sections};});
  const set=(key:string,value:string|null,url:string,note='Дословное значение с официальной страницы; внешняя верификация не выполнялась.')=>{if(value)fields[key]={value,sourceUrl:url,status:'found',observations:[{value,sourceUrl:url}],note};};
  const find=(path:string,expression:RegExp)=>{const d=documents.find(d=>new URL(d.url).pathname===path);const s=d?.sections.find(s=>expression.test(s.text));return s&&d?{value:s.text,url:d.url}:null;};
  const contacts=documents.find(d=>new URL(d.url).pathname==='/kontakty/');
  const about=documents.find(d=>new URL(d.url).pathname==='/o-nas/');
  const homepage=documents.find(d=>new URL(d.url).pathname==='/');
  set('name',manufacturer.name,home,'Название выбранного кандидата, подтверждённое названием бренда на официальном сайте. Scout не запускался заново.');set('siteUrl',home,home);
  const phones=[...new Set((contacts?.sections.map(s=>s.text).join('\n')??'').match(/\+7\s*\(?\d{3}\)?[\s-]*\d{3}[\s-]*\d{2}[\s-]*\d{2}/g)??[])];
  if(contacts){set('phone',phones[0]??null,contacts.url);set('additionalPhones',phones.slice(1).join('; ')||null,contacts.url);set('email',(contacts.sections.map(s=>s.text).join('\n')).match(/[\w.+-]+@ir365\.ru/i)?.[0]??null,contacts.url);}
  const intro=find('/',/ГК.*производит/);if(intro)set('profile.intro',intro.value,intro.url);
  const description=homepage?.sections.filter(s=>s.heading?.includes('О компании')).map(s=>s.text).join('\n\n');set('profile.about',description??null,home);
  const tech=find('/',/производит СИП-панели.*каркасно-модульные/);if(tech)set('technologies',tech.value,tech.url);
  const geo=find('/',/География:/);if(geo)set('workGeography',geo.value,geo.url,'География сформулирована для домов и бань; география СИП-панелей из «О нас» не применяется к проектам автоматически.');
  const locality=about?.sections.find(s=>s.heading?.includes('Адрес производства'));if(locality&&about)set('productionLocality',locality.text,about.url);
  const hours=about?.sections.filter(s=>s.heading?.includes('Режим работы')).map(s=>s.text).join('\n');if(about)set('workingHours',hours??null,about.url);
  const social:{value:string;sourceUrl:string}[]=[];
  for(const d of documents){
    for(const a of d.doc.querySelectorAll('a[href]')){let u:URL;try{u=new URL(a.getAttribute('href')!,d.url);}catch{continue;}if(/(^|\.)(t\.me|telegram\.me|youtube\.com|youtu\.be|vk\.com|max\.ru|whatsapp\.com)$/.test(u.hostname)){if(!social.some(x=>x.value===u.href))social.push({value:u.href,sourceUrl:d.url});}}
    for(const img of d.doc.querySelectorAll('img')){const src=img.getAttribute('src');if(!src)continue;let u:URL;try{u=new URL(src,d.url);}catch{continue;}if(u.origin!==origin)continue;const role=/logo|custom-logo/i.test(`${src} ${img.getAttribute('class')??''}`)?'logo':'unclassified';if(!images.some(i=>i.url===u.href))images.push({url:u.href,sourceUrl:d.url,role});}
  }
  const tg=social.find(s=>/t\.me|telegram\.me/.test(new URL(s.value).hostname));if(tg)set('telegram',tg.value,tg.sourceUrl,'Ссылка на мессенджер/бот с сайта; не считается подтверждённым каналом с публикациями.');
  if(social.length)fields.socialLinks={value:social.map(s=>s.value).join('\n'),sourceUrl:social[0].sourceUrl,status:'found',observations:social,note:'Каждая ссылка имеет собственный официальный URL страницы, на которой она опубликована.'};
  const logo=images.find(i=>i.role==='logo');if(logo)set('logo',logo.url,logo.sourceUrl,'Официальный URL логотипа, без загрузки/изменения изображения.');
  const policy=documents.find(d=>new URL(d.url).pathname==='/privacy-policy/');
  if(policy){const operator=policy.sections.find(s=>/Адрес места жительства|Контактный телефон/.test(s.text));set('legalOperator',operator?.text??null,policy.url,'Оператор персональных данных, а не установленное юридическое лицо производителя.');
    const transfer=policy.sections.find(s=>/передаются производственной компании|передачи заявки производственной компании/.test(s.text));
    if(transfer){fields.brandManufacturerIdentity={value:null,sourceUrl:policy.url,status:'conflict',observations:[...(intro?[{value:intro.value,sourceUrl:intro.url}]:[]),{value:transfer.text,sourceUrl:policy.url}],note:'Сайт заявляет производство от имени бренда, политика отделяет оператора сайта от неназванной производственной компании. Юридическая связь не подтверждена.'};}
  }
  if(locality&&about){fields.productionAddress={value:null,sourceUrl:about.url,status:'conflict',observations:[{value:locality.text,sourceUrl:about.url},...(intro?[{value:intro.value,sourceUrl:intro.url}]:[])],note:'На главной — Екатеринбург; страница «О нас» указывает Березовский. Улица и номер производства отсутствуют. Город не превращается в точный адрес.'};}
  for(const key of companyFieldPaths.filter(k=>k.startsWith('profile.legal.'))){fields[key].sourceUrl=policy?.url??home;fields[key].note='Реквизиты юридического лица производителя не установлены. Данные оператора сайта не переносятся в юридическую карточку компании.';}
  const certs=about?.sections.filter(s=>s.heading?.includes('Сертификат'));if(certs?.length&&about)set('certificates',certs.map(s=>s.text).join('\n'),about.url,'Заявления/названия сертификатов, не независимая проверка их действительности.');
  fields.externalRating.status='not-checked';fields.externalRating.note='Независимые площадки не открывались; собственные отзывы не являются независимым рейтингом.';
  return companyDataSchema.parse({collectedAt:new Date().toISOString(),fields,pages:documents.map(d=>({url:d.url,snapshot:d.snapshot,sha256:createHash('sha256').update(d.html).digest('hex'),sections:d.sections})),images,coverage:{checkedUrls:pages.map(p=>p.url),failedUrls:failures,complete:failures.length===0&&!!homepage&&!!contacts&&!!about&&!!policy}});
}
export function createCompanyCollector():CompanyProvider {return {async collect(input){
  const origin=new URL(input.manufacturer.officialWebsite).origin;if(origin!=='https://ir365.ru')throw new Error('Для компании требуется официальный адаптер; пакет проектов без данных компании больше не считается полным.');
  const queue=[origin+'/',origin+'/kontakty/',origin+'/o-nas/',origin+'/privacy-policy/'],seen=new Set<string>(),pages:{url:string;html:string;snapshot:string}[]=[],failures:{url:string;error:string}[]=[];
  await mkdir(join(input.directory,'company-sources'),{recursive:true});
  while(queue.length){const url=queue.shift()!;if(seen.has(url))continue;seen.add(url);if(seen.size>20)throw new Error('Не завершён обход страниц компании');
    const u=new URL(url);if(u.origin!==origin||/^\/product(?:\/|-category\/)|^\/wp-json\//.test(u.pathname))throw new Error('Повторное чтение каталога запрещено для дополнения компании');
    try{const res=await fetch(url,{signal:AbortSignal.any([input.signal,AbortSignal.timeout(30000)]),redirect:'manual'});if(!res.ok)throw new Error(`HTTP ${res.status}`);const html=await res.text();if(html.length>8_000_000)throw new Error('Страница слишком большая');const snapshot=`company-sources/${createHash('sha256').update(url).digest('hex').slice(0,20)}.html`;await writeFile(join(input.directory,snapshot),html,{mode:0o600});await writeFile(join(input.directory,snapshot+'.json'),JSON.stringify({url,fetchedAt:new Date().toISOString(),status:res.status}),{mode:0o600});pages.push({url,html,snapshot});await input.onSource(url);
      const doc=new JSDOM(html,{virtualConsole:new VirtualConsole()}).window.document;
      for(const a of doc.querySelectorAll('a[href]')){let next:URL;try{next=new URL(a.getAttribute('href')!,url);}catch{continue;}if(next.origin===origin&&/контакт|реквизит|юрид|сертификат|о нас|производств|выполненн|отзыв|портфолио/i.test(a.textContent??'')&&!/^\/product|^\/wp-json|^\/blog/.test(next.pathname)&&!next.hash&&!next.search&&!/\.(pdf|png|jpe?g|svg|webp)$/i.test(next.pathname))queue.push(next.href);}
    }catch(e){if(input.signal.aborted)throw e;failures.push({url,error:e instanceof Error?e.message:String(e)});}
  }
  return parseCompanyPages(pages,input.manufacturer,failures);
}};}
