import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6 text-center font-vazir">
          <div className="max-w-md w-full p-8 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-[#F7931A]/10 text-[#F7931A] flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ⚠️
            </div>
            <h2 className="text-xl font-bold mb-2 text-white">خطای غیرمنتظره در بارگذاری داده‌ها</h2>
            <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
              متأسفانه مشکلی در ارتباط با سرور رخ داده است. برای ادامه می‌توانید صفحه را مجدداً بارگذاری نمایید.
            </p>
            <button
              onClick={() => {
                localStorage.removeItem('WESEE_FIREBASE_CONFIG');
                window.location.reload();
              }}
              className="px-6 py-2.5 rounded-xl bg-[#F7931A] hover:bg-[#E07E05] text-black font-bold text-sm transition-all"
            >
              بارگذاری مجدد صفحه
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
