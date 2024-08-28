<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'date_time_departure' => 'required|date',
            'departure_time' => 'required|date_format:H:i',
            'from_city' => 'required|string',
            'from_street' => 'required|string',
            'from_house' => 'required|string',
            'to_city' => 'required|string',
            'to_street' => 'required|string',
            'to_house' => 'required|string',
            'price' => 'required|numeric',
            'available_seats' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'intermediate_addresses' => 'nullable|array',
            'intermediate_addresses.*' => 'exists:addresses,id'
        ];
    }
}
