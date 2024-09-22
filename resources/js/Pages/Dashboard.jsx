import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, {useEffect, useState} from 'react';
import { Head } from '@inertiajs/react';
import Navbar from "@/Components/Navbar.jsx";
import PassengerOrders from "@/Pages/Orders/PassengerOrders.jsx";
import { BrowserRouter as Router } from 'react-router-dom';
import {Inertia} from "@inertiajs/inertia";

export default function Dashboard({ auth, orders, searchCriteria }) {
    const [ordersState, setOrders] = useState(orders || searchCriteria || []);
    const [fromCity, setFromCity] = useState(searchCriteria.departureCity || '');
    const [toCity, setToCity] = useState(searchCriteria.arrivalCity || '');
    const [date, setDate] = useState(searchCriteria.date || '');
    const [passengerCount, setPassengerCount] = useState(searchCriteria.seats || 1);

   // console.log('Orders in Dashboard (Проверка, что заказы приходят сюда):', orders); // Проверка, что заказы приходят сюда

    const handleSearch = (fromCity, toCity, date, passengerCount) => {
        const url = route('dashboard', {
            departureCity: fromCity,
            arrivalCity: toCity,
            date: date,
            seats: passengerCount,
        });
        Inertia.visit(url);
    };


    return (
        <Router>
            <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Home</h2>}>
                <Navbar
                    orders={ordersState}
                    setOrders={setOrders}
                    onSearch={(fromCity, toCity, date, passengerCount) => {
                        // Передаем параметры поиска обратно
                        handleSearch(fromCity, toCity, date, passengerCount);
                    }}
                />
                <PassengerOrders orders={ordersState} />
            </AuthenticatedLayout>
        </Router>
    );
}

