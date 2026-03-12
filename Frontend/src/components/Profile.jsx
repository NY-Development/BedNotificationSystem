import React, { useState } from 'react';
import { uploadProfileImage } from '../services/profileAPI';
import { requestRoleChange } from '../services/auth'; 
import toast from 'react-hot-toast';
import { Camera, User, Mail, ShieldCheck, X, Activity } from 'lucide-react';

const Profile = ({ onClose, user }) => {
    const [image, setImage] = useState(user?.image || '');
    const [file, setFile] = useState(null); 
    const [name, setName] = useState(user?.name || ''); 
    const [email, setEmail] = useState(user?.email || ''); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [roleRequest, setRoleRequest] = useState('');
    const [sendingRole, setSendingRole] = useState(false);

    const handleRoleChangeRequest = async () => {
        if (!roleRequest) {
            toast.error("Please select a role.");
            return;
        }
        try {
            setSendingRole(true);
            const res = await requestRoleChange(roleRequest); 
            toast.success(res.message || "Request sent to Administration!");
            setRoleRequest('');
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || "Failed to send request.");
        } finally {
            setSendingRole(false);
        }
    };

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => setImage(reader.result);
            setFile(selectedFile);
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData();
        if (file) formData.append('image', file);
        formData.append('name', name); 
        formData.append('email', email);

        try {
            await uploadProfileImage(formData);
            toast.success('Medical Profile Updated.');
            onClose();
        } catch (err) {
            setError(err.message || 'Update failed.');
            toast.error('Could not update profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            {/* Main Card */}
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-white overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="px-8 pt-8 pb-4 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                            <Activity size={20} />
                        </div>
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                            Provider Profile
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto px-8 pb-8 no-scrollbar">
                    {error && (
                        <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl mb-6 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            <ShieldCheck size={16} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        
                        {/* Avatar Upload */}
                        <div className="flex flex-col items-center">
                            <div className="relative group">
                                <input type="file" onChange={handleImageChange} accept="image/*" className="hidden" id="profile-upload" />
                                <label htmlFor="profile-upload" className="block relative cursor-pointer">
                                    <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-slate-50 shadow-xl ring-1 ring-slate-200">
                                        {image ? (
                                            <img src={image} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                <User size={40} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-blue-600/60 flex items-center justify-center rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <Camera className="text-white" size={28} />
                                    </div>
                                </label>
                            </div>
                            <span className="mt-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Clinical ID Photo</span>
                        </div>

                        {/* Input Fields */}
                        <div className="space-y-4">
                            <div className="relative">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="text" value={name} onChange={(e) => setName(e.target.value)} 
                                        className="w-full bg-slate-50 border border-slate-100 pl-12 pr-4 py-4 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                                        placeholder="Enter name" required
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                                        className="w-full bg-slate-50 border border-slate-100 pl-12 pr-4 py-4 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                                        placeholder="Enter email" required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Role Request Section */}
                        <div className="bg-teal-50/50 rounded-3xl p-6 border border-teal-100">
                            <div className="flex items-center gap-2 mb-4">
                                <ShieldCheck className="text-teal-600" size={18} />
                                <h3 className="text-xs font-black text-teal-800 uppercase tracking-widest">Medical Access Level</h3>
                            </div>
                            
                            <div className="flex gap-2">
                                <select
                                    value={roleRequest}
                                    onChange={(e) => setRoleRequest(e.target.value)}
                                    className="flex-1 bg-white border border-teal-200 px-4 py-3 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-teal-200"
                                >
                                    <option value="">Select Target Role</option>
                                    <option value="c1">C1 (Clinical Yr 1)</option>
                                    <option value="c2">C2 (Clinical Yr 2)</option>
                                    <option value="intern">Intern Resident</option>
                                </select>
                                <button
                                    type="button" onClick={handleRoleChangeRequest}
                                    disabled={sendingRole || !roleRequest}
                                    className="px-4 py-3 bg-teal-600 text-white rounded-xl text-xs font-black uppercase tracking-tighter hover:bg-teal-700 disabled:opacity-50 transition-all active:scale-95"
                                >
                                    {sendingRole ? "..." : "Request"}
                                </button>
                            </div>
                            <p className="mt-3 text-[10px] font-bold text-teal-600/70 italic text-center uppercase tracking-wider">
                                Current Status: {user?.role || 'Unverified'}
                            </p>
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button" onClick={onClose}
                                className="flex-1 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all"
                            >
                                Dismiss
                            </button>
                            <button
                                type="submit" disabled={loading}
                                className="flex-[2] px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-white bg-blue-600 shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98]"
                            >
                                {loading ? "Updating Records..." : "Save Profile"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;