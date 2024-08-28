<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\CarBrand;

class CarBrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * команда в консоле для сида машин php artisan db:seed --class=CarBrandSeeder
     */
    public function run(): void
    {
        $jsonFile = base_path('database/seeders/filtered_data.json');

        if (File::exists($jsonFile)) {
            $data = json_decode(File::get($jsonFile), true);

            foreach ($data as $brandName => $models) {
                foreach ($models as $modelName) {
                    CarBrand::create([
                        'brand' => $brandName,
                        'model' => $modelName,
                    ]);
                }
            }

            echo "Car brands and models have been successfully seeded!";
        } else {
            echo "JSON file not found!";
        }
    }
}
