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
    });

    useEffect(() => {
        setData('intermediate_addresses', intermediate_addresses);
    }, [intermediate_addresses]);


    // Установка сегодняшней даты и времени 08:00 по умолчанию при загрузке компонента
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const defaultTime = '08:00';

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
       // console.log('Отправляемые данные:', JSON.stringify(formData, null, 2));

        post('/orders', formData, {
            onError: (error) => console.error('Ошибка при создании заказа:', error),
            onSuccess: (page) => console.log('Заказ успешно создан:', page),
        });
    };


    const handleCitySelect = (suggestion, cityField) => {
        const boundingBox = suggestion.boundingbox.join(','); // Формат: minLon,minLat,maxLon,maxLat
        setCityBoundingBox(boundingBox);
        setData(cityField, suggestion.display_name);
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
        <form onSubmit={handleSubmit} className={`container ${className}`}>
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
                            <Link href="/" className="home-link">
                                <button className="btn btn-info">На главную</button>
                            </Link>
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
                        <InputLabel htmlFor="from_city" value="Город" style={{ color: '#eea236' }} />
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
                        <InputLabel htmlFor="from_street" value="Улица" style={{ color: '#eea236' }} />
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
                        <InputLabel htmlFor="from_house" value="Дом" style={{color: '#eea236'}}/>
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
                        <InputLabel htmlFor="to_city" value="Город" style={{ color: '#eea236' }} />
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
                        <InputLabel htmlFor="to_street" value="Улица" style={{ color: '#eea236' }} />
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
                        <InputLabel htmlFor="to_house" value="Дом" style={{color: '#eea236'}}/>
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
                    <div className="card-body">
                        {intermediate_addresses.map((address, index) => (
                            <div key={index} className="intermediate-address">
                                <InputLabel htmlFor={`intermediate_address_${index}`} value={`Промежуточный адрес ${index + 1}`} style={{ color: '#eea236' }} />
                                <TextInput
                                    id={`intermediate_address_${index}`}
                                    value={address} // Убедитесь, что передаете правильное значение
                                    onChange={(e) => handleIntermediateAddressChange(index, e.target.value)}
                                    placeholder="Введите промежуточный город"
                                    className="form-control"
                                />
                                <SecondaryButton type="button" onClick={() => handleRemoveIntermediateAddress(index)} className="btn btn-danger">
                                    Удалить
                                </SecondaryButton>
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
                            <Link href={route('home')} className="btn btn-info">
                                Отмена
                            </Link>
                        </div>
                    </div>
                </div>
            )}

        </form>
    );
}
