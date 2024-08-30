import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@inertiajs/inertia-react';

export default function PassengerOrdersIndex({ order }) {
    if (!order) {
        return <div>No available orders</div>;
    }

    // Функция для форматирования даты и времени
    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        const formattedDate = date.toLocaleDateString([], {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
        });
        const formattedTime = date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
        return { formattedDate, formattedTime };
    };

    // Функция для извлечения только названия города
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

    const { formattedDate, formattedTime } = formatDateTime(order.dateTimeDeparture);
    const driverPhotoUrl = order.driverPhotoUrl || '/images/user_icon.svg';

    return (
        <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="order-container bg-white p-6 rounded-lg shadow-lg relative"
        >
            <div className="city-label from-city">
                {extractCityName(order.fromCity)}
            </div>
            <div className="departure-time-container">
                <div className="departure-date">{formattedDate}</div>
                <div className="departure-time">{formattedTime}</div>
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

PassengerOrdersIndex.propTypes = {
    order: PropTypes.shape({
        id: PropTypes.number.isRequired,
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
    }).isRequired,
};
