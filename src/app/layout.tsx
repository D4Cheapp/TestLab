import React from 'react';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import Providers from '../components/common/Providers';
import ErrorContainer from '../components/common/ErrorContainer';
import 'src/styles/globals.scss';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['cyrillic', 'latin'],
});

export const metadata: Metadata = {
  title: 'Test Lab',
  description:
    'Test Lab - ваш надежный помощник для создания и прохождения тестов. Интуитивный интерфейс, \
    мощные инструменты и возможность генерировать разнообразные вопросы делают наше приложение \
    идеальным выбором для студентов, преподавателей и всех, кто стремится проверить свои знания.',
};

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Providers>
          <ErrorContainer />
          {children}
        </Providers>
      </body>
    </html>
  );
}
