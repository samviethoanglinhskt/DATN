<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\tb_logo_banner;
class LogoBannerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $logo_banner= tb_logo_banner::all(); // lấy logo_banner
        return response()->json($logo_banner);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
