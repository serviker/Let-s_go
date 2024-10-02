import React from 'react';
import { usePage } from '@inertiajs/react';
import '../../../css/PassengerNotificationComponent.css';
import { Button } from "@headlessui/react";
import { Inertia } from "@inertiajs/inertia"; // Ваши кастомные стили
import axios from 'axios'; // Не забудьте импортировать axios

const NotificationsList = ({ notifications, onMarkAsRead, onDeleteNotification }) => {
     console.log("Полученные уведомления из notifications:", notifications); // Отладка полученных данных
    return (
        <div className="notification-container">
            <div className="notification-header">
                <Button onClick={() => window.history.back()} className="btn btn-link">
                    &larr;
                </Button>
                <h2>Уведомления</h2>
            </div>

            <div className="notifications-container">
                {notifications.length === 0 ? (
                    <p>Список уведомлений пуст</p>
                ) : (
                    <ul className="notifications-list">
                        {notifications.map(notification => (
                            <li key={notification.id}
                                className={`notification-item ${notification.read_at ? 'read' : 'unread'}`}>

                                <div className="notification-text">
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        alignContent: "space-between"
                                    }}>
                                        <div style={{flex: 1, fontSize: '20px', color: '#eea236', fontWeight: 'bold'}}>
                                            {notification.data.date_time_departure ? new Date(notification.data.date_time_departure).toLocaleDateString() : 'Не указано'}
                                        </div>


                                        <div style={{display: 'flex'}}>
                                            <div style={{
                                                flex: 1,
                                                fontSize: '20px',
                                                color: '#eea236',
                                                fontWeight: 'bold'
                                            }}>
                                                {notification.data.fromCity || 'Не указано'}
                                            </div>
                                            <div className="arrow" style={{flex: 0, margin: '0 10px'}}>→</div>
                                            <div style={{
                                                flex: 1,
                                                fontSize: '20px',
                                                color: '#eea236',
                                                fontWeight: 'bold'
                                            }}>
                                                {notification.data.toCity || 'Не указано'}
                                            </div>
                                        </div>
                                        <div style={{
                                            flex: 1,
                                            textAlign: 'right',
                                            fontSize: '20px',
                                            color: '#eea236',
                                            fontWeight: 'bold'
                                        }}>
                                            {notification.data.name || 'Не указано'}
                                        </div>
                                        <div style={{
                                            flex: 1,
                                            textAlign: 'right',
                                            fontSize: '20px',
                                            color: '#eea236',
                                            fontWeight: 'bold'
                                        }}>
                                            {notification.data.seats || 'Не указано'}
                                        </div>
                                    </div>
                                    <div style={{marginLeft: '10px', marginTop: '10px'}}>
                                        Причина отмены: {notification.data.cancellation_reason || 'Не указано'}
                                    </div>
                                </div>

                                <div className="notification-small">
                                    <small style={{ fontSize: '18px', marginLeft: '10px' }}>Дата/Время отмены поездки {new Date(notification.created_at).toLocaleString()}</small>
                                    {!notification.read_at ? (
                                        <button className="btn btn-outline-info" onClick={() => onMarkAsRead(notification.id)}>Прочитать</button>
                                    ) : (
                                        <button className="btn btn-danger" onClick={() => onDeleteNotification(notification.id)}>Удалить</button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

const PassengerNotificationComponent = () => {
    // Получаем данные через Inertia
    const { props } = usePage();
    const notifications = props.notifications || []; // Убедиться, что notifications существует

     console.log(props); // Проверить, что props содержит notifications
    // Добавляем отладочный лог для проверки полученных данных
     console.log('Полученные уведомления:', notifications);

    // Обработка прочтения уведомления
    const markAsRead = async (notificationId) => {
        try {
            await axios.post(`/notifications/${notificationId}/read`);

            // Автоматически перезагрузить данные с помощью Inertia
            Inertia.reload({
                only: ['notifications'], // Перезагрузить только уведомления, если не хотите перезагружать всё
                preserveScroll: true,    // Сохраняет позицию скролла при перезагрузке
            });

        } catch (error) {
            console.error('Ошибка при пометке уведомления как прочитанного:', error);
        }
    };

    // Обработка удаления уведомления
    const deleteNotification = async (notificationId) => {
        try {
            await axios.delete(`/notifications/${notificationId}`);

            // Перезагрузить страницу с обновленным списком уведомлений
            Inertia.reload({
                only: ['notifications'], // Перезагрузить только уведомления
                preserveScroll: true,    // Сохраняет позицию скролла при перезагрузке
            });

        } catch (error) {
            console.error('Ошибка при удалении уведомления:', error);
        }
    };

    return (
        <div>
            <NotificationsList notifications={notifications} onMarkAsRead={markAsRead} onDeleteNotification={deleteNotification} />
        </div>
    );
};

export default PassengerNotificationComponent;
