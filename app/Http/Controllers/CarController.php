<?php

namespace App\Http\Controllers;

use App\Models\Car;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CarController extends Controller
{
    public function create()
    {
        return Inertia::render('Profile/AddCar');
    }

    public function store(Request $request)
    {
        // Валидация входных данных
        $request->validate([
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'color' => 'required|string|max:255',
            'photoUrl' => 'nullable|file|mimes:jpeg,png,jpg|max:2048', // Проверка на файл
        ]);

        // Получение пользователя
        $user = $request->user();

       /* // Получение оригинального имени файла
        $originalName = $request->file('photoUrl')->getClientOriginalName();
        // Сохранение файла с оригинальным именем
        $path = $request->file('photoUrl')->storeAs('imagesCar', $originalName, 'public'); */

        // Инициализация переменной для пути к файлу
        $path = null;

        // Сохранение файла, если он есть
        if ($request->hasFile('photoUrl')) {
            $originalName = $request->file('photoUrl')->getClientOriginalName();
            $path = $request->file('photoUrl')->storeAs('imagesCar', $originalName, 'public');
        }

        // Создание записи автомобиля
        $user->cars()->create([
            'brand' => $request->brand,
            'model' => $request->model,
            'color' => $request->color,
            'photoUrl' => $path, // Путь к файлу в хранилище
        ]);

        // Перенаправление с сообщением об успехе
        return redirect()->route('profile.edit')->with('success', 'Car added successfully.');
    }

    public function destroy($id)
    {
        $car = Car::find($id);

        if ($car) {
            $car->delete();
           // return response()->json(['message' => 'Car deleted successfully.']);
            return redirect()->route('profile.edit')->with('success', 'Car deleted successfully.');
        } else {
            //return response()->json(['message' => 'Car not found.'], 404);
            return redirect()->route('profile.edit')->with('error', 'Car not found.');
        }
    }

}
