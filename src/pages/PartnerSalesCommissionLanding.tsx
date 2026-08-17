import PartnerDetailLanding from "@/components/partner/PartnerDetailLanding";
import {
  PartnerCommissionPreview,
  PartnerCrmPreview,
  PartnerDealHistoryPreview,
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
            <p>В заявке видно контакты покупателя, выбранный дом, регион и страницу, с которой пришёл запрос. Менеджер сразу готовит расчёт по конкретной модели и экономит первый разговор.</p>
            <p>Если покупатель обращался в компанию в предыдущие 6 месяцев, вознаграждение по нему не начисляется. Достаточно показать запись в CRM или переписку.</p>
          </>
        ),
        visual: <PartnerLeadPreview />,
      },
      {
        title: "Платите 5% после состоявшейся сделки",
        content: (
          <>
            <p>Вознаграждение составляет 5% от полной суммы договора и выплачивается целиком сразу после состоявшейся сделки. График платежей покупателя, включая рассрочку, не делит и не переносит выплату вознаграждения.</p>
            <p>Сделку подтверждают заключённый договор и поступление оплаты от покупателя. Для проверки достаточно записи в CRM и копии договора без лишних коммерческих подробностей.</p>
          </>
        ),
        visual: <PartnerDealHistoryPreview />,
      },
      {
        title: "Условия закрепляем в договоре заранее",
        content: (
          <>
            <p>В договоре записаны вознаграждение 5%, его полная выплата сразу после состоявшейся сделки и срок атрибуции 12 месяцев с первого обращения покупателя. Задним числом эти условия не меняются.</p>
            <p>Размещение проектов модульных домов и страница компании остаются бесплатными. Вознаграждение 5% возникает только после состоявшейся сделки.</p>
          </>
        ),
        visual: <PartnerCommissionPreview />,
      },
    ]}
    finalTitle="Обсудим условия до первой заявки"
    finalDescription="Оставьте контакты компании. Посмотрим ассортимент, разберём путь покупателя от карточки до договора и предложим условия работы."
    ctaLabel="Обсудить условия"
  />
);

export default PartnerSalesCommissionLanding;
