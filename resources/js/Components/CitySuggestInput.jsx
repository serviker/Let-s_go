// src/components/CitySuggestInput.jsx
import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';

function CitySuggestInput({ value, onChange, onSelect }) {
    const [suggestions, setSuggestions] = useState([]);

    const onSuggestionsFetchRequested = async ({ value }) => {
        if (value.length < 1) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await axios.get('https://nominatim.openstreetmap.org/search', {
                params: {
                    q: value,
                    format: 'json',
                    addressdetails: 1,
                    countrycodes: 'RU',
                    limit: 10
                },
            });
            setSuggestions(response.data);
        } catch (error) {
            console.error('Ошибка при запросе данных:', error);
        }
    };

    const getSuggestionValue = (suggestion) => suggestion.display_name;

    const renderSuggestion = (suggestion) => (
        <div>{suggestion.display_name}</div>
    );

    const onSuggestionSelected = (event, { suggestion }) => {
        onSelect(suggestion);
    };

    const inputProps = {
        placeholder: 'Введите название города',
        value: value,
        onChange: (e, { newValue }) => onChange(newValue),
        style: {
            height: '50px', // Высота поля ввода
            color: 'black', // Цвет текста
            backgroundColor: '#eaeaea', // Цвет фона по умолчанию
            //borderColor: '#eea236', // Цвет границы
            textAlign: 'center', // Выравнивание текста по центру
            padding: '0 10px', // Отступы внутри поля
            borderRadius: '4px', // Радиус границ
            border: '1px solid #eea236', // Граница цвета #eea236
        },
        onMouseEnter: (e) => {
            e.target.style.backgroundColor = '#fdf9ec'; // Цвет фона при наведении
        },
        onMouseLeave: (e) => {
            e.target.style.backgroundColor = '#eaeaea'; // Возвращаем цвет фона при уходе курсора
        }
    };

    return (
        <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={() => setSuggestions([])}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            onSuggestionSelected={onSuggestionSelected}
        />
    );
}

export default CitySuggestInput;
