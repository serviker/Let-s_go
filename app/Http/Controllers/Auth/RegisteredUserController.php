<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|min:3|max:20',
            'lastName' => 'required|string|min:3|max:20',
            'email' => 'required|string|lowercase|email|max:255|unique:users',
            'phone' => 'nullable|string|max:20',
            'photoUrl' => 'nullable|file|image|max:2048', // Validate as an image file
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $userData = [
            'name' => $request->name,
            'lastName' => $request->lastName,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
        ];

        /* if ($request->hasFile('photoUrl')) {
            $file = $request->file('photoUrl');
            $fileName = time() . '-' . $file->getClientOriginalName(); // Генерация уникального имени
            $filePath = $file->storeAs('images', $fileName, 'public'); // Сохранение в public/images
            \Log::info('Saving file path: ' . $filePath);

            $userData['photoUrl'] = $filePath; // Сохранение только имени файла
        }
*/

        // Обработка загруженного файла
        if ($request->hasFile('photoUrl')) {
            $file = $request->file('photoUrl');
            $fileName = $file->getClientOriginalName(); // Используем исходное имя файла
            $filePath = 'images/' . $fileName;

            // Проверка на уникальность имени файла
            $counter = 1;
            while (Storage::disk('public')->exists($filePath)) {
                $fileName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME) . '-' . $counter . '.' . $file->getClientOriginalExtension();
                $filePath = 'images/' . $fileName;
                $counter++;
            }

            // Сохранение файла
            $file->storeAs('images', $fileName, 'public');
            $userData['photoUrl'] = $filePath; // Сохранение пути в базе данных
        }


        $user = User::create($userData);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
