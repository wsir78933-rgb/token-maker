import '../globals.css';

import { CoatMakerDocument } from '@/components/coat-of-arms/CoatMakerDocument';

export default function EnglishCoatMakerRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <CoatMakerDocument locale="en">{children}</CoatMakerDocument>;
}
