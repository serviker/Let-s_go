import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, {useEffect, useState} from 'react';
import { Head } from '@inertiajs/react';
import Navbar from "@/Components/Navbar.jsx";
import PassengerOrders from "@/Pages/Orders/PassengerOrders.jsx";

export default function Dashboard({ auth }) {
        const [orders, setOrders] = useState([]); // Изначально данные отсутствуют

   // console.log('Orders in Dashboard (Проверка, что заказы приходят сюда):', orders); // Проверка, что заказы приходят сюда

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Home</h2>}>
            <Navbar setOrders={setOrders} />
            <PassengerOrders orders={orders || []} />
        </AuthenticatedLayout>
    );
}
