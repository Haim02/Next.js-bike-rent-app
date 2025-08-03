import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { cookies } from "next/headers";


export async function POST() {
    const session = await getServerSession(authOptions);

  if (session) {
     const cookieStore = await cookies();
        cookieStore.delete("session");
    return NextResponse.redirect(new URL('/', process.env.NEXTAUTH_URL), {
      status: 302,
      headers: {
        'Set-Cookie': 'next-auth.session-token=; Max-Age=0; Path=/;',
      },
    });
  }

  return NextResponse.json({ message: 'לא מחובר' }, { status: 401 });
}
