import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';


export default function UpdatePasswordForm({ className = '' }) {
    const { data, setData, put, errors, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('password.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900" style={{ textAlign: 'center', fontWeight: 'bold'}}>Изменить пароль</h2>
                <p className="mt-1 text-sm text-gray-900" style={{fontSize: '20px', fontWeight: 'bold'}}>Используется уникальный пароль для обеспечения безопасности.</p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div style={{ textAlign: 'center'}}>
                    <InputLabel htmlFor="current_password" value="Текущий пароль" />
                    <TextInput
                        id="current_password"
                        type="password"
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        required
                        autoComplete="current-password"
                        className="form-control w-100"
                    />
                    <InputError message={errors.current_password} className="mt-2" />
                </div>

                <div style={{ textAlign: 'center'}}>
                    <InputLabel htmlFor="password" value="Новый пароль" />
                    <TextInput
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                        autoComplete="new-password"
                        className="form-control w-100"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div style={{ textAlign: 'center'}}>
                    <InputLabel htmlFor="password_confirmation" value="Подтверждение пароля" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                        autoComplete="new-password"
                        className="form-control w-100"
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex items-center justify-between mt-6" style={{ display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between'}}>
                        <PrimaryButton className="btn btn-primary" disabled={processing}>
                            Сохранить
                        </PrimaryButton>

                        {recentlySuccessful && <p className="text-sm text-green-600">Saved.</p>}
                        <Link  href="/profile" className="btn btn-info">
                            На главную
                        </Link>
                    </div>
            </form>
        </section>
    );
}
