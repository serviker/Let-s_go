<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UsersTableSeeder extends Seeder
{
    public function run()
    {
        // Удаляем записи из зависимых таблиц
      //  DB::table('cars')->delete();
      //  DB::table('users')->delete();
        // Отключаем проверки внешних ключей
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        $firstNames = [
            'Александр', 'Дмитрий', 'Сергей', 'Анатолий', 'Иван',
            'Егор', 'Михаил', 'Роман', 'Алексей', 'Николай',
            'Мария', 'Анна', 'Елена', 'Татьяна', 'Ольга',
            'Ксения', 'Светлана', 'Ирина', 'Юлия', 'Екатерина',
        ];

        $lastNames = [
            'Иванов', 'Петров', 'Сидоров', 'Кузнецов', 'Семёнов',
            'Морозов', 'Соловьёв', 'Волков', 'Лебедев', 'Егоров',
            'Николаев', 'Фёдоров', 'Григорьев', 'Ковалёв', 'Тарасов',
            'Александров', 'Давыдов', 'Степанов', 'Михайлов', 'Федосеев',
        ];

        for ($i = 0; $i < 30; $i++) {
            $gender = rand(0, 1); // 0 - мужчина, 1 - женщина
            $firstName = $gender === 0 ? $firstNames[array_rand(array_slice($firstNames, 0, 10))] : $firstNames[array_rand(array_slice($firstNames, 10))];
            $lastName = $lastNames[array_rand($lastNames)];

            DB::table('users')->insert([
                'name' => $firstName,
                'lastName' => $lastName,
                'email' => strtolower($firstName . '.' . $lastName . rand(1, 100)  . '@mail.com'),
                'password' => bcrypt('Qwerty_123'),
                'phone' => '+7(999)' . rand(100, 999) . '-' . rand(10, 99) . '-' . rand(10, 99),
                'photoUrl' => 'images/image' . ($i + 1) . '.png',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        // Включаем проверки внешних ключей
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
