<?php

namespace App\Http\Controllers;

use App\Models\Option;
use App\Models\OptionValue;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class OptionController extends Controller
{
    // Получение всех опций вместе с их значениями
    public function index()
    {
        // Получаем аутентифицированного пользователя
        $user = Auth::user();

        // Извлекаем все опции вместе с их значениями
        $options = Option::with('values')->get();

        // Группируем опции по имени
        $groupedOptions = [];
        foreach ($options as $option) {
            $groupedOptions[$option->name] = $option->values->pluck('description')->toArray();
        }

        return Inertia::render('Options/OptionComponent', [
            'options' => $groupedOptions,
            'userId' => $user->id, // Передаем userId в компонент
        ]);
    }

    // Сохранение выбранных опций для пользователя
    public function saveOptions(Request $request, $userId)
    {
        // Log the incoming request data
        Log::info('Incoming request data:', $request->all());

        // Validate the request data
        $data = $request->validate([
            'Курение' => 'string|nullable',
            'Животные' => 'string|nullable',
            'Музыка' => 'string|nullable',
            'Остановки' => 'string|nullable',
            'Разговоры' => 'string|nullable',
        ]);

        // Log the validated data
        Log::info('Validated data:', $data);

        // Find the user by ID
        $user = User::find($userId);

        // Log the user information
        if (!$user) {
            Log::warning('User not found:', ['userId' => $userId]);
            return response()->json(['message' => 'Пользователь не найден'], 404);
        }
        Log::info('User found:', ['userId' => $user->id]);

        // Process each option
        foreach ($data as $optionName => $selectedValue) {
            // Find the option by name
            $option = Option::where('name', $optionName)->first();

            // Log the found option
            if ($option) {
                Log::info('Option found:', ['optionName' => $optionName, 'optionId' => $option->id]);

                // Find the option value
                $optionValue = OptionValue::where('description', $selectedValue)
                    ->where('option_id', $option->id)
                    ->first();

                // Log the option value found
                if ($optionValue) {
                    Log::info('Option value found:', ['description' => $selectedValue, 'optionValueId' => $optionValue->id]);

                    // Save the relationship between the user and the selected option value
                    $user->optionValues()->attach($optionValue->id);
                    Log::info('Attached option value to user:', ['userId' => $user->id, 'optionValueId' => $optionValue->id]);
                } else {
                    Log::warning('Option value not found:', ['description' => $selectedValue, 'optionId' => $option->id]);
                }
            } else {
                Log::warning('Option not found:', ['optionName' => $optionName]);
            }
        }

        return response()->json(['message' => 'Опции успешно сохранены']);
    }





    // Создание новой опции
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $option = Option::create($request->all());
       // return response()->json($option, 201);

        // Возвращаем Inertia ответ с уведомлениями
        return Inertia::render('Options/OptionComponent', [
            'option' => $option,
        ]);
    }

    // Обновление существующей опции
    public function update(Request $request, $id)
    {
        $option = Option::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $option->update($request->all());
        return response()->json($option);
    }

    // Удаление опции
    public function destroy($id)
    {
        $option = Option::findOrFail($id);
        $option->delete();
        return response()->json(null, 204);
    }
}
