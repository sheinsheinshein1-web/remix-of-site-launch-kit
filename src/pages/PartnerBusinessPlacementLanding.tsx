import PartnerDetailLanding from "@/components/partner/PartnerDetailLanding";
import {
  PartnerBusinessPreview,
  PartnerDeliveryPreview,
  PartnerLeadPreview,
  PartnerProjectPagePreview,
} from "@/components/partner/PartnerProductVisuals";
import { partnerServices } from "@/data/partnerServices";
import { makersById, projects } from "@/data/projects";

const matchingProjects = projects.filter((project) =>
  project.suitableFor.some((value) => ["Аренда", "Бизнес", "Гостевой дом"].includes(value)),
);
const businessMaker = matchingProjects[0]
  ? makersById[matchingProjects[0].maker.id]
  : Object.values(makersById)[0];
const makerBusinessProjects = businessMaker
  ? matchingProjects.filter((project) => project.maker.id === businessMaker.id).slice(0, 3)
  : [];
const businessProjects = makerBusinessProjects.length > 0 ? makerBusinessProjects : matchingProjects.slice(0, 3);

const PartnerBusinessPlacementLanding = () => {
  if (!businessMaker || businessProjects.length === 0) return null;

  return (
    <PartnerDetailLanding
      service={partnerServices.businessPlacement}
      heroVisual={<PartnerBusinessPreview projects={businessProjects} maker={businessMaker} layout="hero" />}
      sections={[
        {
          title: "Данные для расчёта окупаемости",
          content: (
            <>
              <p>Покупатель в этом разделе выбирает объект для аренды, приёма гостей или собственной площадки. В карточке видно площадь, число спален и санузлов, комплектацию, утепление и срок изготовления.</p>
              <p>Страница проекта остаётся полной: изображения, планировки, характеристики и форма запроса расчёта остаются на своих местах.</p>
            </>
          ),
          visual: <PartnerProjectPagePreview projects={businessProjects} maker={businessMaker} />,
        },
        {
          title: "Проект остаётся связан с вашей компанией",
          content: (
            <>
              <p>Покупатель видит производителя, его остальные проекты и города доставки, поэтому обезличенной карточки в отрыве от компании раздел не создаёт. Репутация работает на все ваши объекты.</p>
              <p>Цена, комплектация и направления доставки обновляются один раз и применяются во всех представлениях проекта на платформе.</p>
            </>
          ),
          visual: <PartnerDeliveryPreview projects={businessProjects} maker={businessMaker} />,
        },
        {
          title: "Запрос приходит с параметрами объекта",
          content: (
            <>
              <p>В заявке видно выбранный объект, регион и контакты покупателя. Менеджер сразу уточняет комплектацию, количество модулей и сроки поставки, то есть вопросы коммерческого проекта.</p>
              <p>Заявки приходят в вашу CRM вместе с параметрами объекта. Оплата за раздел не связана с моделью вознаграждения со сделки.</p>
            </>
          ),
          visual: <PartnerLeadPreview />,
        },
      ]}
      finalTitle="Проверим проекты и подготовим раздел «Бизнес»"
      finalDescription="Оставьте контакты компании и укажите коммерческие проекты. Оценим, подходят ли они разделу, согласуем материалы и зафиксируем состав размещения."
      ctaLabel="Обсудить размещение"
    />
  );
};

export default PartnerBusinessPlacementLanding;
