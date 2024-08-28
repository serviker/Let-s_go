
<form method="POST" action="{{ route('profile.update') }}">
@csrf
@method('PATCH')

<!-- Current Password Field -->
<div class="form-group mb-3">
    <label for="current_password" class="form-label">Current Password</label>
    <input id="current_password" type="password" name="current_password" required class="form-control">
    @error('current_password') <span class="text-danger">{{ $message }}</span> @enderror
</div>

<!-- New Password Field -->
<div class="form-group mb-3">
    <label for="password" class="form-label">New Password</label>
    <input id="password" type="password" name="password" required class="form-control">
    @error('password') <span class="text-danger">{{ $message }}</span> @enderror
</div>

<!-- Confirm Password Field -->
<div class="form-group mb-3">
    <label for="password_confirmation" class="form-label">Confirm New Password</label>
    <input id="password_confirmation" type="password" name="password_confirmation" required class="form-control">
    @error('password_confirmation') <span class="text-danger">{{ $message }}</span> @enderror
</div>

<button type="submit" class="btn btn-primary">Save</button>
</form>
