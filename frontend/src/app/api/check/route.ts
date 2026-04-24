import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    // Fetch the URL to see if GitHub Pages has finished building it
    const res = await fetch(url, { cache: 'no-store' });
    
    // GitHub Pages returns 404 while it's building. Once it's live, it returns 200.
    if (res.status === 200) {
      return NextResponse.json({ live: true });
    }
    
    return NextResponse.json({ live: false, status: res.status });
  } catch (error) {
    return NextResponse.json({ live: false });
  }
}
