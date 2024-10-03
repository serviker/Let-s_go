import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import DeleteUserForm from './Partials/DeleteUserForm';
import { Head } from '@inertiajs/react';
import ProfileInformationForm from "@/Pages/Profile/Partials/ProfileInformationForm.jsx";

function Profile({ auth, mustVerifyEmail, status }) {
    return (
        <div className="mb-4 p-3 bg-light shadow rounded">
            <ProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} className="max-w-xl" />
        </div>
    );
}function ChangeProfile({ auth, mustVerifyEmail, status }) {
    return (
        <div className="mb-4 p-3 bg-light shadow rounded">
            <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} className="max-w-xl" />
        </div>
    );
}

function ChangePassword() {
    return (
        <div className="mb-4 p-3 bg-light shadow rounded">
            <UpdatePasswordForm className="max-w-xl" />
        </div>
    );
}

function DeleteAccount() {
    return (
        <div className="mb-4 p-3 bg-light shadow rounded">
            <DeleteUserForm className="max-w-xl" />
        </div>
    );
}

export default function ProfileRoutes({ auth, mustVerifyEmail, status }) {
    return (
        <Router>
            <AuthenticatedLayout
                user={auth.user}
                header={
                    <div className="text-center">
                        <h2 className="text-xl font-weight-bold text-dark">Профиль</h2>
                    </div>
                }
            >
                <Head title="Profile"/>
                <div className="py-4" style={{ marginTop: '100px'}}>
                    <div className="container">
                    <nav className="mb-4">
                        <ul className="flex space-x-4">
                            <li>
                                <Link to="/profile" style={{color: 'gray'}}>Профиль</Link>
                            </li>
                            <li>
                                <Link to="/profile/change-profile" style={{color: 'gray'}}>Изменить профиль</Link>
                            </li>
                            <li>
                                <Link to="/profile/change-password" style={{color: 'gray'}}>Изменить пароль</Link>
                            </li>
                            <li>
                                <Link to="/profile/delete-account" style={{color: 'gray'}}>Удалить аккаунт</Link>
                            </li>
                        </ul>
                    </nav>
                        <Routes>
                            <Route path="/profile" element={<Profile auth={auth} mustVerifyEmail={mustVerifyEmail} status={status} />} />
                            <Route path="/profile/change-profile" element={<ChangeProfile auth={auth} mustVerifyEmail={mustVerifyEmail} status={status} />} />
                            <Route path="/profile/change-password" element={<ChangePassword/>}/>
                            <Route path="/profile/delete-account" element={<DeleteAccount/>}/>
                        </Routes>
                    </div>
                </div>
            </AuthenticatedLayout>
        </Router>
    );
}
