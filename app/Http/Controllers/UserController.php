<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use Illuminate\Auth\MustVerifyEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request)
    {
        $user = $request->user();
        $cars = $user->cars;

          return Inertia::render('Profile/Edit', [
              'auth' => [
              'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
              'status' => session('status'),
              'user' => $request->user(),
              'cars' => $cars->toArray(),
              ],
          ]);

    }

    public function show(User $user)
    {
        return Inertia::render('Profile/ShowDriverProfile', [
            'user' => $user,
        ]);
    }

    public function checkBookedTrips($userId) {
        $hasBookedTrips = Order::where('passenger_id', $userId)->exists();

        return response()->json(['hasBookedTrips' => $hasBookedTrips]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request)
    {
        $user = $request->user();

        // Validate the request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:255',
            'photo' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return Redirect::route('profile.edit')
                ->withErrors($validator)
                ->withInput();
        }

        // Update user details
        $user->name = $request->input('name');
        $user->lastName = $request->input('lastName');
        $user->email = $request->input('email');
        $user->phone = $request->input('phone');

        // Handle photo upload and update
        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($user->photoUrl && Storage::exists($user->photoUrl)) {
                Storage::delete($user->photoUrl);
            }

            // Store new photo
            $photoPath = $request->file('photo')->store('images', 'public');
            $user->photoUrl = $photoPath;
        }

        // Check if email has changed
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return Redirect::route('profile.edit')->with('status', 'Profile updated successfully.');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        // Delete user's photo if exists
        if ($user->photoUrl && Storage::exists($user->photoUrl)) {
            Storage::delete($user->photoUrl);
        }

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
