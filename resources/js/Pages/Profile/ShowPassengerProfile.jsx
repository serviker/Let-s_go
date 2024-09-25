import { formatDistanceToNow } from 'date-fns';
import {Link, usePage} from '@inertiajs/react';
import React from 'react';
import '../../../css/ProfilePassenger.css';

export default function ShowPassengerProfile({ user, order, cars }) {
    const { auth } = usePage().props;
    //console.log('Auth Data:', auth); // Добавьте эту строку для отладки
    // const user = auth.user || {};
    //  const cars = Array.isArray(user.cars) ? user.cars : [];
    const formatRegistrationDate = (date) => {
        return formatDistanceToNow(new Date(date), { addSuffix: true });
    };

    return (
        <section>
            {/*<header>*/}
            {/*    <h2 className="text-lg font-medium text-center text-gray-900">User Profile</h2>*/}
            {/*</header>*/}
            <div className="order-details-container bg-white p-6 rounded-lg shadow-lg">

                <div className="user-photo">
                    {user.photoUrl ? (
                        <img
                            src={`/${user.photoUrl}`}
                            alt="User Avatar"
                            className="user-avatar"
                        />
                    ) : (
                        <img
                            src="/images/user_icon.svg"
                            alt="User"
                            className="user-no-avatar"
                        />
                    )}
                    <span className="user-name">
                        <h2><b>{user.name}</b></h2>
                    </span>
                </div>
                <div className="separator"></div>
                <div className="mt-6 space-y-6">
                    <div>
                        <div>
                            <label className="label-profile">Профиль -
                                подтвержден</label>
                        </div>
                        <div>
                            <label className="label-profile-email">Эл.адрес - подтвержден</label>
                        </div>
                        <div>
                            <label className="label-profile-email">Номер телефона -
                                подтвержден</label>
                        </div>
                    </div>

                    <div className="separator"></div>

                    <div>
                        <div id="lastName"
                             className="label-profile">{user.name} о себе
                        </div>
                    </div>
                    <div>
                        <label className="label-profile-email">Не прочь поболтать, когда мне
                            комфортно</label>
                    </div>
                    <div>
                        <label className="label-profile-email">Люблю спакойную музыку</label>
                    </div>
                    <div>
                        <label className="label-profile-email">Не люблю когда машине не курят</label>
                    </div>
                    {/*<div>*/}
                    {/*    <label className="label-profile-email">Предпочитаю поездки без питомцев</label>*/}
                    {/*</div>*/}

                </div>

                <div className="separator-thin"></div>

                {/*<h2 className="text-lg font-medium text-center text-gray-900">Автомобили</h2>*/}

                {/*<div className="mt-6">*/}
                {/*    {cars.length > 0 ? (*/}
                {/*        cars.map((car) => (*/}
                {/*            <div className="car-info" key={car.id}>*/}


                {/*                <span style={{marginRight: car.photoUrl ? '50px' : '0', fontSize: '22px'}}>*/}
                {/*                    {car.brand} {car.model}*/}

                {/*                </span>*/}
                {/*                {car.photoUrl ? (*/}
                {/*                    <img*/}
                {/*                        src={`/${car.photoUrl}`}*/}
                {/*                        alt="Car"*/}
                {/*                        style={{width: '100px', height: '80px', borderRadius: '16%'}}*/}
                {/*                        className="mr-2"*/}
                {/*                    />*/}
                {/*                ) : (*/}
                {/*                    <div className="flex items-center">*/}
                {/*                        <span style={{fontSize: '18px', marginRight: '20px'}}>Цвет: {car.color}</span>*/}
                {/*                        <img*/}
                {/*                            src="/imagesCar/icon-car.png"*/}
                {/*                            alt="Car"*/}
                {/*                            style={{width: '100px', height: '100px', marginRight: '10px'}}*/}
                {/*                        />*/}

                {/*                    </div>*/}
                {/*                )}*/}

                {/*            </div>*/}
                {/*        ))*/}
                {/*    ) : (*/}
                {/*        <h5 className="text-lg font-medium text-center text-gray-900">Нет автомобиля</h5>*/}
                {/*    )}*/}
                {/*</div>*/}
                {/*<div className="separator-thin"></div>*/}

                <div className="car-info">
                    <label htmlFor="registrationDate" className="label-profile">Зарегистрирован(а)</label>
                    <div id="registrationDate" className="label-profile">
                        {formatRegistrationDate(user.registrationDate || user.created_at)}
                    </div>
                </div>

                <div className="separator-thin"></div>

                <button className="btn btn-info" onClick={() => window.history.back()}>Назад</button>

            </div>
        </section>
    );
}
