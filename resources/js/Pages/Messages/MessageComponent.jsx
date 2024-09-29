import React, {useEffect, useState} from 'react';
import '../../../css/Message.css';
import {Inertia} from "@inertiajs/inertia";
import PropTypes from 'prop-types';
import {Link} from "@inertiajs/react";

const MessageComponent = ({ order, passenger, driver, messages: initialMessages, currentUser }) => {
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState(initialMessages || []); // Объявляем состояние для списка сообщений

    // Проверка и обновление сообщений при изменении initialMessages
    useEffect(() => {
        setMessages(initialMessages);
    }, [initialMessages]);

    const handleSendMessage = async () => {
        if (!currentUser || !currentUser.id) {
            console.error("currentUser is undefined or missing an id");
            return;
        }

        if (newMessage.trim()) {
            try {
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

                // Определяем отправителя и получателя
                const senderId = currentUser.id;
                const recipientId = currentUser.id === driver.id ? passenger.id : driver.id;

                const response = await fetch(`/orders/${order.id}/messages`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': csrfToken,
                    },
                    body: JSON.stringify({
                        sender_id: senderId,
                        recipient_id: recipientId,
                        message_text: newMessage,
                        order_id: order.id,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setMessages(data.messages); // Обновляем список сообщений
                    setNewMessage(''); // Очищаем поле ввода
                } else {
                    console.error('Ошибка сервера:', response.statusText);
                }
            } catch (error) {
                console.error('Ошибка отправки сообщения:', error);
            }
        }
    };


    // Determine who is currently active (clicked) and should be shown at the top
    const activeUser = driver.id === passenger.id ? driver : passenger;
    const activeUserName = activeUser.name;
    const imageName = activeUser.photoUrl ? activeUser.photoUrl.replace(/^\//, '') : 'user_icon.svg';
    const activeUserPhoto = `/${imageName}`;

    return (
        <div className="message-container">
            <div className="message-header">
                <Link onClick={() => window.history.back()} className="btn btn-link text-decoration-none">
                    &larr;
                </Link>
                <img
                    src={activeUserPhoto || '/images/user_icon.svg'} // Use a default avatar if no photo
                    alt={activeUserName}
                    className="user-photo"
                />
                <h2 className="user-name">{activeUserName}</h2>
            </div>

            <div className="separator"></div>

            <div className="message-list">
                {Array.isArray(messages) && messages.map((message, index) => (
                    <div
                        key={index}
                        className={`message-bubble ${message.sender_id === currentUser.id ? 'current-user' : (message.sender_id === driver.id ?  'message-right' : 'message-left')}`}
                    >
                        {message.message_text}
                    </div>
                ))}
            </div>

            <div className="message-input-container">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Введите ваше сообщение ..."
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
    currentUser: PropTypes.object,
    order: PropTypes.object.isRequired,
    passenger: PropTypes.object.isRequired,
    driver: PropTypes.object.isRequired,
    messages: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default MessageComponent;

