import PartnerDetailLanding from "@/components/partner/PartnerDetailLanding";
import {
  PartnerDeliveryPreview,
  PartnerLeadPreview,
  PartnerProjectPagePreview,
  PartnerWebsitePreview,
} from "@/components/partner/PartnerProductVisuals";
import { partnerServices } from "@/data/partnerServices";
import { makersById, projects } from "@/data/projects";

const showcaseMaker = makersById.platforma ?? Object.values(makersById)[0];
const makerProjects = showcaseMaker
  ? projects.filter((project) => project.maker.id === showcaseMaker.id).slice(0, 3)
  : [];
const showcaseProjects = makerProjects.length >= 2 ? makerProjects : projects.slice(0, 3);

const PartnerManufacturerWebsiteLanding = () => {
  if (!showcaseMaker || showcaseProjects.length === 0) return null;

  return (
    <PartnerDetailLanding
      service={partnerServices.manufacturerWebsite}
      heroVisual={<PartnerWebsitePreview projects={showcaseProjects} maker={showcaseMaker} layout="hero" />}
      sections={[
        {
          title: "Привлекайте покупателей из Яндекса и Google",
          content: (
            <>
              <p>Каждый модульный дом получает отдельную страницу с фотографиями, планировкой, ценой, комплектацией и характеристиками. Такие страницы доступны поисковикам и помогают покупателю перейти сразу к подходящему проекту.</p>
              <p>Человек изучает конкретный дом и отправляет заявку по нему. Так сайт приводит не случайные обращения, а покупателей, которые уже выбрали интересующую модель.</p>
            </>
          ),
          visual: <PartnerProjectPagePreview projects={showcaseProjects} maker={showcaseMaker} />,
        },
        {
          title: "Не платите разработчикам и агентствам",
          content: (
            <>
              <p>Вместе с размещением вы получаете готовый сайт: мы оформляем страницы проектов и настраиваем формы заявок. Вам не нужно отдельно заказывать разработку и собирать команду для поддержки сайта.</p>
              <p>Когда меняются проекты, цены или регионы доставки, мы обновляем информацию. Сайт остаётся актуальным и продолжает привлекать покупателей без постоянных расходов с вашей стороны.</p>
            </>
          ),
          visual: <PartnerDeliveryPreview projects={showcaseProjects} maker={showcaseMaker} />,
        },
        {
          title: "Запрос приходит по конкретному дому",
          content: (
            <>
              <p>Форма передаёт контакты покупателя, выбранный дом и регион. Менеджер видит, о какой модели идёт речь, и отвечает расчётом вместо уточняющих вопросов о площади и комплектации.</p>
              <p>Заявки передаём напрямую в вашу CRM, поэтому менеджеру не приходится переносить контакты вручную из письма или мессенджера.</p>
            </>
          ),
          visual: <PartnerLeadPreview />,
        },
      ]}
      finalTitle="Запустим сайт, который приводит покупателей"
      finalDescription="Оставьте контакты компании. Посмотрим ваши проекты, подготовим структуру и запустим дополнительный канал привлечения покупателей."
      ctaLabel="Получить сайт"
    />
  );
};

export default PartnerManufacturerWebsiteLanding;
