
import './globals.css'; 
import { Inter } from 'next/font/google';
import ReduxProvider from './ReduxProvider'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Dashboard App',
  description: 'A responsive dashboard built with Next.js, Tailwind CSS, and Redux Toolkit.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}