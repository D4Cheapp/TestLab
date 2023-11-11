import React from 'react';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.scss';
import Providers from "@/src/components/Provider/Providers";

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['cyrillic', 'latin'],
});

export const metadata: Metadata = {
  title: 'Test Lab',
  description:
    'Test Lab - ваш надежный помощник для создания и прохождения тестов. Интуитивный интерфейс, мощные инструменты и возможность генерировать разнообразные вопросы делают наше приложение идеальным выбором для студентов, преподавателей и всех, кто стремится проверить свои знания.',
};

interface RootLayoutInterface {
children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutInterface) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Providers>
           {children}
        </Providers>
      </body>
    </html>
  );
}
