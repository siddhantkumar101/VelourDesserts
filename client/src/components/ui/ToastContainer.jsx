import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from '../../stores/uiSlice';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContainer = () => {
  const toasts = useSelector((state) => state.ui.toasts);
  const dispatch = useDispatch();

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        dispatch(removeToast(toasts[0].id));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toasts, dispatch]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => {
        const isError = toast.type === 'error' || toast.type === 'danger';
        const isSuccess = toast.type === 'success';
        
        return (
          <div 
            key={toast.id} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border animate-fade-in
              ${isError ? 'bg-white border-error text-error' : 
                isSuccess ? 'bg-white border-success text-success' : 
                'bg-chocolate text-cream border-chocolate-dark'}`}
          >
            {isError ? <AlertCircle className="w-5 h-5" /> : 
             isSuccess ? <CheckCircle className="w-5 h-5" /> : 
             <Info className="w-5 h-5" />}
             
            <p className="text-sm font-medium pr-6">{toast.message}</p>
            
            <button 
              onClick={() => dispatch(removeToast(toast.id))}
              className="absolute right-3 p-1 rounded-full hover:bg-black/5"
            >
              <X className="w-4 h-4 opacity-50 hover:opacity-100" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
