import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

import '../../../css/Auth.css';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        lastName: '',
        email: '',
        phone: '',
        photoUrl: null,
        password: '',
        password_confirmation: '',
    });
    const [fileName, setFileName] = useState('');
    const submit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('lastName', data.lastName);
        formData.append('email', data.email);
        formData.append('phone', data.phone);
        formData.append('photoUrl', data.photoUrl);
        formData.append('password', data.password);
        formData.append('password_confirmation', data.password_confirmation);

        post(route('register'), {
            data: formData,
            forceFormData: true,
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    // Проверка, есть ли ошибки в обязательных полях
    const isDisabled = processing ||
        errors.name ||
        errors.lastName ||
        errors.email ||
        errors.password ||
        errors.password_confirmation;

    return (
        <GuestLayout>
            <Head title="Register" />
            <div className="card">
                <Link href="/" className="btn btn-link text-decoration-none" style={{color: '#eea236', fontWeight: 'bold', fontSize: '20px'}}>&larr; Назад</Link>
                <div className="card-header text-center">
                    <img
                        src="/images/logo_4.png"
                        alt="Описание изображения"
                        style={{
                            display: 'block',
                            margin: '0 auto',
                            width: '200px',
                            height: 'auto'
                        }}
                    />
                    <h1>Регистрация</h1>
                </div>
                <div className="card-body">
                    <form onSubmit={submit}>
                        {/* Поле имени */}
                        <div className="mb-3">
                            <InputLabel htmlFor="name" value="Имя" style={{color: '#eea236'}}/>
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                autoComplete="given-name"
                                isFocused
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="input-error"/>
                        </div>

                        {/* Поле фамилии */}
                        <div className="mb-3">
                            <InputLabel htmlFor="lastName" value="Фамилия" style={{color: '#eea236'}}/>
                            <TextInput
                                id="lastName"
                                name="lastName"
                                value={data.lastName}
                                className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                autoComplete="family-name"
                                onChange={(e) => setData('lastName', e.target.value)}
                                required
                            />
                            <InputError message={errors.lastName} className="input-error"/>
                        </div>

                        {/* Поле email */}
                        <div className="mb-3">
                            <InputLabel htmlFor="email" value="Email" style={{color: '#eea236'}}/>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                autoComplete="email"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} className="input-error"/>
                        </div>

                        {/* Поле телефона */}
                        <div className="mb-3">
                            <InputLabel htmlFor="phone" value="Телефон" style={{color: '#eea236'}}/>
                            <TextInput
                                id="phone"
                                type="tel"
                                name="phone"
                                value={data.phone}
                                className="form-control"
                                onChange={(e) => setData('phone', e.target.value)}
                            />
                            <InputError message={errors.phone} className="input-error"/>
                        </div>

                        {/* Поле фото */}
                        <div className="mb-3">
                            <InputLabel htmlFor="photoUrl" value="Фото" style={{color: '#eea236'}}/>
                            <div style={{
                                display: 'inline-block',
                                width: '100%',
                                height: '50px',
                                padding: '20px',
                                border: '1px solid #eea236',
                                borderRadius: '8px',
                                position: 'relative',
                                cursor: 'pointer',
                                textAlign: 'center',
                            }}>
                                <input
                                    id="photoUrl"
                                    type="file"
                                    accept="image/*"
                                    name="photoUrl"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        setData('photoUrl', file);
                                        setFileName(file ? file.name : ''); // Установка имени файла
                                    }}
                                    className="form-control"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        position: 'absolute',
                                        opacity: '0',
                                        cursor: 'pointer',
                                        left: '0',
                                        top: '0'
                                    }}
                                />
                                <p style={{marginTop: '-10px', color: '#333'}}>{fileName || 'Выберите файл'}</p>
                            </div>
                            <InputError message={errors.photoUrl} className="input-error"/>
                        </div>

                        {/* Поле пароля */}
                        <div className="mb-3">
                            <InputLabel htmlFor="password" value="Пароль" style={{color: '#eea236'}}/>
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <InputError message={errors.password} className="input-error"/>
                        </div>

                        {/* Поле подтверждения пароля */}
                        <div className="mb-3">
                            <InputLabel htmlFor="password_confirmation" value="Подтвердить пароль"
                                        style={{color: '#eea236'}}/>
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            <InputError message={errors.password_confirmation} className="input-error"/>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <Link href={route('login')} className="text-decoration-none" style={{color: '#eea236'}}>
                                Уже зарегистрированы?
                            </Link>
                            <PrimaryButton className="ms-2 btn-primary" disabled={isDisabled}>
                                Зарегистрироваться
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}


