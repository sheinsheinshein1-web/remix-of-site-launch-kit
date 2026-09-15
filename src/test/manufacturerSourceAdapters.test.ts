import { describe, expect, it } from "vitest";
import {
  discoverByggeProjectUrls,
  discoverSqModylProjectUrls,
  parseByggeProject,
  parseFpsModulProject,
  parseDaHomeProject,
  parseGenericProject,
  parsePlatformaProject,
  parseSqModylProject,
} from "../../scripts/manufacturer-source-adapters.mjs";

describe("manufacturer source adapters", () => {
  it("normalizes Bygge visible fields and gallery without inventing floors", () => {
    const html = `
      <h1 class="project-title">Модульный дом<br> ЭЛЕН 7.9х10</h1>
      <div class="project-price"><span>3 200 000 руб</span></div>
      <ul>
        <li>Общая площадь: 79 м2</li>
        <li>Габариты: 7.9х10 м</li>
        <li>Количество комнат: 3</li>
        <li>Срок строительства: 19 дней</li>
        <li>Тип строения: Дом</li>
      </ul>
      <a href="/media/front.jpg" data-fancybox="project"></a>
      <a href="/media/plan-m2.jpg" data-fancybox="project"></a>
    `;
    const result = parseByggeProject({ html, sourceUrl: "https://bygge.ru/katalog/elen/" });

    expect(result.area.value).toBe("79 м²");
    expect(result.price.value).toBe("3 200 000 ₽");
    expect(result.productionTerm.value).toBe("19 д.");
    expect(result.roomCount.value).toBe("3");
    expect(result.dimensions.value).toBe("7,9 × 10 м");
    expect(result.floors.status).toBe("not-published");
    expect(result.media.publishedImageCount).toBe(2);
    expect(result.media.planStatus).toBe("published");
  });

  it("blocks a Platforma area conflict instead of silently choosing one value", () => {
    const html = `
      <title>Купить модульный дом Wide House 66 м²</title>
      <script type="application/ld+json">
        {"@type":"Product","name":"WIDE HOUSE","additionalProperty":[
          {"name":"Жилая площадь","value":"66,24 м²"},
          {"name":"Количество спален","value":"2"},
          {"name":"Этажность","value":"1"}
        ]}
      </script>
      <div>56,8 м² Площадь дома 60 дней Срок производства 2 Количество спален от 5 480 000 р. Стоимость</div>
      <div data-field-imgs-value="[{&quot;li_img&quot;:&quot;https://cdn.example/front.webp&quot;}]" />
    `;
    const result = parsePlatformaProject({ html, sourceUrl: "https://platforma-modul.ru/wide-house" });

    expect(result.area.value).toBe("56,8 м²");
    expect(result.area.status).toBe("conflict");
    expect(result.conflicts[0]?.values).toEqual(["56,8 м²", "66 м²", "66,24 м²"]);
    expect(result.productionTerm.value).toBe("60 д.");
    expect(result.bedrooms.value).toBe("2");
    expect(result.floors.value).toBe("1");
  });

  it("discovers only Bygge product pages, including relative catalog links", () => {
    const html = `
      <a href="katalog/elen/">Elen</a>
      <a href="/katalog/patio-v2/">Patio</a>
      <a href="/katalog/modulnyie-doma/">Category</a>
    `;

    expect(discoverByggeProjectUrls({ html })).toEqual([
      "https://bygge.ru/katalog/elen/",
      "https://bygge.ru/katalog/patio-v2/",
    ]);
  });

  it("extracts only explicitly labelled facts with the generic manufacturer adapter", () => {
    const html = `
      <script type="application/ld+json">
        {"@graph":[{"@type":"Product","name":"Дом 60","offers":{"price":"3640000"},"image":"/house.webp"}]}
      </script>
      <h1>Дом 60</h1>
      <div>Общая площадь: 60 м²</div>
      <div>Габариты: 6 × 10 м</div>
      <div>Количество спален: 2</div>
      <div>Этажность: 1</div>
      <div>Срок производства: 30 дней</div>
    `;
    const result = parseGenericProject({
      manufacturerId: "example-maker",
      html,
      sourceUrl: "https://example.com/dom-60/",
    });

    expect(result.manufacturerId).toBe("example-maker");
    expect(result.name.value).toBe("Дом 60");
    expect(result.area.value).toBe("60 м²");
    expect(result.price.value).toBe("3 640 000 ₽");
    expect(result.productionTerm.value).toBe("30 д.");
    expect(result.bedrooms.value).toBe("2");
    expect(result.floors.value).toBe("1");
    expect(result.dimensions.value).toBe("6 × 10 м");
  });

  it("reads FPS Modul project facts without confusing delivery with the house price", () => {
    const html = `
      <h1>Модульный дом АH 281</h1>
      <div>Общая площадь: 54 кв.м.</div>
      <div class="price"><span class="value">2 160 000 ₽</span></div>
      <div style="background-image:url('/data/uploads/catalog/ah281/0.webp')"></div>
      <a href="/data/uploads/catalog/ah281/plan-1.webp">План</a>
      <section>Доставка от 8 000 рублей</section>
    `;
    const result = parseFpsModulProject({
      html,
      sourceUrl: "https://fps-modul.ru/art-haus/modulnyj-dom-ah281",
    });

    expect(result.area.value).toBe("54 м²");
    expect(result.price.value).toBe("2 160 000 ₽");
    expect(result.media.imageUrls).toEqual([
      "https://fps-modul.ru/data/uploads/catalog/ah281/plan-1.webp",
      "https://fps-modul.ru/data/uploads/catalog/ah281/0.webp",
    ]);
    expect(result.media.planStatus).toBe("published");
  });

  it("reads DA-HOME only from the primary card and ignores related project prices", () => {
    const html = `
      <section>
        <div class="gallery"><img src="/images/gallery/p06/g1.jpg"><img src="/images/gallery/p06/plan.jpg"></div>
        <h1>Модульный дом 30 м²</h1>
        <span class="text-4xl font-extrabold">690 000 ₽</span>
        <dl>
          <dt>Площадь</dt><dd>30 м²</dd>
          <dt>Размер</dt><dd>6 × 5 м</dd>
          <dt>Этажность</dt><dd>1 этаж</dd>
          <dt>Технология</dt><dd>Модульный дом</dd>
        </dl>
        <li>Утепление: минеральная вата 100 мм</li>
      </section>
      <h2>Похожие проекты</h2>
      <article><span class="text-4xl">1 600 000 ₽</span><div>Срок 30 дней</div></article>
    `;
    const result = parseDaHomeProject({
      html,
      sourceUrl: "https://da-home.ru/proekt/modulnyy-dom-30/",
    });

    expect(result.price.value).toBe("690 000 ₽");
    expect(result.productionTerm.status).toBe("not-published");
    expect(result.floors.value).toBe("1");
    expect(result.dimensions.value).toBe("6 × 5 м");
    expect(result.insulation?.value).toBe("100 мм");
    expect(result.media.imageUrls).toEqual([
      "https://da-home.ru/images/gallery/p06/g1.jpg",
      "https://da-home.ru/images/gallery/p06/plan.jpg",
    ]);
  });

  it("extracts a Tilda project gallery while rejecting logos and unrelated carousels", () => {
    const encode = (items: string[]) => JSON.stringify(items.map((li_img) => ({ li_img })))
      .replaceAll('"', "&quot;");
    const desktop = encode([
      "https://static.tildacdn.com/tild1111/front.webp",
      "https://static.tildacdn.com/tild2222/interior.webp",
      "https://static.tildacdn.com/tild3333/plan.webp",
    ]);
    const mobile = encode([
      "https://static.tildacdn.com/tild1111/front.webp",
      "https://static.tildacdn.com/tild2222/interior.webp",
      "https://static.tildacdn.com/tild4444/terrace.webp",
    ]);
    const unrelated = encode([
      "https://static.tildacdn.com/tild5555/review-1.webp",
      "https://static.tildacdn.com/tild6666/review-2.webp",
    ]);
    const html = `
      <h1>Дом</h1>
      <div data-field-imgs-value="${desktop}"></div>
      <div data-field-imgs-value="${mobile}"></div>
      <div data-field-imgs-value="${unrelated}"></div>
      <img src="https://static.tildacdn.com/tild7777/company-logo.png">
    `;
    const result = parseGenericProject({
      manufacturerId: "tilda-maker",
      html,
      sourceUrl: "https://example.com/dom/",
    });

    expect(result.media.imageUrls).toEqual([
      "https://static.tildacdn.com/tild1111/front.webp",
      "https://static.tildacdn.com/tild2222/interior.webp",
      "https://static.tildacdn.com/tild3333/plan.webp",
      "https://static.tildacdn.com/tild4444/terrace.webp",
    ]);
    expect(result.media.planStatus).toBe("published");
  });

  it("keeps one SQ-MODYL base variant together and never reads millimeters as days", () => {
    const html = `
      <h1>Модульный дом серии «Шале»</h1>
      <title>Модульный дом Шале под ключ</title>
      <div>Стоимость от 1.93 млн. ₽</div>
      <div>90 дней Срок изготовления</div>
      <section>Стоимость модульный дом Шале 30 Кухня гостиная: 13.8 м² Спальня: 6.4 м² Санузел: 3.1 м² 6х5х3 м (ДхШхВ) Что входит 1.93 млн. ₽ Утеплитель KNAUF INSULATION (стены, пол, потолок), 150 мм.</section>
      <div>Дверь 1800х700 мм</div>
      <div data-field-imgs-value="[{&quot;li_img&quot;:&quot;https://static.tildacdn.com/tild1111/front.webp&quot;}]" />
    `;
    const result = parseSqModylProject({ html, sourceUrl: "https://modyl.info/modular-smart-home" });

    expect(result.area.value).toBe("30 м²");
    expect(result.price.value).toBe("1 930 000 ₽");
    expect(result.productionTerm.value).toBe("90 д.");
    expect(result.bedrooms.value).toBe("1");
    expect(result.dimensions.value).toBe("6 × 5 × 3 м");
    expect(result.technology.value).toBe("Каркасно-модульный");
    expect(result.insulation.value).toBe("150 мм");
    expect(result.completion.value).toBe("Под ключ");
  });

  it("keeps an SQ-MODYL marketing-price conflict visible to the release audit", () => {
    const html = `
      <h1>Каркасная баня серии «Смарт-бокс»</h1>
      <div>Стоимость от 1.44 млн. ₽</div>
      <div>90 дней Срок изготовления</div>
      <section>Стоимость модульная баня Смарт-бокс 24 8х3х2.8 м (ДхШхВ) Что входит 1.56 млн. ₽</section>
    `;
    const result = parseSqModylProject({ html, sourceUrl: "https://modyl.info/smart-box-bathhouse" });

    expect(result.price.value).toBe("1 560 000 ₽");
    expect(result.conflicts).toEqual(expect.arrayContaining([
      expect.objectContaining({ field: "price", values: ["1 560 000 ₽", "1 440 000 ₽"] }),
    ]));
  });

  it("discovers the 12 canonical SQ-MODYL series and ignores ordinary Tilda links", () => {
    const html = `
      <a href="/smart-box-bathhouse">Баня</a>
      <a href="https://modyl.info/panorama/">Панорама</a>
      <a href="/contacts">Контакты</a>
      <a href="https://t.me/example">Telegram</a>
    `;

    expect(discoverSqModylProjectUrls({ html })).toEqual([
      "https://modyl.info/smart-box-bathhouse",
      "https://modyl.info/panorama",
    ]);
  });
});
