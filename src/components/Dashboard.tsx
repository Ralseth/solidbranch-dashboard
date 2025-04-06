import React, { useState, useEffect, useCallback } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import type { Layout, Layouts } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const STORAGE_KEY = 'my-dashboard-layouts';

export default function Dashboard() {
    // Функция загрузки раскладок из localStorage
    const loadLayoutsFromStorage = (): Layouts => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
            // дефолтная раскладка, если localStorage пуст
            return {
                lg: [
                    { i: 'widget-1', x: 0, y: 0, w: 3, h: 2 },
                    { i: 'widget-2', x: 3, y: 0, w: 3, h: 2 },
                ],
            };
        } catch (error) {
            console.error('Error loading layouts:', error);
            return {
                lg: [
                    { i: 'widget-1', x: 0, y: 0, w: 3, h: 2 },
                    { i: 'widget-2', x: 3, y: 0, w: 3, h: 2 },
                ],
            };
        }
    };

    // Состояние: layouts
    const [layouts, setLayouts] = useState<Layouts>(loadLayoutsFromStorage);

    // Сохраняем в localStorage при каждом изменении layout
    const onLayoutChange = (currentLayout: Layout[], allLayouts: Layouts) => {
        setLayouts(allLayouts);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allLayouts));
    };

    // -----------------------------
    // 1) Добавление нового виджета
    // -----------------------------
    // Счётчик ID для новых виджетов
    // (можно использовать useRef, nanoid или любой другой способ)
    const [counter, setCounter] = useState(3); // т.к. у нас уже есть widget-1, widget-2

    // Добавляем новый виджет в массив layouts.lg
    const handleAddWidget = () => {
        // Уникальный ID виджета
        const widgetId = `widget-${counter}`;

        // Новая запись о виджете
        const newWidget: Layout = {
            i: widgetId,
            x: 0,
            y: 0,
            w: 3,
            h: 2,
        };

        // Копируем старые layouts
        const newLayouts = { ...layouts };
        // Добавляем новый виджет в breakpoint 'lg'
        newLayouts.lg = [...(newLayouts.lg || []), newWidget];

        // Ставим новый стейт
        setLayouts(newLayouts);
        // Пишем в localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newLayouts));

        // Увеличиваем счётчик, чтобы следующий виджет имел следующий номер
        setCounter((prev) => prev + 1);
    };

    // -----------------------------
    // 2) Удаление виджета
    // -----------------------------
    const handleRemoveWidget = useCallback(
        (widgetId: string) => {
            // Копируем текущий layouts
            const newLayouts = { ...layouts };
            // Убираем из newLayouts.lg элемент, у которого i === widgetId
            newLayouts.lg = newLayouts.lg?.filter((item) => item.i !== widgetId) || [];

            // Обновляем стейт и пишем в localStorage
            setLayouts(newLayouts);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newLayouts));
        },
        [layouts]
    );

    return (
        <div className="w-full h-full bg-gray-100 p-4">
            {/* Кнопка для добавления нового виджета */}
            <div className="mb-4">
                <button
                    onClick={handleAddWidget}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Добавить виджет
                </button>
            </div>

            {/* Сетка */}
            <ResponsiveGridLayout
                layouts={layouts}
                onLayoutChange={onLayoutChange}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                rowHeight={60}
                draggableCancel=".no-drag"
            >
                {(layouts.lg || []).map((item) => (
                    <div
                        key={item.i}
                        className="relative border border-gray-300 bg-white
                            p-2 flex items-center justify-center
                            rounded-lg shadow-md"
                    >
                        <h2 className="text-xl font-bold text-center">{item.i}</h2>
                        {/* Кнопка удаления виджета (абсолютно в верхнем правом углу) */}
                        <button
                            onClick={() => handleRemoveWidget(item.i)}
                            className="no-drag absolute top-1 right-1 text-sm bg-red-500
                                hover:bg-red-700 text-white px-2 py-1 rounded transition"
                        >
                            X
                        </button>
                    </div>
                ))}
            </ResponsiveGridLayout>

            {/* Уникальный код */}
            <div className="fixed bottom-4 right-4 text-sm text-gray-500 bg-white/80 px-2 py-1 rounded shadow">
                LIQN
            </div>
        </div>
    );
}
