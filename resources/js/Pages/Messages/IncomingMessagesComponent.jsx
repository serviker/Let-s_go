import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from '@inertiajs/inertia-react';
import '../../../css/IncomingMessages.css';
import { Button } from "@headlessui/react";
import {Inertia} from "@inertiajs/inertia";

const IncomingMessagesComponent = ({ driverIncoming, passengerIncoming, user }) => {
    const [openList, setOpenList] = useState({});
    const dropdownRefs = useRef({});

    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        return {
            date: date.toLocaleDateString([], {
                day: '2-digit',
                month: '2-digit',
            }),
            time: date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
    };

    const extractCityName = (address) => {
        if (!address) return '';
        const parts = address.split(',');
        for (let i = 0; i < parts.length; i++) {
            const trimmedPart = parts[i].trim();
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
        return parts[0].trim();
    };

    const toggleOpen = (id) => {
        setOpenList((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleClickOutside = (event) => {
        const newOpenList = { ...openList };
        Object.keys(dropdownRefs.current).forEach((id) => {
            if (dropdownRefs.current[id] && !dropdownRefs.current[id].contains(event.target)) {
                newOpenList[id] = false;
            }
        });
        setOpenList(newOpenList);
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openList]);

    // Сортировка driverIncoming и passengerIncoming по дате поездки
    const sortedDriverIncoming = [...driverIncoming].sort((b, a) => new Date(b.dateTimeDeparture) - new Date(a.dateTimeDeparture));
    const sortedPassengerIncoming = [...passengerIncoming].sort((b, a) => new Date(b.dateTimeDeparture) - new Date(a.dateTimeDeparture));


    return (
        <div className="incoming-container">
            <div className="incoming-header">
                <Button onClick={() => Inertia.visit('/dashboard')} className="btn btn-link text-decoration-none">
                    &larr;
                </Button>
                <h2>Входящие сообщения</h2>
            </div>
            <div className="incoming-list">
                {driverIncoming.length === 0 ? (
                    <p>Нет входящих сообщений как у водителя.</p>
                ) : (
                    sortedDriverIncoming.map((incoming) => {
                        const { date, time } = formatDateTime(incoming.dateTimeDeparture);
                        return (
                            <div
                                key={incoming.id}
                                onClick={() => toggleOpen(incoming.id)}
                                className="incoming-item"
                                ref={(el) => (dropdownRefs.current[incoming.id] = el)}
                            >
                                <div className="incoming-info">
                                    <h4>
                                        <span className="incoming-date">
                                         {date} {time}
                                            </span>
                                        {extractCityName(incoming.departureCity)} —> {extractCityName(incoming.arrivalCity)}

                                    </h4>
                                    <span className="passenger-count">
                                        {incoming.passengers.length}
                                    </span>
                                </div>

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
                                            <h4>Нет пассажиров.</h4>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            <h2>Ваши поездки пассажиром</h2>
            <div className="incoming-list">
                {passengerIncoming.length === 0 ? (
                    <p>Нет поездок пассажиром.</p>
                ) : (
                    sortedPassengerIncoming.map((incoming) => {
                        const { date, time } = formatDateTime(incoming.dateTimeDeparture);
                        return (
                            <div
                                key={incoming.id}
                                onClick={() => toggleOpen(incoming.id)}
                                className="incoming-item clickable"
                                ref={(el) => (dropdownRefs.current[incoming.id] = el)}
                            >
                                <h4>
                                    <span className="incoming-date">
                                            {date} {time}
                                        </span>
                                    {extractCityName(incoming.departureCity)} —> {extractCityName(incoming.arrivalCity)}

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
