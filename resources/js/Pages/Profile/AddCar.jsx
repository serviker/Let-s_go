import React, { useState, useEffect } from 'react';
import { useForm, Link } from '@inertiajs/react';
import Autosuggest from 'react-autosuggest';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import '../../../css/Car.css'; // Подключение стилей

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
        return [];
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

const renderSuggestionColor = suggestion => (
    <div style={{ display: 'flex', alignItems: 'center'}}>
        <div
            style={{
                width: '100%',
                height: '25px',
                borderRadius: '5px',
                backgroundColor: suggestion.value || '#ffffff', // Убедитесь, что это свойство правильно называется
                marginRight: '10px',
            }}
        />
        {suggestion.name || 'Unknown Color'} {/* Убедитесь, что это свойство правильно называется */}
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


    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('photoUrl', file);
        }
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

      const handleColorSuggestionsFetchRequested = ({ value }) => {
          const colorSuggestions = getSuggestions(value, colors, 'color');
         // console.log("Color suggestions:", colorSuggestions); // Проверьте правильность данных
          setColorSuggestions(colorSuggestions);
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

    const handleColorChange = (event, { newValue }) => {
        setData('color', newValue);
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
                        <Autosuggest
                            suggestions={colorSuggestions}
                            onSuggestionsFetchRequested={handleColorSuggestionsFetchRequested}
                            onSuggestionsClearRequested={() => setColorSuggestions([])}
                            getSuggestionValue={getSuggestionValue}
                            renderSuggestion={renderSuggestionColor}
                            inputProps={{
                                placeholder: "Введите цвет автомобиля",
                                value: data.color || '', // Убедитесь, что значение не undefined
                                onChange: handleColorChange,
                                className: 'add-car-input',
                            }}
                            onSuggestionSelected={handleColorSuggestionSelected}
                        />
                        <InputError message={errors.color} className="add-car-error"/>
                    </div>
                )}

                {step === 4 && (
                    <div>
                        <InputLabel htmlFor="photo" value="Фото" className="add-car-label"/>
                        <input
                            type="file"
                            id="photo"
                            name="photoUrl"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="add-car-file-input"
                        />
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
