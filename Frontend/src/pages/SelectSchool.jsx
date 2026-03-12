import React, { useState } from 'react';
import hosData from '../data/data';
import SchoolCard from '../components/SchoolCard';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Building, ArrowRight, ShieldCheck } from 'lucide-react';

const SelectSchool = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [confirmData, setConfirmData] = useState({});
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleSchoolSelect = (school) => {
        // Save to local storage to persist the session
        localStorage.setItem("university", school?.name);
        toast.success(`Unit Synchronized: ${school.name}`);
        setIsOpen(false);
        navigate('/dashboard');
    };

    const openConfirm = (school) => {
        setConfirmData({
            title: "Authorize School Access",
            message: (
                <>
                    You are about to initialize the dashboard for <span className="text-indigo-600 font-black">{school.name}</span>. 
                    Ensure you are authorized for this specific clinical unit.
                </>
            ),
            onConfirm: () => handleSchoolSelect(school)
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
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Departmental Node</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4">
                        Hello, <span className="text-indigo-600 italic">{user.name.split(' ')[0]}</span>
                    </h1>
                    <p className='text-lg font-bold text-slate-500 max-w-2xl leading-relaxed italic'>
                        Choose the specific clinical school or hospital branch to manage patient distributions and bed availability.
                    </p>
                </div>

                {/* School Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {hosData.schools.map((school) => (
                        <SchoolCard
                            key={school.name}
                            school={school}
                            onClick={() => openConfirm(school)}
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

// Reusable Internal Access Denied Component
const AccessDenied = () => (
    <div className='flex items-center justify-center min-h-screen bg-slate-50 p-8'>
        <div className='bg-white shadow-2xl rounded-[3rem] p-12 max-w-md w-full border border-slate-100 text-center'>
            <div className='w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6'>
                <ShieldCheck className="text-rose-500" size={32} />
            </div>
            <h2 className='text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2'>Session Required</h2>
            <p className='text-sm font-bold text-slate-400 mb-8 leading-relaxed px-4'>
                Please authenticate your terminal to access school-specific data nodes.
            </p>
            <a href="/login" className='flex items-center justify-center gap-2 w-full bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest py-5 rounded-2xl hover:bg-indigo-600 transition-all'>
                Return to Login <ArrowRight size={14} />
            </a>
        </div>
    </div>
);

export default SelectSchool;