// resources/js/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import Autosuggest from 'react-autosuggest';
import { Link, usePage } from '@inertiajs/react';
import Modal from "@/Components/Modal.jsx";
import {Inertia} from "@inertiajs/inertia"; // Use Inertia's usePage for accessing the Laravel Breeze user data

const cities = [
    { name: 'Москва' },
    { name: 'Санкт-Петербург' },
    { name: 'Новосибирск' },
    { name: 'Екатеринбург' },
    { name: 'Нижний Новгород' },
    { name: 'Казань' },
    { name: 'Челябинск' },
    { name: 'Омск' },
    { name: 'Самара' },
    { name: 'Ростов-на-Дону' },
    { name: 'Воронеж' },
    { name: 'Ярославль' },
    { name: 'Тула' },
    { name: 'Липецк' },
    { name: 'Рязань' },
    { name: 'Курск' },
    { name: 'Иваново' },
    { name: 'Тверь' },
    { name: 'Белгород' },
    { name: 'Брянск' },
    { name: 'Владимир' },
    { name: 'Тамбов' },
    { name: 'Смоленск' },
    { name: 'Калуга' },
    { name: 'Кострома' },
    { name: 'Саратов' },
    { name: 'Пенза' },
    { name: 'Астрахань' },
    { name: 'Севастополь' },
    { name: 'Симферополь' },
    { name: 'Ялта' },
    { name: 'Евпатория' },
    { name: 'Феодосия' },
    { name: 'Керчь' },
    { name: 'Алушта' },
    { name: 'Бахчисарай' },
    { name: 'Судак' },
    { name: 'Алупка' },
    { name: 'Джанкой' },
    { name: 'Армянск' },
    { name: 'Старый Крым' },
    // Добавленные районные и небольшие города
    { "name": "Зеленоград, Моск. обл." },
    { "name": "Электросталь, Моск. обл." },
    { "name": "Коломна, Моск. обл." },
    { "name": "Серпухов, Моск. обл." },
    { "name": "Одинцово, Моск. обл." },
    { "name": "Жуковский, Моск. обл." },
    { "name": "Клин, Моск. обл." },
    { "name": "Пушкино, Моск. обл." },
    { "name": "Щелково, Моск. обл." },
    { "name": "Ногинск, Моск. обл." },
    { "name": "Мытищи, Моск. обл." },
    { "name": "Королев, Моск. обл." },
    { "name": "Химки, Моск. обл." },
    { "name": "Балашиха, Моск. обл." },
    { "name": "Подольск, Моск. обл." },
    { "name": "Долгопрудный, Моск. обл." },
    { "name": "Люберцы, Моск. обл." },
    { "name": "Видное, Моск. обл." },
    { "name": "Воскресенск, Моск. обл." },
    { "name": "Домодедово, Моск. обл." },
    { "name": "Железногорск, Моск. обл." },
    { "name": "Солнечногорск, Моск. обл." },
    { "name": "Старый Оскол, Белг. обл." },
    { "name": "Губкин, Белг. обл." },
    { "name": "Шебекино, Белг. обл." },
    { "name": "Старый Крым, Крым" },
    { "name": "Черноголовка, Моск. обл." },
    { "name": "Сергиев Посад, Моск. обл." },
    { "name": "Орехово-Зуево, Моск. обл." },
    { "name": "Фрязино, Моск. обл." },
    { "name": "Раменское, Моск. обл." },
    { "name": "Реутов, Моск. обл." },
    { "name": "Электрогорск, Моск. обл." },
    { "name": "Талдом, Моск. обл." },
    { "name": "Кашира, Моск. обл." },
    { "name": "Лобня, Моск. обл." },
    { "name": "Ликино-Дулево, Моск. обл." },
    { "name": "Красногорск, Моск. обл." },
    { "name": "Котельники, Моск. обл." },
    { "name": "Можайск, Моск. обл." },
    { "name": "Волоколамск, Моск. обл." },
    { "name": "Рошаль, Моск. обл." },
    { "name": "Луховицы, Моск. обл." },
    { "name": "Краснознаменск, Моск. обл." },
    { "name": "Наро-Фоминск, Моск. обл." },
    { "name": "Таруса, Моск. обл." },
    { "name": "Кондрово, Калуж. обл." },
    { "name": "Малоярославец, Калуж.обл." },
    { "name": "Балабаново, Калуж. обл." },
    { "name": "Обнинск, Калуж. обл." },
    { "name": "Троицк, Моск. обл." },
    { "name": "Калуга, Калуж. обл." },
    { "name": "Козельск, Калуж. обл." },
    { "name": "Киров, Калуж. обл." },
    { "name": "Людиново, Калужс. обл." },
    { "name": "Спас-Деменск, Калуж. обл." },
    { "name": "Сухиничи, Калуж. обл." },
    { "name": "Жиздра, Калуж. обл." },
    { "name": "Курчатов, Калуж. обл." },
    { "name": "Льгов, Калуж. обл." },
    { "name": "Рыльск, Калуж. обл." },
    { "name": "Суджа, Калуж. обл." },
    { "name": "Дмитров, Моск. обл." },
    { "name": "Истра, Моск. обл." },
    { "name": "Старая Русса, Твер. обл." },
    { "name": "Нелидово, Твер. обл." },
    { "name": "Белый, Твер.обл." },
    { "name": "Бежецк, Твер. обл." },
    { "name": "Ржев, Твер. обл." },
    { "name": "Торжок, Твер. обл." },
    { "name": "Кимры, Твер. обл." },
    { "name": "Кашин, Твер. обл." },
    { "name": "Осташков, Твер. обл." },
    { "name": "Вышний Волочек, Твер. обл." },
    { "name": "Западная Двина, Твер. обл." },
    { "name": "Красный Холм, Твер. обл." },
    { "name": "Бологое, Твер. обл." },
    { "name": "Удомля, Твер. обл." },
    { "name": "Андреаполь, Твер. обл." },
    { "name": "Зубцов, Твер. обл." },
    { "name": "Калязин, Твер. обл." },
    { "name": "Кувшиново, Твер. обл." },
    { "name": "Оленино, Твер. обл." },
    { "name": "Пено, Твер. обл." },
    { "name": "Сандово, Твер. обл." },
    { "name": "Селижарово, Твер. обл." },
    { "name": "Сонково, Твер. обл." },
    { "name": "Спирово, Твер.я обл." },
    { "name": "Старица, Твер. обл." },
    { "name": "Фирово, Твер. обл." },
    { "name": "Юрьевец, Твер.я обл." },
    { "name": "Александров, Вл. обл." },
    { "name": "Вязники, Вл. обл." },
    { "name": "Гороховец, Вл. обл." },
    { "name": "Гусь-Хрустальный, Вл. обл." },
    { "name": "Камешково, Вл. обл." },
    { "name": "Карабаново, Вл. обл." },
    { "name": "Киржач, Вл. обл." },
    { "name": "Ковров, Вл. обл." },
    { "name": "Кольчугино, Вл. обл." },
    { "name": "Меленки, Вл. обл." },
    { "name": "Муром, Вл. обл." },
    { "name": "Петушки, Вл. обл." },
    { "name": "Покров, Вл. обл." },
    { "name": "Радужный, Вл. обл." },
    { "name": "Собинка, Вл. обл." },
    { "name": "Судогда, Вл. обл." },
    { "name": "Суздаль, Вл. обл." },
    { "name": "Юрьев-Польский, Вл. обл." },
    { "name": "Борисоглебск, Ворон. обл." },
    { "name": "Бутурлиновка, Ворон. обл." },
    { "name": "Бобров, Ворон. обл." },
    { "name": "Верхний Мамон, Ворон. обл." },
    { "name": "Воробьевка, Ворон. обл." },
    { "name": "Воронеж, Ворон. обл." },
    { "name": "Грибановка, Ворон. обл." },
    { "name": "Калач, Ворон. обл." },
    { "name": "Каменка, Ворон. обл." },
    { "name": "Лиски, Ворон. обл." },
    { "name": "Новая Усмань, Ворон. обл." },
    { "name": "Нововоронеж, Ворон. обл." },
    { "name": "Новохоперск, Ворон. обл." },
    { "name": "Ольховатка, Ворон. обл." },
    { "name": "Острогожск, Ворон. обл." },
    { "name": "Павловск, Ворон. обл." },
    { "name": "Панино, Ворон. обл." },
    { "name": "Петропавловка, Ворон. обл." },
    { "name": "Поворино, Ворон. обл." },
    { "name": "Рамонь, Ворон. обл." },
    { "name": "Репьевка, Ворон. обл." },
    { "name": "Россошь, Ворон. обл." },
    { "name": "Семилуки, Ворон. обл." },
    { "name": "Таловая, Ворон. обл." },
    { "name": "Терновка, Ворон. обл." },
    { "name": "Хохол, Ворон. обл." },
    { "name": "Эртиль, Ворон. обл." },
    { "name": "Алексин, Тул. обл." },
    { "name": "Белев, Тул. обл." },
    { "name": "Богородицк, Тул. обл." },
    { "name": "Болохово, Тул. обл." },
    { "name": "Венев, Тул. обл." },
    { "name": "Донской, Тул. обл." },
    { "name": "Ефремов, Тул. обл." },
    { "name": "Кимовск, Тул. обл." },
    { "name": "Киреевск, Тул. обл." },
    { "name": "Липки, Тул. обл." },
    { "name": "Новомосковск, Тул. обл." },
    { "name": "Плавск, Тул. обл." },
    { "name": "Советск, Тул. обл." },
    { "name": "Суворов, Тул. обл." },
    { "name": "Тула, Тул. обл." },
    { "name": "Узловая, Тул. обл." },
    { "name": "Щекино, Тул. обл." },
    { "name": "Ясногорск, Тул. обл." },
];
const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0 ? [] : cities.filter(city =>
        city.name.toLowerCase().slice(0, inputLength) === inputValue
    );
};

const getSuggestionValue = (suggestion) => suggestion.name;

const renderSuggestion = (suggestion) => (
    <div>{suggestion.name}</div>
);

const getPassengerLabel = (count) => {
    if (count === 1) return 'пассажир';
    if (count >= 2 && count <= 4) return 'пассажира';
    return 'пассажиров';
};

const NoCarModal = ({ show, onClose, onAddCar }) => {
    if (!show) return null;

    return (
        <div className="modal-content" style={{
            width: '30%', border: '4px solid #eea236', borderRadius: '10px',
            position: 'fixed', top: '11%',   // Смещение на 30% сверху
            left: '50%',    // Горизонтальное центрирование
            transform: 'translateX(-50%)'   // Центрирование элемента по горизонтали
        }}>
            <h3 style={{textAlign: 'center', color: 'black'}}>У вас нет авто</h3>
            <p style={{textAlign: 'center', margin: '0', fontSize: '18px', color: 'black'}}>Пожалуйста, добавьте автомобиль, чтобы
                опубликовать поездку.</p>
            <div style={{display: 'flex', justifyContent: 'space-between', margin: '0px 10px -10px 10px'}}>
                <button className="btn btn-secondary" onClick={onClose}>Вернуться назад</button>
                <button className="btn btn-success" onClick={onAddCar}>Добавить авто</button>
            </div>
        </div>

    )
        ;
};

const NoOrdersModal = ({show, onClose}) => {
    if (!show) return null;

    return (
        <div className="modal-content" style={{
            width: '30%', border: '4px solid #eea236', borderRadius: '10px',
            position: 'fixed', top: '11%',   // Смещение на 30% сверху
            left: '50%',    // Горизонтальное центрирование
            transform: 'translateX(-50%)'   // Центрирование элемента по горизонтали
        }}>
            <h3 style={{textAlign: 'center', color: 'black'}} className="modal-body">
                Нет поездок, соответствующих вашему запросу.
            </h3>
            <div style={{display: 'flex', justifyContent: 'center', margin: '0px 10px -10px 10px'}}>
                <button onClick={onClose} className="btn btn-secondary">Вернуться назад</button>
            </div>
        </div>
    );
};

const  NoCompletedOrdersModal = ({show, onClose}) => {
    if (!show) return null;

    return (
        <div className="modal-content" style={{
            width: '30%', border: '4px solid #eea236', borderRadius: '10px',
            position: 'fixed', top: '11%',   // Смещение на 30% сверху
            left: '50%',    // Горизонтальное центрирование
            transform: 'translateX(-50%)'   // Центрирование элемента по горизонтали
        }}>
            <h2 style={{textAlign: 'center', color: 'black'}} className="modal-body">
                У вас нет завершенных поездок.
            </h2>
            <div style={{display: 'flex', justifyContent: 'space-between', margin: '10px 10px 0 10px'}}>
                <button onClick={onClose} className="btn btn-secondary">Вернуться назад</button>
                <Link href={route('order.create')} className="btn btn-primary">Опубликовать поездку</Link>
            </div>
        </div>
    );
}
const userHasBookedTrips = async (userId) => {
    const response = await fetch(`/api/user/${userId}/booked-trips`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
    });

    const data = await response.json();
    return data.hasBookedTrips; // Флаг, возвращаемый сервером
};

const Navbar = ({setOrders, orders}) => {
    // console.log('Navbar: setOrders:', setOrders); // Добавьте это для проверки
    const {auth} = usePage().props;
    const user = auth.user || {};

    const [cars, setCars] = useState([]);
    const [date, setDate] = useState('');
    const [fromCity, setFromCity] = useState('');
    //  const [orders, setOrders] = useState([]);
    const [toCity, setToCity] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [passengerCount, setPassengerCount] = useState(1);
    const [showNoCarModal, setShowNoCarModal] = useState(false);
    const [showNoOrdersModal, setShowNoOrdersModal] = useState(false);
    const [showNoCompletedOrdersModal, setShowNoCompletedOrdersModal] = useState(!Array.isArray(orders) || orders.length === 0);
    const dropdownRef = useRef(null);
    const passengerDropdownRef = useRef(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [passengerDropdownOpen, setPassengerDropdownOpen] = useState(false);
    const inputRef = useRef(null);


    useEffect(() => {
        fetch('/api/user/cars', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            },
        })
            .then(response => response.json())
            .then(data => setCars(data))
            .catch(error => console.error('Error fetching cars:', error));
    }, []);

    useEffect(() => {
        if (Array.isArray(orders) && orders.length === 0) {
            setShowNoCompletedOrdersModal(true);
        } else {
            setShowNoCompletedOrdersModal(false); // Скрываем окно, если заказы есть
        }
    }, [orders]);

    const handleDateChange = (event) => { setDate(event.target.value); };
    const formattedDate = date ? format(parseISO(date), 'EE, d MMMM', { locale: ru }) : 'Сегодня';

    const onFromCityChange = (event, { newValue }) => { setFromCity(newValue); };
    const onToCityChange = (event, { newValue }) => { setToCity(newValue); };
    const onSuggestionsFetchRequested = ({ value }) => { setSuggestions(getSuggestions(value)); };
    const onSuggestionsClearRequested = () => { setSuggestions([]); };
    const toggleDropdown = () => { setDropdownOpen(!dropdownOpen); };
    const togglePassengerDropdown = () => { setPassengerDropdownOpen(!passengerDropdownOpen); };

    const incrementPassenger = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setPassengerCount(prevCount => (prevCount < 4 ? prevCount + 1 : prevCount));
    };

    const decrementPassenger = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setPassengerCount(prevCount => (prevCount > 1 ? prevCount - 1 : prevCount));
    };

    const handleSearch = async (event) => {
        event.preventDefault();

        // Проверяем, что город отправления и прибытия указаны
        if (!fromCity || !toCity) {
            alert("Пожалуйста, укажите города отправления и прибытия");
            return;
        }

        try {
            // Создаем параметры запроса
            const searchParams = new URLSearchParams({
                departureCity: fromCity,
                arrivalCity: toCity,
                date: date || '', // Опциональная дата
                seats: passengerCount || 1 // Минимум 1 пассажир по умолчанию
            });

            // Выполняем запрос
            const response = await fetch(`/passenger/orders?${searchParams.toString()}`);

            // Проверяем статус ответа
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Получаем данные
            const data = await response.json();

            // Проверяем наличие поездок
            if (data.orders.length === 0) {
                setShowNoOrdersModal(true); // Показать модалку, если поездок нет
            } else {
                console.log('Navbar: Received orders:', data.orders);

                if (setOrders && typeof setOrders === 'function') {
                    setOrders(data.orders); // Обновляем состояние orders в Dashboard
                    console.log('Navbar: setOrders вызван');
                } else {
                    console.warn('setOrders is not provided');
                }

                setShowNoOrdersModal(false); // Скрыть модалку, если поездки найдены
            }
        } catch (error) {
            console.error('Error searching orders:', error);
        }
    };

    //  window.location.href = `/passenger/orders?${searchParams.toString()}`;

    const handlePublishClick = (event) => {
        event.preventDefault();
        if (cars.length === 0) {
            setShowNoCarModal(true);
        } else {
            window.location.href = '/orders/create';
        }
    };

    const closeNoCarModal = () => {
        setShowNoCarModal(false);
    };

    const closeNoOrdersModal = () => {
        setShowNoOrdersModal(false);
    };

    const closeNoCompletedOrdersModal = () => {
        setShowNoCompletedOrdersModal(false);

    };

    const redirectToAddCar = () => {
        window.location.href = route('car.create');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
            if (passengerDropdownRef.current && !passengerDropdownRef.current.contains(event.target)) {
                setPassengerDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header>
            <div className="navbar navbar-default bs-dos-nav navbar-fixed-top" role="navigation">
                <div className="container">
                    <div className="navigation">
                        <a href="#home" className="navbar-brand">
                            <img src="/images/Logo-1.png" alt="Plus Icon" width="148" height="36"/>
                        </a>
                        <div className="navbar-header">
                            <nav className="collapse navbar-collapse" id="rock-navigation">
                                <ul className="nav navbar-nav navbar-right main-navigation text-capitalize">
                                    <li><a href="#home" className="smoothScroll">С попутчиками</a></li>
                                    <li><a href="#help" className="smoothScroll">Центр помощи</a></li>
                                </ul>
                            </nav>
                        </div>

                        <nav className="navbar-collapse" id="rock-navigation">
                            <ul className="nav navbar-nav navbar-right main-navigation text-capitalize">
                                <li><a href="#home" className="smoothScroll"></a></li>
                                <li><a href="#work" className="smoothScroll"></a></li>
                                <li><a href="#portfolio" className="smoothScroll"></a></li>
                                <li></li>
                                <li>
                                    <a onClick={handlePublishClick} className="smoothScroll" style={{ cursor: 'pointer'}}>
                                        <img src="/images/icons_plus.svg" alt="" width="25" height="25"/>
                                        Опубликовать поездку
                                    </a>
                                </li>
                                <li className="dropdown" ref={dropdownRef}>
                                    <a className="dropdown-toggle user-info" onClick={toggleDropdown}>
                                        {auth.user ? (
                                            <>
                                                <img src={auth.user.photoUrl || "/images/user_icon.svg"} alt="" width="37" height="35"/>
                                                <span>{auth.user.name}</span>
                                            </>
                                        ) : (
                                            <img src="/images/user_icon.svg" alt="User" width="37" height="35" />
                                        )}
                                    </a>
                                    {dropdownOpen && (
                                        <ul className="dropdown-menu">
                                            {auth.user ? (
                                                <>
                                                    <li><Link href={route('driver.orders')}>Ваши поездки</Link></li>
                                                    <li><Link href={route('incoming.show')}>Входящие</Link></li>
                                                    <li><a href="/profile">Профиль</a></li>
                                                    <li><Link href="/logout" method="post">Выйти</Link></li>
                                                </>
                                            ) : (
                                                <>
                                                    <li><Link href="/login">Вход</Link></li>
                                                    <li><Link href="/register">Регистрация</Link></li>
                                                </>
                                            )}
                                        </ul>
                                    )}
                                </li>
                            </ul>
                        </nav>
                    </div>

                    <form role="search" className="search-form" onSubmit={handleSearch}>
                        <div className="input-group">
                            <div className="input-wrapper">
                                <Autosuggest
                                    suggestions={suggestions}
                                    onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                                    onSuggestionsClearRequested={onSuggestionsClearRequested}
                                    getSuggestionValue={getSuggestionValue}
                                    renderSuggestion={renderSuggestion}
                                    inputProps={{
                                        placeholder: 'Откуда',
                                        value: fromCity,
                                        onChange: onFromCityChange
                                    }}
                                />
                                <div className="icon-wrapper">
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="img"
                                         aria-hidden="true" className="search-icon">
                                        <g color="neutralIconDefault">
                                            <g color="currentColor">
                                                <path fill="currentColor" fillRule="evenodd"
                                                      d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm7.293.293a1 1 0 0 1 1.414-1.414l2 2a1 1 0 0 1-1.414 1.414l-2-2Z"
                                                      clipRule="evenodd"></path>
                                            </g>
                                        </g>
                                    </svg>
                                </div>
                            </div>

                            <div className="input-wrapper">
                                <Autosuggest
                                    suggestions={suggestions}
                                    onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                                    onSuggestionsClearRequested={onSuggestionsClearRequested}
                                    getSuggestionValue={getSuggestionValue}
                                    renderSuggestion={renderSuggestion}
                                    inputProps={{
                                        placeholder: 'Куда',
                                        value: toCity,
                                        onChange: onToCityChange
                                    }}
                                />
                                <div className="icon-wrapper">
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="img"
                                         aria-hidden="true" className="search-icon">
                                        <g color="neutralIconDefault">
                                            <g color="currentColor">
                                                <path fill="currentColor" fillRule="evenodd"
                                                      d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm7.293.293a1 1 0 0 1 1.414-1.414l2 2a1 1 0 0 1-1.414 1.414l-2-2Z"
                                                      clipRule="evenodd"></path>
                                            </g>
                                        </g>
                                    </svg>
                                </div>
                            </div>

                            <div className="input-wrapper-calendar" onClick={() => inputRef.current?.focus()}>
                                <input
                                    type="date"
                                    aria-invalid="false"
                                    className="input-field-calendar"
                                    value={date}
                                    onChange={handleDateChange}
                                    ref={inputRef}
                                />
                                <div className="button-overlay">
                                    <span>{formattedDate}</span>
                                </div>
                                <div className="icon-wrapper">
                                    <img src="/images/calendar-1.png" alt="Calendar Icon" width="20" height="20"/>
                                </div>
                            </div>

                            <div className="input-wrapper" onClick={togglePassengerDropdown}>
                                <div className="button-overlay">
                                    <span>{passengerCount} {getPassengerLabel(passengerCount)}</span>
                                </div>
                                <div className="icon-wrapper">
                                    <img src="/images/user2_icon.svg" alt="Passenger Icon" width="20" height="20"/>
                                </div>
                            </div>
                            {passengerDropdownOpen && (
                                <div className="passenger-dropdown" style={{borderColor: '#eea236'}} ref={passengerDropdownRef}>
                                    <span>Пассажиров</span>
                                    <button onClick={decrementPassenger}>-</button>
                                    <span>{passengerCount}</span>
                                    <button onClick={incrementPassenger}>+</button>
                                </div>
                            )}
                            <button type="submit" className="search-button">Поиск</button>
                        </div>
                    </form>
                    <NoCarModal show={showNoCarModal} onClose={closeNoCarModal} onAddCar={redirectToAddCar} />
                    <NoOrdersModal show={showNoOrdersModal} onClose={closeNoOrdersModal} />
                    {/*<NoCompletedOrdersModal show={showNoCompletedOrdersModal} onClose={closeNoCompletedOrdersModal} />*/}
                </div>
            </div>
        </header>
    );
};

export default Navbar;

