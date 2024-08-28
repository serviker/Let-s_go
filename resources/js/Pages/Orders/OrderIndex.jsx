import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@inertiajs/react';  // Используйте @inertiajs/react для навигации
import '../../../css/OrderIndex.css';  // Импорт стилей

export default function OrderIndex({ order }) {
    if (!order) {
        return <div>Error: Order data is missing</div>;
    }

    const departureDate = new Date(order.dateTimeDeparture).toLocaleDateString([], {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
    });

    const departureTime = new Date(order.dateTimeDeparture).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    const driverPhotoUrl = order.driverPhotoUrl ? order.driverPhotoUrl : '/images/user_icon.svg';

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

    return (
        <Link href={`/orders/${order.id}`} className="order-container bg-white p-6 rounded-lg shadow-lg relative">
            <div className="city-label from-city">
                {extractCityName(order.fromCity)}
            </div>
            <div className="departure-time-container">
                <div className="departure-date">{departureDate}</div>
                <div className="departure-time">{departureTime}</div>
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

OrderIndex.propTypes = {
    order: PropTypes.shape({
        fromCity: PropTypes.string.isRequired,
        toCity: PropTypes.string.isRequired,
       // intermediateCity: PropTypes.string,
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
