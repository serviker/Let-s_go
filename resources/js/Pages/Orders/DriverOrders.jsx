import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from '@inertiajs/inertia-react';
import DriverOrderIndex from "@/Pages/Orders/DriverOrderIndex.jsx";
import Modal from "@/Components/Modal.jsx";
import {Inertia} from "@inertiajs/inertia";
import {usePage} from "@inertiajs/react";
import {Button} from "@headlessui/react";
import '../../../css/DriverOrders.css';
import Navbar from "@/Components/Navbar.jsx";

export default function DriverOrders({ orders }) {
    const [showModal, setShowModal] = useState(!Array.isArray(orders) || orders.length === 0);
    const { props } = usePage();
    // Функция для закрытия модального окна
    const closeModal = () => {
        Inertia.visit(route('dashboard')); // Переход на главную страницу
        setShowModal(false);

    };

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
                        У вас нет опубликованых <br/> или завершенных поездок.
                    </h2>
                    <div style={{display: 'flex', justifyContent: 'space-between', margin: '10px 10px -10px 10px'}}>
                        <button onClick={closeModal} className="btn btn-secondary">Вернуться назад</button>
                        <Link href={route('order.create')} className="btn btn-primary">Опубликовать поездку</Link>
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

        <div className="driver-orders-container">

            <div className="header">
                <a href={route('dashboard')} className="btn btn-link text-decoration-none">
                    &larr;
                </a>
                <h2>Мои поездки водителем</h2>
            </div>
            {props.flash && props.flash.message && (
                <div className="alert alert-success">
                    {props.flash.message}
                </div>
            )}
            {sortedOrders.map(order => (
                <DriverOrderIndex key={order.id} order={order} className="order-item"/>
            ))}
        </div>
    );
}

DriverOrders.propTypes = {
    orders: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        fromCity: PropTypes.string,
        toCity: PropTypes.string,
        price: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]).isRequired,
        driverName: PropTypes.string,
        carName: PropTypes.string,
        dateTimeDeparture: PropTypes.string,
        driverPhotoUrl: PropTypes.string,
    })).isRequired,
};
