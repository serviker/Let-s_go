<?php

namespace App\Http\Controllers\Message;

use App\Http\Controllers\Controller;
use App\Http\Requests\Message\UpdateRequest;
use App\Models\Address;
use App\Models\Message;
use App\Models\Order;

class UpdateController extends Controller
{
    public function __invoke(UpdateRequest $request, Message $message) {
        $data = $request->validated();
        $message->update($data);
        return redirect()->route('message.show', $message->id);
        }
}
