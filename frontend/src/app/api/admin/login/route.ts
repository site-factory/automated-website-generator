import { NextResponse } from 'next/server';
import { isAdminPasswordValid, setAdminSession } from '@/lib/admin-auth';

export async function POST(request: Request) {
  const { password } = await request.json();

  if (!isAdminPasswordValid(String(password || ''))) {
    return NextResponse.json({ ok: false, error: 'Invalid password' }, { status: 401 });
  }

  await setAdminSession();
  return NextResponse.json({ ok: true });
}
