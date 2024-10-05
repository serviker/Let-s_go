import React from 'react';
import { usePage } from '@inertiajs/react';
import '../../../css/DriverNotificationComponent.css';
import { Button } from "@headlessui/react";
import {Inertia} from "@inertiajs/inertia"; // Ваши кастомные стили

const NotificationsList = ({ notifications, onMarkAsRead, onDeleteNotification }) => {
   // console.log("Полученные уведомления из notifications:", notifications); // Отладка полученных данных
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

                                {/*<p className="notification-text">Водитель {notification.data.driverName} отменил поездку.<br/> Причина отмены: {notification.data.cancellation_reason}</p>*/}
                                <div className="notification-text">
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        alignContent: "space-between"
                                    }}>

                                        <div style={{flex: 1, fontSize: '20px', color: 'grey', fontWeight: 'bold', marginLeft: '10px'}}>
                                            {notification.data.date_time_departure ? new Date(notification.data.date_time_departure).toLocaleDateString() : 'Не указано'}
                                        </div>

                                        <div style={{display: 'flex'}}>
                                            <div style={{
                                                flex: 1,
                                                fontSize: '20px',
                                                color: 'grey',
                                                fontWeight: 'bold'
                                            }}>
                                                {notification.data.fromCity || 'Не указано'}
                                            </div>
                                            <div className="arrow" style={{flex: 0, margin: '0 10px'}}>→</div>
                                            <div style={{
                                                flex: 1,
                                                fontSize: '20px',
                                                color: 'grey',
                                                fontWeight: 'bold'
                                            }}>
                                                {notification.data.toCity || 'Не указано'}
                                            </div>
                                        </div>
                                        <div style={{flex: 1,textAlign: 'right' , fontSize: '20px', color: 'grey', fontWeight: 'bold'}}>
                                            {notification.data.name || 'Не указано'}
                                        </div>
                                    </div>
                                    <div style={{ marginLeft: '10px', marginTop: '10px', display: 'flex', justifyContent: 'space-between'}}>
                                        Причина отмены: <div style={{ color: 'grey', fontWeight: 'bold'}}>{notification.data.cancellation_reason || 'Не указано'}</div>
                                </div>
                                </div>

                                <div className="notification-small">
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between', // Это выравнивает элементы по ширине
                                        gap: '10px' // Добавляет пространство между элементами
                                    }}>
                                        <small style={{fontSize: '18px', marginLeft: '10px'}}>
                                            Дата/Время отмены поездки
                                        </small>
                                        <div style={{
                                            fontSize: '20px',
                                            color: 'grey',
                                            fontWeight: 'bold',
                                            marginLeft: '50px'
                                        }}>
                                            {new Date(notification.created_at).toLocaleString()}
                                        </div>
                                    </div>

                                    {!notification.read_at ? (
                                        <button className="btn btn-outline-info"
                                                onClick={() => onMarkAsRead(notification.id)}>Прочитать</button>
                                    ) : (
                                        <button className="btn btn-danger"
                                                onClick={() => onDeleteNotification(notification.id)}>Удалить</button>
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

const NotificationComponent = () => {
    // Получаем данные через Inertia
    const {props} = usePage();
    const notifications = props.notifications || []; // Убедиться, что notifications существует

    // console.log(props); // Проверить, что props содержит notifications
    // Добавляем отладочный лог для проверки полученных данных
   // console.log('Полученные уведомления:', notifications);

    // Обработка прочтения уведомления
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

export default NotificationComponent;
