import PartnerDetailLanding from "@/components/partner/PartnerDetailLanding";
import BeforeAfterComparison from "@/components/BeforeAfterComparison";
import partnerRenderAfter from "@/assets/partner-render-after.webp";
import partnerRenderBefore from "@/assets/partner-render-before.webp";
import {
  PartnerCommissionPreview,
  PartnerCrmPreview,
  PartnerLeadPreview,
} from "@/components/partner/PartnerProductVisuals";
import { partnerServices } from "@/data/partnerServices";

const PartnerSalesCommissionLanding = () => (
  <PartnerDetailLanding
    service={partnerServices.salesCommission}
    heroVisual={<PartnerCrmPreview layout="hero" />}
    sections={[
      {
        title: "Заявка приходит с выбранным домом",
        content: (
          <>
            <p>В заявке видно контакты покупателя, выбранный дом или баню, регион и страницу, с которой пришёл запрос. Менеджер может сразу обсудить комплектацию и подготовить расчёт.</p>
          </>
        ),
        visual: <PartnerLeadPreview />,
      },
      {
        title: "Стоимость от 2 900 ₽ за квалифицированный лид",
        content: (
          <>
            <p>До запуска согласуем стоимость, географию и критерии квалифицированного лида. Вы заранее понимаете, какие обращения оплачиваются.</p>
          </>
        ),
        visual: <PartnerCommissionPreview />,
      },
      {
        title: "Изображения, которые помогают продавать",
        content: (
          <>
            <p>Улучшаем фотографии и рендеры домов и бань: свет, окружение и ракурсы. Покупатель может рассмотреть отделку и представить готовый объект на своём участке.</p>
            <p>Готовим изображения для карточек, презентаций и рекламы в едином стиле. Сравните исходную фотографию и художественную визуализацию.</p>
          </>
        ),
        visual: <BeforeAfterComparison beforeSrc={partnerRenderBefore} afterSrc={partnerRenderAfter} beforeAlt="Исходная фотография модульного дома" afterAlt="Художественная визуализация модульного дома" />,
        actionLabel: "Улучшить изображения",
        interest: "Художественные рендеры",
      },
    ]}
    finalTitle="Привлечём покупателей ваших домов и бань"
    finalDescription="Оставьте контакты компании. Посмотрим ассортимент, согласуем критерии лида и географию обращений."
    ctaLabel="Получать лиды"
  />
);

export default PartnerSalesCommissionLanding;
