<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class StreetSeeder extends Seeder
{
    public function run(): void
    {
        // Указываем путь к JSON файлу
        $jsonFile = base_path('database/seeders/streets_data.json');

        // Проверяем наличие файла
        if (File::exists($jsonFile)) {
            // Загружаем и декодируем JSON данные
            $data = json_decode(File::get($jsonFile), true);

            // Проверяем, действительно ли данные загружены и являются ли они массивом
            if (is_array($data)) {
                // Вставляем данные без повторений
                foreach ($data as $streetData) {
                    if (isset($streetData['street'])) {
                        // Используем firstOrCreate для избежания дубликатов
                        DB::table('streets')->updateOrInsert(
                            ['street' => $streetData['street']], // Условие поиска
                            ['created_at' => now(), 'updated_at' => now()] // Данные для вставки
                        );
                    }
                }
                echo "Streets have been successfully seeded!";
            } else {
                echo "Invalid JSON structure!";
            }
        } else {
            echo "JSON file not found!";
        }
    }
}

