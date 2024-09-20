import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, usePage } from '@inertiajs/react';
import '../../../css/DriverOrderDetails.css';
//import '../../../css/PassengerOrderDetails.css';
import {Inertia} from "@inertiajs/inertia";
//import DriverOrderIndex from "@/Pages/Orders/DriverOrderIndex.jsx";

const CancelBookingModal = ({ show, onClose, onConfirm }) => {
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
                width: '25%',
                border: '4px solid #eea236',
                borderRadius: '10px',
                backgroundColor: 'white',
                padding: '20px',
                position: 'relative'
            }}>
                <h3 style={{ textAlign: 'center', color: 'black' }}>
                    Вы уверены, что хотите отменить бронирование?
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
                    <button onClick={onConfirm} className="btn btn-danger">
                        Подтвердить
                    </button>
                    <button onClick={onClose} className="btn btn-secondary">
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
};

const DriverOrderDetails = React.memo(() => {
    const { order, searchCriteria } = usePage().props;
    const [data, setData] = useState(order);
    const [availableSeats, setAvailableSeats] = useState(order.availableSeats);
    const [showCancelModal, setShowCancelModal] = useState(false);


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
    const openMessagingComponent = (passengerId) => {
        // логикА для перехода на компонент обмена сообщениями
        Inertia.visit(`/orders/${data.id}/messages/${passengerId}`);
    };
    const handleOpenCancelModal = () => setShowCancelModal(true);
    const handleCloseCancelModal = () => setShowCancelModal(false);
    const handleConfirmCancel = () => {
        Inertia.delete(route('order.cancelForDriver', { order: data.id }), {
            onSuccess: () => {
                handleCloseCancelModal();
            },
            onError: () => {
                // Обработка ошибки
            },
        });
    };

    return (
        <div className="order-container-details bg-white p-6 rounded-lg shadow-lg">
            <div className="order-header">
                <h1 className="order-date">{formattedTime} {formattedDate}</h1>
                <button className="btn btn-danger"
                        onClick={handleOpenCancelModal}>
                    Отменить поездку
                </button>
            </div>
            <div className="departure-info">
                <div className="route-line">
                    <div className="circle"></div>
                </div>
                <div className="departure-address">
                    {data.fromCity}, {data.departureAddress}
                </div>
                {/*<div className="departure-time">{formattedTime}</div>*/}
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
                    <div style={{marginTop: '-8px'}} className="circle"></div>
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
                <span className="available-seats-label">Свободные места:</span>
                <span className="available-seats-value">
                    {availableSeats > 0 ? availableSeats : 'Мест нет'}
                </span>
            </div>
            <div className="passenger-seats">
                <span className="passenger-seats-label">Пассажиры:</span>
                <div className="passenger-list">
                    {data.passengers.length > 0 ? (
                        data.passengers.map((passenger, index) => {
                            // console.log(passenger); // Выводим данные пассажира в консоль
                            return (
                                <div
                                    key={index}
                                    className="passenger"
                                    onClick={() => openMessagingComponent(passenger.id)}  // Убедитесь, что используется правильное поле для id
                                >
                                    <div style={{flex: 1}}>
                                        <span className="passenger-name">{passenger.name}</span>
                                        <div className="passenger-cities-container">
                                            <span className="passenger-departure">{passenger.departureCity}</span>
                                            <div className="arrow">→</div>
                                            <span className="passenger-arrival">{passenger.arrivalCity}</span>
                                            {passenger.seats >= 2 && (  // Условное отображение
                                                <div style={{color: '#eea236', fontWeight: 'bold', marginLeft: '30px'}}>
                                                    <span> - {passenger.seats} Места </span>
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
                            );
                        })
                    ) : (
                        <p style={{fontSize: '18px', color: '#eea236'}}>Пока никого нет</p>
                    )}
                </div>
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
            {/*<p className="available-seats-label">Ваше бронирование будет подтверждено только после одобрения*/}
            {/*    водителя</p>*/}
            <p className="available-seats-label">Максимум двое сзади</p>
            <div className="separator-thin"></div>

            <div className="button-container">
                <Link href={route('driver.orders')} className="home-link">
                    <button type="button" className="btn btn-secondary">К поездкам</button>
                </Link>
                <Link href={route('dashboard')} className="home-link">
                    <button className="btn btn-info">На главную</button>
                </Link>
            </div>
            <CancelBookingModal
                show={showCancelModal}
                onClose={handleCloseCancelModal}
                onConfirm={handleConfirmCancel}
            />
        </div>
    );
});

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
export default DriverOrderDetails;
