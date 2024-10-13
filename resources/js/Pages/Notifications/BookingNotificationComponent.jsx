import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import '../../../css/PassengerNotificationComponent.css';
import { Button } from "@headlessui/react";
import { Inertia } from "@inertiajs/inertia";
import axios from 'axios';

const BookingNotificationComponent = () => {
    const { props } = usePage();
    const notifications = props.notifications || [];
    const orders = props.orders || [];  // Предполагаем, что заказы переданы в props
    const [message, setMessage] = useState(null);

    // Функция для пометки уведомления как прочитанного и редиректа на страницу запросов бронирования
    const handleReadAndRedirect = async (notificationId) => {
        try {
            // Помечаем уведомление как прочитанное
            await axios.post(`/notifications/${notificationId}/read`);

            // Перенаправляем на страницу запросов бронирования
            Inertia.visit(route('driver.bookingRequests', { driverId: props.auth.user.id }), {
                only: ['notifications/booking'], // Обновляем только уведомления после редиректа
                preserveScroll: true     // Сохраняем позицию скролла
            });
        } catch (error) {
            console.error('Ошибка при пометке уведомления как прочитанного и редиректе:', error);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            await axios.delete(`/notifications/${notificationId}`);
            Inertia.reload({ only: ['notifications'], preserveScroll: true });
        } catch (error) {
            console.error('Ошибка при удалении уведомления:', error);
        }
    };

    // Функция для проверки, является ли пользователь водителем в данном заказе
    const isDriverForOrder = (orderId) => {
        const order = orders.find(order => order.id === orderId); // Ищем заказ по ID
        return order && order.driver_id === props.auth.user.id;   // Сравниваем driver_id с текущим пользователем
    };

    const markAsRead = async (notificationId) => {
        try {
            await axios.post(`/notifications/${notificationId}/read`);

            // После успешного запроса, перезапросить уведомления
            /* await axios.get('/notifications').then((response) => {
                 const updatedNotifications = response.data.props.notifications;
                 Inertia.reload(); // Перезагрузить страницу с новыми уведомлениями
             });*/

            // Автоматически перезагрузить данные с помощью Inertia
            Inertia.reload({
                only: ['notifications'], // Перезагрузить только уведомления, если не хотите перезагружать всё
                preserveScroll: true,    // Сохраняет позицию скролла при перезагрузке
            });

        } catch (error) {
            console.error('Ошибка при пометке уведомления как прочитанного:', error);
        }
    };

    return (
        <div className="notification-container">
            <div className="notification-header">
                <Button onClick={() => window.history.back()} className="btn btn-link">
                    &larr;
                </Button>
                <h2>Уведомления о бронировании</h2>
            </div>

            <div className="notifications-container">
                {Array.isArray(notifications) && notifications.length === 0 ? (
                    <p>Нет уведомлений о бронировании.</p>
                ) : (
                    <ul className="notifications-list">
                        {notifications.map(notification => {
                            console.log("notification", notification);  // Логируем уведомление

                            // Проверяем, является ли текущий пользователь водителем в этом заказе
                            const isDriver = isDriverForOrder(notification.data.order_id);

                            return (
                                <li key={notification.id} className="notification-item">
                                    <div className="notification-text">
                                        <p>{notification.data?.message || 'Сообщение отсутствует'}</p>

                                        {/* Показываем кнопку "Посмотреть запросы" только для водителя */}
                                        {isDriver && (
                                            <button
                                                onClick={() => handleReadAndRedirect(notification.id)}
                                                className="btn btn-info"
                                            >
                                                Посмотреть запросы
                                            </button>
                                        )}
                                    </div>
                                    <div className="notification-small">
                                        <small style={{ fontSize: '18px', marginLeft: '10px' }}>
                                            Дата уведомления: {new Date(notification.created_at).toLocaleString()}
                                        </small>

                                        {!notification.read_at ? (
                                            <button className="btn btn-outline-info"
                                                    onClick={() => markAsRead(notification.id)}>Прочитать</button>
                                        ) : (
                                            <button className="btn btn-danger"
                                                    onClick={() => deleteNotification(notification.id)}>Удалить</button>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default BookingNotificationComponent;




/*// Проверяем, является ли пользователь водителем для каждого заказа
const isDriverForOrder = (orderId) => {
    const order = props.orders.find(order => order.id === orderId);
    return order && order.driverId === props.auth.user.id;
};

 // Проверяем, является ли пользователь водителем в конкретном заказе
const isDriver = (notification) => {
    const orderDriverId = notification.data.order?.driver_id; // Предполагаем, что driver_id есть в данных заказа
    return orderDriverId === props.auth.user.id;
};*/
