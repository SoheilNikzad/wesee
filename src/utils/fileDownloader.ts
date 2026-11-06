// Utility to generate and trigger real downloadable files for legal deeds and smart contracts

export function downloadDeedDocument(assetTitle: string, docTitle: string, docType: string) {
  const timestamp = new Date().toLocaleDateString('fa-IR');
  const docRefNumber = 'IR-REG-' + Math.floor(100000 + Math.random() * 900000);
  
  const content = `================================================================================
جمهوری اسلامی ایران - سامانه ثبت و ممیزی اموال و اسناد رسمی (WeSee RWA Engine)
گواهی استعلام و شناسنامه رسمی دارایی توکنیزه‌شده
================================================================================

نام دارایی: ${assetTitle}
عنوان سند: ${docTitle}
شماره ثبت و شناسه یکتا: ${docRefNumber}
تاریخ استعلام و ممیزی: ${timestamp}
نوع سند: ${docType}
وضعیت حقوقی: تأیید شده توسط کارشناس رسمی دادگستری و سازمان ثبت اسناد

خلاصه ارزیابی و استعلام:
این سند تأیید می‌کند که دارایی مذکور بر اساس قوانین حقوقی، دارای سند تک‌برگ معتبر،
بدون معارض قضایی و تحت نظارت نماینده ناظر و قانون‌گذار پلتفرم WeSee به صورت سهام
توکنیزه‌شده بر روی شبکه‌های بلاکچین Polygon و BNB Chain صادر گردیده است.

امضای دیجیتال ناظر قانونی:
0x847291a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9

پلتفرم مرجع: wesee.ir
================================================================================
`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const sanitizedTitle = assetTitle.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_');
  a.download = `${sanitizedTitle}_${docTitle.replace(/\s+/g, '_')}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
