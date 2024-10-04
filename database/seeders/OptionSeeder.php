<?php

namespace Database\Seeders;

use App\Models\OptionValue;
use Illuminate\Database\Seeder;
use App\Models\Option;
use Illuminate\Support\Facades\DB;

class OptionSeeder extends Seeder
{
    /**
     * Run the database seeds.  php artisan db:seed --class=OptionSeeder
     *
     * @return void
     */
    public function run()
    {
        // Отключение проверки внешних ключей
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Очистка таблиц
        OptionValue::query()->delete();
        Option::query()->delete();

        // Включение проверки внешних ключей обратно
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $options = [
            "Курение" => [
                "Я не против курящих",
                "Можно курить, но не в машине",
                "Я не курю и я против курения в машине",
            ],
            "Животные" => [
                "Я не против домашних животных",
                "Зависит от животного",
                "Предпочитаю поездки без питомцев",
            ],
            "Музыка" => [
                "Люблю слушать музыку во время поездки",
                "Музыка возможна по согласованию",
                "Предпочитаю тишину в поездке",
            ],
            "Остановки" => [
                "Не возражаю против остановок по пути",
                "Остановки возможны по необходимости",
                "Предпочитаю поездки без остановок",
            ],
            "Разговоры" => [
                "Могу общаться, если нужно",
                "Предпочитаю молчаливые поездки",
                "Предпочитаю поездки без разговоров",
            ]
        ];

        // Проходим по каждой опции
        foreach ($options as $name => $descriptions) {
            // Создаем опцию
            $option = Option::create(['name' => $name]);

            // Создаем значения опции
            foreach ($descriptions as $description) {
                OptionValue::create([
                    'option_id' => $option->id, // Связываем с опцией
                    'description' => $description,
                ]);
            }
        }
    }
}
