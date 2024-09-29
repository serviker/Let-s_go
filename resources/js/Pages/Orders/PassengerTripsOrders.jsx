import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from '@inertiajs/inertia-react';
import PassengerOrdersIndex from "@/Pages/Orders/PassengerOrdersIndex.jsx";
import Modal from "@/Components/Modal.jsx";
import { Inertia } from "@inertiajs/inertia";
import {usePage} from "@inertiajs/react";
//import '../../../css/PassengerOrdersIndex.css';
import '../../../css/PassengerTripsOrders.css';
import {Button} from "@headlessui/react";  // Импорт стилей

export default function PassengerTripsOrders() {
    const { orders, flash, passengerOrders } = usePage().props;

    // Отображаем все данные props для проверки
    // console.log('Props from usePage:', usePage().props);
    // console.log('Orders:', orders); // Добавлено для отладки

    useEffect(() => {
        //  console.log('Passenger orders:', passengerOrders);
    }, [passengerOrders]);

    // Проверка на заказы
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        if (!orders || orders.length === 0) {
            setShowModal(true);
        }
    }, [orders]);

    // Функция для закрытия модального окна
    const closeModal = () => {
        Inertia.visit(route('dashboard')); // Переход на главную страницу
        setShowModal(false);

    };

    if (!orders) {
        return <div>Загрузка...</div>;
    }

    // Если нет заказов, показываем модальное окно
    if (showModal) {
        return (
            <Modal show={showModal} onClose={closeModal}>
                <div className="modal-content" style={{ width: '23%', border: '4px solid #eea236', borderRadius: '10px',
                    position: 'fixed', top: '20%',   // Смещение на 30% сверху
                    left: '50%',    // Горизонтальное центрирование
                    transform: 'translateX(-50%)'   // Центрирование элемента по горизонтали
                }}>
                    <h2  style={{ textAlign: 'center'}} className="modal-body">
                        У вас нет забронированых поездок.
                    </h2>
                    <div style={{display: 'flex', justifyContent: 'center', margin: '10px 10px -10px 10px'}}>
                        <button onClick={closeModal} className="btn btn-secondary">Вернуться назад</button>
                    </div>
                </div>
            </Modal>
        );
    }


    // Сортировка заказов по времени отправления
    const sortedOrders = orders.sort((a, b) => {
        return new Date(a.dateTimeDeparture) - new Date(b.dateTimeDeparture);
    });

    return (
        <div className="driver-orders-container" style={{display: 'flex', alignContent: 'center'}}>
            {/*<div className="driver-orders-container">*/}
            <div className="header">
                <Button onClick={() => window.history.back()} className="btn btn-link text-decoration-none">
                    &larr;
                </Button>
                <h2>Мои поездки пассажиром</h2>
            </div>
            {flash && flash.message && (
                <div className="alert alert-success">
                    {flash.message}
                </div>
            )}
            {sortedOrders.map(order => (
                <PassengerOrdersIndex key={order.id} order={order} />
            ))}

            {/* Кнопка "На главную"
            <div className="d-flex justify-content-end mt-4">
                <Link href={route('dashboard')} className="btn btn-info">
                    На главную
                </Link>
            </div>*/}

        </div>

    );
}

PassengerTripsOrders.propTypes = {
    orders: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        fromCity: PropTypes.string.isRequired,
        toCity: PropTypes.string.isRequired,
        price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        driverName: PropTypes.string,
        carName: PropTypes.string,
        dateTimeDeparture: PropTypes.string.isRequired,
        driverPhotoUrl: PropTypes.string,
    })).isRequired,
};
