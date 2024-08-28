import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextInput({ type = 'text', className = '', isFocused = false, ...props }, ref) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, [isFocused]);

    const commonStyle = {
        color: 'black', // Цвет текста
        backgroundColor: '#eaeaea', // Цвет фона по умолчанию
        fontSize: '20px', // Размер текста
    };

    return type === 'textarea' ? (
        <textarea
            {...props}
            className={`border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ${className}`}
            style={{
                ...commonStyle,
                height: '250px', // Высота поля ввода
                color: 'black', // Цвет текста
                backgroundColor: '#eaeaea', // Цвет фона по умолчанию
                textSize: '18px',
                textAlign: 'center',
            }}
            onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#fdf9ec'; // Цвет фона при наведении
            }}
            onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#eaeaea'; // Возвращаем цвет фона при уходе курсора
            }}
            ref={input}
        />
    ) : (
        <input
            {...props}
            type={type}
            className={`border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ${className}`}
            style={{
                ...commonStyle,
                height: '50px', // Высота поля ввода
                color: 'black', // Цвет текста
                backgroundColor: '#eaeaea', // Цвет фона по умолчанию
                textAlign: 'center',
            }}
            onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#fdf9ec'; // Цвет фона при наведении
            }}
            onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#eaeaea'; // Возвращаем цвет фона при уходе курсора
            }}
            ref={input}
        />
    );
});
