import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../css/NotificationIncomingComponent.css';
import {Button} from "@headlessui/react"; // Ваши кастомные стили

const NotificationsList = ({ notifications, onMarkAsRead }) => {
    console.log('Уведомления:', notifications);
    return (
        <div>
            <div className="header">
                <Button onClick={() => window.history.back()} className="btn btn-link text-decoration-none">
                    &larr;
                </Button>
                <h2>Уведомления</h2>
            </div>

            {notifications.length === 0 ? (
                <p>Список уведомлений пуст</p>
            ) : (
                <ul>
                    {notifications.map(notification => (
                        <li key={notification.id} className={notification.read_at ? 'read' : 'unread'}>
                            <p>{notification.data.cancellation_reason} от {notification.data.driver_name}</p>
                            <small>{new Date(notification.created_at).toLocaleString()}</small>
                            {!notification.read_at && (
                                <button onClick={() => onMarkAsRead(notification.id)}>Прочитать</button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const NotificationIncomingComponent = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('Текущее состояние уведомлений:', notifications);
    }, [notifications]);


    // Функция для получения уведомлений
    const fetchNotifications = async () => {
        try {
            const response = await axios.get('/api/notifications');
            console.log('Ответ от сервера:', response.data);
            console.log('Тип данных:', typeof response.data);
            console.log('Количество уведомлений:', response.data.length);
            setNotifications(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Ошибка при получении уведомлений:', error);
        } finally {
            setLoading(false);
        }
    };



   /* const fetchNotifications = async () => {
        try {
            const response = await axios.get('/api/notifications', {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });
            console.log('Ответ от сервера:', response.data);
            setNotifications(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Ошибка при получении уведомлений:', error);
        }
    };*/


    // Обработка прочтения уведомления
    const markAsRead = async (notificationId) => {
        try {
            await axios.post(`/api/notifications/${notificationId}/read`);
            setNotifications((prevNotifications) =>
                prevNotifications.map(notification =>
                    notification.id === notificationId ? { ...notification, read_at: new Date() } : notification
                )
            );
        } catch (error) {
            console.error('Ошибка при пометке уведомления как прочитанного:', error);
        }
    };

    // Загрузка уведомлений при монтировании компонента
    useEffect(() => {
        fetchNotifications();
    }, []);

    console.log('Текущее состояние уведомлений:', notifications); // Это покажет, что происходит с состоянием

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="notifications-container">
            {notifications.length > 0 ? (
                <NotificationsList notifications={notifications} onMarkAsRead={markAsRead}/>
            ) : (
                <p>Нет новых уведомлений.</p>
            )}
        </div>
    );
};

export default NotificationIncomingComponent;
