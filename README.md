# Реплика

Персональный AI-интервьюер для IT-специалистов. Пользователь задаёт роль и уровень, затем проходит живое видеособеседование с реалистичным аватаром, голосовым диалогом и уточняющими вопросами.

![React](https://img.shields.io/badge/React-19-20232a?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite&logoColor=white)

## Возможности

- персонализация по роли и уровню;
- Zoom-подобный экран звонка и локальное превью камеры;
- LiveAvatar FULL Mode: лицо, lip-sync, WebRTC, распознавание и синтез речи;
- динамические вопросы по резюме и вакансии;
- уточнения, естественные паузы и вежливые перебивания;
- защищённое создание сессии через serverless API;
- бесплатный Sandbox-режим примерно на одну минуту.

Интерфейс явно сообщает, что собеседование проводит AI. Секретный ключ никогда не отправляется в браузер и не хранится в Git.

## Запуск

```bash
npm install
npm run dev
```

Для полного локального запуска с serverless API используйте Vercel CLI:

```bash
cp .env.example .env.local
# Добавьте LIVEAVATAR_API_KEY в .env.local
npx vercel dev
```

Сборка и проверка:

```bash
npm run lint
npm run build
```

## Переменные окружения

| Переменная | Назначение |
| --- | --- |
| `LIVEAVATAR_API_KEY` | Серверный API-ключ LiveAvatar |
| `LIVEAVATAR_SANDBOX` | `true` для бесплатной минутной песочницы |
| `LIVEAVATAR_AVATAR_ID` | Необязательный ID production-аватара |

Получить ключ можно в [LiveAvatar Developers](https://app.liveavatar.com/). Для production-развёртывания добавьте его как Sensitive Environment Variable в Vercel, не в файл репозитория.

## Продуктовая модель

Целевая аудитория первого релиза — junior/middle IT-специалисты. Бесплатный тариф даёт короткую тренировку, Pro — полноценные интервью, разные персоны рекрутеров и историю прогресса.
