import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, usePage } from '@inertiajs/react';
import '../../../css/DriverOrderDetails.css';
import { Inertia } from '@inertiajs/inertia';

const PassengerOrderDetails = ({ order }) => {
    const { auth } = usePage().props; // Доступ к информации о пользователе из страницы
    const [availableSeats, setAvailableSeats] = useState(order.availableSeats);
    const [isBooked, setIsBooked] = useState(order.isBooked); // Используем isBooked из order
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [fromCity, setFromCity] = useState(order.fromCity || '');
    const [toCity, setToCity] = useState(order.toCity || '');
    const [data, setData] = useState(order);

    if (!data) {
        return <div>Error: Order data is missing</div>;
    }

    const currentPassenger = data.passengers.find((passenger) => passenger.id === auth.user.id); // Переместили выше

    useEffect(() => {
        if (currentPassenger) {
            setFromCity(currentPassenger.departureCity);
            setToCity(currentPassenger.arrivalCity);
        }
    }, [currentPassenger]);

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

    useEffect(() => {
        // Установите начальное состояние кнопки и текста
        if (availableSeats <= 0 || isBooked) {
            setIsButtonDisabled(true);
        }
    }, [availableSeats, isBooked]);

    const handleBooking = async () => {
        try {
            await Inertia.post(route('order.join', { order: order.id }), {
                departure_city: fromCity, // Передаем город отправления
                arrival_city: toCity,     // Передаем город прибытия
            }, {
                onSuccess: () => {
                    setIsBooked(true);
                    setAvailableSeats(availableSeats - 1);
                    Inertia.visit(route('dashboard'));
                },
                onError: (errors) => {
                    alert('Error: ' + errors.message);
                },
            });
        } catch (error) {
            console.error('Error booking the order:', error);
        }
    };

    const openDriverMessagingComponent = () => {
        Inertia.visit(`/orders/${data.id}/messages/${data.driverId}`);
    };


    return (
        <div className="order-details-container bg-white p-6 rounded-lg shadow-lg">
            <h1 className="order-date">{formattedDate}</h1>

            {/* Показываем только города отправления и прибытия пассажира
            {currentPassenger && (
                <>
                    <div className="departure-info">
                        <div className="route-line">
                            <div className="circle"></div>
                        </div>
                        <div className="departure-address">
                            {currentPassenger.departureCity}
                        </div>
                        <div className="departure-time">{formattedTime}</div>
                    </div>

                    <div className="arrival-info">
                        <div className="route-line">
                            <div className="circle"></div>
                        </div>
                        <div className="arrival-address">
                            {currentPassenger.arrivalCity}
                        </div>
                    </div>
                </>
            )}*/}
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
            <Link href={route('profile.show', {user: data.driverId})} className="driver-link">
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
                <span className="available-seats-value">
                    {availableSeats > 0 ? availableSeats : 'Свободных мест нет'}
                </span>
            </div>
            <div className="passenger-seats">
                <span className="passenger-seats-label">Пассажиры:</span>
                <div className="passenger-list">
                    {data.passengers.length > 0 ? (
                        data.passengers.map((passenger, index) => (
                            <div key={index} className="passenger"
                                 onClick={() => window.location.href = route('profile.show', {user: passenger.id})}>
                                {/* Имя пассажира слева */}
                                <div style={{flex: 1}}>
                                    <span className="passenger-name">{passenger.name}</span>
                                    <div className="passenger-cities-container">
                                        <span className="passenger-departure">{passenger.departureCity}</span>
                                        <div className="arrow">→</div>
                                        <span className="passenger-arrival">{passenger.arrivalCity}</span>
                                    </div>
                                </div>
                                <img
                                    src={passenger.photoUrl ? passenger.photoUrl : '/images/user_icon.svg'}
                                    alt={passenger.name}
                                    className="passenger-photo"
                                />
                            </div>
                        ))
                    ) : (
                        <p style={{color: '#eea236'}}>Будьте первым !!!</p>
                    )}
                </div>
            </div>

            <div className="separator-thin"></div>

            <div className="communication" onClick={openDriverMessagingComponent}>
                <span className="communication-label">Связаться с </span>
                <span className="communication-value">{data.driverName}</span>
            </div>


            <div className="separator-thin"></div>

            <div className="car-info">
                <div>
                    <p className="car-name">{order.carName}</p>
                    <p className="car-color" style={{fontSize: '18px'}}>{order.carColor}</p>
                </div>
                <img
                    src={data.carPhoto ? data.carPhoto : '/imagesCar/icon-car.png'}
                    alt="Driver"
                    className="car-photo"
                />
            </div>
            <div className="separator-thin"></div>
            <p className="available-seats-label">Максимум двое сзади</p>
            <div className="separator-thin"></div>

            <div className="button-container">
                <Link href={route('dashboard')} className="home-link">
                    <button type="button" className="btn btn-secondary">Назад</button>
                </Link>
                <button
                    className="btn btn-info"
                    disabled={isButtonDisabled}
                    onClick={handleBooking}
                >
                    {isBooked ? 'Вы забронировали место' : 'Забронировать место'}
                </button>
            </div>
        </div>
    );
};

PassengerOrderDetails.propTypes = {
    order: PropTypes.shape({
        fromCity: PropTypes.string,
        toCity: PropTypes.string,
        intermediate_addresses: PropTypes.arrayOf(PropTypes.string),
        price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        dateTimeDeparture: PropTypes.string,
        driverName: PropTypes.string,
        driverPhotoUrl: PropTypes.string,
        driverId: PropTypes.number.isRequired,
        description: PropTypes.string,
        availableSeats: PropTypes.number.isRequired,
        passengers: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
                name: PropTypes.string.isRequired,
                departureCity: PropTypes.string,
                arrivalCity: PropTypes.string,
                departureAddress: PropTypes.string,
                arrivalAddress: PropTypes.string,
                photoUrl: PropTypes.string,
            })
        ),
    }).isRequired,
};

export default PassengerOrderDetails;
