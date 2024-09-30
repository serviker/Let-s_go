<?php
namespace Database\Seeders; // Убедитесь, что пространство имен установлено правильно
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class NotificationSeeder extends Seeder
{
    public function run()
    {
        DB::table('notifications')->insert([
            [
                'id' => (string) Str::uuid(),
                'type' => 'App\Notifications\TripCancelled', // Пример уведомления
                'notifiable_id' => 30, // ID пользователя
                'notifiable_type' => 'App\Models\User', // Тип модели
                'data' => json_encode([
                    'cancellation_reason' => 'Водитель отменил поездку',
                    'driver_id' => 1, // ID водителя, который отменил поездку
                    'driver_name' => 'Иван Иванов' // Имя водителя для отображения
                ]),
                'read_at' => null, // Оставим как непрочитанное
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'type' => 'App\Notifications\TripCancelled',
                'notifiable_id' => 29, // ID пользователя, которому адресовано уведомление (например, пассажиру)
                'notifiable_type' => 'App\Models\User',
                'data' => json_encode([
                    'cancellation_reason' => 'Водитель отменил поездку',
                    'driver_id' => 1, // ID водителя, который отменил поездку
                    'driver_name' => 'Иван Иванов' // Имя водителя для отображения
                ]),
                'read_at' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            // Добавьте больше уведомлений, если нужно
        ]);
    }
}
