import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from '@inertiajs/inertia-react';
import PassengerOrdersIndex from "@/Pages/Orders/PassengerOrdersIndex.jsx";
import Modal from "@/Components/Modal.jsx";
import { Inertia } from "@inertiajs/inertia";

export default function PassengerOrders({ orders }) {

    return (
        <div className="driver-orders-container" style={{ marginTop: '80px', width: '160%'}}>
            {orders.map(order => (
                <PassengerOrdersIndex key={order.id} order={order} />
            ))}

            {/*<div className="d-flex justify-content-end mt-4">*/}
            {/*    <Link href={route('dashboard')} className="btn btn-info">*/}
            {/*        Назад*/}
            {/*    </Link>*/}
            {/*</div>*/}
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
