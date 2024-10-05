<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Car;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    public function showOptions($id)
    {
        $user = User::findOrFail($id);
        $options = $user->optionValues()->with('option')->get();

        return response()->json(['options' => $options]);
    }


    public function showDriver($id)
    {
        // Получаем пользователя
        $user = User::findOrFail($id);
        // Получаем автомобили пользователя
        // $cars = Car::where('user_id', $id)->get();
        $cars = $user->cars; // Оптимально использовать связь
        // Получаем опции пользователя через связь с OptionValue
        $options = $user->optionValues()->with('option')->get();

        return Inertia::render('Profile/ShowDriverProfile', [
            'user' => $user,
            'cars' => $cars,
            'options' => $options,  // Передаем опции на фронт
        ]);
    }

    public function showPassenger($id)
    {
        // Получаем пользователя
        $user = User::findOrFail($id);
        // Получаем опции пользователя через связь с OptionValue
        $options = $user->optionValues()->with('option')->get();

        return Inertia::render('Profile/ShowPassengerProfile', [
            'user' => $user,
            'options' => $options,  // Передаем опции на фронт
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }
        if ($request->hasFile('photoUrl')) {
            $path = $request->file('photoUrl')->store('images', 'public');
            $request->user()->photo = $path;
        }
        // Инициализация переменной для пути к файлу
      /*  $path = null;
        if ($request->hasFile('photoUrl')) {
            $originalName = $request->file('photoUrl')->getClientOriginalName();
            $path = $request->file('photoUrl')->storeAs('images', $originalName, 'public');
        }*/


        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
