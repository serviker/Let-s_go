// resources/js/Pages/Order/ShowOrder.jsx
import React from 'react';
import {Link, usePage} from '@inertiajs/react';
import OrderIndex from './OrderIndex';
import '../../../css/OrderIndex.css';
import SecondaryButton from "@/Components/SecondaryButton.jsx";

export default function ShowOrder() {

   const { order } = usePage().props;
   // Убедитесь, что order не является строкой и содержит необходимые данные
   if (typeof order === 'string' || !order) {
       // Проверка данных
       console.log('Orders: ', typeof order);
       return <div>Error: Order data is missing or incorrect</div>;
   }

   return (
       <div className="container mx-auto p-4">
           <OrderIndex order={order}/>

           <div className="flex justify-end mt-4">
               <Link
                   href={route('home')}
                   className="btn btn-info"
               >
                   На главную
               </Link>
           </div>
       </div>
   );
}

