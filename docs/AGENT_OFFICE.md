# Agent Office — первый этап

Этот документ описывает исходную визуализацию. Текущий исполнительный этап Astra → Scout, постоянное хранение истории, подключение API и проверка реальных источников описаны в [AGENT_RUNTIME.md](./AGENT_RUNTIME.md). Разделы ниже про отсутствие runtime и историю только в памяти относятся к первому этапу.

Внутренний маршрут: `/agent-office`. Отдельная ленивая страница с собственным оформлением, без публичной навигации и cookie-баннера. `Seo` выставляет `noindex,nofollow`. Маршрут отсутствует в реестре пререндера и sitemap. Авторизация пока не реализована: noindex не является контролем доступа. На боевой сервер этот этап не развёрнут.

## Файлы и точки подключения

- `src/pages/AgentOffice.tsx` — карта React Flow, масштаб, перемещение, миникарта, выбор агента и глобальные разделы.
- `src/features/agent-office/agents.ts` — все девять участников, специализации, позиции, организационные связи `organizationLinks` и отдельная цепочка обработки `taskPipeline` / `pipelineLinks`.
- `src/features/agent-office/AgentNode.tsx` — компактный узел, центральная Astra, шесть статусов.
- `src/features/agent-office/OfficePanel.tsx` — Overview, Activity, Tasks, Files; пустой Replay и пошаговое чтение истории, когда реальные события появятся.
- `src/features/agent-office/events.ts` — проверяемый контракт событий версии 1 и чистая проекция состояния.
- `src/features/agent-office/OfficeProvider.tsx` — локальное состояние и единственный вход `useOffice().ingest(event)` для будущего адаптера реального источника.
- `src/features/agent-office/agent-office.css` — оформление, ограниченное `.agent-office`, адаптивность и reduced motion.
- `src/test/agentOffice.test.ts` и `e2e/agent-office.spec.ts` — проверки состояния и браузерных действий; снимки четырёх размеров экрана сохраняются в `outputs/agent-office-tests`.
- `docs/AGENT_OFFICE.md` — этот документ.

В существующих файлах изменены только подключение отдельного маршрута в `src/App.tsx` и добавление зависимости `@xyflow/react` в `package.json` / `pnpm-lock.yaml`. Параллельные изменения других задач сохранены.

У всех агентов начальный статус `idle`. События, задачи, файлы отсутствуют. Клики, drag, zoom и открытие вкладок не создают Activity. Нет сетевого исполнителя, моделей, таймеров симуляции, импорта каталога или автоматической публикации. Позиции и состояние не сохраняются между перезагрузками.

## Контракт реальных событий

Каждое событие имеет `version: 1`, глобально уникальный `id`, `runId`, монотонный `sequence` внутри запуска, ISO-время `occurredAt`, глобально уникальный `taskId`, понятный `message` и данные по типу:

- `agent.status`: `agentId`, `status`.
- `task.handoff`: `from`, `to`; отображает отдельную направленную линию передачи. Само по себе не выдумывает завершение работы отправителя.
- `task.updated`: `task` с `id`, `title`, `agentId`, `status`.
- `file.recorded`: `file` с `id`, `name`, `path`, `agentId`, `taskId`. Путь показывается текстом; UI ничего не исполняет и не открывает автоматически.

Повторная доставка того же события не добавляет строку. Неизвестные агенты, статусы, некорректные связи задач и устаревшая последовательность отвергаются. Будущий транспорт обязан проверять/упорядочивать пакет перед передачей в React, обрабатывать ошибки и обеспечивать глобальную уникальность ID задач и файлов. `ingestOfficeEvent` доступен отдельно для проверки. История хранится только в памяти; хранение на сервере, авторизация и восстановление соединения относятся к следующему этапу.

Replay использует `replayOfficeEvents(events, cursor)` и не меняет текущее состояние. Подсветка передачи появляется только для явного `task.handoff` на выбранном шаге; следующее событие снимает её. Анимация отключается при `prefers-reduced-motion`. Автоматический проигрыватель пока не подключён — предусмотрен выбор шага.

## Референс AgentBoard

Изучен https://github.com/Samarth0211/AgentBoard на коммите `6ac861bffa1fbe645885d927b6faf28a2ebc5238`. README указывает MIT; отдельного LICENSE-файла в дереве этого коммита нет.

Рассмотрены `src/app/page.tsx`, `src/components/AgentNode.tsx`, `ConfigPanel.tsx`, `LogsPanel.tsx`. Переиспользован интерфейсный подход: React Flow с custom nodes и handles, smoothstep-связи, точечный фон, выбор узла с правой панелью, журнал событий, выделение состояния узла и анимация передачи. Реализация написана заново под Vite и текущую дизайн-систему; исходные компоненты не скопированы. В референсе используется React Flow 11 (`reactflow`), здесь — `@xyflow/react` 12.11.6. Next.js, Framer Motion, Gemini, `/api/execute`, `/api/workflow`, шаблоны и исполнительная логика не перенесены.

## Проверки

- TypeScript: `node node_modules/typescript/bin/tsc --noEmit -p tsconfig.app.json`.
- Модель состояния: `node node_modules/vitest/vitest.mjs run src/test/agentOffice.test.ts`.
- Браузер: `node node_modules/@playwright/test/cli.js test e2e/agent-office.spec.ts --output outputs/agent-office-tests`.
- Проверка актуального списка sitemap без сборки: `PRERENDER_LIST_ONLY=1 node scripts/prerender.mjs`.

До реализации полный TypeScript уже сообщал три ошибки в `src/test/projectSourceFacts.test.ts` (строки 40, 41, 43). Этот файл не изменялся в рамках Agent Office.
