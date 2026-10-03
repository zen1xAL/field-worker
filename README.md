# Код кандидата: SA-RN-2026-X1

## 📱 Field Worker Productivity App

Мобильное приложение для выездных специалистов и сервисных инженеров на **React Native** (Expo Managed Workflow) с автономным офлайн-режимом, очередью синхронизации (Outbox pattern), интерактивной картой объектов, фотоотчетами и локальными уведомлениями.

---

## 🛠 Технологический стек

* **Платформа**: React Native 0.86 (Expo SDK 57, React 19, TypeScript в Strict Mode).
* **Управление состоянием**: Redux Toolkit (`@reduxjs/toolkit` + `react-redux`) с персистентностью в `@react-native-async-storage/async-storage`.
* **Автономность и сеть**: `@react-native-community/netinfo`, очередь синхронизации Outbox, слияние данных по стратегии Last-Write-Wins (LWW).
* **Mock REST Server**: `json-server` (база в `server/db.json`, запуск через `npm run mock`).
* **Карта объектов**: Интерактивная векторная карта Leaflet + OpenStreetMap внутри `react-native-webview` (без требований платных API-ключей карт).
* **Оповещения**: `expo-notifications` (плановые напоминания за 30 мин + мгновенное тестирование канала связи).
* **Мультимедиа**: `expo-image-picker` и изолированное сохранение во внутреннее хранилище `expo-file-system`.
* **Качество и тестирование**: Jest + `ts-jest` (38 модульных тестов, 100% покрытие ключевой бизнес-логики).

---

## 🏗 Архитектура приложения

Приложение спроектировано по принципам **Clean Architecture** и **SOLID** с четким разделением на слои:

1. **Domain Layer (`src/types`, `src/utils/validation.ts`)**:
   * Чистые бизнес-интерфейсы (`Task`, `OutboxQueueItem`, `HistoryLogItem`, `SyncStatus`).
   * Строгая валидация форм на чистом TypeScript (`validateTaskForm`) без лишних раздувающих бандл зависимостей.

2. **Application / State Layer (`src/store`, `src/hooks`)**:
   * Redux Toolkit слайсы: `tasksSlice`, `syncSlice`, `historySlice`, `themeSlice`.
   * Мемоизированные селекторы на базе `createSelector` для высокопроизводительной фильтрации и сортировки нарядов.
   * Пользовательские хуки-оркестраторы: `useSyncQueue`, `useTaskActions`, `useNetworkMonitor`.

3. **Infrastructure / Services Layer (`src/services`)**:
   * `syncService`: сетевое взаимодействие с REST API, отказоустойчивые запросы с `AbortController` и таймаутами.
   * `storageService`: абстракция над `AsyncStorage` для персистентности данных.
   * `mediaService`: работа с нативной камерой и галереей, кэширование фото в изолированном хранилище файловой системы.
   * `notificationService`: планирование локальных пуш-уведомлений и тестовых оповещений.

4. **Presentation Layer (`src/screens`, `src/components`)**:
   * Атомарные переиспользуемые UI-примитивы (`AppButton`, `AppCard`, `AppBadge`, `AppInput`, `ScreenHeader`).
   * Строгая дизайн-система токенов (`SPACING`, `RADIUS`, `LAYOUT`, `TYPOGRAPHY`, `THEME_COLORS`).
   * Поддержка высококонтрастных тем оформления (Light / Dark) и эргономика сенсорных зон (tap targets >= 48dp).

---

## 🚀 Быстрый старт

### 1. Установка зависимостей
```bash
npm install
```

### 2. Запуск модульных тестов
```bash
npm test
```
Запускает 5 наборов тестов Jest (валидация формы задач, редьюсеры задач с LWW-слиянием, очередь синхронизации, журнал истории, утилиты времени).

### 3. Запуск Mock REST-сервера
```bash
npm run mock
```
Запускает `json-server` на порту `3000` (доступен по локальной сети `0.0.0.0:3000/tasks`).

### 4. Запуск приложения в Expo
```bash
npm start
```
Отсканируйте QR-код в приложении **Expo Go** на смартфоне Android или запустите на эмуляторе клавишей `a`.

---

## 📦 Сборка автономного APK (EAS Build)

Для создания автономного установочного `.apk` без использования Expo Go:

1. Установите EAS CLI (при необходимости):
   ```bash
   npm install -g eas-cli
   ```
2. Запустите сборку профиля `preview`:
   ```bash
   npx eas-cli build -p android --profile preview
   ```
3. Скачайте готовый `.apk` по ссылке из терминала и установите на устройство.

---

## ⚖️ Архитектурные компромиссы и известные ограничения

* **Разрешение конфликтов Last-Write-Wins (LWW)**: Применена стратегия LWW на основе таймстемпа `updatedAt`. Для задач выездного специалиста это наиболее надежное и прозрачное решение.
* **Движок карты Leaflet/OSM**: Использование Leaflet на `WebView` позволило избавиться от обязательного платного Google Maps API-ключа, устранило проблемы совместимости в Expo Go и обеспечило чистые векторные тайлы OpenStreetMap без ограничений.
* **Хранилище медиа**: Фотографии сохраняются в локальное изолированное хранилище приложения (`expo-file-system`), а в Redux и mock-сервер передаются оптимизированные URI и метаданные, что защищает `AsyncStorage` от переполнения квот памяти.
