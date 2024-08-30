import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from '@inertiajs/inertia-react';
import PassengerOrdersIndex from "@/Pages/Orders/PassengerOrdersIndex.jsx";
import Modal from "@/Components/Modal.jsx";
import { Inertia } from "@inertiajs/inertia";

export default function PassengerOrders({ orders }) {
    // Определяем состояние для модального окна, если нет заказов
    const [showModal, setShowModal] = useState(!Array.isArray(orders) || orders.length === 0);

    // Функция для закрытия модального окна
    const closeModal = () => {
        Inertia.visit(route('home')); // Переход на главную страницу
        setShowModal(false);
    };

    // Если нет заказов, показываем модальное окно
    if (showModal) {
        return (
            <Modal show={showModal} onClose={closeModal}>
                <div className="modal-content" style={{ width: '25%', border: '4px solid #eea236', borderRadius: '10px',
                    position: 'fixed', top: '30%',   // Смещение на 30% сверху
                    left: '50%',    // Горизонтальное центрирование
                    transform: 'translateX(-50%)'   // Центрирование элемента по горизонтали
                }}>
                    <h2  style={{ textAlign: 'center'}} className="modal-body">
                        Нет поездок, соответствующих вашему запросу.
                    </h2>
                    <div style={{display: 'flex', justifyContent: 'space-between', margin: '10px 10px 0 10px'}}>
                        <button onClick={closeModal} className="btn btn-secondary">Вернуться назад</button>
                        {/*<Link href={route('search')} className="btn btn-primary">Найти другие поездки</Link>*/}
                    </div>
                </div>
            </Modal>
        );
    }

    return (
        <div className="passenger-orders-container">
            {orders.map(order => (
                <PassengerOrdersIndex key={order.id} order={order} />
            ))}

            {/* Кнопка "На главную" */}
            <div className="d-flex justify-content-end mt-4">
                <Link href={route('home')} className="btn btn-info">
                    На главную
                </Link>
            </div>
        </div>
    );
}

PassengerOrders.propTypes = {
    orders: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        fromCity: PropTypes.string.isRequired,
        toCity: PropTypes.string.isRequired,
        price: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]).isRequired,
        driverName: PropTypes.string,
        carName: PropTypes.string,
        dateTimeDeparture: PropTypes.string.isRequired,
        driverPhotoUrl: PropTypes.string,
    })).isRequired,
};
