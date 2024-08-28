import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import DeleteUserForm from './Partials/DeleteUserForm';

// export default function Edit({ auth, mustVerifyEmail, status }) {
//     return (
//         <AuthenticatedLayout
//             user={auth.user}
//             header={
//                 <div className="text-center">
//                     <h2 className="text-xl font-weight-bold text-dark">Profile</h2>
//                 </div>
//             }
//         >
//             <Head title="Profile" />
//
//             <div className="py-4">
//                 <div className="container">
//                     <div className="mb-4 p-3 bg-light shadow rounded">
//                         <UpdateProfileInformationForm
//                             mustVerifyEmail={mustVerifyEmail}
//                             status={status}
//                             className="max-w-xl"
//                         />
//                     </div>
//
//                     <div className="mb-4 p-3 bg-light shadow rounded">
//                         <UpdatePasswordForm className="max-w-xl" />
//                     </div>
//
//                     <div className="mb-4 p-3 bg-light shadow rounded">
//                         <DeleteUserForm className="max-w-xl" />
//                     </div>
//                 </div>
//             </div>
//         </AuthenticatedLayout>
//     );
// }

import React from 'react';
import ProfileRoutes from './ProfileRoutes';

export default function Edit({ auth, mustVerifyEmail, status }) {
    return <ProfileRoutes auth={auth} mustVerifyEmail={mustVerifyEmail} status={status} />;
}
