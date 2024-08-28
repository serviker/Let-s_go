import React from 'react';
import {Link, usePage} from '@inertiajs/react';
import DriverOrders from './DriverOrders';

export default function DriverOrdersPage() {
    const { orders } = usePage().props;

    return (
        <div className="container">
            <DriverOrders orders={orders}/>
        </div>
    );
}
