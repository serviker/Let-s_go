<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Street;

class StreetController extends Controller
{
    // Получение всех улиц
    public function getStreets()
    {
        $streets = Street::all();
        return response()->json($streets);
    }

    // Метод для получения предложений по улице
    public function getSuggestions(Request $request)
    {
        $value = $request->query('value', '');
        $inputLength = strlen(trim($value));

        if ($inputLength === 0) {
            return response()->json([]);
        }

        // Получаем улицы, которые соответствуют запросу
        $suggestions = Street::where('street', 'like', $value . '%')->get(['street'])->toArray();
        return response()->json(['data' => $suggestions]);
    }

    // Поиск улиц по запросу
    public function search($query)
    {
        $results = Street::where('street', 'like', "%$query%")->get(['street'])->toArray();
        return response()->json($results);
    }
}
