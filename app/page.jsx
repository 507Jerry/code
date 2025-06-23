'use client';

import React from 'react';
import QRCodeGenerator from '../components/QRCodeGenerator';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * 主页面 - 展示 QR Code 生成器组件
 */
export default function HomePage() {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 页面头部 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t('header_title')}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {t('header_subtitle')}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLanguage}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {language === 'zh' ? 'English' : '中文'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main>
        <QRCodeGenerator />
      </main>

      {/* 页面底部 */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>© 2025 QR Code Generator MADE BY NUNU IS CAT</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 
