import { NextRequest, NextResponse } from 'next/server';

// HuggingFace API URL
const HUGGINGFACE_API_URL = 'https://gary29-water-quality-ai.hf.space';

export async function GET(request: NextRequest) {
  try {
    // Fetch directly from HuggingFace API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(`${HUGGINGFACE_API_URL}/iot/latest`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
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
          message: 'HuggingFace Space timeout - mungkin sedang cold start.' 
        },
        { status: 504 }
      );
    }
    
    if (!response.ok) {
      return NextResponse.json(
        { status: 'error', message: data.message || 'HuggingFace API error' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching from HuggingFace:', error);
    
    // Handle abort/timeout
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { 
            status: 'error', 
            message: 'Request timeout. HuggingFace Space mungkin sedang sleep.' 
          },
          { status: 504 }
        );
      }
      
      // Network errors
      if (error.message.includes('fetch')) {
        return NextResponse.json(
          { 
            status: 'error', 
            message: 'Tidak dapat terhubung ke HuggingFace Space. Cek koneksi internet.' 
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
