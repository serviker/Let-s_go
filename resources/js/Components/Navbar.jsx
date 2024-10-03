// resources/js/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import Autosuggest from 'react-autosuggest';
import { Link, usePage } from '@inertiajs/react';
import Modal from "@/Components/Modal.jsx";
import {Inertia} from "@inertiajs/inertia";
import {useLocation} from "react-router-dom"; // Use Inertia's usePage for accessing the Laravel Breeze user data
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Стандартные стили библиотеки




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
    );
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

/*const  NoCompletedOrdersModal = ({show, onClose}) => {
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
}*/
const userHasBookedTrips = async (userId) => {
    const response = await fetch(`/api/user/${userId}/booked-trips`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
    });

    const data = await response.json();
    return data.hasBookedTrips; // Флаг, возвращаемый сервером
};

/*
const getSuggestions = (inputValue, cityList) => {
    const inputLower = inputValue.toLowerCase();
    return cityList.filter(city => {
        // Проверяем, существует ли поле city и является ли оно строкой
        return city && city.city && typeof city.city === 'string' && city.city.toLowerCase().includes(inputLower);
    });
};*/

/*const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0 ? [] : cities.filter(city =>
        city.name.toLowerCase().slice(0, inputLength) === inputValue
    );
};
*/
// Метод для фильтрации городов по введенному значению
/*const getSuggestions = (value, uniqueCities) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : uniqueCities.filter(city =>
        city.toLowerCase().includes(inputValue)
    );
};*/


const getPassengerLabel = (count) => {
    if (count === 1) return 'пассажир';
    if (count >= 2 && count <= 4) return 'пассажира';
    return 'пассажиров';
};

const Navbar = ({setOrders, orders, onSearch }) => {
    // console.log('Navbar: setOrders:', setOrders); // Добавьте это для проверки
    const {auth} = usePage().props;
    const user = auth.user || {};
    const [cars, setCars] = useState([]);
   // const today = new Date().toISOString().split('T')[0];
   // console.log("Today:", today); // Проверяем правильность today's date
   //  const [date, setDate] = useState(today || ''); // Установите сегодняшнюю дату
    const [date, setDate] = useState('');
    const [fromCity, setFromCity] = useState('');
    const [toCity, setToCity] = useState('');
    const [seats, setSeats] = useState('');
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
    const location = useLocation();
    const [cities, setCities] = useState([]); // Состояние для всех городов
    const [citySuggestions, setCitySuggestions] = useState([]); // Состояние для предложений
    const [data, setData] = useState([]); // Состояние для предложений
    const [inputValue, setInputValue] = useState([] || ''); // Состояние для предложений
    const [isCitiesLoaded, setIsCitiesLoaded] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    // Управление вторичным выпадающим списком для уведомлений
    const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);

    const toggleNotificationsDropdown = () => {
        setNotificationsDropdownOpen(!notificationsDropdownOpen);
    };

    // Закрытие выпадающих списков при клике вне них
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
            setNotificationsDropdownOpen(false); // Закрыть также и вторичное меню
        }
    };

    // Добавляем слушателя событий для кликов вне меню
    React.useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    // Функция для получения количества непрочитанных уведомлений
    const fetchUnreadCount = async () => {
        try {
            const response = await fetch('/notifications/unread-count');
            const data = await response.json();
            setUnreadCount(data.unreadCount);
        } catch (error) {
            console.error("Error fetching unread notifications:", error);
        }
    };

    // Вызываем функцию при монтировании компонента
    useEffect(() => {
        fetchUnreadCount();
    }, []);


    // Метод для фильтрации городов по введенному значению
    function getSuggestions(value, list) {
        const inputValue = value.trim().toLowerCase();
      //  console.log("Input value:", inputValue);
        const inputLength = inputValue.length;
        return inputLength === 0 ?  []: list.filter(item => item.toLowerCase().slice(0, inputLength) === inputValue);
    }

    const getSuggestionValue = (suggestion) => suggestion;

    const renderSuggestion = (suggestion) => {
        return <div>{suggestion}</div>; // Убедитесь, что suggestion - это объект с свойством city
    };


    const fetchCities = async () => {
        const response = await fetch('/api/cities');
        return await response.json();
        // console.log("Cities fetched from API:", data);
    };

    const fetchSuggestions = async (value) => {
        const response = await fetch(`/api/suggestions?value=${value}`);
        return await response.json();
    };

    useEffect(() => {
        // Функция для загрузки городов из базы данных
        const fetchCities = async () => {
            try {
                const response = await axios.get('/api/cities');
            //    console.log("Fetched cities:", response.data);  // Добавляем вывод в консоль
                setCities(response.data);  // Сохраняем список городов в состоянии
                setIsCitiesLoaded(true);  // Помечаем, что города загружены
            } catch (error) {
                console.error("Ошибка при загрузке городов:", error);
            }
        };

        // Загрузка городов только при монтировании компонента
        if (cities.length === 0) {
            fetchCities();
        }
    }, []);  // Пустой массив зависимостей гарантирует выполнение только один раз при монтировании.


    useEffect(() => {
        if (data.city && isCitiesLoaded) {
            onSuggestionsFetchRequested({ value: data.city });
        }
    }, [data.city, isCitiesLoaded]);


    // Восстанавливаем состояние из URL-параметров при загрузке компонента
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        setFromCity(queryParams.get('departureCity') || '');
        setToCity(queryParams.get('arrivalCity') || '');
        setDate(queryParams.get('date') || '');
        setPassengerCount(queryParams.get('seats') || 1);
    }, [location]);

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


    /*
            let formattedDate = '';
            if (date) {
                try {
                    formattedDate = (date === today ? 'Сегодня' : format(parseISO(date), 'EE, d MMMM', { locale: ru }));
                } catch (error) {
                    console.error("Error formatting date:", error);
                }
            }
            useEffect(() => {
                console.log("Date updated:", date);
                console.log("Formatted Date useEffect:", formattedDate);
            }, [date]);

            console.log(date);
            console.log("Formatted Date:", formattedDate);

            const handleDateChange = (e) => {
                const newDate = e.target.value;
                console.log("New Date:", newDate);
                setDate(newDate  today); // Возвращайте today's date, если новое значение пустое
            };
     */
            const handleDateChange = (e) => {
                const newDate = e.target.value;
                setDate(newDate ); // Возвращайте today's date, если новое значение пустое
            };

            const formattedDate = date ? format(parseISO(date), 'EE, d MMMM', { locale: ru }) : 'Сегодня';

    const onFromCityChange = (event, { newValue }) => {
        // Обновляем как состояние для автозаполнения, так и данные формы
        setFromCity(newValue); // обновляем отображаемое значение в инпуте
        setData({ ...data, fromCity: newValue }); // обновляем данные формы
    };
     const onToCityChange = (event, { newValue }) => {
        // Обновите входное значение города
         setToCity(newValue); // обновляем отображаемое значение в инпуте
        setData({ ...data, toCity: newValue });
    };

    const onSuggestionsFetchRequested = async ({ value }) => {
      //  console.log("Fetching suggestions for:", value);

        // Проверяем, если массив cities пуст, загружаем города
        if (cities.length === 0) {
            const allCities = await fetchCities(); // Здесь используем fetchCities
            setCities(allCities);
        }

        // Извлекаем уникальные города
        const uniqueCities = Array.from(new Set(cities.map(city => city.city)));

        // Фильтруем предложения
        const suggestions = getSuggestions(value, uniqueCities);
        const limitedSuggestions = suggestions.slice(0, 15);
      //  console.log("City suggestions:", suggestions);
        setCitySuggestions(limitedSuggestions);
    };

    const handleCityChange = (event, { newValue }) => {
        setData({ ...data, city: newValue });
    };

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

                // Обновляем состояние orders в Dashboard, если setOrders передан
                if (setOrders && typeof setOrders === 'function') {
                    setOrders(data.orders);
                    console.log('Navbar: setOrders вызван');
                } else {
                    console.warn('setOrders is not provided');
                }

                setShowNoOrdersModal(false); // Скрыть модалку, если поездки найдены
            }

            // Обработка редиректа с использованием Inertia
            const currentParams = new URLSearchParams(location.search);
            const currentRoute = route('dashboard', {
                departureCity: currentParams.get('departureCity'),
                arrivalCity: currentParams.get('arrivalCity'),
                date: currentParams.get('date' ),
                seats: currentParams.get('seats'),
            });

            const newRoute = route('dashboard', {
                departureCity: fromCity,
                arrivalCity: toCity,
                date: date,
                seats: passengerCount,
            });

            // Если маршрут изменился, делаем замену URL через Inertia
            if (currentRoute !== newRoute) {
                Inertia.replace(newRoute);
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
                            <img src="/images/logo_4.png" alt="Plus Icon" width="138" height="36" style={{ marginLeft: '15%'}}/>
                        </a>
                        <div className="navbar-header">
                            <nav className="collapse navbar-collapse" id="rock-navigation">
                                <ul className="nav navbar-nav navbar-right main-navigation text-capitalize">
                                    <li><a href="#home" className="smooth">С попутчиками</a></li>
                                    <li><a href="#help" className="smooth">Центр помощи</a></li>
                                </ul>
                            </nav>
                        </div>

                        <nav className="navbar-collapse" id="rock-navigation">
                            <ul className="nav navbar-nav navbar-right main-navigation text-capitalize">
                                <li><a href="#home" className="smooth"></a></li>
                                <li><a href="#work" className="smooth"></a></li>
                                <li><a href="#portfolio" className="smooth"></a></li>
                                <li></li>
                                <li>
                                    <a onClick={handlePublishClick} className="smooth" style={{cursor: 'pointer'}}>
                                        <img src="/images/icons_plus.svg" alt="" width="25" height="25"
                                             style={{marginRight: '15px', marginBottom: '3px'}}/>
                                        Опубликовать поездку
                                    </a>
                                </li>
                                {/*<li className="dropdown" ref={dropdownRef}>
                                    <a className="dropdown-toggle user-info" onClick={toggleDropdown}>
                                        {auth.user ? (
                                            <>
                                                <div className="user-photo-container">
                                                    <img
                                                        src={auth.user.photoUrl || "/images/user_icon.svg"}
                                                        alt=""
                                                        width="37"
                                                        height="35"
                                                    />
                                                    {unreadCount > 0 && (
                                                        <span className="notification-badge-foto" style={{ color: 'white'}}>{unreadCount}</span>
                                                    )}
                                                </div>
                                                <span>{auth.user.name}</span>
                                            </>
                                        ) : (
                                            <img src="/images/user_icon.svg" alt="User" width="37" height="35"/>
                                        )}
                                    </a>

                                    {dropdownOpen && (
                                        <ul className="dropdown-menu">
                                            {auth.user ? (
                                                <>
                                                    <li><Link href={route('driver.orders')}>Мои поездки Водителем</Link>
                                                    </li>
                                                    <li><Link href={route('passenger.search')}>Мои поездки
                                                        Пассажиром</Link></li>
                                                    <li><Link href={route('incoming.show')}>Входящие сообщения</Link>
                                                    </li>

                                                    <li className="dropdown-menu">
                                                        <button
                                                            className="btn btn-link dropdown-toggle"
                                                            type="button"
                                                            id="dropdownMenuButton"
                                                            data-toggle="dropdown"
                                                            aria-haspopup="true"
                                                            aria-expanded="false"
                                                        >
                                                            Уведомления
                                                            {unreadCount > 0 && (
                                                                <span
                                                                    className="notification-badge">{unreadCount}</span>
                                                            )}
                                                        </button>

                                                        <div className="dropdown-menu dropdown-menu-right"
                                                             aria-labelledby="dropdownMenuButton">
                                                            <Link className="dropdown-item"
                                                                  href={route('notifications.driverShow')}>
                                                                Уведомления для Водителя
                                                            </Link>
                                                            <Link className="dropdown-item"
                                                                  href={route('notifications.passengerShow')}>
                                                                Уведомления для Пассажира
                                                            </Link>
                                                        </div>
                                                    </li>


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
                                </li>*/}
                                {/*<li><Link href={route('notifications.index')}>Уведомления</Link></li>*/}
                                <li className="dropdown" ref={dropdownRef}>
                                    <a className="dropdown-toggle user-info" onClick={toggleDropdown}>
                                        {auth.user ? (
                                            <>
                                                <div className="user-photo-container">
                                                    <img
                                                        src={auth.user.photoUrl || "/images/user_icon.svg"}
                                                        alt=""
                                                        width="37"
                                                        height="35"
                                                    />
                                                    {unreadCount > 0 && (
                                                        <span className="notification-badge-foto"
                                                              style={{color: 'white'}}>{unreadCount}</span>
                                                    )}
                                                </div>
                                                <span>{auth.user.name}</span>
                                            </>
                                        ) : (
                                            <img src="/images/user_icon.svg" alt="User" width="37" height="35"/>
                                        )}
                                    </a>

                                    {dropdownOpen && (
                                        <ul className="dropdown-menu">
                                            {auth.user ? (
                                                <>
                                                    <li>
                                                        <Link className="dropdown-item"
                                                              href={route('notifications.index')}>
                                                            Уведомления
                                                            {unreadCount > 0 && (
                                                                <span
                                                                    className="notification-badge">{unreadCount}</span>
                                                            )}
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href={route('incoming.show')}>Входящие сообщения</Link>
                                                    </li>

                                                    {/* Основной пункт для уведомлений */}
                                                    <li className="dropdown-submenu">
                                                        <a
                                                            onClick={toggleNotificationsDropdown}>
                                                            Мои поездки
                                                            <div className="arrow"
                                                                 style={{flex: 0, margin: '0 10px', marginLeft: '60px'}}>→
                                                            </div>
                                                        </a>

                                                        {/* Вторичный выпадающий список для уведомлений */}
                                                        {notificationsDropdownOpen && (
                                                            <ul className="dropdown-menu dropdown-menu-right">

                                                                <li>
                                                                    <Link href={route('driver.orders')}>
                                                                        Водителем</Link>
                                                                </li>
                                                                <li>
                                                                    <Link href={route('passenger.search')}>
                                                                        Пассажиром</Link>
                                                                </li>
                                                            </ul>
                                                        )}

                                                    </li>

                                                    <li>
                                                        <a href="/profile">Профиль</a>
                                                    </li>
                                                    <li>
                                                        <Link href="/logout" method="post">Выйти</Link>
                                                    </li>
                                                </>
                                            ) : (
                                                <>
                                                    <li>
                                                    <Link href="/login">Вход</Link>
                                                    </li>
                                                    <li>
                                                    <Link href="/register">Регистрация</Link>
                                                    </li>
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
                                    suggestions={citySuggestions}
                                    // suggestions={Array.isArray(suggestions) ? suggestions : []}
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
                                    suggestions={citySuggestions}
                                    // suggestions={Array.isArray(suggestions) ? suggestions : []}
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
                                   // onBlur={() => console.log("Input value on blur:", date)}
                                    ref={inputRef}
                                   // style={{border: 'none', outline: 'none', flex: 1}}
                                    onFocus={() => inputRef.current?.showPicker()}
                                />
                                <div className="button-overlay">
                                    <span>{formattedDate}</span>
                                </div>
                                <div className="icon-wrapper">
                                    <img src="/images/calendar-1.png" alt="Calendar Icon" width="20" height="20"/>
                                </div>
                            </div>

                            {/*<div className="input-wrapper-calendar">*/}
                            {/*    <DatePicker*/}
                            {/*        value={date} // Ваше состояние даты*/}
                            {/*        onChange={handleDateChange} // Обработчик изменения даты*/}
                            {/*        dateFormat="yyyy-MM-dd" // Формат отображения даты*/}
                            {/*        placeholderText="Выберите дату" // Плейсхолдер*/}
                            {/*        className="input-field-calendar" // Кастомный класс для стилей*/}
                            {/*        calendarClassName="custom-datepicker-calendar" // Кастомные стили для календаря*/}
                            {/*    />*/}
                            {/*    <div className="icon-wrapper">*/}
                            {/*        <img src="/images/calendar-1.png" alt="Calendar Icon" width="20" height="20"/>*/}
                            {/*    </div>*/}
                            {/*</div>*/}


                            <div className="input-wrapper" onClick={togglePassengerDropdown}>
                                <div className="button-overlay">
                                    <span>{passengerCount} {getPassengerLabel(passengerCount)}</span>
                                </div>
                                <div className="icon-wrapper">
                                    <img src="/images/user2_icon.svg" alt="Passenger Icon" width="20" height="20"/>
                                </div>
                            </div>
                            {passengerDropdownOpen && (
                                <div className="passenger-dropdown"
                                     ref={passengerDropdownRef}>
                                    <span style={{ marginLeft: '10px'}}>Пассажиров</span>
                                    <button onClick={decrementPassenger}>-</button>
                                    <span style={{ fontSize: '22px'}}>{passengerCount}</span>
                                    <button onClick={incrementPassenger}>+</button>
                                </div>
                            )}
                            <button type="submit" className="search-button">Поиск
                            </button>
                        </div>
                    </form>
                    <NoCarModal show={showNoCarModal} onClose={closeNoCarModal} onAddCar={redirectToAddCar}/>
                    <NoOrdersModal show={showNoOrdersModal} onClose={closeNoOrdersModal}/>
                    {/*<NoCompletedOrdersModal show={showNoCompletedOrdersModal} onClose={closeNoCompletedOrdersModal} />*/}
                </div>
            </div>
        </header>
    );
};

export default Navbar;

