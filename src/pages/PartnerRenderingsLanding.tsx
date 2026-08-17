import partnerRenderAfter from "@/assets/partner-render-after.webp";
import partnerRenderBefore from "@/assets/partner-render-before.webp";
import BeforeAfterComparison from "@/components/BeforeAfterComparison";
import PartnerDetailLanding from "@/components/partner/PartnerDetailLanding";
import {
  PartnerProjectPagePreview,
  PartnerRenderingEstimatePreview,
  PartnerWebsitePreview,
} from "@/components/partner/PartnerProductVisuals";
import { partnerServices } from "@/data/partnerServices";
import { makersById, projects } from "@/data/projects";

const showcaseMaker = makersById.platforma ?? Object.values(makersById)[0];
const makerProjects = showcaseMaker
  ? projects.filter((project) => project.maker.id === showcaseMaker.id).slice(0, 3)
  : [];
const showcaseProjects = makerProjects.length >= 2 ? makerProjects : projects.slice(0, 3);
const PartnerRenderingsLanding = () => {
  if (!showcaseMaker || showcaseProjects.length === 0) return null;

  return (
    <PartnerDetailLanding
      service={partnerServices.renderings}
      heroVisual={(
        <BeforeAfterComparison
          beforeSrc={partnerRenderBefore}
          afterSrc={partnerRenderAfter}
          beforeAlt="Фотография построенного модульного дома до художественной визуализации"
          afterAlt="Художественный рендер модульного дома в хвойном лесу"
          layout="hero"
        />
      )}
      sections={[
        {
          title: "Первое впечатление, которое приводит к заявке",
          content: (
            <>
              <p>Покупатель сначала видит изображение и только потом открывает характеристики. Выразительный ракурс помогает заметить проект среди других, представить готовый дом на участке и перейти к подробному изучению.</p>
              <p>Показываем архитектуру, материалы фасада и окружение так, чтобы ценность проекта была понятна с первого экрана. Изображения сразу готовим для корректного показа на мобильном и десктопе.</p>
            </>
          ),
          visual: <PartnerProjectPagePreview projects={showcaseProjects} maker={showcaseMaker} />,
        },
        {
          title: "Используйте рендеры на платформе, сайте и в рекламе",
          content: (
            <>
              <p>Готовые изображения можно сразу разместить на платформе многоместа.рф, на вашем сайте, в презентациях, коммерческих предложениях и рекламе. Не придётся повторно заказывать одни и те же ракурсы для каждой площадки.</p>
              <p>Сразу готовим нужные размеры и пропорции, чтобы дом одинаково убедительно выглядел в карточке проекта, на сайте и в рекламных материалах.</p>
            </>
          ),
          visual: <PartnerWebsitePreview projects={showcaseProjects} maker={showcaseMaker} />,
        },
        {
          title: "Покажите всю линейку в едином сильном стиле",
          content: (
            <>
              <p>Полноценная визуальная система для всего ассортимента усиливает не одну карточку, а весь бренд. Когда каждый проект показан убедительно и в едином стиле, вся линейка вызывает больше доверия и помогает покупателю сравнивать ваши модели.</p>
              <p>Для каждого дома готовим полный набор необходимых ракурсов экстерьера и интерьера, а затем адаптируем изображения для платформы, сайта, презентаций и рекламы.</p>
            </>
          ),
          visual: <PartnerRenderingEstimatePreview />,
        },
      ]}
      finalTitle="Отправьте изображения проекта"
      finalDescription="Оставьте контакты и приложите материалы по дому. Предложим визуальную концепцию, состав изображений и рассчитаем стоимость работы."
      ctaLabel="Рассчитать стоимость"
    />
  );
};

export default PartnerRenderingsLanding;
