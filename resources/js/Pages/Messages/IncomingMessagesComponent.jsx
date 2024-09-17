import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from '@inertiajs/inertia-react';
import '../../../css/IncomingMessages.css';
import { Button } from "@headlessui/react";

const IncomingMessagesComponent = ({ driverIncoming, passengerIncoming, user }) => {
    // Функция для форматирования даты и времени
    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        return {
            date: date.toLocaleDateString([], {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            }),
            time: date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
    };

    // Функция для извлечения только названия города
    const extractCityName = (address) => {
        if (!address) return '';

        // Разделяем адрес на части, используя запятую
        const parts = address.split(',');

        // Проходим по частям и ищем название города
        for (let i = 0; i < parts.length; i++) {
            const trimmedPart = parts[i].trim();

            // Если часть не содержит "область", "край", "республика" и т.д., считаем это названием города
            if (
                !trimmedPart.toLowerCase().includes('область') &&
                !trimmedPart.toLowerCase().includes('край') &&
                !trimmedPart.toLowerCase().includes('республика') &&
                !trimmedPart.toLowerCase().includes('район') &&
                !trimmedPart.toLowerCase().includes('россия') &&
                !trimmedPart.toLowerCase().includes('округ')
            ) {
                return trimmedPart;
            }
        }

        // Если ничего не нашли, возвращаем первую часть, как fallback
        return parts[0].trim();
    };

    // Состояние для управления открытием списка пассажиров и водителя
    const [openList, setOpenList] = useState({});

    // Функция для переключения состояния списка
    const toggleOpen = (id) => {
        setOpenList((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <div className="incoming-container">
            <div className="incoming-header">
                <Button onClick={() => window.history.back()} className="btn btn-link text-decoration-none" style={{ display: 'flex'}}>
                    &larr;
                </Button>
                <h2><strong>Входящие сообщения</strong></h2>
            </div>
            <div className="incoming-list">
                {driverIncoming.length === 0 ? (
                    <p>Нет входящих сообщений как у водителя.</p>
                ) : (
                    driverIncoming.map((incoming) => {
                        const { date, time } = formatDateTime(incoming.dateTimeDeparture);
                        return (
                            <div key={incoming.id} className="incoming-item">
                                <h4>
                                    {extractCityName(incoming.departureCity) || 'Не указан'} —> {extractCityName(incoming.arrivalCity) || 'Не указан'},
                                    {date ? ` ${date} ${time}` : ' Дата и время не указаны'}
                                    <Button onClick={() => toggleOpen(incoming.id)} className="btn btn-link" style={{ float: 'right' }}>
                                        {openList[incoming.id] ? '▲' : '▼'}
                                    </Button>
                                </h4>
                                {openList[incoming.id] && (
                                    <div className="dropdown-menu">
                                        {incoming.passengers && incoming.passengers.length > 0 ? (
                                            incoming.passengers.map((p) => (
                                                <Link
                                                    key={p.id}
                                                    href={`/orders/${incoming.id}/messages/${p.id}`}
                                                    className="dropdown-item"
                                                >
                                                    {p.name}
                                                </Link>
                                            ))
                                        ) : (
                                            <p>У вас нет пассажиров.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            <h2>Ваши поездки как пассажир</h2>
            <div className="incoming-list">
                {passengerIncoming.length === 0 ? (
                    <p>Нет поездок как пассажир.</p>
                ) : (
                    passengerIncoming.map((incoming) => {
                        const { date, time } = formatDateTime(incoming.dateTimeDeparture);
                        return (
                            <div key={incoming.id} className="incoming-item">
                                <h4>
                                    {extractCityName(incoming.departureCity) || 'Не указан'} —> {extractCityName(incoming.arrivalCity) || 'Не указан'},
                                    {date ? ` ${date} ${time}` : ' Дата и время не указаны'}
                                    <Button onClick={() => toggleOpen(incoming.id)} className="btn btn-link" style={{ float: 'right' }}>
                                        {openList[incoming.id] ? '▲' : '▼'}
                                    </Button>
                                </h4>
                                {openList[incoming.id] && (
                                    <div className="dropdown-menu">
                                        <Link
                                            href={`/orders/${incoming.id}/messages/${user.id}`}
                                            className="dropdown-item"
                                        >
                                            Водитель: {incoming.driver.name}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

IncomingMessagesComponent.propTypes = {
    driverIncoming: PropTypes.array.isRequired,
    passengerIncoming: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
};

export default IncomingMessagesComponent;
