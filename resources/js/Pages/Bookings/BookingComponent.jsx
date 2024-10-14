import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import '../../../css/PassengerNotificationComponent.css';
import { Button } from "@headlessui/react";
import { Inertia } from "@inertiajs/inertia";
import axios from 'axios';

const BookingList = ({ orders, onMarkAsRead, onDeleteNotification, handleResponse }) => {
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
                            <li key={order.order_id} className="notification-item">
                                <div className="notification-text">
                                    {/* Отображение информации о поездке */}
                                    <h2 style={{ display: 'flex', alignContent: 'center', justifyContent: 'center'}}>Поездка {order.fromCity}
                                        <div className="arrow">→</div>
                                        {order.toCity}</h2>
                                    <div style={{  display: 'flex', alignContent: 'center', justifyContent: 'center'}}>
                                    <div style={{ fontWeight: 'bold', color: 'gray', fontSize: '26px'}}>Доступных мест: {order.available_seats ?? 'Не указано'}</div>
                                    <div style={{ fontWeight: 'bold', color: 'gray', fontSize: '26px', marginLeft: '40px'}}>Дата поездки: {new Date(order.date_time_departure).toLocaleDateString()}</div>
                                    </div>
                                    {/* Проверка наличия запросов от пассажиров */}
                                    {order.passengerRequests && order.passengerRequests.length > 0 ? (
                                        <>
                                            <h3 style={{ fontWeight: 'bold', color: '#eea236', textAlign: 'center'}}>Запросы от пассажиров:</h3>
                                            <ul>
                                                {order.passengerRequests.map(request => (
                                                    <li key={request.request_id}>
                                                        <div style={{ fontWeight: 'bold', color: 'gray', textAlign: 'center', marginTop: '-10px', fontSize: '26px', marginBottom: '10px'}}>Пассажир: {request.passenger_name}</div>
                                                        <div style={{ fontWeight: 'bold', color: 'gray', textAlign: 'center', marginTop: '-10px', fontSize: '26px'}}>Сообщение: {request.message || 'Без сообщения'}</div>
                                                        <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'center'}}>
                                                            {/* Кнопки для одобрения или отклонения */}
                                                            <button
                                                                onClick={() => handleResponse(order.order_id, request.passenger_id, true)}
                                                                className="btn btn-info"
                                                                style={{ marginRight: '20px' }}>
                                                                Одобрить
                                                            </button>
                                                            <button
                                                                onClick={() => handleResponse(order.order_id, request.passenger_id, false)}
                                                                className="btn btn-warning">
                                                                Отклонить
                                                            </button>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    ) : (
                                        <div style={{ display: 'flex', alignContent: 'center', fontSize: '24px', fontWeight: 'bold', color: 'gray', justifyContent: 'center'}}>Ответ на бронирование: {order.response_status === 'approve' ? 'Одобрено' : 'Отклонено'}</div>
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

            // Здесь добавьте перезагрузку данных о заказах
            // Inertia.reload({ only: ['orders'], preserveScroll: true });
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
