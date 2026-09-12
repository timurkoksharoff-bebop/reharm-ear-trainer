# Space Music College — BUILD 074, сохранено 12 сентября 2026

## ГЛАВНАЯ ТОЧКА ВОЗОБНОВЛЕНИЯ

Пользователь попросил сохранить контекст и продолжить сборку BUILD 074.
Рабочий проект — ТОЛЬКО `game/` Space Music College. Не возвращаться к
родительскому Ear Reharm Trainer и не называть игру ER Trainer.

- Рабочий каталог: `/Users/tim/.codex/worktrees/8410/Ear Reharm Trainer`
- Ветка: `codex/space-music-college-067`
- Последняя опубликованная версия: BUILD 073, commit `5dcd259`.
- Мобильная production-ссылка 073:
  `https://timurkoksharoff-bebop.github.io/reharm-ear-trainer/game/?release=073`
- BUILD 074 находится в незакоммиченном рабочем состоянии. Его ещё нельзя
  выдавать пользователю как опубликованный.

## Что уже сделано локально для BUILD 074

1. Создан реальный каталог `game/melodies-catalog.mjs`: 200 уникальных
   джазовых мелодий, 20 753 события, примерно 251 KiB. Это мелодические линии,
   а не цифровки аккордов.
   - 130 тем: PSjazzEval RealBook MusicXML, CC BY 4.0 в файлах источника.
   - 48 тем: Freed Jazz MSCZ.
   - 22 темы: OpenEWLD MusicXML.
   Исходные архивы лежат только в `/private/tmp` и в Git не попадают.
2. Импортёр `game/tools/import_melodies.py` читает MusicXML, MXL и MSCZ,
   сохраняет длительности, паузы, лиги, триоли, затакты, регистр, стабильный
   `id`, имя исходного файла и SHA-256. Добавлен тест
   `game/tools/melody-import-check.py`; он проходит.
3. В `game/audio.mjs` мелодия проигрывается по событиям с паузами. Короткий
   вопрос и полное прослушивание используют одинаковый темп. Длинная тема
   планируется маленькими порциями, чтобы не создавать сразу сотни генераторов
   звука на iPhone. Тест `game/tools/audio-check.mjs` проходит.
4. После правильного ответа Melody Memory полёт остаётся на паузе, звучит вся
   записанная форма темы. Есть кнопка `Продолжить полёт →`, если не хочется
   ждать конца. Пауза/возврат и повтор запускают полную тему корректно.
   Пойманный во время исполнения артефакт ставится в очередь и открывается
   после темы.
5. Старые сохранённые ошибки Melody Memory мигрируют по стабильному имени/id,
   а не по номеру массива. Удалённая ошибочная Greensleeves не превращается
   в случайную новую тему. `game/tools/debrief-check.mjs` проходит.
6. Добавлен `game/melody-library.mjs`: отдельный список всех 200 тем с поиском,
   постраничным просмотром, случайным выбором, прослушиванием фрагмента и
   полной темы. Вход добавлен в Sound Lab как `♫ МЕЛОДИИ · 200`.
7. Начало `All the Things You Are` визуально сверено с пользовательским Real
   Book (`/Users/tim/Documents/_SCRIBD/Standards/...Volume-1-text.pdf`, стр. 22):
   прежний ручной фрагмент действительно был неверен, новый MusicXML совпадает
   на проверенном начале. Нельзя заявлять, что все 200 тем проверены вручную.
8. `game/tools/expedition-check.mjs` проходит: проверены полное исполнение,
   блокировка следующей сцены, устаревшие callbacks, pause/resume, очередь
   артефакта и ротация всего каталога.

Текущие изменённые файлы:
`game/audio.mjs`, `game/debrief.mjs`, `game/expedition.mjs`, `game/game.js`,
`game/mistake-log.mjs`, соответствующие тесты и bundle tool.
Новые нужные файлы:
`game/melodies-catalog.mjs`, `game/melody-library.mjs`,
`game/tools/import_melodies.py`, `game/tools/melody-import-check.py`,
`game/MELODY_CATALOG_SOURCES.md`.

Не включать в коммит старые незадействованные:
`game/assets/artifacts-cutouts.png`, `game/assets/artifacts-cutouts.webp`,
`game/design-concepts/`.

## Что осталось закончить перед публикацией BUILD 074

Обновление после сохранения: номера BUILD/CACHE уже переведены на 074,
документация источников и SESSION_STATE обновлены, bundle пересобран. Прошли
importer, melody importer, expedition, audio, debrief, standards library,
assets, static build, Node syntax и `git diff --check`. Добавлен отдельный
тест Melody Library; он тоже проходит.

1. Сделать локальную браузерную проверку, особенно iPhone portrait:
   Sound Lab → `МЕЛОДИИ · 200` → поиск → фрагмент → полная тема → Stop/Back;
   затем Melody Memory → правильный ответ → полная тема → Continue.
2. Закоммитить только нужные файлы, push в `origin/main`, проверить публичный
   service worker и дать мобильную ссылку с `?release=074`.

Попытка открыть CUA для браузерной проверки была отклонена самим сервисом
Codex из-за исчерпания usage limit до 13 сентября 2026 01:15. Это не ошибка
игры и не HTTP 403 нотного источника. Не обходить ограничение. После сброса
лимита повторить браузерную проверку штатно.

## Следующий игровой блок после выпуска 074

Переделать гидру как наземного босса:

- при встрече прокрутка/полёт фиксируются перед боссом;
- гидра стоит на поверхности и имеет контактную тень;
- корабль получает мягкую тень на земле, чтобы чувствовалась высота;
- 3–4 её пушки отслеживают корабль и наносят частый небольшой урон;
- HP становится дробной/длинной шкалой, а не «три попадания и конец»;
- правильный музыкальный ответ сильно повреждает гидру и восстанавливает HP;
- обычной долгой стрельбой гидру тоже можно победить, но знание музыки даёт
  большое преимущество.

Этот блок не смешивать с выпуском банка 200 тем, пока BUILD 074 не опубликован.

---

Ниже сохранена предыдущая запись как история; её сведения о локальном 073 и
старом проигрывателе уже устарели.

# Предыдущая пауза перед перезагрузкой, 12 сентября 2026

Пользователь попросил ПРИОСТАНОВИТЬ работу и сохранить контекст. Не продолжать
разработку автоматически, пока он не вернётся и не попросит продолжить.

## Где продолжать

- Рабочий каталог: /Users/tim/.codex/worktrees/8410/Ear Reharm Trainer
- Ветка: codex/space-music-college-067. Проект — Space Music College в game/;
  НЕ переносить работу на старый родительский Trainer.
- Опубликован BUILD 072, commit 5079189, origin/main.
- Мобильная ссылка: https://timurkoksharoff-bebop.github.io/reharm-ear-trainer/game/?release=072
- 073 пока ЛОКАЛЬНЫЙ, не опубликован и не закоммичен. В HTML/CSS query и
  service-worker уже стоит 0.73. Не выдавать ссылку на 073 как готовую.

## Последние изменения после 072

1. На скриншоте IMG_3146.PNG Safari TypeError undefined pattern.beats.
   Причина: replay во время reveal/roulette попадал в общий else audio.rhythm,
   где target отсутствует. Исправлено: переходные сцены игнорируют replay,
   кнопка Replay и Space заблокированы, ветка rhythm явная.
2. Пауза отменяет audio callbacks. Добавлен resumeChallenge: возобновляет
   прерванный звук раскрытия и завершение открытия; иначе ящик зависал бы.
3. Новые правила ТРУБАЧА (пользователь утвердил):
   - Novice/Student: guide или color; в color ВСЕГДА ОДНА надстройка.
   - Master: только color, ОДНА ИЛИ ДВЕ надстройки.
   - Legend: только color, ОДНА/ДВЕ/ТРИ.
   - Выделить набор → Ответить. Полёт удержан. Звучат выбранные надстройки.
   Реализовано toneMission(..., level), старт задания. Не путать с будущими
   отдельными Vibraphonist Color Hearing и Trumpeter Scale Palette.
4. expedition-check прошёл после этих изменений. build.mjs прошёл и bundle
   обновлён после runtime-изменений. Последнее изменение только в тесте/docs.
   Перед публикацией: повторить нужные проверки, проверить браузер и Git diff.
   tests/smoke.cjs отсутствует; macOS wrapper не входит в веб-выпуск.
5. Браузерная проверка 073 только начата: локальный запуск → LAUNCH → briefing.
   Следующий шаг UI: Артефакты и правила → Попробовать Rock Tongue/иной ящик,
   проверить Replay disabled, паузу/возврат во время раскрытия, отсутствие ошибки.

## Главный следующий блок: реальные мелодии, НЕ цифровки

Пользователь недоволен: 50 новых мелодий до сих пор не появились, банк старый.
Он утвердил список ниже и просит СРАЗУ ИМПОРТИРОВАТЬ, не ждать согласований.
Исключить имеющиеся из числа новых. Разрешил расширить до 100–200 основных
джазовых стандартов, если доступен пригодный архив. Не изобретать ноты.
Jazz 1460 — это гармония; 1085 доступных карт достаточно, 375 отложены.

Утверждённые 50 (имеющиеся тоже пересверить):
1. All of Me
2. All the Things You Are
3. Autumn Leaves
4. Blue Bossa
5. Fly Me to the Moon
6. Summertime
7. Take the A Train
8. Satin Doll
9. There Will Never Be Another You
10. On the Sunny Side of the Street
11. Misty
12. My Funny Valentine
13. Body and Soul
14. 'Round Midnight
15. My Foolish Heart
16. In a Sentimental Mood
17. Georgia on My Mind
18. Stardust
19. The Nearness of You
20. Someone to Watch Over Me
21. A Night in Tunisia
22. Caravan
23. The Girl from Ipanema
24. Black Orpheus
25. Corcovado
26. Wave
27. Desafinado
28. Recorda Me
29. St. Thomas
30. Footprints
31. So What
32. Blue Monk
33. C Jam Blues
34. Bag's Groove
35. Billie's Bounce
36. Straight, No Chaser
37. Watermelon Man
38. Cantaloupe Island
39. Doxy
40. Oleo
41. Stella by Starlight
42. Days of Wine and Roses
43. On Green Dolphin Street
44. Have You Met Miss Jones?
45. How High the Moon
46. Just Friends
47. Cherokee
48. Confirmation
49. Softly, as in a Morning Sunrise
50. What Is This Thing Called Love?

Списки для отбора: Learn Jazz Standards 50 Must-Know;
https://jenslarsen.nl/WP/wp-content/uploads/2020/02/50-Jazz-Standards-The-List.pdf
Выбор наш редакционный, не буквальный рейтинг.

## Нотные источники — факты, не обещания

- game/MELODY_SOURCE_AUDIT.md содержит результаты исследования.
- Freed Jazz https://freedjazz.org/songs/ — 52 темы, PDF и MuseScore MSCZ.
  Body and Soul скачан в /private/tmp/smc-body-and-soul.mscz и разобран:
  32 такта, 130 нот, 15 пауз, триоли. Этот источник может дать первую реальную
  порцию. Сохранять происхождение и ограничения, не объявлять всю музыку PD.
- JAZZMUS 163 темы на HuggingFace требует login/approval; не получен.
- Найден MusPy Wikifonia loader:
  https://raw.githubusercontent.com/salu133445/muspy/main/muspy/datasets/wikifonia.py
  указывает http://www.synthzone.com/files/Wikifonia/Wikifonia.zip,
  35,727,800 байт, sha256 e7bce509462a73cee175308b6a3cdafa9effd6e8958b3ce03b4edb293cc6b691.
  Попытка через HTTPS вернула HTTP403; файла smc-wikifonia.zip НЕТ.
  Не пытаться обходить ограничение доступа. Найти открытое разрешённое зеркало
  или пользоваться Freed Jazz/пользовательскими нотами. MusPy loader сохранён
  в /private/tmp/smc-wikifonia-loader.py (может исчезнуть после перезагрузки).
- В worktree reference только README; прежние ссылки в комментариях на Real
  Book не подтверждают текущую точность. Исходные PDF искать в разрешённых
  пользовательских файлах при необходимости, не добавлять PDF в Git.
- Проигрыватель melody сейчас notes/beats, без правильных пауз и лиг.
  До импорта реализовать точные события (паузы, затакт, лиги, триоли, регистр).
  Особенно пересверить Greensleeves и All the Things You Are.
- Джаз должен преобладать; классические/народные мелодии редкими вставками.
  Нужен перемешиваемый банк без постоянных повторов, удобное прослушивание.

## Артефакты — сохранить стиль, не перерисовывать вслепую

Пользователь считает, что смешаны разные версии. Найти утверждённые ящики,
из которых выступают настоящие инструменты. Язык должен быть металлический
с барабаном/механикой игрового автомата, НЕ просто знак Rolling Stones.
Сначала показать найденные исходники и согласовать единый набор.
Drum Machine нужен ОТДЕЛЬНЫЙ ящик от Zildjian; если исходника нет, сгенерировать.
Последние артефактные правки отложены по просьбе быстро выпустить 072.
Неудачные game/assets/artifacts-cutouts.png и .webp НЕ подключены, НЕ коммитить.
game/design-concepts — старый неотслеживаемый архив, не удалять/не публиковать.
Иконку из правильного металлического языка сделать после выбора источника.

## Прочее и возобновление

- Офлайн и ускорение запуска ещё не сделаны. Не обещать мгновенный offline.
- Автоматизацию space-music-college приостановить на время пользовательской
  перезагрузки; при возвращении не включать без его желания работать автоматически.
- Локальный http.server был 8135, terminal session5401; после reboot нужен новый.
- Node: /Users/tim/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node
- Все реальные изменения сохранены на диске. После возвращения прочитать этот
  файл, PROJECT_CONTEXT.md и SESSION_STATE.md, затем git status/diff.
- Сначала закончить и опубликовать исправление 073, затем реально импортировать
  нотный банк и выпустить следующий мобильный build. Не начинать проект заново.
