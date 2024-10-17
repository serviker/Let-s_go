import React, { useState, useEffect } from 'react';
import { Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import '../../../css/DriverOrderCreate.css';
import CitySuggestInput from "@/Components/CitySuggestInput.jsx";
import StreetSuggestInput from "@/Components/StreetSuggestInput.jsx";
import Autosuggest from "react-autosuggest";
import axios from "axios";


export default function DriverOrderCreate({ className = '' }) {
    const [step, setStep] = useState(1);
    const [cityBoundingBox, setCityBoundingBox] = useState('');
    const [intermediate_addresses, setIntermediate_addresses] = useState([]);
    const { data, setData, post, processing, errors } = useForm({
        date_time_departure: '',
        departure_time: '',
        from_city: '',
        from_street: '',
        from_house: '',
        to_city: '',
        to_street: '',
        to_house: '',
        intermediate_addresses: [''],
        price: '',
        available_seats: 1,
        description: '',
        status_order_id: 1,  // Новое поле для выбора статуса бронирования
    });
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [cities, setCities] = useState([]); // Состояние для всех городов
    const [isCitiesLoaded, setIsCitiesLoaded] = useState(false);



    // Метод для фильтрации городов по введенному значению
    function getSuggestions(value, list) {
        const inputValue = value.trim().toLowerCase();
        //  console.log("Input value:", inputValue);
        const inputLength = inputValue.length;
        return inputLength === 0 ?  []: list.filter(item => item.toLowerCase().slice(0, inputLength) === inputValue);
    }
    const getSuggestionValue = (suggestion) => suggestion;

    const renderSuggestion = (suggestion) => (
        <div>{suggestion}</div>
    );

    // const onCityChange = (event, { newValue }) => {
    //     // Обновите входное значение города
    //     setCity(newValue); // обновляем отображаемое значение в инпуте
    //     setData({ ...data, toCity: newValue });
    // };

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
    }, []);  // Пустой массив зависимостей гарантирует выполнение только один раз при монтировании.useEffect(() => {

    useEffect(() => {
        if (data.city && isCitiesLoaded) {
            onSuggestionsFetchRequested({ value: data.city });
        }
    }, [data.city, isCitiesLoaded]);

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
        const limitedSuggestions = suggestions.slice(0, 10);
        //  console.log("City suggestions:", suggestions);
        setCitySuggestions(limitedSuggestions);
    };

    const onSuggestionsClearRequested = () => {
        setCitySuggestions([]);
    };

    useEffect(() => {
        setData('intermediate_addresses', intermediate_addresses);
    }, [intermediate_addresses]);


    // Установка сегодняшней даты и времени 08:00 по умолчанию при загрузке компонента
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const now = new Date();
        const currentHours = String(now.getHours()).padStart(2, '0'); // Форматируем часы
        const currentMinutes = String(now.getMinutes()).padStart(2, '0'); // Форматируем минуты
        const defaultTime = `${currentHours}:${currentMinutes}`; // Текущее время в формате HH:MM

        if (!data.date_time_departure) {
            setData('date_time_departure', today);
        }

        if (!data.departure_time) {
            setData('departure_time', defaultTime);
        }
    }, [data.date_time_departure, data.departure_time, setData]);


    const handleIncrease = () => {
        if (data.available_seats < 4) {
            setData('available_seats', data.available_seats + 1);
        }
    };

    const handleDecrease = () => {
        if (data.available_seats > 1) {
            setData('available_seats', data.available_seats - 1);
        }
    };
    const handleNext = () => setStep(prevStep => prevStep + 1);
    const handlePrev = () => setStep(prevStep => prevStep - 1);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Передаем промежуточные адреса в `setData`
        setData((prevData) => ({
            ...prevData,
            intermediate_addresses: intermediate_addresses,
        }));

        // Создаем объект данных для отправки
        const formData = { ...data, intermediate_addresses };
       // console.log('Отправляемые данные:', formData); // Проверьте, что промежуточные адреса включены
        console.log('Отправляемые данные:', JSON.stringify(formData, null, 2));

        post('/orders', formData, {
            onError: (error) => console.error('Ошибка при создании заказа:', error),
            onSuccess: (page) => console.log('Заказ успешно создан:', page),
        });
    };


    const handleCitySelect = (suggestion, cityField) => {
        const boundingBox = suggestion.boundingbox.join(','); // Формат: minLon,minLat,maxLon,maxLat
        setCityBoundingBox(boundingBox);
        setData(cityField, suggestion);
    };

    const handleAddIntermediateAddress = () => {
        setIntermediate_addresses([...intermediate_addresses, '']);
    };


    const handleIntermediateAddressChange = (index, value) => {
        const updatedAddresses = [...intermediate_addresses];
        updatedAddresses[index] = value; // Обновляем конкретный адрес
        setIntermediate_addresses(updatedAddresses); // Обновляем состояние
    };


    const handleRemoveIntermediateAddress = (index) => {
        const updatedAddresses = intermediate_addresses.filter((_, i) => i !== index);
        setIntermediate_addresses(updatedAddresses);
    };


    return (
        <form onSubmit={handleSubmit} className={`create-order-container ${className}`}>
            {step === 1 && (
                <div className="card">
                    <div className="card-header text-center">
                        <h2>Когда планируете выезжать?</h2>
                    </div>
                    <div className="card-body">
                        <InputLabel htmlFor="date_time_departure" style={{ color: '#eea236' }} />
                        <TextInput
                            id="date_time_departure"
                            type="date"
                            value={data.date_time_departure}
                            onChange={(e) => setData('date_time_departure', e.target.value)}
                            onFocus={(e) => e.target.showPicker()} // Открытие календаря при фокусе на поле ввода
                            className="form-control"
                        />
                        <InputError message={errors.date_time_departure} className="input-error" />
                        <div className="flex">
                            <button
                                className="btn btn-info"
                                onClick={() => window.location.href = route('dashboard')}
                            >
                                На главную
                            </button>
                            <SecondaryButton type="button" onClick={handleNext} className="btn btn-success">
                            Продолжить
                            </SecondaryButton>
                        </div>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="card">
                    <div className="card-header text-center">
                        <h2>Во сколько заберете пассажиров?</h2>
                    </div>
                    <div className="card-body">
                        <InputLabel htmlFor="departure_time" style={{ color: '#eea236' }} />
                        <TextInput
                            id="departure_time"
                            type="time"
                            value={data.departure_time}
                            onChange={(e) => setData('departure_time', e.target.value)}
                            onFocus={(e) => e.target.showPicker()}
                            className="form-control"
                        />
                        <InputError message={errors.departure_time} className="input-error" />
                        <div className="flex">
                            <SecondaryButton type="button" onClick={handlePrev} className="btn btn-secondary">
                                Назад
                            </SecondaryButton>
                            <SecondaryButton type="button" onClick={handleNext} className="btn btn-success">
                                Продолжить
                            </SecondaryButton>
                        </div>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="card">
                    <div className="card-header text-center">
                        <h2>Откуда вы выезжаете ?</h2>
                    </div>
                    <div className="card-body">
                        <InputLabel htmlFor="from_city" value="Город" className="inputLabel"/>
                        <CitySuggestInput
                            id="from_city"
                            value={data.from_city}
                            onChange={(value) => setData('from_city', value)}
                            onSelect={(suggestion) => handleCitySelect(suggestion, 'from_city')}
                            placeholder="Введите город"
                        />
                        <InputError message={errors.from_city} className="input-error" />
                        <div className="flex">
                            <SecondaryButton type="button" onClick={handlePrev} className="btn btn-secondary">
                                Назад
                            </SecondaryButton>
                            <SecondaryButton type="button" onClick={handleNext} className="btn btn-success">
                                Продолжить
                            </SecondaryButton>
                        </div>
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="card">
                    <div className="card-header text-center">
                        <h2>Откуда вы выезжаете ?</h2>
                    </div>
                    <div className="card-body">
                        <InputLabel htmlFor="from_street" value="Улица" className="inputLabel"/>
                        <StreetSuggestInput
                            id="from_street"
                            value={data.from_street}
                            onChange={(value) => setData('from_street', value)}
                            cityBoundingBox={cityBoundingBox}
                            placeholder="Введите улицу"
                        />
                        <InputError message={errors.from_street} className="input-error" />
                        <div className="flex">
                            <SecondaryButton type="button" onClick={handlePrev} className="btn btn-secondary">
                                Назад
                            </SecondaryButton>
                            <SecondaryButton type="button" onClick={handleNext} className="btn btn-success">
                                Продолжить
                            </SecondaryButton>
                        </div>
                    </div>
                </div>
            )}

            {step === 5 && (
                <div className="card">
                    <div className="card-header text-center">
                        <h2>Откуда вы выезжаете ?</h2>
                    </div>
                    <div className="card-body">
                        <InputLabel htmlFor="from_house" value="Дом" className="inputLabel"/>
                        <TextInput
                            id="from_house"
                            value={data.from_house}
                            onChange={(e) => setData('from_house', e.target.value)}
                            className="form-control"
                        />
                        <InputError message={errors.from_house} className="input-error"/>
                        <div className="flex">
                            <SecondaryButton type="button" onClick={handlePrev} className="btn btn-secondary">
                                Назад
                            </SecondaryButton>
                            <SecondaryButton type="button" onClick={handleNext} className="btn btn-success">
                                Продолжить
                            </SecondaryButton>
                        </div>
                    </div>
                </div>
            )}

            {step === 6 && (
                <div className="card">
                    <div className="card-header text-center">
                        <h2>Куда вы едете?</h2>
                    </div>
                    <div className="card-body">
                        <InputLabel htmlFor="to_city" value="Город" className="inputLabel"/>
                        <CitySuggestInput
                            id="to_city"
                            value={data.to_city}
                            onChange={(value) => setData('to_city', value)}
                            onSelect={(suggestion) => handleCitySelect(suggestion, 'to_city')}
                            placeholder="Введите город"
                        />
                        <InputError message={errors.to_city} className="input-error" />
                        <div className="flex">
                            <SecondaryButton type="button" onClick={handlePrev} className="btn btn-secondary">
                                Назад
                            </SecondaryButton>
                            <SecondaryButton type="button" onClick={handleNext} className="btn btn-success">
                                Продолжить
                            </SecondaryButton>
                        </div>
                    </div>
                </div>
            )}

            {step === 7 && (
                <div className="card">
                    <div className="card-header text-center">
                        <h2>Куда вы едете?</h2>
                    </div>
                    <div className="card-body">
                        <InputLabel htmlFor="to_street" value="Улица" className="inputLabel"/>
                        <StreetSuggestInput
                            id="to_street"
                            value={data.to_street}
                            onChange={(value) => setData('to_street', value)}
                            cityBoundingBox={cityBoundingBox}
                            placeholder="Введите улицу" style={{ borderColor: '#eea236' }}
                        />
                        <InputError message={errors.to_street} className="input-error" />
                        <div className="flex">
                            <SecondaryButton type="button" onClick={handlePrev} className="btn btn-secondary">
                                Назад
                            </SecondaryButton>
                            <SecondaryButton type="button" onClick={handleNext} className="btn btn-success">
                                Продолжить
                            </SecondaryButton>
                        </div>
                    </div>
                </div>
            )}

            {step === 8 && (
                <div className="card">
                    <div className="card-header text-center">
                        <h2>Куда вы едете?</h2>
                    </div>
                    <div className="card-body">
                        <InputLabel htmlFor="to_house" value="Дом" className="inputLabel"/>
                        <TextInput
                            id="to_house"
                            value={data.to_house}
                            onChange={(e) => setData('to_house', e.target.value)}
                            className="form-control"
                        />
                        <InputError message={errors.to_house} className="input-error"/>
                        <div className="flex">
                            <SecondaryButton type="button" onClick={handlePrev} className="btn btn-secondary">
                                Назад
                            </SecondaryButton>
                            <SecondaryButton type="button" onClick={handleNext} className="btn btn-success">
                                Продолжить
                            </SecondaryButton>
                        </div>
                    </div>
                </div>
            )}

            {step === 9 && (
                <div className="card">
                    <div className="card-header text-center">
                        <h2>Добавьте промежуточные адреса</h2>
                    </div>
                    <div className="card-body" style={{overflow: 'visible', position: 'relative'}}>
                        {intermediate_addresses.map((address, index) => (
                            <div key={index} className="intermediate-address">
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' , padding: '0 20px'}}>
                                    <InputLabel htmlFor={`intermediate_address_${index}`} value={`${index + 1} - промежуточный адрес `} style={{ color: '#eea236', fontSize: '20px', fontWeight: 'normal', marginTop: '12px' }} />
                                    <SecondaryButton type="button" onClick={() => handleRemoveIntermediateAddress(index)} className="btn btn-danger" style={{background:'transparent', color: "#f65900", fontSize: '18px'}}>
                                        Удалить этот адрес
                                    </SecondaryButton>
                                </div>

                                <div className="input-wrapper">
                                <Autosuggest
                                    suggestions={citySuggestions}
                                    onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                                    onSuggestionsClearRequested={onSuggestionsClearRequested}
                                    getSuggestionValue={getSuggestionValue}
                                    renderSuggestion={renderSuggestion}
                                    inputProps={{
                                        id: `intermediate_address_${index}`,
                                        placeholder: 'Введите промежуточный город',
                                        value: address, // Передавайте значение промежуточного города
                                        onChange: (e, { newValue }) => handleIntermediateAddressChange(index, newValue) // Используем вашу функцию для обработки изменений
                                    }}

                                />
                                </div>
                            </div>
                        ))}
                        <div className="flex">
                            <SecondaryButton type="button" onClick={handlePrev} className="btn btn-secondary">
                                Назад
                            </SecondaryButton>
                            <SecondaryButton type="button" onClick={handleAddIntermediateAddress} className="btn btn-info">
                                Добавить еще адрес
                            </SecondaryButton>
                            <SecondaryButton type="button" onClick={handleNext} className="btn btn-success">
                                Продолжить
                            </SecondaryButton>
                        </div>
                    </div>
                </div>
            )}

            {step === 10 && (
                <div className="card">
                    <div className="card-header text-center">
                        <h2>Задайте цену за место</h2>
                    </div>
                    <div className="card-body">
                        <InputLabel htmlFor="price" style={{color: '#eea236'}}/>
                        <TextInput
                            id="price"
                            type="number"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                            className="form-control"
                        />
                        <InputError message={errors.price} className="input-error"/>
                        <div className="flex">
                            <SecondaryButton type="button" onClick={handlePrev} className="btn btn-secondary">
                                Назад
                            </SecondaryButton>
                            <SecondaryButton type="button" onClick={handleNext} className="btn btn-success">
                                Продолжить
                            </SecondaryButton>
                        </div>
                    </div>
                </div>
            )}

            {step === 11 && (
                <div className="card">
                    <div className="card-header text-center">
                        <h2>Итак, сколько попутчиков возьмете в дорогу?</h2>
                    </div>
                    <div className="card-body">
                        <InputLabel htmlFor="available_seats"/>
                        <div className="passenger-selector">
                            <button
                                type="button"
                                onClick={handleDecrease}
                                className={`btn ${data.available_seats === 1 ? 'btn-disabled' : 'btn-primary'}`}
                                disabled={data.available_seats === 1} style={{marginRight: '100px'}}
                            >
                                -
                            </button>
                            <span className="passenger-count">{data.available_seats}</span>
                            <button
                                type="button"
                                onClick={handleIncrease}
                                className={`btn ${data.available_seats === 4 ? 'btn-disabled' : 'btn-primary'}`}
                                disabled={data.available_seats === 4} style={{marginLeft: '100px'}}
                            >
                                +
                            </button>
                        </div>
                        <InputError message={errors.available_seats} className="input-error"/>
                        <div className="flex">
                            <SecondaryButton type="button" onClick={handlePrev} className="btn btn-secondary">
                                Назад
                            </SecondaryButton>
                            <SecondaryButton type="button" onClick={handleNext} className="btn btn-success">
                                Продолжить
                            </SecondaryButton>
                        </div>
                    </div>
                </div>
            )}

            {step === 12 && (
                <div className="card">
                    <div className="card-header text-center">
                        <h2>Включите для ваших пассажиров Мгновенное бронирование</h2>
                    </div>
                        <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold', color: '#eea236', marginBottom: '20px', marginTop: '20px'}}>
                            Не нужно просматривать каждый запрос, прежде чем он истечет
                        </div>
                        <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold', color: '#eea236', marginBottom: '20px'}}>
                           Пассажирам нравится получать ответ сразу же
                        </div>
                    <div className="card-body" style={{ textAlign: 'center'}}>
                        <div className="form-group">
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                alignContent: 'center',
                                fontSize: '22px',
                                color: Number(data.status_order_id) === 1 ? '#eea236' : 'inherit' // Условный цвет
                            }}>
                                <input
                                    type="radio"
                                    name="status_order_id"
                                    value="1"
                                    checked={Number(data.status_order_id) === 1}
                                    onChange={(e) => setData('status_order_id', Number(e.target.value))}
                                    style={{marginRight: '30px', marginBottom: '5px'}}
                                />
                                Оставить Мгновенное бронирование
                            </label>
                            <div className="form-group">
                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    alignContent: 'center',
                                    fontSize: '22px',
                                    color: Number(data.status_order_id) === 2 ? '#eea236' : 'inherit' // Условный цвет
                                }}>
                                    <input
                                        type="radio"
                                        name="status_order_id"
                                        value="2"
                                        checked={Number(data.status_order_id) === 2}
                                        onChange={(e) => setData('status_order_id', Number(e.target.value))}
                                        style={{marginRight: '30px', marginBottom: '5px', color: '#eea236'}}
                                    />
                                    Просматривать каждый запрос
                                </label>
                            </div>
                        </div>
                        <div className="flex">
                            <SecondaryButton type="button" onClick={handlePrev} className="btn btn-secondary">
                                Назад
                            </SecondaryButton>
                            <SecondaryButton type="button" onClick={handleNext} className="btn btn-success">
                                Продолжить
                            </SecondaryButton>
                        </div>
                    </div>
                </div>
            )}


            {step === 13 && (
                <div className="card">
                    <div className="card-header text-center">
                        <h2>Хотите сказать о поездке что-то еще?</h2>
                    </div>
                    <div className="card-body">
                        <InputLabel htmlFor="description"/>
                        <TextInput
                            id="description"
                            type="textarea" // Используем тип textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="form-control"
                            style={{ height: '200px' }}
                        />
                        <InputError message={errors.description} className="input-error"/>
                        <div className="flex">
                            <SecondaryButton type="button" onClick={handlePrev} className="btn btn-secondary">
                                Назад
                            </SecondaryButton>
                            <PrimaryButton type="submit" className="btn btn-primary" disabled={processing}>
                                Опубликовать поездку
                            </PrimaryButton>
                            <Link href={route('dashboard')} className="btn btn-info">
                                Отмена
                            </Link>
                        </div>
                    </div>
                </div>
            )}

        </form>
    );
}
