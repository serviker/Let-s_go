import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, usePage } from '@inertiajs/react';
import '../../../css/DriverOrderDetails.css';

export default function DriverOrderDetails() {
    const { order } = usePage().props;
    const [data, setData] = useState(order);

    useEffect(() => {
        // Функция для получения данных заказа
        const fetchOrderData = async () => {
            try {
                const response = await axios.post('/orders/${order.id}'); // Замените URL на ваш
                setData(response.data);
            } catch (error) {
                console.error('Ошибка при получении данных заказа:', error);
            }
        };

        // Если данные уже переданы через пропсы, просто устанавливаем их
        if (order) {
            setData(order);
        } else {
            fetchOrderData(); // Вызов функции получения данных при монтировании
        }
    }, [order]); // Добавляем зависимость от order

    if (!data) {
        return <div>Error: Order data is missing</div>;
    }

    const departureDate = new Date(data.dateTimeDeparture);
    const formattedDate = departureDate.toLocaleDateString('ru-RU', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
    });
    const formattedTime = departureDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className="order-details-container bg-white p-6 rounded-lg shadow-lg">
            <h1 className="order-date">{formattedDate}</h1>
            <div className="departure-info">
                <div className="route-line">
                    <div className="circle"></div>
                </div>
                <div className="departure-address">
                    {data.fromCity}, {data.departureAddress}
                </div>
                <div className="departure-time">{formattedTime}</div>
            </div>

            {/* Промежуточные города */}
            {data.intermediate_addresses && data.intermediate_addresses.length > 0 && (
                <div className="intermediate-cities">
                    {data.intermediate_addresses.map((city, index) => (
                        <div key={index} className="intermediate-city">
                            <div className="route-line">
                                <div className="line"></div>
                                <div className="circle"></div>
                                <div className="line"></div>
                            </div>
                            <div className="intermediate-city-name">
                                {city}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="arrival-info">
                <div className="route-line">
                    <div className="circle"></div>
                </div>
                <div className="arrival-address">
                    {data.toCity}, {data.arrivalAddress}
                </div>
            </div>

            <div className="separator"></div>

            <div className="price-container">
                <span className="price-label">Итого за 1 пассажира:</span>
                <span className="price-value">{data.price} ₽</span>
            </div>

            <div className="separator"></div>
            <Link href={route('profile.edit', {id: data.driverId})} className="driver-link">
                <div className="driver-info">
                    <img
                        src={data.driverPhotoUrl ? data.driverPhotoUrl : '/images/user_icon.svg'}
                        alt="Driver"
                        className="driver-photo"
                    />
                    <p className="driver-name">{data.driverName}</p>

                </div>
            </Link>

            <div className="separator-thin"></div>

            {/* Описание поездки */}
            {data.description && (
                <div className="trip-description">
                    <p>{data.description}</p>
                </div>
            )}

            <div className="separator-thin"></div>

            {/* Свободные места */}
            <div className="available-seats">
                <span className="available-seats-label">Свободных мест:</span>
                <span className="available-seats-value">{data.availableSeats}</span>
            </div>

            <div className="separator-thin"></div>

            <div className="communication">
                <span className="communication-label">Связатся с </span>
                <span className="communication-value">{data.driverName}</span>
            </div>

            <div className="separator-thin"></div>

            <p className="car-name">{order.carName}</p>
            <p className="car-color" style={{fontSize: '18px'}}>{order.carColor}</p>
            <div className="separator-thin"></div>
            <p className="available-seats-label">Максимум двое сзади</p>
            <div className="separator-thin"></div>

            <div className="button-container">
                <Link href={route('driver.orders')} className="home-link">
                    <button type="button" className="btn btn-primary">К поездкам</button>
                </Link>
                <Link href="/" className="home-link">
                    <button className="btn btn-info">На главную</button>
                </Link>
            </div>
        </div>
    );
}

DriverOrderDetails.propTypes = {
    order: PropTypes.shape({
        departureAddress: PropTypes.string,
        arrivalAddress: PropTypes.string,
        fromCity: PropTypes.string,
        toCity: PropTypes.string,
        intermediate_addresses: PropTypes.arrayOf(PropTypes.string), // Промежуточные города
        price: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]).isRequired,
        dateTimeDeparture: PropTypes.string,
        driverName: PropTypes.string,
        driverPhotoUrl: PropTypes.string,
        driverId: PropTypes.number.isRequired,
        description: PropTypes.string, // Описание поездки
        availableSeats: PropTypes.number.isRequired, // Свободные места
    }).isRequired,
};
