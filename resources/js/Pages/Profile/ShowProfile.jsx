import { formatDistanceToNow } from 'date-fns';
import {Link, usePage} from '@inertiajs/react';
import React from 'react';
import '../../../css/Profile.css';

export default function ShowProfile({ user, order, cars }) {
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
                            style={{width: '150px', height: '150px', borderRadius: '16px', alignItems: 'center'}}
                        />
                    ) : (
                        <img
                            src="/images/user_icon.svg"
                            alt="User"
                            style={{width: '100px', height: '100px', borderRadius: '16px'}}
                        />
                    )}
                    <span style={{marginLeft: '50px'}} className="user-name">
                        <h2><b>{user.name}</b></h2>
                    </span>
                </div>
                <div className="separator"></div>
                <div className="mt-6 space-y-6">
                    <div>
                        {/*<label htmlFor="name" className="block text-sm font-medium text-gray-700">Профиль Подтвержден</label>
                        <div id="name" style={{ fontSize:'18px', fontWeight:'bold', color: '#eea236'}}>{user.name} -
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700"> Профиль
                                Подтвержден</label>
                        </div>*/}
                        <div>
                            <label style={{fontSize: '18px', fontWeight: 'bold', color: '#eea236'}}>Профиль -
                                подтвержден</label>
                        </div>
                        <div>
                            <label style={{fontSize: '18px', fontWeight: 'normal'}}>Эл.адрес - подтвержден</label>
                        </div>
                        <div>
                            <label style={{fontSize: '18px', fontWeight: 'normal'}}>Номер телефона -
                                подтвержден</label>
                        </div>
                    </div>

                    <div className="separator"></div>

                    <div>
                        <div id="lastName"
                             style={{fontSize: '18px', fontWeight: 'bold', color: '#eea236'}}>{user.name} о себе
                        </div>
                    </div>
                    <div>
                        <label style={{fontSize: '18px', fontWeight: 'normal'}}>Не прочь поболтать, когда мне
                            комфортно</label>
                    </div>
                    <div>
                        <label style={{fontSize: '18px', fontWeight: 'normal'}}>Music Включайте, и погромче!</label>
                    </div>
                    <div>
                        <label style={{fontSize: '18px', fontWeight: 'normal'}}>В моей машине не курят</label>
                    </div>
                    <div>
                        <label style={{fontSize: '18px', fontWeight: 'normal'}}>Предпочитаю поездки без питомцев</label>
                    </div>

                    {/*<div>*/}
                    {/*    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>*/}
                    {/*    <div id="email" className="mt-1 text-sm text-gray-900">{user.email}</div>*/}
                    {/*</div>*/}

                    {/*<div>*/}
                    {/*    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Телефон</label>*/}
                    {/*    <div id="phone" className="mt-1 text-sm text-gray-900">{user.phone}</div>*/}
                    {/*</div>*/}

                </div>

                <div className="separator-thin"></div>

                {/*<h2 className="text-lg font-medium text-center text-gray-900">Автомобили</h2>*/}

                <div className="mt-6">
                    {cars.length > 0 ? (
                        cars.map((car) => (
                            <div className="car-info" key={car.id}>


                                <span style={{marginRight: car.photoUrl ? '50px' : '0', fontSize: '22px'}}>
                                    {car.brand} {car.model}

                                </span>
                                {car.photoUrl ? (
                                    <img
                                        src={`/${car.photoUrl}`}
                                        alt="Car"
                                        style={{width: '100px', height: '80px', borderRadius: '16%'}}
                                        className="mr-2"
                                    />
                                ) : (
                                    <div className="flex items-center">
                                        <span style={{fontSize: '18px', marginRight: '20px'}}>Цвет: {car.color}</span>
                                        <img
                                            src="/imagesCar/icon-car.png"
                                            alt="Car"
                                            style={{width: '100px', height: '100px', marginRight: '10px'}}
                                        />

                                    </div>
                                )}

                            </div>
                        ))
                    ) : (
                        <h5 className="text-lg font-medium text-center text-gray-900">Нет автомобиля</h5>
                    )}
                </div>
                <div className="separator-thin"></div>

                <div className="car-info" style={{marginTop: '15px', marginBottom: '10px'}}>
                <label htmlFor="registrationDate"
                       style={{fontSize: '18px', fontWeight: 'bold', color: '#eea236'}}>Зарегистрирован</label>
                    <div id="registrationDate" className="mt-1 text-sm text-gray-900">
                        {formatRegistrationDate(user.registrationDate || user.created_at)}
                    </div>
                </div>

                <div className="separator-thin"></div>

                <button className="btn btn-info" onClick={() => window.history.back()}>Назад</button>

            </div>
        </section>
    );
}
