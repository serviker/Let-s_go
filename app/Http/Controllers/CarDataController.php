<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\CarBrand;

class CarDataController extends Controller
{
    // Получение всех марок автомобилей
    public function getBrands()
    {
        $brands = CarBrand::all();
        return response()->json($brands);
    }

    // Получение моделей по id марки
    public function getModels($brandId)
    {
        $brand = CarBrand::find($brandId);
        if (!$brand) {
            return response()->json(['error' => 'Brand not found'], 404);
        }

        $models = CarBrand::where('brand', $brand->brand)->get(); // Получаем все модели для данной марки
        return response()->json($models);
    }

    // Поиск по бренду или модели
    public function search($query)
    {
        $results = CarBrand::where('brand', 'like', "%$query%")
            ->orWhere('model', 'like', "%$query%")
            ->get();

        return response()->json($results);
    }

    // Получение всех доступных цветов
    public function getColors()
    {
        $colors = [
            ['name' => 'Коричневый', 'value' => '#702d00'],
            ['name' => 'Красный', 'value' => '#FF0000'],
            ['name' => 'Оранжевый', 'value' => '#ff7300'],
            ['name' => 'Зелёный', 'value' => '#00FF00'],
            ['name' => 'Голубой', 'value' => '#00FFFF'],
            ['name' => 'Синий', 'value' => '#0000FF'],
            ['name' => 'Жёлтый', 'value' => '#FFFF00'],
            ['name' => 'Фиолетовый', 'value' => '#FF00FF'],
            ['name' => 'Чёрный', 'value' => '#000000'],
            ['name' => 'Белый', 'value' => '#FFFFFF'],
            ['name' => 'Серый', 'value' => '#808080'],
        ];
        return response()->json($colors);
    }
}
