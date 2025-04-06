Инструкция по установке и запуску:

## Установка и запуск

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/Ralseth/solidbranch-dashboard.git
   cd <ваш_репо>

2. Установите зависимости:
   npm install

3. Запустите dev-сервер:
   npm run dev
   Приложение будет доступно по адресу http://localhost:5173.

4. Сборка production-версии:
   npm run build
   Итоговые файлы появятся в папке dist.


## Особенности

- Приложение построено на React + TypeScript + Vite
- Поддерживается Drag&Drop для виджетов, а также их resize
- **Уникальный код `LIQN`** отображается в правом нижнем углу страницы
- Сохранение раскладок в LocalStorage
