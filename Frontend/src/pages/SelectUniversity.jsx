import React, { useState } from 'react';
import { Universities } from '../data/data';
import UniversityCard from '../components/UniversityCard';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowRight } from 'lucide-react';

const SelectUniversity = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [confirmData, setConfirmData] = useState({});
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleUniversitySelect = (university) => {
        localStorage.setItem("university", university?.name);
        toast.success(`Access Granted: ${university.name}`);
        navigate('/schools');
    };

    const openConfirm = (university) => {
        setConfirmData({
            title: "Switch Campus",
            message: <>Confirming redirection to <span className="text-indigo-600">{university.name}</span>. This will update your local session data.</>,
            onConfirm: () => handleUniversitySelect(university)
        });
        setIsOpen(true);
    };

    if (!user) return <AccessDenied />;

    return (
        <div className='bg-[#F8FAFC] min-h-screen p-6 md:p-12'>
            <div className='container mx-auto max-w-6xl'>
                {/* Header Section */}
                <div className="mb-16">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-1 w-12 bg-indigo-600 rounded-full" />
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600">Institution Gateway</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4">
                        Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">{user.name.split(' ')[0]}</span>
                    </h1>
                    <p className='text-lg font-bold text-slate-500 max-w-2xl leading-relaxed italic'>
                        Please select your affiliated university to access the clinical department mapping and bed management system.
                    </p>
                </div>

                {/* Selection Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {Universities.map((uni) => (
                        <UniversityCard
                            key={uni.name}
                            university={uni}
                            onClick={() => openConfirm(uni)}
                        />
                    ))}
                </div>
            </div>
            
            <ConfirmModal
                isOpen={isOpen}
                title={confirmData.title}
                message={confirmData.message}
                onConfirm={confirmData.onConfirm}
                onCancel={() => setIsOpen(false)}
                isDestructive={false}
            />
        </div>
    );
};

// Internal Access Denied Component for Beauty
const AccessDenied = () => (
    <div className='flex items-center justify-center min-h-screen bg-slate-50 p-8'>
        <div className='bg-white shadow-2xl rounded-[3rem] p-12 max-w-md w-full border border-slate-100 text-center'>
            <div className='w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-100'>
                <GraduationCap className="text-rose-500" size={40} />
            </div>
            <h2 className='text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4'>Access Denied</h2>
            <p className='text-sm font-bold text-slate-400 mb-8 leading-relaxed'>
                Unauthorized terminal access detected. Please authenticate your credentials to view institutions.
            </p>
            <a href="/login" className='flex items-center justify-center gap-2 w-full bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest py-5 rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200'>
                Return to Login <ArrowRight size={14} />
            </a>
        </div>
    </div>
);

export default SelectUniversity;