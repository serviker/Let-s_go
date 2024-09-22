<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.  php artisan db:seed --class=CitySeeder
     */
    public function run(): void
    {
        // Указываем путь к JSON файлу
        $jsonFile = base_path('database/seeders/cities_data.json');

        // Проверяем наличие файла
        if (File::exists($jsonFile)) {
            // Загружаем и декодируем JSON данные
            $data = json_decode(File::get($jsonFile), true);

            // Вставляем данные в базу данных
            foreach ($data as $cityData) {
                DB::table('cities')->insert([
                    'region' => $cityData['region'],
                    'city' => $cityData['city'],
                ]);
            }

            echo "Cities have been successfully seeded!";
        } else {
            echo "JSON file not found!";
        }
    }
}
