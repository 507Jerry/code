'use client';

import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ChromePicker } from 'react-color';
import html2canvas from 'html2canvas';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * QR Code 生成器组件
 * 支持多种内容类型、自定义样式、Logo 上传和拖拽等功能
 */
const QRCodeGenerator = () => {
  const { t } = useLanguage();
  
  // 基础状态
  const [activeTab, setActiveTab] = useState('url');
  const [qrValue, setQrValue] = useState('');
  const [qrSize, setQrSize] = useState(400);
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [showColorPicker, setShowColorPicker] = useState({ fg: false, bg: false });
  
  // Logo 相关状态
  const [logoFile, setLogoFile] = useState(null);
  const [logoUrl, setLogoUrl] = useState('');
  const [logoPosition, setLogoPosition] = useState({ x: 50, y: 50 });
  const [logoSize, setLogoSize] = useState(60);
  const [logoOpacity, setLogoOpacity] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // 引用
  const qrContainerRef = useRef(null);
  const logoRef = useRef(null);
  
  // 内容类型配置
  const contentTypes = {
    url: { label: t('content_type_url'), placeholder: t('placeholder_url') },
    text: { label: t('content_type_text'), placeholder: t('placeholder_text') },
    phone: { label: t('content_type_phone'), placeholder: t('placeholder_phone') },
    sms: { label: t('content_type_sms'), placeholder: t('placeholder_sms') },
    email: { label: t('content_type_email'), placeholder: t('placeholder_email') },
    vcard: { label: t('content_type_vcard'), placeholder: t('placeholder_vcard_name') },
    wifi: { label: t('content_type_wifi'), placeholder: t('placeholder_wifi_ssid') }
  };

  // 生成 QR Code 内容
  const generateQRContent = () => {
    switch (activeTab) {
      case 'url':
        return qrValue;
      case 'text':
        return qrValue;
      case 'phone':
        return `tel:${qrValue}`;
      case 'sms':
        return `sms:${qrValue}`;
      case 'email':
        return `mailto:${qrValue}`;
      case 'vcard':
        return generateVCard();
      case 'wifi':
        return generateWiFiConfig();
      default:
        return qrValue;
    }
  };

  // 生成 vCard 格式
  const generateVCard = () => {
    const vcardData = {
      name: qrValue,
      phone: document.getElementById('vcard-phone')?.value || '',
      email: document.getElementById('vcard-email')?.value || '',
      company: document.getElementById('vcard-company')?.value || '',
      title: document.getElementById('vcard-title')?.value || ''
    };
    
    return `BEGIN:VCARD
VERSION:3.0
FN:${vcardData.name}
TEL:${vcardData.phone}
EMAIL:${vcardData.email}
ORG:${vcardData.company}
TITLE:${vcardData.title}
END:VCARD`;
  };

  // 生成 Wi-Fi 配置
  const generateWiFiConfig = () => {
    const ssid = qrValue;
    const password = document.getElementById('wifi-password')?.value || '';
    const encryption = document.getElementById('wifi-encryption')?.value || 'WPA';
    
    return `WIFI:T:${encryption};S:${ssid};P:${password};;`;
  };

  // Logo 文件处理
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setLogoUrl(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Logo 拖拽处理
  const handleLogoMouseDown = (e) => {
    if (!logoRef.current) return;
    
    setIsDragging(true);
    const rect = logoRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleLogoMouseMove = (e) => {
    if (!isDragging || !qrContainerRef.current) return;
    
    const containerRect = qrContainerRef.current.getBoundingClientRect();
    const newX = ((e.clientX - containerRect.left - dragOffset.x) / containerRect.width) * 100;
    const newY = ((e.clientY - containerRect.top - dragOffset.y) / containerRect.height) * 100;
    
    setLogoPosition({
      x: Math.max(0, Math.min(100 - logoSize, newX)),
      y: Math.max(0, Math.min(100 - logoSize, newY))
    });
  };

  const handleLogoMouseUp = () => {
    setIsDragging(false);
  };

  // 下载 QR Code
  const downloadQRCode = async () => {
    if (!qrContainerRef.current) return;
    
    try {
      const canvas = await html2canvas(qrContainerRef.current, {
        backgroundColor: backgroundColor,
        scale: 2
      });
      
      const link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error(t('download_failed'), error);
    }
  };

  // 复制 QR Code
  const copyQRCode = async () => {
    if (!qrContainerRef.current) return;
    
    try {
      const canvas = await html2canvas(qrContainerRef.current, {
        backgroundColor: backgroundColor,
        scale: 2
      });
      
      canvas.toBlob(async (blob) => {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          alert(t('copy_success'));
        } catch (error) {
          console.error(t('copy_failed'), error);
        }
      });
    } catch (error) {
      console.error('生成图片失败:', error);
    }
  };

  // 打印 QR Code
  const printQRCode = () => {
    const printWindow = window.open('', '_blank');
    const qrContent = qrContainerRef.current?.innerHTML;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code</title>
          <style>
            body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
            .qr-container { background: ${backgroundColor}; padding: 20px; }
          </style>
        </head>
        <body>
          <div class="qr-container">${qrContent}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // 清除 Logo
  const clearLogo = () => {
    setLogoFile(null);
    setLogoUrl('');
    setLogoPosition({ x: 50, y: 50 });
  };

  // 监听全局鼠标事件
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleLogoMouseMove);
      document.addEventListener('mouseup', handleLogoMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleLogoMouseMove);
        document.removeEventListener('mouseup', handleLogoMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          QR Code 生成器
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：输入表单 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* 内容类型选择 */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">{t('content_type_title')}</h2>
              <div className="flex flex-wrap gap-2">
                {Object.entries(contentTypes).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === key
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {config.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 内容输入 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {contentTypes[activeTab].label}
              </label>
              <input
                type="text"
                value={qrValue}
                onChange={(e) => setQrValue(e.target.value)}
                placeholder={contentTypes[activeTab].placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 特殊字段（vCard 和 WiFi） */}
            {(activeTab === 'vcard' || activeTab === 'wifi') && (
              <div className="mb-6 space-y-3">
                {activeTab === 'vcard' && (
                  <>
                    <input
                      id="vcard-phone"
                      type="tel"
                      placeholder={t('placeholder_vcard_phone')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      id="vcard-email"
                      type="email"
                      placeholder={t('placeholder_vcard_email')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      id="vcard-company"
                      type="text"
                      placeholder={t('placeholder_vcard_company')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      id="vcard-title"
                      type="text"
                      placeholder={t('placeholder_vcard_title')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </>
                )}
                {activeTab === 'wifi' && (
                  <>
                    <input
                      id="wifi-password"
                      type="password"
                      placeholder={t('placeholder_wifi_password')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <select
                      id="wifi-encryption"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="WPA">{t('wifi_encryption_wpa')}</option>
                      <option value="WEP">{t('wifi_encryption_wep')}</option>
                      <option value="nopass">{t('wifi_encryption_none')}</option>
                    </select>
                  </>
                )}
              </div>
            )}

            {/* 样式设置 */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">{t('style_title')}</h2>
              
              {/* 尺寸选择 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('style_qr_size')}
                </label>
                <select
                  value={qrSize}
                  onChange={(e) => setQrSize(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={200}>200px</option>
                  <option value={400}>400px</option>
                  <option value={600}>600px</option>
                </select>
              </div>

              {/* 颜色选择 */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('style_foreground_color')}
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowColorPicker(prev => ({ ...prev, fg: !prev.fg }))}
                      className="w-full h-10 border border-gray-300 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: foregroundColor }}
                    >
                      <span className="text-white text-sm font-medium">{t('style_select_color')}</span>
                    </button>
                    {showColorPicker.fg && (
                      <div className="absolute z-10 mt-2">
                        <ChromePicker
                          color={foregroundColor}
                          onChange={(color) => setForegroundColor(color.hex)}
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('style_background_color')}
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowColorPicker(prev => ({ ...prev, bg: !prev.bg }))}
                      className="w-full h-10 border border-gray-300 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: backgroundColor }}
                    >
                      <span className="text-sm font-medium">{t('style_select_color')}</span>
                    </button>
                    {showColorPicker.bg && (
                      <div className="absolute z-10 mt-2">
                        <ChromePicker
                          color={backgroundColor}
                          onChange={(color) => setBackgroundColor(color.hex)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Logo 上传 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('style_logo_upload')}
                </label>
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={handleLogoUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {logoUrl && (
                  <button
                    onClick={clearLogo}
                    className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    {t('style_clear_logo')}
                  </button>
                )}
              </div>

              {/* Logo 设置 */}
              {logoUrl && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('style_logo_size')} ({logoSize}px)
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="120"
                      value={logoSize}
                      onChange={(e) => setLogoSize(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('style_logo_opacity')} ({Math.round(logoOpacity * 100)}%)
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.1"
                      value={logoOpacity}
                      onChange={(e) => setLogoOpacity(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 右侧：预览区域 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">{t('preview_title')}</h2>
            <div className="flex justify-center">
              <div
                ref={qrContainerRef}
                className="relative inline-block"
                style={{ backgroundColor }}
              >
                <QRCodeSVG
                  value={generateQRContent()}
                  size={qrSize}
                  fgColor={foregroundColor}
                  bgColor={backgroundColor}
                  level="M"
                />
                
                {/* Logo 覆盖层 */}
                {logoUrl && (
                  <div
                    ref={logoRef}
                    className="absolute cursor-move"
                    style={{
                      left: `${logoPosition.x}%`,
                      top: `${logoPosition.y}%`,
                      width: `${logoSize}px`,
                      height: `${logoSize}px`,
                      opacity: logoOpacity,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onMouseDown={handleLogoMouseDown}
                  >
                    <img
                      src={logoUrl}
                      alt="Logo"
                      className="w-full h-full object-contain"
                      draggable={false}
                    />
                  </div>
                )}
              </div>
            </div>
            
            {logoUrl && (
              <p className="text-sm text-gray-500 text-center mt-2">
                {t('preview_drag_tip')}
              </p>
            )}
          </div>
        </div>

        {/* 底部操作按钮 */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={downloadQRCode}
            className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            {t('button_download')}
          </button>
          
          <button
            onClick={copyQRCode}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            {t('button_copy')}
          </button>
          
          <button
            onClick={printQRCode}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors"
          >
            {t('button_print')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator; 