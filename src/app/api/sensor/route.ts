import { NextResponse } from 'next/server';

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
      
      // Jangan retry jika AbortError atau sudah retry terakhir
      if (error instanceof Error && error.name === 'AbortError') {
        console.log(`Attempt ${i + 1} timed out, retrying...`);
      }
      
      if (i < maxRetries) {
        // Wait 2 seconds before retry
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log(`Retrying... (${i + 1}/${maxRetries})`);
      }
    }
  }
  
  throw lastError;
}

export async function GET() {
  try {
    const response = await fetchWithRetry(
      'https://gary29-water-quality-ai.hf.space/iot/latest',
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      },
      2 // Max 2 retries (total 3 attempts)
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    
    // Return error dengan informasi lebih detail
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { 
            status: 'error', 
            message: 'API timeout - HuggingFace Space mungkin sedang cold start. Silakan tunggu beberapa saat.' 
          },
          { status: 504 } // Gateway Timeout
        );
      }
    }
    
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
