import './globals.css';
import { LanguageProvider } from '../contexts/LanguageContext';

export const metadata = {
  title: 'QR Code Generator',
  description: '功能完整的二维码生成工具',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
} 