import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, usePage } from '@inertiajs/react';
import '../../../css/DriverOrderDetails.css';
import {Inertia} from "@inertiajs/inertia";

const CancelBookingModal = ({ show, onClose, onConfirm }) => {
    const [selectedReason, setSelectedReason] = useState(null); // Состояние для выбранной причины
    const [showErrorMessage, setShowErrorMessage] = useState(false); // Состояние для сообщения
    const cancellation_reason = [
        'Изменились личные обстоятельства ',
        'Необходимость ремонта автомобиля',
        'Плохие погодные условия',
        'Изменение времени или даты поездки',
        'Другие причины',
    ];

    const handleReasonChange = (event) => {
        setSelectedReason(event.target.value);
    };

    const handleConfirm = () => {
        if (!selectedReason) {
            setShowErrorMessage(true); // Показать сообщение об ошибке
            setTimeout(() => setShowErrorMessage(false), 1000); // Скрыть сообщение через 2 секунды
            return;
        }
        onConfirm(selectedReason); // Передаем выбранную причину в функцию onConfirm
       // console.log('CancelBookingModal - handleConfirm:', onConfirm(selectedReason));
    };

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
                <h3 style={{ textAlign: 'center', color: 'black' }}>
                    Вы уверены, что хотите отменить поездку?
                </h3>
                <p style={{ textAlign: 'center', color: 'black' }}>Пожалуйста, выберите причину отмены:</p>

                <div className="cancel-reasons" style={{ marginBottom: '20px' }}>
                    {cancellation_reason.map((reason, index) => (
                        <div key={index} style={{  display: 'flex', alignItems: 'center' }}>
                            <input
                                type="radio"
                                id={`reason-${index}`}
                                name="cancelReason"
                                value={reason}
                                onChange={handleReasonChange}
                                style={{ marginRight: '20px', marginBottom: '12px', background: '#eea236' }}
                            />
                            <label htmlFor={`reason-${index}`} style={{ color: 'gray' }}>
                                {reason}
                            </label>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <button onClick={handleConfirm} className="btn btn-danger">
                        Подтвердить
                    </button>
                    <button onClick={onClose} className="btn btn-secondary">
                        Отмена
                    </button>
                </div>

                {showErrorMessage  && (
                    <div style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: '#fff',
                        border: '2px solid #eea236',
                        borderRadius: '10px',
                        padding: '20px',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                        zIndex: 1000,
                        textAlign: 'center',
                    }}>
                        <h4 style={{margin: 0}}>Пожалуйста, выберите причину отмены!</h4>
                    </div>
                )}
            </div>
        </div>
    );
};

const DriverOrderDetails = React.memo(() => {

    const { order, isOrderCreated } = usePage().props;
    // Добавляем состояние для контроля перезагрузки
    const [hasReloaded, setHasReloaded] = useState(false);
    const [data, setData] = useState(order);
    const [availableSeats, setAvailableSeats] = useState(order.availableSeats);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    useEffect(() => {
        // Если поездка успешно создана и перезагрузка еще не выполнялась
        if (isOrderCreated && !hasReloaded) {
            window.location.reload();
            setHasReloaded(true); // Устанавливаем, что перезагрузка уже произошла
        }
    }, [isOrderCreated, hasReloaded]);

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
    const handleConfirmCancel = (cancellation_reason) => {
        Inertia.delete(route('order.cancelForDriver', { order: data.id, cancellation_reason  }), {
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


            <a href={route('profile.edit', {id: data.driverId})} className="driver-link">
                <div className="driver-info">
                    <img
                        src={data.driverPhotoUrl ? data.driverPhotoUrl : '/images/user_icon.svg'}
                        alt="Driver"
                        className="driver-photo"
                    />
                    <p className="driver-name">{data.driverName}</p>

                </div>
            </a>

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
                <button type="button" className="btn btn-secondary"
                        onClick={() => window.location.href = route('driver.orders')}>
                    К поездкам
                </button>
                <a href={route('dashboard')} className="home-link">
                    <button className="btn btn-info">На главную</button>
                </a>
            </div>
            <CancelBookingModal
                show={showCancelModal}
                onClose={handleCloseCancelModal}
                onConfirm={handleConfirmCancel}
            />
            {showErrorMessage && ( // Модальное окно для сообщения об ошибке
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: '#fff',
                    border: '2px solid red',
                    borderRadius: '10px',
                    padding: '20px',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                    zIndex: 1000,
                    textAlign: 'center',
                }}>
                    <h4 style={{margin: 0}}>Пожалуйста, выберите причину отмены!</h4>
                    <button onClick={handleCloseError}>Закрыть</button> {/* Кнопка для закрытия модального окна */}
                </div>
            )}
        </div>
    );
});
DriverOrderDetails.propTypes = {
    order: PropTypes.shape({
        departureAddress: PropTypes.string,
        arrivalAddress: PropTypes.string,
        fromCity: PropTypes.string,
        toCity: PropTypes.string,
        intermediate_addresses: PropTypes.arrayOf(PropTypes.string),
        price: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]).isRequired,
        passengers: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
                name: PropTypes.string.isRequired,
                departureCity: PropTypes.string.isRequired,
                arrivalCity: PropTypes.string.isRequired,
                seats: PropTypes.number,
                photoUrl: PropTypes.string,
            })
        ).isRequired,
        availableSeats: PropTypes.number.isRequired,
        dateTimeDeparture: PropTypes.string.isRequired,
        description: PropTypes.string,
        driverId: PropTypes.number.isRequired,
        driverName: PropTypes.string.isRequired,
        driverPhotoUrl: PropTypes.string,
        carName: PropTypes.string.isRequired,
        carColor: PropTypes.string.isRequired,
        carPhoto: PropTypes.string,
    }).isRequired,
    isOrderCreated: PropTypes.bool.isRequired,
};

/*DriverOrderDetails.propTypes = {
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
};*/
export default DriverOrderDetails;
