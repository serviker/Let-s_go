<form method="POST" action="{{ route('profile.destroy') }}">
    @csrf
    @method('DELETE')

    <div class="form-group mb-3">
        <label for="password" class="form-label">Confirm Password</label>
        <input id="password" type="password" name="password" required class="form-control">
        @error('password') <span class="text-danger">{{ $message }}</span> @enderror
    </div>

    <button type="submit" class="btn btn-danger">Delete Account</button>
</form>
