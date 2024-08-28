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
                <h2 className="text-lg font-medium text-gray-900">Update Password</h2>
                <p className="mt-1 text-sm text-gray-600">Ensure your account is using a long, random password to stay secure.</p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="current_password" value="Current Password" />
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

                <div>
                    <InputLabel htmlFor="password" value="New Password" />
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

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
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

                <div className="flex items-center justify-between mt-6">
                        <PrimaryButton className="btn btn-primary" disabled={processing}>
                            Save
                        </PrimaryButton>

                        {recentlySuccessful && <p className="text-sm text-green-600">Saved.</p>}
                        <Link href={route('home')} className="btn btn-secondary">
                            Home
                        </Link>
                    </div>
            </form>
        </section>
    );
}
