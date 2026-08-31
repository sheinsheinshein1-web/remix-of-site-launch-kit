import Seo from "@/components/Seo";

type NodeProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  title: string | string[];
  subtitle?: string | string[];
  fill?: string;
  stroke?: string;
  titleColor?: string;
  subtitleColor?: string;
  titleSize?: number;
  subtitleSize?: number;
  radius?: number;
};

const Node = ({
  x,
  y,
  width,
  height,
  title,
  subtitle,
  fill = "#ffffff",
  stroke = "#d4dae4",
  titleColor = "#172033",
  subtitleColor = "#687386",
  titleSize = 18,
  subtitleSize = 12,
  radius = 12,
}: NodeProps) => {
  const titleLines = Array.isArray(title) ? title : [title];
  const subtitleLines = subtitle ? (Array.isArray(subtitle) ? subtitle : [subtitle]) : [];
  const titleLineHeight = titleSize + 5;
  const subtitleLineHeight = subtitleSize + 4;
  const totalHeight = titleLines.length * titleLineHeight + (subtitleLines.length ? 10 + subtitleLines.length * subtitleLineHeight : 0);
  const titleY = y + (height - totalHeight) / 2 + titleSize;

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={radius} fill={fill} stroke={stroke} strokeWidth="2" />
      <text x={x + width / 2} y={titleY} textAnchor="middle" fill={titleColor} fontSize={titleSize} fontWeight="650">
        {titleLines.map((line, index) => (
          <tspan key={`${line}-${index}`} x={x + width / 2} dy={index === 0 ? 0 : titleLineHeight}>{line}</tspan>
        ))}
      </text>
      {subtitleLines.length > 0 && (
        <text
          x={x + width / 2}
          y={titleY + titleLines.length * titleLineHeight + 4}
          textAnchor="middle"
          fill={subtitleColor}
          fontSize={subtitleSize}
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        >
          {subtitleLines.map((line, index) => (
            <tspan key={`${line}-${index}`} x={x + width / 2} dy={index === 0 ? 0 : subtitleLineHeight}>{line}</tspan>
          ))}
        </text>
      )}
    </g>
  );
};

type StageProps = {
  x: number;
  width: number;
  number: string;
  title: string;
  subtitle: string;
  tint: string;
};

const Stage = ({ x, width, number, title, subtitle, tint }: StageProps) => (
  <g>
    <rect x={x} y="78" width={width} height="782" rx="20" fill={tint} stroke="#dce2ea" />
    <circle cx={x + 28} cy="115" r="15" fill="#172033" />
    <text x={x + 28} y="120" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="700">{number}</text>
    <text x={x + 52} y="112" fill="#172033" fontSize="18" fontWeight="700">{title}</text>
    <text x={x + 52} y="133" fill="#778195" fontSize="11" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">{subtitle}</text>
  </g>
);

const TrafficArchitecture = () => (
  <main className="min-h-screen bg-[#eef1f5] text-[#172033]">
    <Seo
      title="Путь поискового трафика Многоместа"
      description="Служебная инфографика пути клиента из поиска до заявки производителю."
      canonicalPath="/traffic-map"
      noIndex
      noFollow
    />

    <header className="border-b border-[#d8dee8] bg-white px-5 py-5 md:px-10">
      <div className="mx-auto flex max-w-[1900px] items-end justify-between gap-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.17em] text-[#788397]">Многоместа · карта трафика</p>
          <h1 className="mt-2 text-[26px] font-semibold tracking-[-0.035em] md:text-[34px]">Как клиент проходит путь от запроса до производителя</h1>
        </div>
        <div className="hidden items-center gap-5 text-[11px] text-[#667085] lg:flex">
          <span className="flex items-center gap-2"><i className="h-0 w-7 border-t-[3px] border-[#1769ff]" /> основной путь клиента</span>
          <span className="flex items-center gap-2"><i className="h-0 w-7 border-t-2 border-dashed border-[#8a96a8]" /> альтернативный вход</span>
        </div>
      </div>
    </header>

    <section className="mx-auto max-w-[1940px] overflow-x-auto px-3 py-5 md:px-6 md:py-7" aria-label="Инфографика пути поискового трафика">
      <svg viewBox="0 0 1900 1050" className="w-full min-w-[1180px]" role="img" aria-labelledby="traffic-title traffic-desc">
        <title id="traffic-title">Путь клиента от поискового запроса до заявки производителю</title>
        <desc id="traffic-desc">Клиент формирует потребность, вводит запрос в Яндекс или Google, попадает на подходящую страницу Многоместа или SEO-сайт производителя, выбирает единый проект и отправляет заявку нужному производителю.</desc>

        <defs>
          <marker id="arrow-main" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#1769ff" />
          </marker>
          <marker id="arrow-muted" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#8a96a8" />
          </marker>
          <marker id="arrow-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#0a966b" />
          </marker>
          <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#172033" floodOpacity="0.11" />
          </filter>
        </defs>

        <Stage x={20} width={230} number="1" title="КЛИЕНТ" subtitle="у него есть задача" tint="#f8fafc" />
        <Stage x={275} width={270} number="2" title="ПОИСК" subtitle="он формулирует запрос" tint="#f2f7ff" />
        <Stage x={570} width={625} number="3" title="СТРАНИЦА ВХОДА" subtitle="поиск приводит не только на главную" tint="#fffaf4" />
        <Stage x={1220} width={300} number="4" title="ВЫБОР" subtitle="одна карточка проекта" tint="#f8f5ff" />
        <Stage x={1545} width={335} number="5" title="ЗАЯВКА" subtitle="лид получает нужный партнёр" tint="#f2fbf7" />

        <g fill="none" stroke="#1769ff" strokeWidth="5" markerEnd="url(#arrow-main)">
          <path d="M 220 265 L 305 265" />
          <path d="M 515 265 L 605 265" />
          <path d="M 1160 475 L 1255 475" />
          <path d="M 1490 475 L 1580 475" />
        </g>

        <g filter="url(#soft-shadow)">
          <Node x={48} y={165} width={174} height={200} title="КЛИЕНТ" subtitle={["частник или бизнес", "ищет решение"]} fill="#172033" stroke="#172033" titleColor="#ffffff" subtitleColor="#c5cfdd" titleSize={25} />
        </g>
        <circle cx="135" cy="216" r="25" fill="#ffffff" opacity="0.96" />
        <circle cx="135" cy="207" r="8" fill="#1769ff" />
        <path d="M 116 239 C 119 223, 151 223, 154 239 Z" fill="#1769ff" />

        <text x="48" y="405" fill="#667085" fontSize="12" fontWeight="700">ЕГО ЗАДАЧА</text>
        <Node x={48} y={422} width={174} height={60} title="Дом для себя" titleSize={15} />
        <Node x={48} y={493} width={174} height={60} title="Дом до 5 млн ₽" titleSize={15} />
        <Node x={48} y={564} width={174} height={60} title="Дом в регионе" titleSize={15} />
        <Node x={48} y={635} width={174} height={60} title="Объект для бизнеса" titleSize={15} />
        <Node x={48} y={706} width={174} height={60} title="Конкретный бренд" titleSize={15} />

        <g filter="url(#soft-shadow)">
          <Node x={305} y={180} width={210} height={170} title={["ЯНДЕКС", "GOOGLE"]} subtitle="показывают релевантный URL" fill="#1769ff" stroke="#1769ff" titleColor="#ffffff" subtitleColor="#dce9ff" titleSize={23} />
        </g>
        <text x="305" y="405" fill="#667085" fontSize="12" fontWeight="700">ПРИМЕРЫ КЛЮЧЕЙ</text>
        <Node x={305} y={422} width={210} height={60} title="модульные дома" titleSize={14} />
        <Node x={305} y={493} width={210} height={60} title="…в Екатеринбурге" titleSize={14} />
        <Node x={305} y={564} width={210} height={60} title="…до 5 млн" titleSize={14} />
        <Node x={305} y={635} width={210} height={60} title="…для глэмпинга" titleSize={14} />
        <Node x={305} y={706} width={210} height={60} title="BYGGE Forest 72" titleSize={14} />

        <g fill="none" stroke="#8a96a8" strokeWidth="2.5" strokeDasharray="8 7" markerEnd="url(#arrow-muted)">
          <path d="M 515 445 C 560 445, 570 250, 615 250" />
          <path d="M 515 530 C 570 530, 570 465, 615 465" />
          <path d="M 515 610 C 570 610, 570 590, 615 590" />
          <path d="M 515 690 C 580 690, 590 365, 910 365" />
          <path d="M 515 735 C 650 735, 760 725, 910 725" />
        </g>

        <rect x="595" y="165" width="290" height="610" rx="16" fill="#ffffff" stroke="#ffc58c" strokeWidth="2" />
        <text x="620" y="202" fill="#b34f00" fontSize="17" fontWeight="750">МНОГОМЕСТА</text>
        <text x="620" y="222" fill="#8b6c55" fontSize="11" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">основная платформа</text>
        <Node x={615} y={240} width={250} height={82} title="Категория" subtitle="/modulnye-doma/" titleSize={17} />
        <Node x={615} y={335} width={250} height={82} title="Регион" subtitle="/ekaterinburg/" titleSize={17} />
        <Node x={615} y={430} width={250} height={82} title="SEO-подборка" subtitle="/do-5-mln/ · /pmzh/" titleSize={17} />
        <Node x={615} y={525} width={250} height={82} title="B2B-раздел" subtitle="/business/glamping/" titleSize={17} />
        <Node x={615} y={620} width={250} height={82} title="Карточка производителя" subtitle="/proizvoditeli/bygge/" titleSize={16} />
        <Node x={615} y={715} width={250} height={42} title="Фильтры каталога" titleSize={14} fill="#fff7ed" stroke="#ffc58c" />

        <rect x="900" y="165" width="270" height="610" rx="16" fill="#ffffff" stroke="#83d9bb" strokeWidth="2" />
        <text x="925" y="202" fill="#087752" fontSize="17" fontWeight="750">SEO-САЙТ ПАРТНЁРА</text>
        <text x="925" y="222" fill="#638677" fontSize="11" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">/partners/bygge/</text>
        <Node x={920} y={240} width={230} height={82} title="Главная BYGGE" subtitle="оффер · проекты · цены" titleSize={17} />
        <Node x={920} y={335} width={230} height={82} title="Проекты" subtitle="/projects/" titleSize={17} />
        <Node x={920} y={430} width={230} height={82} title="Цена · комплектации" subtitle="/prices/ · /complectations/" titleSize={15} />
        <Node x={920} y={525} width={230} height={82} title="Производство" subtitle="/factory/ · /technology/" titleSize={16} />
        <Node x={920} y={620} width={230} height={82} title="Доставка · кейсы" subtitle="/delivery/ · /built-houses/" titleSize={15} />
        <Node x={920} y={715} width={230} height={42} title="Глэмпинг · FAQ · ипотека" titleSize={13} fill="#effcf7" stroke="#83d9bb" />

        <path d="M 865 662 C 885 662, 900 662, 920 662" fill="none" stroke="#8a96a8" strokeWidth="2" strokeDasharray="7 6" markerEnd="url(#arrow-muted)" />
        <text x="883" y="648" textAnchor="middle" fill="#7a8495" fontSize="10">переход</text>

        <g fill="none" stroke="#1769ff" strokeWidth="3" markerEnd="url(#arrow-main)">
          <path d="M 865 281 C 1040 281, 1115 360, 1255 420" />
          <path d="M 865 471 C 1030 471, 1110 455, 1255 455" />
          <path d="M 1150 376 C 1190 376, 1210 420, 1255 440" />
          <path d="M 1150 725 C 1210 725, 1215 555, 1255 525" />
        </g>

        <g filter="url(#soft-shadow)">
          <Node x={1255} y={370} width={230} height={210} title={["ОДИН ПРОЕКТ", "FOREST 72"]} subtitle={["одна карточка · один URL", "без SEO-дублей"]} fill="#7251c7" stroke="#7251c7" titleColor="#ffffff" subtitleColor="#e9e1ff" titleSize={22} />
        </g>
        <text x="1255" y="625" fill="#6f5aa7" fontSize="12" fontWeight="700">ОН МОЖЕТ БЫТЬ ОДНОВРЕМЕННО</text>
        <Node x={1255} y={642} width={108} height={56} title="до 5 млн" titleSize={13} fill="#f4f0ff" stroke="#cdbcf3" />
        <Node x={1377} y={642} width={108} height={56} title="60–80 м²" titleSize={13} fill="#f4f0ff" stroke="#cdbcf3" />
        <Node x={1255} y={711} width={108} height={56} title="для ПМЖ" titleSize={13} fill="#f4f0ff" stroke="#cdbcf3" />
        <Node x={1377} y={711} width={108} height={56} title="глэмпинг" titleSize={13} fill="#f4f0ff" stroke="#cdbcf3" />
        <text x="1370" y="807" textAnchor="middle" fill="#687386" fontSize="12">Разные входы ведут в одну карточку,</text>
        <text x="1370" y="825" textAnchor="middle" fill="#687386" fontSize="12">а не создают четыре копии дома.</text>

        <g fill="none" stroke="#0a966b" strokeWidth="4" markerEnd="url(#arrow-green)">
          <path d="M 1680 348 L 1680 392" />
          <path d="M 1680 500 L 1680 540" />
          <path d="M 1680 648 L 1680 688" />
        </g>
        <Node x={1580} y={225} width={200} height={123} title="Клиент изучает" subtitle={["фото · цену · планировку", "сравнивает варианты"]} fill="#ffffff" stroke="#83d9bb" titleSize={18} />
        <Node x={1580} y={392} width={200} height={108} title="Оставляет заявку" subtitle="форма · телефон · квиз" fill="#0a966b" stroke="#0a966b" titleColor="#ffffff" subtitleColor="#d9fff1" titleSize={19} />
        <Node x={1580} y={540} width={200} height={108} title="Многоместа" subtitle={["фиксирует источник", "и проект"]} fill="#ffffff" stroke="#83d9bb" titleSize={18} />
        <Node x={1580} y={688} width={200} height={108} title="ПРОИЗВОДИТЕЛЬ" subtitle={["получает свой лид", "и связывается"]} fill="#172033" stroke="#172033" titleColor="#ffffff" subtitleColor="#c5cfdd" titleSize={18} />

        <rect x="20" y="885" width="1860" height="140" rx="18" fill="#172033" />
        <text x="48" y="920" fill="#91a0b4" fontSize="11" fontWeight="700" letterSpacing="1.6">ОДИН КОНКРЕТНЫЙ ПРИМЕР</text>
        <Node x={48} y={940} width={250} height={60} title="Клиенту нужен глэмпинг" fill="#253148" stroke="#3b4961" titleColor="#ffffff" titleSize={15} />
        <path d="M 298 970 L 338 970" fill="none" stroke="#5d9bff" strokeWidth="3" markerEnd="url(#arrow-main)" />
        <Node x={338} y={940} width={280} height={60} title="Запрос: модуль для глэмпинга" fill="#253148" stroke="#3b4961" titleColor="#ffffff" titleSize={15} />
        <path d="M 618 970 L 658 970" fill="none" stroke="#5d9bff" strokeWidth="3" markerEnd="url(#arrow-main)" />
        <Node x={658} y={940} width={300} height={60} title="Вход: /business/glamping/" fill="#253148" stroke="#3b4961" titleColor="#ffffff" titleSize={15} />
        <path d="M 958 970 L 998 970" fill="none" stroke="#5d9bff" strokeWidth="3" markerEnd="url(#arrow-main)" />
        <Node x={998} y={940} width={230} height={60} title="Выбор: Forest 72" fill="#493a76" stroke="#7251c7" titleColor="#ffffff" titleSize={15} />
        <path d="M 1228 970 L 1268 970" fill="none" stroke="#5d9bff" strokeWidth="3" markerEnd="url(#arrow-main)" />
        <Node x={1268} y={940} width={210} height={60} title="Заявка" fill="#087752" stroke="#0a966b" titleColor="#ffffff" titleSize={15} />
        <path d="M 1478 970 L 1518 970" fill="none" stroke="#5d9bff" strokeWidth="3" markerEnd="url(#arrow-main)" />
        <Node x={1518} y={940} width={235} height={60} title="Лид получает BYGGE" fill="#253148" stroke="#3b4961" titleColor="#ffffff" titleSize={15} />
      </svg>
    </section>
  </main>
);

export default TrafficArchitecture;
