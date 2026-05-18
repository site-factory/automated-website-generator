import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { updateLeadAdmin, type LeadStatus } from '@/lib/supabase';

const statuses = new Set<LeadStatus>(['new', 'contacted', 'converted', 'archived']);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const status = body.status as LeadStatus | undefined;
  const notes = typeof body.notes === 'string' ? body.notes : body.notes === null ? null : undefined;

  if (status && !statuses.has(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const lead = await updateLeadAdmin(id, { status, notes });
  return NextResponse.json({ lead });
}
