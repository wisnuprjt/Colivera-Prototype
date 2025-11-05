import { NextRequest, NextResponse } from 'next/server';

// Retry helper function
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 2) {
  let lastError;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      lastError = error;
      
      if (error instanceof Error && error.name === 'AbortError') {
        console.log(`Predict attempt ${i + 1} timed out, retrying...`);
      }
      
      if (i < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log(`Retrying predict... (${i + 1}/${maxRetries})`);
      }
    }
  }
  
  throw lastError;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetchWithRetry(
      'https://gary29-water-quality-ai.hf.space/predict',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        cache: 'no-store',
      },
      2 // Max 2 retries
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error calling prediction API:', error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { 
            status: 'error', 
            message: 'Prediction timeout - HuggingFace Space sedang cold start. Akan retry otomatis.' 
          },
          { status: 504 }
        );
      }
    }
    
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
