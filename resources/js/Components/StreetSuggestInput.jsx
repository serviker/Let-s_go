import React, {useEffect, useState} from 'react';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';

function StreetSuggestInput({ value, onChange}) {
    const [suggestions, setSuggestions] = useState([]);
    const [data, setData] = useState([]);
    const [streets, setStreets] = useState([]);
    const [isStreetsLoaded, setIsStreetsLoaded] = useState(false);

    // Метод для фильтрации городов по введенному значению
    function getSuggestions(value, list) {
        const inputValue = value.trim().toLowerCase();
        //  console.log("Input value:", inputValue);
        const inputLength = inputValue.length;
        return inputLength === 0 ?  []: list.filter(item => item.toLowerCase().slice(0, inputLength) === inputValue);
    }
    const getSuggestionValue = (suggestion) => suggestion;

    const renderSuggestion = (suggestion) => (
        <div>{suggestion}</div>
    );

    const fetchStreets = async () => {
        const response = await fetch('/api/streets');
        return await response.json();
        // console.log("Cities fetched from API:", data);
    };

    useEffect(() => {
        // Функция для загрузки городов из базы данных
        const fetchStreets = async () => {
            try {
                const response = await axios.get('/api/streets');
               // console.log("Fetched streets:", response.data);  // Добавляем вывод в консоль
                setStreets(response.data);  // Сохраняем список городов в состоянии
                setIsStreetsLoaded(true);  // Помечаем, что города загружены
            } catch (error) {
                console.error("Ошибка при загрузке улиц:", error);
            }
        };

        // Загрузка городов только при монтировании компонента
        if (streets.length === 0) {
            fetchStreets();
        }
    }, []);  // Пустой массив зависимостей гарантирует выполнение только один раз при монтировании.

    useEffect(() => {
        if (data.street && isStreetsLoaded) {
            onStreetSuggestionsFetchRequested({ value: data.street });
        }
    }, [data.street, isStreetsLoaded]);

    // Пример метода для обработки запросов автодополнения улиц
    const onStreetSuggestionsFetchRequested = async ({ value }) => {
       // console.log("Fetching suggestions for:", value);

        // Проверяем, если массив cities пуст, загружаем города
        if (streets.length === 0) {
            const allStreets = await fetchStreets(); // Здесь используем fetchCities
            setStreets(allStreets);
        }

        // Извлекаем уникальные города
        const uniqueStreets = Array.from(new Set(streets.map(street => street.street)));

        // Фильтруем предложения
        const suggestions = getSuggestions(value, uniqueStreets);
        const limitedSuggestions = suggestions.slice(0, 15);
       // console.log("Street suggestions:", suggestions);
        setSuggestions(limitedSuggestions);
    };

    // const onStreetChange = (event, { newValue }) => {
    //     // Обновляем как состояние для автозаполнения, так и данные формы
    //     setStreet(newValue); // обновляем отображаемое значение в инпуте
    //     setData({ ...data, street: newValue }); // обновляем данные формы
    // };

    const inputProps = {
        placeholder: 'Введите название улицы',
        value: value,
        onChange: (e, { newValue }) => onChange(newValue),
        style: {
            height: '50px', // Высота поля ввода
            color: 'black', // Цвет текста
            backgroundColor: '#eaeaea', // Цвет фона по умолчанию
            // borderColor: '#eea236', // Цвет границы
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
            onSuggestionsFetchRequested={onStreetSuggestionsFetchRequested}
            onSuggestionsClearRequested={() => setSuggestions([])}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
        />
    );
}

export default StreetSuggestInput;
