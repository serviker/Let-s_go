import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, {useEffect, useState} from 'react';
import { Head } from '@inertiajs/react';
import Navbar from "@/Components/Navbar.jsx";
import PassengerOrders from "@/Pages/Orders/PassengerOrders.jsx";

export default function Dashboard({ auth }) {
    const [orders, setOrders] = useState(null);

    useEffect(() => {
        // Выполняем запрос на получение заказов при монтировании компонента
        fetch('/passenger/orders')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched orders:', data.orders);
                setOrders(data.orders);
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
                /*
                    // Если запрос не удался, устанавливаем статичные данные
                         const staticOrders = [
                                    { id: 1, fromCity: 'Казань', toCity: 'Нижний Новгород', price: '1000.00', driverName: 'Иван', dateTimeDeparture: '2024-09-01 08:00:00', driverPhotoUrl: 'http://localhost:8000/images/image21.png'},
                                    { id: 2, fromCity: 'Казань', toCity: 'Нижний Новгород', price: '800.00', driverName: 'Алексей', dateTimeDeparture: '2024-09-01 08:00:00', driverPhotoUrl: 'http://localhost:8000/images/image22.png'},
                                    { id: 3, fromCity: 'Казань', toCity: 'Нижний Новгород', price: '850.00', driverName: 'София', dateTimeDeparture: '2024-09-01 08:00:00', driverPhotoUrl: 'http://localhost:8000/images/image4.png'},
                                    { id: 4, fromCity: 'Казань', toCity: 'Нижний Новгород', price: '900.00', driverName: 'Анна', dateTimeDeparture: '2024-09-01 08:00:00', driverPhotoUrl: 'http://localhost:8000/images/image1.png'},
                                    { id: 5, fromCity: 'Казань', toCity: 'Нижний Новгород', price: '900.00', driverName: 'Жанна', dateTimeDeparture: '2024-09-01 08:00:00', driverPhotoUrl: 'http://localhost:8000/images/image11.png'},
                                    { id: 6, fromCity: 'Казань', toCity: 'Нижний Новгород', price: '900.00', driverName: 'Ольга', dateTimeDeparture: '2024-09-01 08:00:00', driverPhotoUrl: 'http://localhost:8000/images/image12.png'},
                                ];
                                setOrders(staticOrders);
                */
                            });
                  }, []);


    console.log('Orders in Dashboard (Проверка, что заказы приходят сюда):', orders); // Проверка, что заказы приходят сюда

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Home</h2>}>
            <Navbar setOrders={setOrders} />
            <PassengerOrders orders={orders || []} />
        </AuthenticatedLayout>
    );
}
