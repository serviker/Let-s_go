import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import '../../../css/Auth.css';
import React from "react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="card">
                <Link href="/" className="btn btn-link text-decoration-none" style={{ color: '#6c757d'}}>
                    &larr; Back
                </Link>
                <div className="card-header text-center">
                    <h1>Login</h1>

                </div>
                <div className="card-body">
                    {status && <div className="mb-4 text-success">{status}</div>}

                    <form onSubmit={submit}>
                        <div className="mb-3">
                            <InputLabel htmlFor="email" value="Email" style={{ color: '#eea236' }} />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="form-control"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="input-error" />
                        </div>

                        <div className="mb-3">
                            <InputLabel htmlFor="password" value="Password" style={{ color: '#eea236' }} />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="form-control"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="input-error" />
                        </div>

                        <div className="form-check mb-3">
                            <label className="form-check-label">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span className="ms-2" style={{ color: '#eea236' }}>Remember me</span>
                            </label>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-decoration-none"
                                    style={{ color: '#eea236' }}
                                >
                                    Forgot your password?
                                </Link>
                            )}
                            <Link href="/register" className="text-decoration-none" style={{ color: '#6c757d', fontSize: '20px'}}>Register</Link>

                            <PrimaryButton className="ms-2 btn-primary" disabled={processing}>
                                Log in
                            </PrimaryButton>
                        </div>

                        <div className="d-flex justify-content-end">

                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
