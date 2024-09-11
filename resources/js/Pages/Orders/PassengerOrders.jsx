import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from '@inertiajs/inertia-react';
import PassengerOrdersIndex from "@/Pages/Orders/PassengerOrdersIndex.jsx";
import Modal from "@/Components/Modal.jsx";
import { Inertia } from "@inertiajs/inertia";

export default function PassengerOrders({ orders }) {

    return (
        <div className="driver-orders-container" style={{ marginTop: '80px', width: '160%'}}>
            {orders.map(order => (
                <PassengerOrdersIndex key={order.id} order={order} />
            ))}

            {/*<div className="d-flex justify-content-end mt-4">*/}
            {/*    <Link href={route('dashboard')} className="btn btn-info">*/}
            {/*        Назад*/}
            {/*    </Link>*/}
            {/*</div>*/}
        </div>

    );
}

PassengerOrders.propTypes = {
    orders: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        fromCity: PropTypes.string.isRequired,
        toCity: PropTypes.string.isRequired,
        price: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]).isRequired,
        driverName: PropTypes.string,
        carName: PropTypes.string,
        dateTimeDeparture: PropTypes.string.isRequired,
        driverPhotoUrl: PropTypes.string,
    })).isRequired,
};
/* const [showModal, setShowModal] = useState(!Array.isArray(orders) || orders.length === 0);

   useEffect(() => {
       setShowModal(!Array.isArray(orders) || orders.length === 0);
   }, [orders]);

   const closeModal = () => {
       setShowModal(false);
       Inertia.visit(route('home'), {
           preserveState: true, // Сохранение состояния текущей страницы
           replace: true, // Заменить текущую запись в истории
       });
   };

   if (showModal) {
       return (
           <Modal show={showModal} onClose={closeModal}>
               <div className="modal-content" style={{ width: '25%', border: '4px solid #eea236', borderRadius: '10px',
                   position: 'fixed', top: '30%',   // Смещение на 30% сверху
                   left: '50%',    // Горизонтальное центрирование
                   transform: 'translateX(-50%)'   // Центрирование элемента по горизонтали
               }}>
                   <h2 style={{ textAlign: 'center'}} className="modal-body">
                       Нет поездок, соответствующих вашему запросу.
                   </h2>
                   <div style={{display: 'flex', justifyContent: 'center', margin: '10px'}}>
                       <button onClick={closeModal} className="btn btn-secondary">Вернуться назад</button>
                   </div>
               </div>
           </Modal>
       );
   }*/
