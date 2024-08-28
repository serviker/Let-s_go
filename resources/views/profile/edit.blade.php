<?php
@extends('layouts.app')

@section('content')
    <div class="container">
        <!-- Update Profile Information Form -->
        <div class="mb-4 p-4 bg-white shadow rounded">
            @include('profile.update-profile-information-form')
        </div>

        <!-- Update Password Form -->
        <div class="mb-4 p-4 bg-white shadow rounded">
            @include('profile.update-password-form')
        </div>

        <!-- Delete User Form -->
        <div class="mb-4 p-4 bg-white shadow rounded">
            @include('profile.delete-user-form')
        </div>
    </div>
@endsection
