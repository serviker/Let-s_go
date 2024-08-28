<?php

namespace App\Http\Requests\Client;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
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
            'firstName' => 'required|string|min:3|max:10',
            'lastName' =>'required|string|min:3|max:10',
            'email'=>'required|regex:/(.+)@(.+)\.(.+)/i',
            'phone'=>'required|regex:/(0)[0-9]{9}/',
            'photoUrl'=>'string',
        ];
    }
}
