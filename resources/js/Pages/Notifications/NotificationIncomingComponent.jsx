import React from 'react';
import { usePage } from '@inertiajs/react';
import '../../../css/NotificationIncomingComponent.css';
import { Button } from "@headlessui/react";
import {Inertia} from "@inertiajs/inertia"; // Ваши кастомные стили

const NotificationsList = ({ notifications, onMarkAsRead }) => {
    return (
        <div className="notification-container">
            <div className="notification-header">
                <Button onClick={() => window.history.back()} className="btn btn-link">
                    &larr;
                </Button>
                <h2>Уведомления</h2>
            </div>

            <div className="notifications-container">
                {/*{notifications.length === 0 ? (*/}
                {/*    <p>Список уведомлений пуст</p>*/}
                {/*) : (*/}
                    <ul className="notifications-list">
                        {notifications.map(notification => (
                            <li key={notification.id}
                                className={`notification-item ${notification.read_at ? 'read' : 'unread'}`}>
                                <p className="notification-text">{notification.data.driver_name} {notification.data.cancellation_reason}</p>
                                <div className="notification-small">
                                    <small style={{ fontSize: '20px'}}>{new Date(notification.created_at).toLocaleString()}</small>
                                    {!notification.read_at && (
                                        <button className="btn btn-outline-info"
                                                onClick={() => onMarkAsRead(notification.id)}>Прочитать</button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                {/*)}*/}
            </div>
        </div>
    );
};

const NotificationIncomingComponent = () => {
    // Получаем данные через Inertia
    const {props} = usePage();
    const {notifications} = props;

    // Обработка прочтения уведомления
    const markAsRead = async (notificationId) => {
        try {
            await axios.post(`/notifications/${notificationId}/read`);

            // После успешного запроса, перезапросить уведомления
            await axios.get('/notifications').then((response) => {
                const updatedNotifications = response.data.props.notifications;
                Inertia.reload(); // Перезагрузить страницу с новыми уведомлениями
            });

        } catch (error) {
            console.error('Ошибка при пометке уведомления как прочитанного:', error);
        }
    };


    return (
        <div>
            {notifications.length > 0 ? (
                <NotificationsList notifications={notifications} onMarkAsRead={markAsRead}/>
            ) : (
                <p>Нет новых уведомлений.</p>
            )}
        </div>
    );
};

export default NotificationIncomingComponent;
