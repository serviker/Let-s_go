import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
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

    return (
        <GuestLayout>
            <Head title="Register" />
            <div className="card">
                <Link href="/" className="btn btn-link text-decoration-none" style={{ color: '#6c757d'}}>
                    &larr; Back
                </Link>
                <div className="card-header text-center">
                    <h1>Register</h1>
                </div>
                <div className="card-body">
                    <form onSubmit={submit}>
                        <div className="mb-3">
                            <InputLabel htmlFor="name" value="First Name" style={{ color: '#eea236' }} />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="form-control"
                                autoComplete="given-name"
                                isFocused
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="input-error" />
                        </div>

                        <div className="mb-3">
                            <InputLabel htmlFor="lastName" value="Last Name" style={{ color: '#eea236' }} />
                            <TextInput
                                id="lastName"
                                name="lastName"
                                value={data.lastName}
                                className="form-control"
                                autoComplete="family-name"
                                onChange={(e) => setData('lastName', e.target.value)}
                                required
                            />
                            <InputError message={errors.lastName} className="input-error" />
                        </div>

                        <div className="mb-3">
                            <InputLabel htmlFor="email" value="Email" style={{ color: '#eea236' }} />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="form-control"
                                autoComplete="email"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} className="input-error" />
                        </div>

                        <div className="mb-3">
                            <InputLabel htmlFor="phone" value="Phone" style={{ color: '#eea236' }} />
                            <TextInput
                                id="phone"
                                type="tel"
                                name="phone"
                                value={data.phone}
                                className="form-control"
                                onChange={(e) => setData('phone', e.target.value)}
                            />
                            <InputError message={errors.phone} className="input-error" />
                        </div>

                        <div className="mb-3">
                            <InputLabel htmlFor="photoUrl" value="Photo" style={{ color: '#eea236' }} />
                            <input
                                id="photoUrl"
                                type="file"
                                name="photoUrl"
                                onChange={(e) => setData('photoUrl', e.target.files[0])}
                                className="form-control"
                            />
                            <InputError message={errors.photoUrl} className="input-error" />
                        </div>

                        <div className="mb-3">
                            <InputLabel htmlFor="password" value="Password" style={{ color: '#eea236' }} />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="form-control"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <InputError message={errors.password} className="input-error" />
                        </div>

                        <div className="mb-3">
                            <InputLabel htmlFor="password_confirmation" value="Confirm Password" style={{ color: '#eea236' }} />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="form-control"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            <InputError message={errors.password_confirmation} className="input-error" />
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <Link href={route('login')} className="text-decoration-none" style={{ color: '#eea236' }}>
                                Already registered?
                            </Link>
                            <PrimaryButton className="ms-2 btn-primary" disabled={processing}>
                                Register
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
