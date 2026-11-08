import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Heart, RefreshCw, AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message || 'Lỗi không xác định' };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-pink-200 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-pink-100 text-rose-500 mx-auto flex items-center justify-center text-3xl">
              <Heart className="w-8 h-8 fill-rose-500 animate-pulse" />
            </div>
            
            <h2 className="font-['Dancing_Script'] text-3xl font-bold text-gray-800">
              Our Love Story
            </h2>

            <p className="text-sm text-gray-600">
              Có một chút sự cố dữ liệu nhỏ trong trình duyệt của bạn. Bấm nút bên dưới để khôi phục lại trang web nhé!
            </p>

            {this.state.errorMessage && (
              <div className="p-3 bg-rose-50 rounded-xl text-xs text-rose-700 font-mono break-all text-left">
                {this.state.errorMessage}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full py-3 rounded-full font-bold text-sm bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200 hover:opacity-95 transition flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Khôi phục dữ liệu ban đầu 💕</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

