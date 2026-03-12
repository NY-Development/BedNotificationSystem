import React from 'react'
import { useAuth } from '../context/AuthContext';

const AccessDenied = () => {
  const {user} = useAuth();
  if (!user?.subscription?.isActive) {
    return (
      <div className="fixed inset-0 bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center p-12 bg-white rounded-[2rem] border border-slate-200 shadow-xl max-w-md">
          <ShieldAlert size={48} className="mx-auto text-slate-300 mb-6" />
          <h2 className="text-2xl font-black text-slate-900 mb-2 italic tracking-tight">Access Restricted</h2>
          <p className="text-slate-500 font-medium mb-8">Authentication required to access the notification terminal.</p>
          <Link to="/login" className="cp block w-full py-4 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }
}

export default AccessDenied