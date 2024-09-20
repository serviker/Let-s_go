import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from '@inertiajs/react';
import '../../../css/DriverOrderIndex.css'; // Импорт стилей

export default function DriverOrderIndex({ order }) {
    const [formattedDateTime, setFormattedDateTime] = useState({ date: '', time: '' });

    useEffect(() => {
        if (order) {
            const departureDate = new Date(order.dateTimeDeparture).toLocaleDateString([], {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            });

            const departureTime = new Date(order.dateTimeDeparture).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            });

            setFormattedDateTime({ date: departureDate, time: departureTime });
        }
    }, [order]);

    if (!order) {
        return <div>Error: Order data is missing</div>;
    }

    const driverPhotoUrl = order.driverPhotoUrl ? order.driverPhotoUrl : '/images/user_icon.svg';

    const extractCityName = (address) => {
        if (!address) return '';

        const parts = address.split(',');
        for (let part of parts) {
            const trimmedPart = part.trim();
            if (!/область|край|республика|район|россия|округ/i.test(trimmedPart)) {
                return trimmedPart;
            }
        }
        return parts[0].trim();
    };

    return (
        <Link href={`/orders/${order.id}`} className="order-container bg-white p-6 rounded-lg shadow-lg relative">
            <div className="city-label from-city">
                {extractCityName(order.fromCity)}
            </div>
            <div className="departure-time-container">
                <div className="departure-date">{formattedDateTime.date}</div>
                <div className="departure-time">{formattedDateTime.time}</div>
            </div>
            <div className="line-container">
                <div className="circle circle-left"></div>
                <div className="line"></div>
                <div className="circle circle-right"></div>
            </div>
            <div className="city-label to-city">
                {extractCityName(order.toCity)}
            </div>
            <div className="price-label">
                {order.price} ₽
            </div>
            <div className="separator"></div>
            <div className="info-container">
                <img
                    src={driverPhotoUrl}
                    alt="Driver"
                    className="driver-photo"
                />
                <p className="driver-name">{order.driverName}</p>
                {order.carName && (
                    <p className="car-name">{order.carName}</p>
                )}
            </div>
        </Link>
    );
}

DriverOrderIndex.propTypes = {
    order: PropTypes.shape({
        fromCity: PropTypes.string.isRequired,
        toCity: PropTypes.string.isRequired,
        price: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]).isRequired,
        driverName: PropTypes.string,
        carName: PropTypes.string,
        dateTimeDeparture: PropTypes.string.isRequired,
        driverPhotoUrl: PropTypes.string,
        id: PropTypes.number.isRequired
    }).isRequired,
};
