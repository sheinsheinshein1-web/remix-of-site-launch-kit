import PartnerDetailLanding from "@/components/partner/PartnerDetailLanding";
import {
  PartnerDeliveryPreview,
  PartnerMarketplacePreview,
  PartnerProfilePreview,
  PartnerProjectPagePreview,
} from "@/components/partner/PartnerProductVisuals";
import { partnerServices } from "@/data/partnerServices";
import { makersById, projects } from "@/data/projects";

const showcaseMaker = makersById.platforma ?? Object.values(makersById)[0];
const makerProjects = showcaseMaker
  ? projects.filter((project) => project.maker.id === showcaseMaker.id).slice(0, 3)
  : [];
const showcaseProjects = makerProjects.length >= 2 ? makerProjects : projects.slice(0, 3);

const PartnerFreePlacementLanding = () => {
  if (!showcaseMaker || showcaseProjects.length === 0) return null;

  return (
    <PartnerDetailLanding
      service={partnerServices.freePlacement}
      heroVisual={<PartnerMarketplacePreview projects={showcaseProjects} maker={showcaseMaker} />}
      sections={[
        {
          title: "У дома своя страница с полными данными",
          content: (
            <>
              <p>На странице дома стоят фотографии, планировки, стоимость, площадь, комплектация, срок изготовления и характеристики. Этих данных хватает, чтобы покупатель сравнил вашу модель с другими ещё до звонка.</p>
              <p>Карточка связана с компанией и её географией, поэтому с неё можно перейти к остальным домам или отправить запрос по выбранному проекту.</p>
            </>
          ),
          visual: <PartnerProjectPagePreview projects={showcaseProjects} maker={showcaseMaker} />,
        },
        {
          title: "Все дома на одной странице компании",
          content: (
            <>
              <p>На странице компании собраны логотип, описание, контакты, отзывы и весь опубликованный ассортимент. Покупатель, которому понравился один дом, сразу видит остальные ваши модели.</p>
              <p>Новый проект добавляется к той же компании, поэтому ассортимент не рассыпается по страницам, а отзывы копятся в одном профиле.</p>
            </>
          ),
          visual: <PartnerProfilePreview projects={showcaseProjects} maker={showcaseMaker} />,
        },
        {
          title: "Показываем проекты в городах доставки",
          content: (
            <>
              <p>Фиксируем базовый регион производства и города, куда компания действительно доставляет дома. Проект не попадает в регион ради охвата, поэтому заявки из недоступной географии не приходят.</p>
              <p>Эта география работает на платформе, в поиске и на региональных страницах. Если направления меняются, вы обновляете их один раз.</p>
            </>
          ),
          visual: <PartnerDeliveryPreview projects={showcaseProjects} maker={showcaseMaker} />,
        },
      ]}
      finalTitle="Пришлите проекты, подготовим размещение и страницу компании"
      finalDescription="Оставьте контакты компании. Посмотрим материалы, скажем, каких данных не хватает, и подготовим страницы на согласование до публикации."
      ctaLabel="Разместить проекты"
    />
  );
};

export default PartnerFreePlacementLanding;
