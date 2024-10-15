import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from '@inertiajs/inertia-react';
import PassengerOrdersIndex from "@/Pages/Orders/PassengerOrdersIndex.jsx";
import Modal from "@/Components/Modal.jsx";
import { Inertia } from "@inertiajs/inertia";
import {usePage} from "@inertiajs/react";

export default function PassengerOrders() {
    const { orders } = usePage().props;

    // Сортировка заказов по времени отправления
    const sortedOrders = orders.sort((a, b) => {
        return new Date(a.dateTimeDeparture) - new Date(b.dateTimeDeparture);
    });

    return (
        <div className="driver-orders-container" style={{ marginTop: '80px', width: '160%' }}>
            {sortedOrders.map(order => (
                <PassengerOrdersIndex key={order.id} order={order} />
            ))}
        </div>
    );
}

PassengerOrders.propTypes = {
    orders: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        fromCity: PropTypes.string.isRequired,
        toCity: PropTypes.string.isRequired,
        price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        driverName: PropTypes.string,
        carName: PropTypes.string,
        dateTimeDeparture: PropTypes.string.isRequired,
        driverPhotoUrl: PropTypes.string,
        status_order_id: PropTypes.number.isRequired, // Добавляем это поле в проверку
    })).isRequired,
};
