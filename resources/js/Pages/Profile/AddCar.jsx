import React, { useState, useEffect } from 'react';
import { useForm, Link } from '@inertiajs/react';
import Autosuggest from 'react-autosuggest';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import '../../../css/Car.css';
import axios from "axios"; // Подключение стилей

const fetchBrands = async () => {
    const response = await fetch('/api/brands');
    return await response.json();
};

const fetchModels = async (brandId) => {
    const response = await fetch(`/api/models/${brandId}`);
    return await response.json();
};

const fetchColors = async () => {
    const response = await fetch('/api/colors');
    return await response.json();
};

// Функция фильтрации
function getSuggestions(value, list, type) {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    if (inputLength === 0) {
        return list;
    }

    if (type === 'color') {
        return list.filter(item => item.name.toLowerCase().slice(0, inputLength) === inputValue);
    } else {
        // Для марок и моделей предполагается, что список содержит строки
        return list.filter(item => item.toLowerCase().slice(0, inputLength) === inputValue);
    }
}

const getSuggestionValue = suggestion => suggestion;

const renderSuggestion = suggestion => (
    <div>
        {suggestion}
    </div>
);




export default function AddCar() {
    const { data, setData, post, errors, processing } = useForm({
        brand: '',
        model: '',
        color: '',
        photoUrl: null,
    });

    const [step, setStep] = useState(1);
    const [brandSuggestions, setBrandSuggestions] = useState([]);
    const [modelSuggestions, setModelSuggestions] = useState([]);
    const [colorSuggestions, setColorSuggestions] = useState([]);
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [colors, setColors] = useState([]);
    const [isBrandsLoaded, setIsBrandsLoaded] = useState(false);
    const [selectedColor, setSelectedColor] = useState(data.color || '');
    const [fileName, setFileName] = useState('Файл не выбран');

    // Функция для обработки выбора цвета
    const handleColorSelect = (color) => {
        setSelectedColor(color); // Обновляем состояние выбранного цвета
        setData((prevData) => ({
            ...prevData,
            color: color, // Обновляем данные
        }));
    };
    const fetchCities = async () => {
        const response = await fetch('/api/cities');
        return await response.json();
        // console.log("Cities fetched from API:", data);
    };

    useEffect(() => {
        const fetchColorsData = async () => {
            try {
                const colorsData = await fetchColors();
                // console.log("Colors data:", colorsData);
                setColors(colorsData);
            } catch (error) {
                console.error("Ошибка при загрузке цветов:", error);
            }
        };
        fetchColorsData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const brandsData = await fetchBrands();
                setBrands(brandsData);
                setIsBrandsLoaded(true);

                const colorsData = await fetchColors();
                setColors(colorsData);
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (data.brand && isBrandsLoaded) {
            handleSuggestionsFetchRequested({ value: data.brand });
        }
    }, [data.brand, isBrandsLoaded]);

    useEffect(() => {
        if (data.brand) {
            const fetchModelsData = async () => {
                try {
                    const selectedBrand = brands.find(brand => brand.brand === data.brand);
                    if (selectedBrand) {
                        const modelsData = await fetchModels(selectedBrand.id);
                        setModels(modelsData);
                    }
                } catch (error) {
                    console.error("Ошибка при загрузке моделей:", error);
                }
            };

            fetchModelsData();
        } else {
            setModels([]);
            setModelSuggestions([]);
        }
    }, [data.brand]);


    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('photoUrl', file);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files.length > 0) {
            setFileName(e.target.files[0].name); // Обновляем имя файла при выборе
        } else {
            setFileName('Файл не выбран'); // Если файл не выбран
        }
        handlePhotoChange(e); // Вызываем переданный метод для обработки загрузки
    };

    const handleNext = () => {
        if (step < 4) {
            setStep(step + 1);
        }
    };

    const handlePrevious = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('brand', data.brand);
        formData.append('model', data.model);
        formData.append('color', data.color);
        if (data.photoUrl) {
            formData.append('photoUrl', data.photoUrl);
        }
        post(route('car.store'), formData);
    };

    const handleSuggestionsFetchRequested = async ({ value }) => {
        if (brands.length === 0) {
            return;
        }

        // Получаем уникальные бренды
        const uniqueBrands = Array.from(new Set(brands.map(brand => brand.brand)));

        // Фильтруем предложения на основе ввода пользователя
        const suggestions = getSuggestions(value, uniqueBrands);

        // Устанавливаем уникальные предложения
        setBrandSuggestions(suggestions);
    };

    const handleModelSuggestionsFetchRequested = ({ value }) => {
        setModelSuggestions(getSuggestions(value, models.map(model => model.model)));
    };

    // Функция для показа всех цветов при фокусе
    //   const handleColorSuggestionsFetchRequested = ({ value }) => {
    //       const colorSuggestions = getSuggestions(value, colors, 'color');
    //       console.log("Color suggestions:", colorSuggestions); // Проверьте правильность данных
    //       setColorSuggestions(colorSuggestions);
    //   };

    const handleColorSuggestionsFetchRequested = ({ value }) => {
        // Если value пустое, показываем все цвета
        if (value.trim() === '') {
            setColorSuggestions(colors);
            console.log("Color setColorSuggestions(colors)):", colors); // Проверьте правильность данных
        } else {
            const filteredSuggestions = getSuggestions(value, colors, 'color');
            console.log("Color suggestions:", filteredSuggestions); // Проверьте правильность данных
            setColorSuggestions(filteredSuggestions);
        }
    };

    const handleBrandChange = (event, { newValue }) => {
        setData('brand', newValue);
    };

    const handleBrandSuggestionSelected = (event, { suggestion }) => {
        setData('brand', suggestion);
        setData('model', '');
        setModelSuggestions([]);
    };

    const handleModelChange = (event, { newValue }) => {
        setData('model', newValue);
    };

    const handleModelSuggestionSelected = (event, { suggestion }) => {
        setData('model', suggestion);
    };

   // const handleColorChange = (event, { newValue }) => { setData('color', newValue); };

    // Функция для изменения значения цвета
    const handleColorChange = (event, { newValue }) => {
        setData((prevData) => ({
            ...prevData,
            color: newValue, // Обновляем выбранный цвет
        }));
    };
    const handleColorSuggestionSelected = (event, { suggestion }) => {
        setData('color', suggestion.name);
    };

    return (
        <section className="add-car-container">
            <header>
                <h2 style={{ textAlign: 'center' }}>Добавить Авто</h2>
            </header>

            <form onSubmit={submit} className="card">
                {step === 1 && (
                    <div className="mb-3">
                        <InputLabel htmlFor="brand" value="Марка" className="add-car-label"/>
                        <Autosuggest
                            suggestions={brandSuggestions}
                            onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
                            onSuggestionsClearRequested={() => setBrandSuggestions([])}
                            getSuggestionValue={getSuggestionValue}
                            renderSuggestion={renderSuggestion}
                            inputProps={{
                                placeholder: "Введите марку автомобиля",
                                value: data.brand,
                                onChange: handleBrandChange,
                                className: 'add-car-input',
                            }}
                        />
                        <InputError message={errors.brand} className="add-car-error"/>
                    </div>
                )}

                {step === 2 && (
                    <div className="mb-3">
                        <InputLabel htmlFor="model" value="Модель" className="add-car-label"/>
                        <Autosuggest
                            suggestions={modelSuggestions}
                            onSuggestionsFetchRequested={handleModelSuggestionsFetchRequested}
                            onSuggestionsClearRequested={() => setModelSuggestions([])}
                            getSuggestionValue={getSuggestionValue}
                            renderSuggestion={renderSuggestion}
                            inputProps={{
                                placeholder: "Введите модель автомобиля",
                                value: data.model,
                                onChange: handleModelChange,
                                className: 'add-car-input',
                            }}
                        />
                        <InputError message={errors.model} className="add-car-error"/>
                    </div>
                )}

                {step === 3 && (
                    <div className="mb-3">
                        <InputLabel htmlFor="color" value="Цвет" className="add-car-label"/>
                        <div className="color-options">
                            {colors.map((color) => (
                                <div
                                    key={color.value}
                                    className={`color-option ${selectedColor === color.name ? 'selected' : ''}`} // Выделение выбранного цвета
                                    onClick={() => handleColorSelect(color.name)} // При клике выбираем цвет
                                >
                                    <div className="color-circle" style={{ backgroundColor: color.value }}></div>
                                    <span className="color-name">{color.name}</span>
                                </div>
                            ))}
                        </div>

                        {selectedColor && (
                            <div className="selected-color-info">
                                <div  className="selected-color">Выбранный цвет:
                                    <div className="selectedColor">
                                        {selectedColor}
                                    </div>
                                </div>
                            </div>
                        )}
                        <InputError message={errors.color} className="add-car-error"/>
                    </div>
                )}

                {step === 4 && (
                    <div>
                        <InputLabel htmlFor="photo" value="Фото" className="add-car-label"/>
                        <div className="custom-file-input">
                            <span className="file-name">{fileName}</span>
                            <input
                                type="file"
                                id="photo"
                                name="photoUrl"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="file-input-hidden"
                            />
                        </div>
                        <InputError message={errors.photoUrl} className="add-car-error"/>
                    </div>
                )}

                <div className="add-car-buttons">
                    {step === 1 && (
                        <Link href={route('profile.edit')} className="add-car-button-secondary">
                            Отменить
                        </Link>
                    )}
                    {step > 1 && (
                        <button type="button" onClick={handlePrevious} className="add-car-button-secondary">
                            Назад
                        </button>
                    )}
                    {step < 4 ? (
                        <button type="button" onClick={handleNext} className="add-car-button-primary">
                            Вперед
                        </button>
                    ) : (
                        <PrimaryButton disabled={processing} className="add-car-button-primary">
                            Сохранить
                        </PrimaryButton>
                    )}
                </div>
            </form>
        </section>
    );
}
