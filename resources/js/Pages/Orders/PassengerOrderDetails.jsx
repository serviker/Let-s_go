import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, usePage } from '@inertiajs/react';
import '../../../css/DriverOrderDetails.css';
import {Inertia} from "@inertiajs/inertia";

const PassengerOrderDetails = ({ order }) => {
    const { auth } = usePage().props; // Доступ к информации о пользователе из страницы
    const [availableSeats, setAvailableSeats] = useState(order.availableSeats);
    const [isBooked, setIsBooked] = useState(order.isBooked); // Используем isBooked из order
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [data, setData] = useState(order);
    // console.log("Order data:", data);

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
    //console.log('Order ID:', order.id);

    useEffect(() => {
        // Установите начальное состояние кнопки и текста
        if (availableSeats <= 0 || isBooked) {
            setIsButtonDisabled(true);
        }
    }, [availableSeats, isBooked]);
    const handleBooking = async () => {
        try {
            await Inertia.post(route('order.join', { order: order.id }), {}, {
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

    // Найдем пассажира, чтобы показать его города отправления и прибытия
    const currentPassenger = data.passengers.find((passenger) => passenger.id === auth.user.id);

    return (
        <div className="order-details-container bg-white p-6 rounded-lg shadow-lg">
            <h1 className="order-date">{formattedDate}</h1>

            {/* Показываем только города отправления и прибытия пассажира */}
            {currentPassenger && (
                <>
                    <div className="departure-info">
                        <div className="route-line">
                            <div className="circle"></div>
                        </div>
                        <div className="departure-address">
                            {currentPassenger.departureCity}, {currentPassenger.departureAddress}
                        </div>
                        <div className="departure-time">{formattedTime}</div>
                    </div>

                    <div className="arrival-info">
                        <div className="route-line">
                            <div className="circle"></div>
                        </div>
                        <div className="arrival-address">
                            {currentPassenger.arrivalCity}, {currentPassenger.arrivalAddress}
                        </div>
                    </div>
                </>
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
            <Link href={route('profile.show', { user: data.driverId })} className="driver-link">
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
            <div className="available-seats">
                <span className="available-seats-label">Пассажиры:</span>
                <div className="passenger-list">
                    {data.passengers.length > 0 ? (
                        data.passengers.map((passenger, index) => (
                            <div key={index} className="passenger">
                                <span className="passenger-name" style={{ marginRight: '30px', fontSize: '18px'}}>{passenger.name}</span>
                                <img
                                    src={passenger.photoUrl ? passenger.photoUrl : '/images/user_icon.svg'}
                                    alt={passenger.name}
                                    className="passenger-photo"
                                />
                            </div>
                        ))
                    ) : (
                        <p>Нет пассажиров</p>
                    )}
                </div>
            </div>


            <div className="separator-thin"></div>

            <div className="communication">
                <span className="communication-label">Связатся с </span>
                <span className="communication-value">{data.driverName}</span>
            </div>

            <div className="separator-thin"></div>

            <div className="car-info">
                <div>
                    <p className="car-name">{order.carName}</p><p></p>
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
                {/*<Link href={route('dashboard')} className="home-link">*/}
                {/*    <button type="button" className="btn btn-secondary">Назад</button>*/}
                {/*</Link>*/}
                <button className="btn btn-secondary" onClick={() => window.history.back()}>Назад</button>
                {/*<button className="btn btn-info" onClick={handleBooking} disabled={isButtonDisabled}>Забронировать</button>*/}
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
}

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
