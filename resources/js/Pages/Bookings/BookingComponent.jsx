import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import '../../../css/PassengerNotificationComponent.css';
import { Button } from "@headlessui/react";
import { Inertia } from "@inertiajs/inertia";
import axios from 'axios';

const BookingList = ({ orders, onMarkAsRead, onDeleteNotification, handleResponse }) => {
   // console.log("Полученные данные из handleResponse:", handleResponse); // Отладка полученных данных
    return (
        <div className="notification-container">
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

                                    {order.passenger_requests ? (
                                        <>
                                            <p>Запросы от пассажиров:</p>
                                            <ul>
                                                {order.passenger_requests.map(request => (
                                                    <li key={request.id}>
                                                        <p>Пассажир ID: {request.passenger_id}</p>
                                                        <p>Сообщение: {request.message}</p>
                                                        <div>
                                                            <button
                                                                onClick={() => handleResponse(order.id, request.passenger_id, true)}
                                                                className="btn btn-info"
                                                                style={{marginRight: '20px'}}>
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
                                        </>
                                    ) : (
                                        <p>Ответ на
                                            бронирование: {order.response_status === 'approve' ? 'Одобрено' : 'Отклонено'}</p>
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

const BookingComponent = () => {
    const {props} = usePage();
    const orders = props.orders || [];
    const [message, setMessage] = useState(null);

    const handleResponse = async (orderId, passengerId, approve) => {
        console.log("Полученные данные из handleResponse:", orderId, passengerId, approve );
        try {
            await Inertia.post(route('driver.respondBookingRequest', { orderId, passengerId }), {
                approve: approve,
            });
            setMessage({ type: 'success', text: approve ? 'Запрос одобрен!' : 'Запрос отклонен!' });
            markAsRead(orderId);
        } catch (error) {
            setMessage({ type: 'error', text: 'Ошибка при обработке запроса.' });
            console.error('Error handling request:', error);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await axios.post(`/notifications/${notificationId}/read`);
            Inertia.reload({ only: ['notifications'], preserveScroll: true });
        } catch (error) {
            console.error('Ошибка при пометке уведомления как прочитанного:', error);
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

    return (
        <div>
            {message && <p className={message.type}>{message.text}</p>}
            <BookingList
                orders={orders}
                onMarkAsRead={markAsRead}
                onDeleteNotification={deleteNotification}
                handleResponse={handleResponse}
            />
        </div>
    );
};

export default BookingComponent;
