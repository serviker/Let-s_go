import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, {useEffect, useState} from 'react';
import { Head } from '@inertiajs/react';
import Navbar from "@/Components/Navbar.jsx";
import PassengerOrders from "@/Pages/Orders/PassengerOrders.jsx";
import { BrowserRouter as Router } from 'react-router-dom';
import {Inertia} from "@inertiajs/inertia";

export default function Dashboard({ auth, orders, searchCriteria }) {
   /* const [searchCriteria, setSearchCriteria] = useState({
        fromCity: '',
        toCity: '',
        date: '',
        passengerCount: 1,
    });*/
    const [ordersState, setOrders] = useState(orders || []); // Заказы из контроллера
    const [fromCity, setFromCity] = useState(searchCriteria.departureCity || '');
    const [toCity, setToCity] = useState(searchCriteria.arrivalCity || '');
    const [date, setDate] = useState(searchCriteria.date || '');
    const [passengerCount, setPassengerCount] = useState(searchCriteria.seats || 1);


    // Если критерии поиска изменились, обновляем состояние заказов
    useEffect(() => {
        if (orders && orders.length > 0) {
            setOrders(orders);
        }
    }, [orders]);

    useEffect(() => {
        setFromCity(searchCriteria.departureCity || '');
        setToCity(searchCriteria.arrivalCity || '');
        setDate(searchCriteria.date || '');
        setPassengerCount(searchCriteria.seats || 1);
    }, [searchCriteria]);

    // Логика для выполнения нового поиска по критериям
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
                    fromCity={fromCity} // Передаем значение
                    setFromCity={setFromCity} // Функция для изменения значения
                    toCity={toCity} // Передаем значение
                    setToCity={setToCity} // Функция для изменения значения
                    date={date} // Если нужно, можно также передать date
                    setDate={setDate} // Если нужно, можно также передать функцию для изменения date
                    passengerCount={passengerCount} // Если нужно, можно также передать
                    setPassengerCount={setPassengerCount} // Если нужно, можно также передать
                    onSearch={handleSearch}
                />
                <PassengerOrders orders={ordersState} />
            </AuthenticatedLayout>
        </Router>
    );
}

