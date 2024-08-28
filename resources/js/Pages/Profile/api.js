// api.js
import axios from 'axios';

const API_BASE_URL = 'https://car-data-api.com/api'; // Замените на правильный URL из Car Data API

export const fetchBrands = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/brands`);
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении марок:", error);
        return [];
    }
};

export const fetchModelsByBrand = async (brand) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/brands/${brand}/models`);
        return response.data;
    } catch (error) {
        console.error(`Ошибка при получении моделей для марки ${brand}:`, error);
        return [];
    }
};
