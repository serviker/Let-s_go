<form method="POST" action="{{ route('profile.update') }}">
    @csrf
    @method('PATCH')

    <!-- Name Field -->
    <div class="form-group mb-3">
        <label for="name" class="form-label">Name</label>
        <input id="name" type="text" name="name" value="{{ old('name', $user->name) }}" required class="form-control">
        @error('name') <span class="text-danger">{{ $message }}</span> @enderror
    </div>

    <!-- Last Name Field -->
    <div class="form-group mb-3">
        <label for="last_name" class="form-label">Last Name</label>
        <input id="last_name" type="text" name="last_name" value="{{ old('last_name', $user->last_name) }}" required class="form-control">
        @error('last_name') <span class="text-danger">{{ $message }}</span> @enderror
    </div>

    <!-- Email Field -->
    <div class="form-group mb-3">
        <label for="email" class="form-label">Email</label>
        <input id="email" type="email" name="email" value="{{ old('email', $user->email) }}" required class="form-control">
        @error('email') <span class="text-danger">{{ $message }}</span> @enderror
    </div>

    <!-- Phone Field -->
    <div class="form-group mb-3">
        <label for="phone" class="form-label">Phone</label>
        <input id="phone" type="tel" name="phone" value="{{ old('phone', $user->phone) }}" class="form-control">
        @error('phone') <span class="text-danger">{{ $message }}</span> @enderror
    </div>

    <!-- Photo URL Field -->
    <div class="form-group mb-3">
        <label for="photo" class="form-label">Photo URL</label>
        <input id="photo" type="text" name="photo" value="{{ old('photo', $user->photo) }}" class="form-control">
        @error('photo') <span class="text-danger">{{ $message }}</span> @enderror
    </div>

    <button type="submit" class="btn btn-primary">Save</button>
</form>
