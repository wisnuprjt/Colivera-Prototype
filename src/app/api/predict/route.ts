import { NextRequest, NextResponse } from 'next/server';

// HuggingFace API URL
const HUGGINGFACE_API_URL = 'https://gary29-water-quality-ai.hf.space';

export async function POST(request: NextRequest) {
  try {
    // Get request body with sensor data
    const body = await request.json();
    
    // Fetch directly from HuggingFace API with sensor data and timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout for prediction
    
    const response = await fetch(`${HUGGINGFACE_API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();
    
    // Handle different status codes
    if (response.status === 504) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Prediction timeout - HuggingFace Space sedang cold start.' 
        },
        { status: 504 }
      );
    }
    
    if (!response.ok) {
      return NextResponse.json(
        { status: 'error', message: data.message || 'Prediction API error' },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching prediction:', error);
    
    // Handle abort/timeout
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { 
            status: 'error', 
            message: 'Prediction timeout. HuggingFace Space mungkin sedang sleep.' 
          },
          { status: 504 }
        );
      }
      
      // Network errors
      if (error.message.includes('fetch')) {
        return NextResponse.json(
          { 
            status: 'error', 
            message: 'Tidak dapat terhubung ke HuggingFace Space untuk prediksi.' 
          },
          { status: 503 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
