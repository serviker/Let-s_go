<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\City;
use Illuminate\Support\Facades\Log;

class CityController extends Controller
{
    // Получение всех городов
    public function getCities()
    {
       // Log::info('getCities method called'); // Логирование
        $cities = City::all();
       // Log::info('Cities fetched:', $cities->toArray()); // Логирование
        return response()->json($cities);
    }

    // Метод для получения предложений по городу
    public function getSuggestions(Request $request)
    {
        $value = $request->query('value', '');
        $inputLength = strlen(trim($value));

        if ($inputLength === 0) {
            return response()->json([]);
        }

        // Получаем города, которые соответствуют запросу
        $suggestions = City::where('city', 'like', $value . '%')->get(['city'])->toArray();
        return response()->json(['data' => $suggestions]);
    }

    public function search($query)
    {
        $results = City::where('city', 'like', "%$query%")->get(['city'])->toArray();
      //  Log::info('Cities fetched search:', $results->toArray()); // Логирование
        return response()->json($results);
    }

}

