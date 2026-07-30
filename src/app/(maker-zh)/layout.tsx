import '../globals.css';

import { CoatMakerDocument } from '@/components/coat-of-arms/CoatMakerDocument';

export default function ChineseCoatMakerRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <CoatMakerDocument locale="zh">{children}</CoatMakerDocument>;
}
