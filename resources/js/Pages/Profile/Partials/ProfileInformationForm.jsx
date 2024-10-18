import { formatDistanceToNow } from 'date-fns';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
// import '../../../../css/ProfileInformationForm.css';

export default function ProfileInformationForm({ mustVerifyEmail, status, className = '' }) {
    const { auth } = usePage().props;

    const user = auth.user || {};
    const cars = Array.isArray(auth.cars) ? auth.cars : [];

    // console.log('User Data:', user);
    // console.log('Car Information:', cars); // Убедитесь, что это массив и что он содержит данные*/

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        photoUrl: user.photoUrl,
        registrationDate: user.registrationDate || user.created_at,
    });

    useEffect(() => {
        setData({
            name: user.name || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || '',
            photoUrl: null,
            registrationDate: user.registrationDate || user.created_at,
        });
    }, [user]);

    const [photoPreview, setPhotoPreview] = useState(user.photoUrl ? `/${user.photoUrl}` : null);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await fetch(`/profile/${auth.user.id}/options`); // Путь к вашему маршруту

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Fetched options:', data); // Логируем полученные данные
                setOptions(data.options);
            } catch (error) {
                console.error('Error fetching options:', error);
            }
        };

        fetchOptions();
    }, [auth.user.id]);
    console.log('options:', options); // Добавьте эту строку для отладки
    const formatRegistrationDate = (date) => {
        return formatDistanceToNow(new Date(date), { addSuffix: true });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-center text-gray-900"></h2>
            </header>

            <div className="flex items-center mt-4">
                {photoPreview ? (
                    <img
                        src={photoPreview}
                        alt="User Avatar"
                        className="bg-gray-300 rounded-lg mr-4"
                        style={{
                            marginLeft: '40%',
                            width: '100px',
                            height: '100px',
                            borderRadius: '16px'
                        }}
                    />
                ) : (
                    <img src="/images/user_icon.svg" alt="User" style={{
                        marginLeft: '100px',
                        width: '100px',
                        height: '100px',
                        borderRadius: '16px'
                    }}/>
                )}
                {/*<span style={{marginLeft: '50px'}} className="text-xl font-medium text-gray-900">*/}
                {/*    <b>{user.name} {user.lastName}</b>*/}
                {/*</span>*/}
            </div>


            <form style={{width: '600px'}}>

                <div className="items-container" style={{
                    display: 'flex',
                    alignItems: 'center',
                    alignContent: 'center',
                    justifyContent: 'space-between',
                    marginTop: '50px'
                }}>
                    <div className="items-labal" style={{fontSize: '20px', fontWeight: 'bold'}}>Имя</div>
                    <div className="item-name" style={{fontSize: '20px', fontWeight: 'bold'}}>{data.name}</div>
                </div>

                <div className="separator" style={{
                    borderTop: '1px solid #ccc'
                }}></div>


                <div className="items-container" style={{
                    display: 'flex',
                    alignItems: 'center',
                    alignContent: 'center',
                    justifyContent: 'space-between',
                    marginTop: '20px'
                }}>
                    <div className="items-labal" style={{fontSize: '20px', fontWeight: 'bold'}}>Фамилия</div>
                    <div className="item-name" style={{fontSize: '20px', fontWeight: 'bold'}}>{data.lastName}</div>
                </div>
                <div className="separator" style={{
                    borderTop: '1px solid #ccc'
                }}></div>

                <div className="items-container" style={{
                    display: 'flex',
                    alignItems: 'center',
                    alignContent: 'center',
                    justifyContent: 'space-between',
                    marginTop: '20px'
                }}>
                    <div className="items-labal" style={{fontSize: '20px', fontWeight: 'bold'}}>Email</div>
                    <div className="item-name" style={{fontSize: '20px', fontWeight: 'bold'}}>{data.email}</div>
                </div>
                <div className="separator" style={{
                    borderTop: '1px solid #ccc'
                }}></div>

                <div className="items-container" style={{
                    display: 'flex',
                    alignItems: 'center',
                    alignContent: 'center',
                    justifyContent: 'space-between',
                    marginTop: '20px'
                }}>
                    <div className="items-labal" style={{fontSize: '20px', fontWeight: 'bold'}}>Телефон</div>
                    <div className="item-name" style={{fontSize: '20px', fontWeight: 'bold'}}>{data.phone}</div>
                </div>
                <div className="separator" style={{
                    borderTop: '1px solid #ccc'
                }}></div>

                <div className="items-container" style={{
                    display: 'flex',
                    alignItems: 'center',
                    alignContent: 'center',
                    justifyContent: 'space-between',
                    marginTop: '20px',

                }}>
                    <div className="items-labal" style={{fontSize: '20px', fontWeight: 'bold'}}>Зарегистрирован</div>
                    <div className="item-name" style={{
                        fontWeight: 'bold',
                    }}>{formatRegistrationDate(data.registrationDate)}</div>
                </div>
                <div className="separator" style={{
                    borderTop: '1px solid #ccc',
                    marginBottom: '10px'
                }}></div>
                <div style={{textAlign: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#eea236'
                }}>
                    <div id="lastName"
                         className="label-profile">{user.name} предпочитает в поездке
                    </div>
                </div>
                {options.length > 0 ? (
                    <ul className="options-list" style={{
                        listStyleType: 'none', /* Убираем стандартные маркеры списка */
                        padding: 0, /* Убираем отступы */
                        margin: 0, /* Убираем внешние отступы */
                    }}>
                        {options.map((option) => (
                            <li key={option.id} className="option-item" style={{
                                fontSize: '20px',
                                display: 'flex', /* Используем Flexbox для выравнивания */
                                justifyContent: 'space-between', /* Распределяем пространство между элементами */
                                padding: '8px 0', /* Добавляем вертикальные отступы между элементами */
                                borderBottom: '1px solid #eaeaea', /* Добавляем разделитель между опциями (по желанию) */
                            }}>
                                <span className="option-name" style={{fontWeight: 'bold', color: '#676767'}}>{option.option.name}</span>:
                                <span className="option-description" style={{
                                    marginLeft: 'auto', /* Сдвигаем описание вправо */
                                    fontWeight: 'bolder',
                                }}>{option.description}</span>

                            </li>

                        ))}
                    </ul>
                ) : (
                    <div>
                        <p style={{
                            textAlign: 'center',
                            fontSize: '20px',
                            fontWeight: 'bold'
                        }}>Пользователь пока не выбрал свои предпочтения в поездке.</p>
                        <div className="separator-thin"></div>
                    </div>
                )}

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800">
                            Ваш адрес электронной почты не верифицирован.
                            <a href={route('verification.send')} method="post" as="button"
                               className="text-blue-600 hover:text-blue-800">
                                Нажмите здесь, чтобы повторно отправить письмо для подтверждения.
                            </a>
                        </p>
                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-green-600">На ваш адрес электронной почты было отправлено новое
                                письмо для подтверждения.</div>
                        )}
                    </div>
                )}


            </form>

            <div className="mt-6 border-t border-gray-300"></div>


            <div className="mt-6">

                {cars.length > 0 ? (

                    cars.map((car) => (
                        <div className="flex items-center mt-4" key={car.id}
                             style={{display: 'flex', justifyContent: 'space-between'}}>


                            {/*<h2 className="text-lg font-medium text-center text-gray-900">Ваше авто</h2>*/}
                            {car.photoUrl ? (

                                <img
                                    src={`/${car.photoUrl}`}
                                    alt="Car"
                                    style={{width: '100px', height: '80px', borderRadius: '16%'}}
                                    className="mr-2"
                                />
                            ) : (
                                <img
                                    src="/imagesCar/icon-car.png"
                                    alt="car"
                                    style={{
                                        marginLeft: '20px',
                                        marginRight: '50px',
                                        color: "gray",
                                        width: '100px',
                                        height: '100px'
                                    }}
                                />
                            )}
                            <span
                                style={{
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    textAlign: 'end',
                                    marginTop: '20px'
                                }}>
                    {car.brand} {car.model} {car.color}
                </span>
                        </div>
                    ))
                ) : (
                    <div className="text-center">
                        <p></p>
                    </div>

                )}
                <div className="separator" style={{
                    margin: '20px 0',
                    borderTop: '4px solid #ccc'
                }}></div>
                <div className="flex items-center justify-between gap-4">
                    {recentlySuccessful && <span className="text-green-600">Сохранено.</span>}
                    <a href={route('dashboard')} className="btn btn-info ml-auto">
                        На главную
                    </a>
                </div>

            </div>

        </section>
    );
}
