import React from 'react';
import { LocaleProvider } from '@/components/i18n/LocaleProvider';
import { DrawoltHomeClient } from '@/components/home/DrawoltHomeClient';

export default function HomePage() {
  return (
    <LocaleProvider initialLocale="en">
      <DrawoltHomeClient />
    </LocaleProvider>
  );
}
