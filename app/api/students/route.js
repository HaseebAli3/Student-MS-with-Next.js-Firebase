import { NextResponse } from 'next/server';
import { ref, remove, get, push, update } from 'firebase/database';
import { database } from '@/lib/firebase';

export async function PUT(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const body = await req.json();
  const studentRef = ref(database, `students/${id}`);
  await update(studentRef, body);

  return NextResponse.json({ success: true });
}



export async function GET() {
  const dbRef = ref(database, 'students');
  const snapshot = await get(dbRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    const students = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
    return NextResponse.json(students);
  }
  return NextResponse.json([]);
}

export async function POST(req) {
  const body = await req.json();
  const dbRef = ref(database, 'students');
  const newStudent = await push(dbRef, body);
  return NextResponse.json({ id: newStudent.key, ...body });
}

// 🆕 ADD THIS DELETE handler:
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const studentRef = ref(database, `students/${id}`);
  await remove(studentRef);

  return NextResponse.json({ success: true });
}
