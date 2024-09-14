import React, { useState } from 'react';
import '../Messege.css';
import {Inertia} from "@inertiajs/inertia";
import PropTypes from 'prop-types';

const MessageComponent = ({ order, passenger, messages }) => {
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            Inertia.post('/orders/${order.id}/messages', {
                sender_id: order.driverId, // or use passenger.id if passenger is the sender
                recipient_id: passenger.id,
                messages_text: newMessage
            });
            setNewMessage(''); // Clear the input after sending
        }
    };

    return (
        <div className="message-container">
            <div className="message-list">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`message-bubble ${message.sender_id === order.driverId ? 'driver' : 'passenger'}`}
                    >
                        {message.messages_text}
                    </div>
                ))}
            </div>

            <div className="message-input-container">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Введите сообщение..."
                    className="message-input"
                />
                <button onClick={handleSendMessage} className="send-button">
                    Отправить
                </button>
            </div>
        </div>
    );
};

MessageComponent.propTypes = {
    order: PropTypes.object.isRequired,
    passenger: PropTypes.object.isRequired,
    messages: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default MessageComponent;

