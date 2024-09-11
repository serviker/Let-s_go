import { formatDistanceToNow } from 'date-fns';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';

export default function UpdateProfileInformationForm({ mustVerifyEmail, status, className = '' }) {
    const { auth } = usePage().props;
    //console.log('Auth Data:', auth); // Добавьте эту строку для отладки
    const user = auth.user || {};
    const cars = Array.isArray(auth.cars) ? auth.cars : [];
    // Замените это на статические данные для отладки
    /*const cars = [
         { id: 1, photoUrl: 'imagesCar/Camry.png', brand: 'Toyota', model: 'Corolla', color: 'White' },
          { id: 2, photoUrl: 'imagesCar/mbvb.png', brand: 'Honda', model: 'Civic', color: 'White'  }
    ];

    console.log('User Data:', user);
    console.log('Car Information:', cars); // Убедитесь, что это массив и что он содержит данные*/

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        photo: null,
        registrationDate: user.registrationDate || user.created_at,
    });

    const [photoPreview, setPhotoPreview] = useState(user.photoUrl ? `/${user.photoUrl}` : null);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('photo', file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        const baseUrl = window.location.origin;
        const fullPhotoUrl = user.photoUrl ? `${baseUrl}/${user.photoUrl}` : null;
        setPhotoPreview(fullPhotoUrl);
    }, [user.photoUrl]);

    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('lastName', data.lastName);
        formData.append('email', data.email);
        formData.append('phone', data.phone);
        if (data.photo) {
            formData.append('photo', data.photo);
        }

        patch(route('profile.update'), {
            data: formData,
            forceFormData: true,
        }).then(() => {
            console.log('Profile updated successfully.');
        }).catch((error) => {
            console.error('Error updating profile:', error);
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
                            marginLeft: '100px',
                            width: '100px',
                            height: '100px',
                            borderRadius: '16px'
                        }}
                    />
                ) : (
                    <img src="/images/user_icon.svg" alt="User" style={{marginLeft: '100px',
                        width: '100px',
                        height: '100px',
                        borderRadius: '16px'}} />
                )}
                <span style={{marginLeft: '50px'}} className="text-xl font-medium text-gray-900">
                    <b>{user.name} {user.lastName}</b>
                </span>
            </div>


            <form onSubmit={submit} className="mt-6 space-y-6">

                <div>
                    <InputLabel htmlFor="name" value="Имя"/>
                    <TextInput
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        className="form-control w-100"
                    />
                    <InputError message={errors.name} className="mt-2 text-red-500"/>
                </div>

                <div>
                    <InputLabel htmlFor="lastName" value="Фамилия"/>
                    <TextInput
                        id="lastName"
                        value={data.lastName}
                        onChange={(e) => setData('lastName', e.target.value)}
                        required
                        className="form-control w-100"
                    />
                    <InputError message={errors.lastName} className="mt-2 text-red-500"/>
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email"/>
                    <TextInput
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        className="form-control w-100"
                    />
                    <InputError message={errors.email} className="mt-2 text-red-500"/>
                </div>

                <div>
                    <InputLabel htmlFor="phone" value="Телефон"/>
                    <TextInput
                        id="phone"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        className="form-control w-100"
                    />
                    <InputError message={errors.phone} className="mt-2 text-red-500"/>
                </div>
                <div className="flex items-center">
                    <InputLabel htmlFor="registrationDate" value="Зарегистрирован" className="mr-4"/>
                    <div className="flex-1">
                        {formatRegistrationDate(data.registrationDate)}
                    </div>
                </div>
                <div>
                    <InputLabel htmlFor="photo" value="Фото"/>
                    <input
                        id="photo"
                        type="file"
                        name="photo"
                        onChange={handlePhotoChange}
                        className="form-control w-100"
                    />
                    <InputError message={errors.photo} className="mt-2 text-red-500"/>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800">
                            Your email address is unverified.
                            <Link href={route('verification.send')} method="post" as="button"
                                  className="text-blue-600 hover:text-blue-800">
                                Click here to re-send the verification email.
                            </Link>
                        </p>
                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-green-600">A new verification link has been sent to your email
                                address.</div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing} className="btn btn-primary">Сохранить</PrimaryButton>
                    <Link href={route('dashboard')} className="btn btn-info" style={{marginLeft: '250px'}}>
                        На главную
                    </Link>

                    {recentlySuccessful && <span className="text-green-600 ml-3">Saved.</span>}
                </div>
            </form>

            <div className="mt-6 border-t border-gray-300"></div>

            <h2 className="text-lg font-medium text-center text-gray-900">Автомобили</h2>

            <div className="mt-6">
                {cars.length > 0 ? (
                    cars.map((car) => (
                        <div className="flex items-center mt-4" key={car.id}>
                            {car.photoUrl ? (
                                <img
                                    src={`/${car.photoUrl}`}
                                    alt="Car"
                                    style={{width: '100px', height: '80px', borderRadius: '16%'}}
                                    className="mr-2"
                                />
                            ) : <img src="/imagesCar/icon-car.png" alt="car" style={{marginLeft: '20px',
                                marginRight: '50px',
                                color: "gray",
                                width: '100px',
                                height: '100px'}} />
                            }
                            <span style={{marginLeft: car.photoUrl ? '50px' : '0', fontSize: '22px'}}>
                                {car.brand} {car.model}
                            </span>
                            <PrimaryButton
                                onClick={() => deleteCar(car.id)}
                                style={{marginLeft: '50px'}}
                                className="btn btn-danger"
                            >
                                Удалить
                            </PrimaryButton>
                        </div>
                    ))
                ) : (
                    <Link href={route('car.create')} className="btn btn-primary">
                        Add Car
                    </Link>
                )}
            </div>
        </section>
    );
}
