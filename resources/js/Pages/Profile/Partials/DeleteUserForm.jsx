import React, { useRef, useState } from 'react';
import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import {Link, useForm} from '@inertiajs/react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const { data, setData, delete: destroy, processing, reset, errors } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => setConfirmingUserDeletion(true);

    const deleteUser = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Удаление аккаунта</h2>
                <p className="mt-1 text-sm text-gray-600">
                    При удалении аккаунта все данные будут удалены.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion} className="btn btn-danger">Удалить аккаунт</DangerButton>
            <Link href={route('dashboard')} className="btn btn-secondary" style={{marginLeft: '200px'}}>
                На главную
            </Link>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
                        <form onSubmit={deleteUser} className="p-6">
                            <h2 className="text-lg font-medium text-gray-900">Вы уверены, что хотите<br />удалить свою учетную запись?</h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Введите пароль, чтобы подтвердить, что вы хотите удалить аккаунт.
                            </p>

                            <div className="mt-6">
                                <InputLabel htmlFor="password" value="Password" className="sr-only" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="form-control"
                                    isFocused
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} className="mt-2 text-red-500" />
                            </div>

                            <div className="flex justify-end mt-4 space-x-2">
                                <SecondaryButton onClick={closeModal} className="btn btn-secondary">
                                    Отмена
                                </SecondaryButton>
                                <DangerButton className="btn btn-danger" style={{marginLeft: '200px'}} disabled={processing}>
                                    Удалить аккаунт
                                </DangerButton>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
        </section>
    );
}
