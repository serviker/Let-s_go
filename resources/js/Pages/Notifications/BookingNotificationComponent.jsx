import React from 'react';
import { usePage } from '@inertiajs/react';
import '../../../css/PassengerNotificationComponent.css';
import { Button } from "@headlessui/react";
import { Inertia } from "@inertiajs/inertia"; // Ваши кастомные стили
import axios from 'axios'; // Не забудьте импортировать axios

const BookingNotificationList = ({ orders, onMarkAsRead, onDeleteNotification }) => {
    const [message, setMessage] = useState(null); // Для отображения ошибок и успехов

    console.log('Orders:', orders); // Проверка получения данных

    const handleResponse = async (orderId, passengerId, approve) => {
        try {
            // Отправка запроса на сервер для одобрения или отклонения
            await Inertia.post(route('driver.respondBookingRequest', { orderId, passengerId }), {
                approve: approve,
            });
            setMessage({ type: 'success', text: approve ? 'Запрос одобрен!' : 'Запрос отклонен!' });
            // Дополнительно помечаем уведомление как прочитанное
            onMarkAsRead(orderId);
        } catch (error) {
            setMessage({ type: 'error', text: 'Ошибка при обработке запроса.' });
            console.error('Error handling request:', error);
        }
    };

    return (
        <div className="notification-container">
            {message && <p className={message.type}>{message.text}</p>}
            <div className="notification-header">
                <Button onClick={() => window.history.back()} className="btn btn-link">
                    &larr;
                </Button>
                <h2>Запросы на бронирование</h2>
            </div>

            <div className="notifications-container">
                {Array.isArray(orders) && orders.length === 0 ? (
                    <p>Нет запросов на бронирование.</p>
                ) : (
                    <ul className="notifications-list">
                        {orders.map(order => (
                            <li key={order.id} className="notification-item">
                                <div className="notification-text">
                                    <h2>Поездка из {order.fromCity} в {order.toCity}</h2>
                                    <p>Доступные места: {order.available_seats}</p>
                                    <p>Дата поездки: {new Date(order.date_time_departure).toLocaleDateString()}</p>

                                    <p>Запросы от пассажиров:</p>
                                    <ul>
                                        {order.passenger_requests.map(request => (
                                            <li key={request.id}>
                                                <p>Пассажир ID: {request.passenger_id}</p>
                                                <p>Сообщение: {request.message}</p> {/* Отображение сообщения */}
                                                <div>
                                                    <button
                                                        onClick={() => handleResponse(order.id, request.passenger_id, true)}
                                                        className="btn btn-info"
                                                        style={{ marginRight: '20px' }}>
                                                        Одобрить
                                                    </button>
                                                    <button
                                                        onClick={() => handleResponse(order.id, request.passenger_id, false)}
                                                        className="btn btn-warning">
                                                        Отклонить
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="notification-small">
                                    <small style={{ fontSize: '18px', marginLeft: '10px' }}>Дата/время запроса: {new Date(order.created_at).toLocaleString()}</small>
                                    {!order.read_at ? (
                                        <button className="btn btn-outline-info" onClick={() => onMarkAsRead(order.id)}>Прочитать</button>
                                    ) : (
                                        <button className="btn btn-danger" onClick={() => onDeleteNotification(order.id)}>Удалить</button>
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

export default BookingNotificationList;

// const BookingNotificationComponent = () => {
//     // Получаем данные через Inertia
//     const { props } = usePage();
//     const notifications = props.notifications || []; // Убедиться, что notifications существует
//
//      console.log(props); // Проверить, что props содержит notifications
//     // Добавляем отладочный лог для проверки полученных данных
//      console.log('Полученные уведомления:', notifications);
//
//     // Обработка прочтения уведомления
//     const markAsRead = async (notificationId) => {
//         try {
//             await axios.post(`/notifications/${notificationId}/read`);
//
//             // Автоматически перезагрузить данные с помощью Inertia
//             Inertia.reload({
//                 only: ['notifications'], // Перезагрузить только уведомления, если не хотите перезагружать всё
//                 preserveScroll: true,    // Сохраняет позицию скролла при перезагрузке
//             });
//
//         } catch (error) {
//             console.error('Ошибка при пометке уведомления как прочитанного:', error);
//         }
//     };
//
//     // Обработка удаления уведомления
//     const deleteNotification = async (notificationId) => {
//         try {
//             await axios.delete(`/notifications/${notificationId}`);
//
//             // Перезагрузить страницу с обновленным списком уведомлений
//             Inertia.reload({
//                 only: ['notifications'], // Перезагрузить только уведомления
//                 preserveScroll: true,    // Сохраняет позицию скролла при перезагрузке
//             });
//
//         } catch (error) {
//             console.error('Ошибка при удалении уведомления:', error);
//         }
//     };
//
//     return (
//         <div>
//             <BookingNotificationList notifications={notifications} onMarkAsRead={markAsRead} onDeleteNotification={deleteNotification} />
//         </div>
//     );
// };
//
// export default BookingNotificationComponent;
