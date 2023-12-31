// /app/layout.tsx
import './globals.css';

import Link from 'next/link';
import { ReactNode } from 'react';

import Head from '@/app/head';

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <html>
      <body>
        <Head />
        <header>
          <h1>Home Layout</h1>
          <Link href="/">
            <span className="ml-4 bg-green-100">Home</span>
          </Link>
          <Link href="/table" className="ml-4">
            <span className="ml-4 bg-red-100">Table</span>
          </Link>
          <Link href="/table1" className="ml-4">
            <span className="ml-4 bg-red-100">table new</span>
          </Link>
          <Link href="/tableNew" className="ml-4">
            <span className="ml-4 border-4 border-solid border-blue-400 bg-purple-400 text-3xl">
              移植用table New
            </span>
          </Link>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
