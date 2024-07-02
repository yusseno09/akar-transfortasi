<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSewaKendaraanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function rules()
    {
        return [
            'kode' => 'required|string|max:100|not_regex:/^\s*$/',
            'mulai_tanggal' => 'required|date',
            'akhir_tanggal' => 'required|date|after_or_equal:mulai_tanggal',
            'total' => 'required|numeric|min:0',
            'metode' => 'required|string|in:Cash,Debit,Kredit',
        ];
    }

    /**
     * Custom error messages.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'kode.required' => 'Kode harus diisi.',
            'kode.string' => 'Kode harus berupa teks.',
            'kode.max' => 'Kode tidak boleh lebih dari :max karakter.',
            'kode.not_regex' => 'Format Kode tidak valid.',

            'mulai_tanggal.required' => 'Tanggal mulai harus diisi.',
            'mulai_tanggal.date' => 'Format tanggal mulai tidak valid.',
            'akhir_tanggal.required' => 'Tanggal akhir harus diisi.',
            'akhir_tanggal.date' => 'Format tanggal akhir tidak valid.',
            'akhir_tanggal.after_or_equal' => 'Tanggal akhir harus setelah atau sama dengan tanggal mulai.',

            'total.required' => 'Total harus diisi.',
            'total.numeric' => 'Total harus berupa angka.',
            'total.min' => 'Total tidak boleh kurang dari :min.',

            'metode.required' => 'Metode pembayaran harus dipilih.',
            'metode.string' => 'Metode pembayaran harus berupa teks.',
            'metode.in' => 'Metode pembayaran harus salah satu dari: cash, debit, kredit.',
        ];
    }
}
