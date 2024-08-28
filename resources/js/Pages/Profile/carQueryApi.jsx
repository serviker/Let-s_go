import axios from 'axios';

// Создайте экземпляр axios с базовым URL
/*const api = axios.create({
    baseURL: 'https://www.carqueryapi.com/api/0.3/',
});

// Функция для получения брендов
export const getBrands = async () => {
    try {
        const response = await api.get('?cmd=getMakes');
        return response.data.Makes;
    } catch (error) {
        console.error('Ошибка при получении брендов:', error);
        return [];
    }
};

// Функция для получения моделей для конкретного бренда
export const getModels = async (brand) => {
    try {
        const response = await api.get(`?cmd=getModels&make=${brand}`);
        return response.data.Models;
    } catch (error) {
        console.error('Ошибка при получении моделей:', error);
        return [];
    }
};*/

export const getBrands = async () => {
    try {
        const response = await axios.get('https://thingproxy.freeboard.io/fetch/https://www.carqueryapi.com/api/0.3/?cmd=getMakes');
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении брендов:', error);
        throw error;
    }
};


/*export const getBrands = async () => {
    try {
        const response = await axios.get('http://localhost:8000/api/0.3/?cmd=getMakes');
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении брендов:', error);
        throw error;
    }
};*/

export const getModels = async (brand) => {
    try {
        const response = await axios.get(`/api/0.3/?cmd=getModels&make=${brand}`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении моделей:', error);
        throw error;
    }
};


