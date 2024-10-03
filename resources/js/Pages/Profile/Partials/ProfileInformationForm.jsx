import { formatDistanceToNow } from 'date-fns';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';

export default function ProfileInformationForm({ mustVerifyEmail, status, className = '' }) {
    const { auth } = usePage().props;
    //console.log('Auth Data:', auth); // Добавьте эту строку для отладки
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

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('photoUrl', file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    /* useEffect(() => {
         const baseUrl = window.location.origin;
         const fullPhotoUrl = user.photoUrl ? `${baseUrl}/${user.photoUrl}` : null;
         setPhotoPreview(fullPhotoUrl);
     }, [user.photoUrl]);*/

    useEffect(() => {
        if (user.photoUrl) {
            const baseUrl = window.location.origin;
            setPhotoPreview(`${baseUrl}/${user.photoUrl}`);
        } else {
            setPhotoPreview(null);
        }
    }, [user.photoUrl]);


    const submit = (e) => {
        e.preventDefault();

        // Создаем объект данных
        const formData = new FormData();
        // Добавляем данные в FormData
        formData.append('name', data.name);
        formData.append('lastName', data.lastName);
        formData.append('email', data.email);
        formData.append('phone', data.phone);
        if (data.photoUrl) {
            formData.append('photoUrl', data.photoUrl); // Обработка загрузки фото
        }

        console.log('formData being sent:', formData); // Отладка

        patch(route('profile.update'), {
            data: formData,  // Используем обновленные данные
            preserveScroll: true,
            onSuccess: () => {
                // Обновляем данные страницы после успешного обновления профиля
                router.reload({ preserveScroll: true });
                console.log('Profile updated successfully.');
            },
            onError: (error) => {
                console.error('Error updating profile:', error);
            }
        });
    };

    const deleteCar = async (id) => {
        try {
            await router.delete(`/profile/delete-car/${id}`, {
                preserveState: true,
            });
            console.log('Car deleted successfully - UpdateProfileInformationForm.');
        } catch (error) {
            console.error('Error deleting car UpdateProfileInformationForm:', error);
        }
    };
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


            <form onSubmit={submit} style={{ width: '100%'}}>

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
                    margin: '10px 0',
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
                    margin: '10px 0',
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
                    margin: '10px 0',
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
                    margin: '10px 0',
                    borderTop: '1px solid #ccc'
                }}></div>

                <div className="items-container" style={{
                    display: 'flex',
                    alignItems: 'center',
                    alignContent: 'center',
                    justifyContent: 'space-between',
                    marginTop: '20px',
                    marginBottom: '20px'
                }}>
                    <div className="items-labal" style={{fontSize: '20px', fontWeight: 'bold'}}>Зарегистрирован</div>
                    <div className="item-name" style={{
                        fontSize: '20px',
                        fontWeight: 'bold'
                    }}>{formatRegistrationDate(data.registrationDate)}</div>
                </div>


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
                        <div className="flex items-center mt-4" key={car.id}>
                            <div className="separator" style={{
                                margin: '20px 0',
                                borderTop: '4px solid #ccc'
                            }}></div>
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
                                    marginLeft: car.photoUrl ? '230px' : '0',
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    textAlign: 'end'
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
