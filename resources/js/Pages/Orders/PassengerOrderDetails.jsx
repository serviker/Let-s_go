import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, usePage } from '@inertiajs/react';
import '../../../css/PassengerOrderDetails.css';
import { Inertia } from '@inertiajs/inertia';
import { Modal, Button } from 'react-bootstrap';

const CancelBookingModal = ({ show, onClose, onConfirm }) => {
    const [selectedReason, setSelectedReason] = useState(null); // Состояние для выбранной причины


    const cancellation_reason = [
        'Изменились планы',
        'Неудобное время встречи (сложности с логистикой)',
        'Изменились личные обстоятельства',
        'Изменилась дата и время выезда',
        'Неудобное время и место встречи (сложности с логистикой).',
    ];

    const handleReasonChange = (event) => {
        setSelectedReason(event.target.value);
    };

    const handleConfirm = () => {
        if (!selectedReason) {
            alert('Пожалуйста, выберите причину отмены');
            return;
        }
        onConfirm(selectedReason); // Передаем выбранную причину в функцию onConfirm
        console.log('CancelBookingModal - handleConfirm:', onConfirm(selectedReason));
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
                    Вы уверены, что хотите отменить бронирование?
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
            </div>
        </div>
    );
};
const BookingRequestModal = ({ show, onClose, onSubmit }) => {
    const [message, setMessage] = useState('');

    if (!show) return null;

    const handleSubmit = () => {
        onSubmit(message);
        setMessage(''); // Очищаем поле после отправки
    };

    return (
        <div className="modal-content" style={{ width: '30%', border: '4px solid #eea236', borderRadius: '10px', position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)' }}>
            <h2 style={{ textAlign: 'center', color: 'black' }}>Отправить запрос на бронирование</h2>
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                style={{ width: '90%', margin: '10px auto', display: 'block', padding: '20px', fontSize: '16px', fontWeight:'bold' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px' }}>
                <button onClick={onClose} className="btn btn-secondary">Закрыть</button>
                <button onClick={handleSubmit} className="btn btn-primary">Отправить запрос</button>
            </div>
        </div>
    );
};
const PassengerOrderDetails = ({ order, searchCriteria  }) => {
    const { auth } = usePage().props; // Доступ к информации о пользователе из страницы

    const [isBooked, setIsBooked] = useState(order.isBooked); // Используем isBooked из order
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [fromCity, setFromCity] = useState( searchCriteria.departureCity || '');
    const [toCity, setToCity] = useState(searchCriteria.arrivalCity ||'');
    const [availableSeats, setAvailableSeats] = useState(order.availableSeats);
    const [seats, setSeats] = useState(searchCriteria.seats || 1); // Определяем количество мест
    const [data, setData] = useState(order);
    const [canSendMessage, setCanSendMessage] = useState(false); // Флаг для проверки отправки сообщений
    const [showErrorModal, setShowErrorModal] = useState(false); // Для отображения модального окна
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showBookingRequestModal, setShowBookingRequestModal] = useState(false);
    const [requestSent, setRequestSent] = useState(order.passengerRequests.length > 0); // Установите в true, если есть запрос
    const handleCloseModal = () => setShowErrorModal(false);
    // Убедитесь, что вы получаете сообщение из страницы
    const { flash } = usePage().props;
    const message = usePage().props.flash.message;
    const [visible, setVisible] = useState(true);

// Удалите сообщение через 3 секунды
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setVisible(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);
    //console.log(flash);
    if (!data) {
        return <div>Error: Order data is missing</div>;
    }
   // console.log("Message from session:", message);


    // Проверка на наличие сообщения
   // console.log('seats:', seats);

    const handleOpenBookingRequestModal = () => {
        setShowBookingRequestModal(true);
    };
    const handleCloseBookingRequestModal = () => {
        setShowBookingRequestModal(false);
    };

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

 /*   const handleBooking = async () => {
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
    };*/

    const handleBooking = async () => {
        try {
            // Передаем данные о городах, даже если пользователь не пассажир
            const departureCity = currentPassenger ? currentPassenger.departureCity : fromCity;
            const arrivalCity = currentPassenger ? currentPassenger.arrivalCity : toCity;
           // const availableSeats = currentPassenger ? currentPassenger.availableSeats : seats;

            await Inertia.post(route('order.join', { order: order.id }), {
                departure_city: departureCity,
                arrival_city: arrivalCity,
              //  seats: availableSeats,
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


  /*  const handleBookingRequest = async (message) => {
        console.log('Отправляемое сообщение в запросе:', message); // Логируем сообщение перед отправкой
        try {
            // Передаем данные о городах, даже если пользователь не пассажир
            const departureCity = currentPassenger ? currentPassenger.departureCity : fromCity;
            const arrivalCity = currentPassenger ? currentPassenger.arrivalCity : toCity;
            // Возможно, нужно также передавать места
            const seats = currentPassenger ? currentPassenger.seats : 1;

            await Inertia.post(route('order.requestBooking', { orderId: order.id }), {
                departure_city: departureCity,
                arrival_city: arrivalCity,
                message, // Передаем сообщение
                seats, // Убедитесь, что передаете количество мест
            }, {
                onSuccess: () => {
                    alert('Запрос на бронирование отправлен водителю.');
                    setRequestSent(true); // Установите состояние запроса в true
                },
                onError: (errors) => {
                    alert('Ошибка: ' + errors.message);
                },
            });
        } catch (error) {
            console.error('Ошибка при отправке запроса на бронирование:', error);
        }
    };*/

    const handleBookingRequest = async (message) => {
        console.log('Отправляемое сообщение в запросе:', message); // Логируем сообщение перед отправкой

        // Получаем города отправления и прибытия
        const departureCity = currentPassenger ? currentPassenger.departureCity : fromCity;
        const arrivalCity = currentPassenger ? currentPassenger.arrivalCity : toCity;
        // Получаем количество мест из состояния
        const bookingSeats = seats; // Используем состояние seats

        // Логируем данные, которые будут отправлены
        const bookingData = {
            departure_city: departureCity,
            arrival_city: arrivalCity,
            message,
            seats: bookingSeats, // Добавляем количество мест
        };

        console.log('Данные для отправки:', bookingData); // Логируем данные перед отправкой
       // await new Promise(resolve => setTimeout(resolve, 15000));
        try {
            await Inertia.post(route('order.requestBooking', { orderId: order.id }), bookingData, {
                onSuccess: () => {
                    alert('Запрос на бронирование отправлен водителю.');
                    setRequestSent(true);
                },
                onError: (errors) => {
                    alert('Ошибка: ' + errors.message);
                },
            });
        } catch (error) {
            console.error('Ошибка при отправке запроса на бронирование:', error);
        }
    };



    const handleRequestSubmit = (message) => {
        console.log('Отправляемое сообщение:', message); // Проверяем, что сообщение не пустое
        handleBookingRequest(message); // Передаем сообщение в функцию
        closeModal(); // Закрываем модальное окно после отправки
    };

    const handleCancelRequest = async () => {
        try {
            await Inertia.post(route('order.cancelBookingRequest', { orderId: order.id })); // Предполагается, что у вас есть маршрут для отмены запроса
            setRequestSent(false); // Установите состояние обратно в false после отмены
        } catch (error) {
            console.error('Ошибка при отмене запроса:', error);
        }
    };

   // console.log("requestSent",requestSent); // Проверьте, какое значение выводится
   // console.log("order",order); // Проверьте, какое значение выводится
   // console.log("status_order",order.status_order_id); // Проверьте, какое значение выводится
   // console.log("isBooked",isBooked); // Должно быть false для отображения кнопок
    // Открыть модальное окно
    const handleCancelBooking = () => { setShowCancelModal(true); };
    const handleCloseCancelModal = () => setShowCancelModal(false);
    const confirmCancellation = (cancellation_reason) => {
        Inertia.delete(route('order.cancel', { order: data.id, cancellation_reason  }), {
            onSuccess: () => {
                handleCloseCancelModal();
                // alert('Бронирование успешно отменено.');
                // Действия после успешной отмены бронирования
            },
            onError: (errors) => {
                alert(errors.message || 'Ошибка при отмене бронирования.');
            }
        });
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
            {visible && message && (
                <div className="alert alert-success" role="alert">
                    {message}
                </div>
            )}
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
                    <div style={{marginTop: '-8px'}} className="circle"></div>
                </div>
                <div className={`arrival-address ${toCity === data.toCity ? 'highlighted' : ''}`}
                     style={{marginTop: '-8px'}}>
                    {data.toCity}, {data.arrivalAddress}
                </div>
            </div>
            <div className="separator"></div>

            <div className="price-container">
                <span className="price-label">Итого за 1 пассажира:</span>
                <span className="price-value">{data.price} ₽</span>
            </div>

            <div className="separator"></div>
            <a href={route('profile.showDriver', {user: data.driverId})} className="driver-link">
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
                <span className="available-seats-label">Свободных мест:</span>
                <span className="available-seats-value">
                    {availableSeats > 0 ? availableSeats : 'Свободных мест нет'}
                </span>
            </div>
            <div className="passenger-seats">
                <span className="passenger-seats-label">Пассажиры:</span>
                <div className="passenger-list">
                    {data.passengers.length > 0 ? (
                        data.passengers.map((passenger) => (
                            <Link
                                key={passenger.id}
                                href={route('profile.showPassenger', {user: passenger.id})}
                                className="passenger"
                            >
                                <div className="passenger_div">
                                    <span className="passenger-name">{passenger.name}</span>
                                    <div className="passenger-cities-container">
                                        <span className="passenger-departure">{passenger.departureCity}</span>
                                        <div className="arrow">→</div>
                                        <span className="passenger-arrival">{passenger.arrivalCity}</span>
                                        {passenger.seats >= 2 && (
                                            <div className="passenger_seats">
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
                            </Link>
                        ))
                    ) : (
                        <p className="p_seats">Будьте первыми !!!</p>
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
                <button className="btn btn-secondary" onClick={() => window.history.back()}>Назад</button>

                {/* Если место забронировано, показываем кнопку отмены
                {isBooked ? (
                    <>
                        <CancelBookingModal
                            show={showCancelModal}
                            onClose={() => setShowCancelModal(false)}
                            onConfirm={confirmCancellation}
                        />
                        <div>
                            <button onClick={handleCancelBooking} className="btn btn-danger">
                                Отменить бронирование
                            </button>
                        </div>
                    </>
                ) : (
                    // Если место не забронировано, показываем кнопку бронирования
                    <button
                        className="btn btn-info"
                        disabled={isButtonDisabled}
                        onClick={handleBooking}
                    >
                        Забронировать место
                    </button>
                )}*/}
                {isBooked ? (
                    <>
                        <CancelBookingModal
                            show={showCancelModal}
                            onClose={() => setShowCancelModal(false)}
                            onConfirm={confirmCancellation}
                        />
                        <div>
                            <button onClick={handleCancelBooking} className="btn btn-danger">
                                Отменить бронирование
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {Number(order.status_order_id) === 1 ? (
                            <button
                                className="btn btn-success"
                                disabled={isButtonDisabled}
                                onClick={handleBooking}
                            >
                                Забронировать мгновенно !
                            </button>
                        ) : Number(order.status_order_id) === 2 ? (
                            requestSent ? ( // Проверяем, отправлен ли запрос
                                <button
                                    className="btn btn-danger"
                                    onClick={handleCancelRequest}
                                >
                                    Отменить запрос
                                </button>
                            ) : (
                                /* <button
                                     className="btn btn-warning"
                                     onClick={handleBookingRequest}
                                 >
                                     Отправить запрос
                                 </button>*/
                                <button className="btn btn-info" onClick={handleOpenBookingRequestModal}>
                                    Перейти к бронированию
                                </button>
                            )
                        ) : order.status_order_id === null ? (
                            <div>Статус заказа еще не определен.</div> // Сообщение, если статус равен null
                        ) : null}
                    </>
                )}

            </div>
            <BookingRequestModal show={showBookingRequestModal} onClose={handleCloseBookingRequestModal} onSubmit={handleRequestSubmit}/>
            {/*<NoDriverMessagingModal show={showErrorModal} onClose={handleCloseModal}/>*/}
        </div>
    );
};

PassengerOrderDetails.propTypes = {
    order: PropTypes.shape({
        fromCity: PropTypes.string.isRequired,
        toCity: PropTypes.string.isRequired,
        intermediate_addresses: PropTypes.arrayOf(PropTypes.string), // Убедись, что это массив строк
        price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        dateTimeDeparture: PropTypes.string.isRequired, // Если это поле всегда нужно
        driverName: PropTypes.string.isRequired, // Если всегда есть имя водителя
        driverPhotoUrl: PropTypes.string, // Может быть необязательным
        driverId: PropTypes.number.isRequired,
        description: PropTypes.string,
        availableSeats: PropTypes.number.isRequired,
        status_order_id: PropTypes.number.isRequired, // Статус заказа
        seats: PropTypes.number,
        passengers: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
                name: PropTypes.string.isRequired,
                departureCity: PropTypes.string, // Если это может быть необязательным
                arrivalCity: PropTypes.string,
                departureAddress: PropTypes.string,
                arrivalAddress: PropTypes.string,
                photoUrl: PropTypes.string,
            })
        ),
    }).isRequired,
};


export default PassengerOrderDetails;
