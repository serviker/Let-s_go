import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, usePage } from '@inertiajs/react';
import '../../../css/DriverOrderDetails.css';
import { Inertia } from '@inertiajs/inertia';
import { Modal, Button } from 'react-bootstrap';

const NoDriverMessagingModal = ({ show, onClose }) => {
    if (!show) return null;

    return (
        <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Полупрозрачный фон
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1050 // Поверх других элементов
        }}>
            <div className="modal-content" style={{
                width: '30%',
                border: '4px solid #eea236',
                borderRadius: '10px',
                backgroundColor: 'white',
                padding: '20px',
                position: 'relative'
            }}>
                <h2 style={{ textAlign: 'center', color: 'black' }}>
                    Чтобы связаться с водителем, забронируйте место в поездке.
                </h2>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <button onClick={onClose} className="btn btn-secondary">
                        Вернуться назад
                    </button>
                </div>
            </div>
        </div>
    );
};

const PassengerOrderDetails = ({ order, searchCriteria  }) => {
    const { auth } = usePage().props; // Доступ к информации о пользователе из страницы
    const [availableSeats, setAvailableSeats] = useState(order.availableSeats);
    const [isBooked, setIsBooked] = useState(order.isBooked); // Используем isBooked из order
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [fromCity, setFromCity] = useState( searchCriteria.departureCity || '');
    const [toCity, setToCity] = useState(searchCriteria.arrivalCity||'');
    const [data, setData] = useState(order);
    const [canSendMessage, setCanSendMessage] = useState(false); // Флаг для проверки отправки сообщений
    const [showErrorModal, setShowErrorModal] = useState(false); // Для отображения модального окна
    const [errorMessage, setErrorMessage] = useState(''); // Для хранения сообщения об ошибке
    const handleCloseModal = () => setShowErrorModal(false);

    if (!data) {
        return <div>Error: Order data is missing</div>;
    }

    // Находим текущего пользователя среди пассажиров
    const currentPassenger = data.passengers.find((passenger) => passenger.id === auth.user.id); // Переместили выше

    useEffect(() => {
        if (currentPassenger) {
            setFromCity(currentPassenger.departureCity);
            setToCity(currentPassenger.arrivalCity);
            setCanSendMessage(true); // Если пользователь является пассажиром, разрешаем отправку сообщений
        } else {
            setCanSendMessage(false); // Запрещаем отправку сообщений, если пользователь не пассажир
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
                departure_city: currentPassenger ? currentPassenger.departureCity : '', // Передаем город отправления
                arrival_city: currentPassenger ? currentPassenger.arrivalCity : '',     // Передаем город прибытия
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
        if (canSendMessage) {
            Inertia.visit(`/orders/${data.id}/messages/${data.driverId}`);
        } else {
            setShowErrorModal(true); // Показываем модальное окно при ошибке
        }
    };
    const filterCities = (cities) => {
        const fromIndex = cities.indexOf(fromCity);
        const toIndex = cities.indexOf(toCity);

        return cities.filter((city, index) => {
            return (
                index === fromIndex - 1 || // предыдущий город
                index === fromIndex || // город отправления
                index === toIndex || // город прибытия
                index === toIndex + 1 // следующий город
            );
        });
    };

    const filteredCities = filterCities(data.intermediate_addresses || []);

    return (
        <div className="order-details-container bg-white p-6 rounded-lg shadow-lg">
            <h1 className="order-date">{formattedTime} {formattedDate}</h1>

            <div className="departure-info">
                <div className="route-line">
                    <div className="circle"></div>
                </div>
                <div className={`departure-address ${fromCity === data.fromCity ? 'highlighted' : ''}`}>
                    {data.fromCity}, {data.departureAddress}
                </div>
            </div>

            {filteredCities.length > 0 && (
                <div className="intermediate-cities">
                    {filteredCities.map((city, index) => (
                        <div key={index}
                             className={`intermediate-city ${city === fromCity || city === toCity ? 'highlighted' : ''}`}>
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
                <div className={`arrival-address ${toCity === data.toCity ? 'highlighted' : ''}`}>
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
                                        {passenger.seats >= 2 && (  // Условное отображение
                                            <div style={{color: '#eea236', fontWeight: 'bold', marginLeft: '30px'}}>
                                                <span> - {passenger.seats} места </span>
                                            </div>
                                        )}
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
                        <p style={{
                            color: '#eea236',
                            fontWeight: 'bold',
                            display: 'flex',
                            justifyContent: 'center'
                        }}>Будьте первыми !!!</p>
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
            <NoDriverMessagingModal show={showErrorModal} onClose={handleCloseModal}/>
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
