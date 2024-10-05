import React, { useState, useEffect, useRef } from 'react';
import '../../../css/OptionComponent.css';
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

const OptionComponent = ({ options, userId }) => {
    const [selectedOptions, setSelectedOptions] = useState({});
    const [activeDropdown, setActiveDropdown] = useState(null);
    const dropdownRefs = useRef({});
    console.log('User ID:', userId);

    // Инициализация выбранных опций
    useEffect(() => {
        const initialOptions = Object.keys(options).reduce((acc, key) => {
            acc[key] = options[key][1] || ''; // По умолчанию выбираем первое значение или пустую строку
            return acc;
        }, {});
        setSelectedOptions(initialOptions);
    }, [options]);

    useEffect(() => {
        console.log("Опции, переданные в компонент:", options);
    }, [options]);

   /* useEffect(() => {
        // Убираем все значения null из переданных опций
        const cleanOptions = Object.keys(options).reduce((acc, key) => {
            acc[key] = options[key].filter(optionValue => optionValue !== null);
            return acc;
        }, {});

        console.log("Очищенные опции:", cleanOptions);
        setSelectedOptions(cleanOptions);
    }, [options]);
*/

    // Закрытие выпадающего списка при клике вне
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!Object.values(dropdownRefs.current).some(ref => ref && ref.contains(event.target))) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleOptionChange = (optionName, optionValue) => {
        setSelectedOptions((prevOptions) => {
            const updatedOptions = {
                ...prevOptions,
                [optionName]: optionValue, // Обновляем выбранную опцию
            };
            return updatedOptions;
        });
        setActiveDropdown(null); // Закрыть выпадающий список после выбора
    };

    const saveOptions = async () => {
        if (!userId) {
            console.error('userId не определен');
            return;
        }

        console.log('Selected Options:', selectedOptions);

        try {
            const response = await fetch(`/api/saveOptions/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken, // Добавьте CSRF-токен в заголовки
                },
                body: JSON.stringify(selectedOptions),
            });

            if (response.ok) {
                console.log('Опции успешно сохранены!');
            } else {
                const errorText = await response.text();
                console.error('Ошибка при сохранении опций:', response.status, errorText);
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
        }
    };



    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px', alignContent: 'center', height: '100vh'}}>
            <div className="header" >
                <a href={route('dashboard')} className="btn btn-link text-decoration-none" >
                    &larr;
                </a>
                <h2>Опции для комфортной поездки</h2>
            </div>

            <div style={{width: '500px', marginTop: '50px'}}>
                {Object.keys(options).map((optionName) => (
                    <div key={optionName} style={{
                        marginBottom: '20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        alignContent: 'center'
                    }}>
                        <label style={{fontSize: '16px', textAlign: 'left'}}>{optionName}</label>
                        <div style={{position: 'relative', width: '180px'}}
                             ref={ref => dropdownRefs.current[optionName] = ref}>
                            <div
                                style={{
                                    width: '400px',
                                    cursor: 'pointer',
                                    padding: '1px',
                                    textAlign: 'left'
                                }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveDropdown(optionName === activeDropdown ? null : optionName);
                                }}
                            >
                                {selectedOptions[optionName] || 'Выберите опцию'}
                            </div>
                            {activeDropdown === optionName && (
                                <ul
                                    style={{
                                        position: 'absolute',
                                        top: '1px',
                                        left: '-10px',
                                        width: '500px',
                                        background: '#fff',
                                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                        zIndex: 1,
                                        fontSize: '18px',
                                        textAlign: 'center',
                                        padding: '10px 0',
                                        listStyle: 'none',
                                        margin: 0,
                                        border: '2px solid #eea236',
                                        borderRadius: '10px',
                                    }}
                                >
                                    {Array.isArray(options[optionName]) && options[optionName].length > 0 ? (
                                        options[optionName]
                                            .filter(optionValue => optionValue !== null)  // Фильтруем значения null
                                            .map((optionValue, index) => (
                                                <li
                                                    key={`${optionName}-${index}`}
                                                    style={{
                                                        padding: '10px',
                                                        cursor: 'pointer',
                                                        backgroundColor: selectedOptions[optionName] === optionValue ? '#f0f0f0' : '#fff',
                                                    }}
                                                    onClick={() => handleOptionChange(optionName, optionValue)}
                                                >
                                                    {optionValue || 'Не указано'} {/* Если значение null, выводим 'Не указано' */}
                                                </li>
                                            ))
                                    ) : (
                                        <li style={{padding: '10px', color: '#999'}}>Нет доступных опций</li>
                                    )}

                                </ul>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={saveOptions} style={{marginTop: '20px', padding: '10px 20px', border: '2px solid #eea236', borderRadius: '10px', fontWeight: 'bold', color: '#eea236'}}>
                Сохранить опции
            </button>
        </div>
    );
};

export default OptionComponent;
