// src/components/CitySuggestInput.jsx
import React, {useEffect, useState} from 'react';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';

function CitySuggestInput({ value, onChange, onSelect }) {
    const [suggestions, setSuggestions] = useState([]);
    const [data, setData] = useState([]);
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [isCitiesLoaded, setIsCitiesLoaded] = useState(false);
    const [cities, setCities] = useState([]); // Состояние для всех городов


    const fetchCities = async () => {
        const response = await fetch('/api/cities');
        return await response.json();
        // console.log("Cities fetched from API:", data);
    };

    // Метод для фильтрации городов по введенному значению
    function getSuggestions(value, list) {
        const inputValue = value.trim().toLowerCase();
        //  console.log("Input value:", inputValue);
        const inputLength = inputValue.length;
        return inputLength === 0 ?  []: list.filter(item => item.toLowerCase().slice(0, inputLength) === inputValue);
    }

    /*useEffect(() => {
        // Функция для загрузки городов из базы данных
        const fetchCities = async () => {
            try {
                const response = await axios.get('/api/cities');
                  //  console.log("Fetched cities:", response.data);  // Добавляем вывод в консоль
                setCities(response.data);  // Сохраняем список городов в состоянии
                setIsCitiesLoaded(true);  // Помечаем, что города загружены
            } catch (error) {
                console.error("Ошибка при загрузке городов:", error);
            }
        };

        // Загрузка городов только при монтировании компонента
        if (cities.length === 0) {
            fetchCities();
        }
    }, []);  // Пустой массив зависимостей гарантирует выполнение только один раз при монтировании.useEffect(() => {
*/
    useEffect(() => {
        if (!isCitiesLoaded) {
            fetchCities(); // Загружаем города при монтировании компонента
        }
    }, [isCitiesLoaded]);

   const onSuggestionsFetchRequested = async ({ value }) => {
        //  console.log("Fetching suggestions for:", value);

        // Проверяем, если массив cities пуст, загружаем города
        if (cities.length === 0) {
            const allCities = await fetchCities(); // Здесь используем fetchCities
            setCities(allCities);
        }
        // Извлекаем уникальные города
        const uniqueCities = Array.from(new Set(cities.map(city => city.city)));
        // Фильтруем предложения
       const filteredSuggestions = getSuggestions(value, uniqueCities);
       setSuggestions(filteredSuggestions.slice(0, 15));
    };

  /*   const onSuggestionsFetchRequested = ({ value }) => {
        if (isCitiesLoaded) {
            const uniqueCities = Array.from(new Set(cities.map(city => city.city)));
            const filteredSuggestions = getSuggestions(value, uniqueCities);
            setSuggestions(filteredSuggestions.slice(0, 5)); // Ограничиваем 5 предложениями
        }
    };*/

    const getSuggestionValue = (suggestion) => suggestion;

    const renderSuggestion = (suggestion) => (
        <div>{suggestion}</div>
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
            borderRadius: '10px', // Радиус границ
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
           // onSuggestionSelected={onSuggestionSelected}
        />
    );
}

export default CitySuggestInput;
