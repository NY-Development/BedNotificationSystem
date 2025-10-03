import React, { useState } from 'react';
import { uploadProfileImage } from '../services/profileAPI'; // Adjust the import path as necessary
import { requestRoleChange } from '../services/auth'; 
import toast from 'react-hot-toast';

// Icon for the upload overlay
const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.218A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.218A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const Profile = ({ onClose, user }) => {
    const [image, setImage] = useState(user?.image || '');
    const [file, setFile] = useState(null); 
    const [name, setName] = useState(user?.name || ''); 
    const [email, setEmail] = useState(user?.email || ''); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [roleRequest, setRoleRequest] = useState('');
    const [sendingRole, setSendingRole] = useState(false);

    const scrollableClass = "overflow-y-auto no-scrollbar max-h-[90vh]"; 

    const handleRoleChangeRequest = async () => {
        if (!roleRequest) {
            toast.error("Please select a role.");
            return;
        }
        try {
            setSendingRole(true);
            const res = await requestRoleChange(roleRequest); 
            toast.success(res.message || "Role change request sent!");
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
            reader.onloadend = () => {
                setImage(reader.result);
            };
            setFile(selectedFile);
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData();
        if (file) {
            formData.append('image', file);
        }
        formData.append('name', name); 
        formData.append('email', email);

        try {
            const uploadResponse = await uploadProfileImage(formData);
            toast.success('Profile Updated Successfully.');
            onClose();
        } catch (err) {
            setError(err.message || 'An unknown error occurred.');
            toast.error('Error Updating Profile.');
            console.error('Upload failed:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            <div className="fixed inset-0 flex items-start justify-center p-4 backdrop-blur-sm z-50 overflow-y-auto pt-8 sm:pt-16">
                <div 
                    className={`bg-white w-full max-w-lg p-6 sm:p-8 rounded-xl shadow-2xl transition-all duration-300 mb-10 ${scrollableClass}`}
                >
                    <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-6 border-b border-gray-100 pb-3 sticky top-0 bg-white z-10 shadow-sm">
                        Update Profile
                    </h2>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg mb-4 text-sm" role="alert">
                            <span className="font-medium">{error}</span>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6">
                        
                        <div className="flex flex-col items-center mb-4">
                            <input 
                                type="file" 
                                onChange={handleImageChange} 
                                accept="image/*" 
                                className="hidden"
                                id="file-input"
                            />
                            <label 
                                htmlFor="file-input" 
                                className="relative w-36 h-36 rounded-full cursor-pointer overflow-hidden border-4 border-indigo-300 hover:border-indigo-500 transition-colors duration-300 group shadow-lg ring-2 ring-indigo-100"
                            >
                                {image ? (
                                    <img 
                                        src={image} 
                                        alt="Profile Preview" 
                                        className="w-full h-full object-cover transition duration-300 group-hover:opacity-75" 
                                        onError={(e) => e.target.src = 'https://placehold.co/144x144/f0f0f0/808080?text=Error'} 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                                        <span className="text-sm text-center font-medium">No Photo</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <CameraIcon />
                                </div>
                            </label>
                            <p className="text-sm text-gray-500 mt-2">Change Profile Photo</p>
                        </div>

                        <div className="w-full space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                                <input 
                                    id="name"
                                    type="text" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    placeholder="Your Full Name" 
                                    className="w-full border border-gray-300 text-gray-900 p-3 rounded-lg shadow-sm focus:border-indigo-600 focus:ring-indigo-600 focus:ring-1 transition duration-150"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                                <input 
                                    id="email"
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    placeholder="name@example.com" 
                                    className="w-full border border-gray-300 text-gray-900 p-3 rounded-lg shadow-sm focus:border-indigo-600 focus:ring-indigo-600 focus:ring-1 transition duration-150"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="w-full pt-6">
                            <h3 className="text-xl font-bold text-gray-800 border-t border-gray-200 pt-4">Role & Access</h3>
                        </div>
                        
                        <div className="w-full p-5 border border-purple-200 rounded-xl bg-purple-50 shadow-inner space-y-4">
                            <h4 className="text-base font-bold text-purple-800 flex items-center">
                                <svg className="h-5 w-5 mr-2 text-purple-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.513l-.224-.131A7.001 7.001 0 003 10a7.001 7.001 0 0014 0 7.001 7.001 0 00-7.776-5.618l-.224.131V3a1 1 0 011-1zm3 10a1 1 0 10-2 0v3a1 1 0 102 0v-3z" clipRule="evenodd" />
                                </svg>
                                Request Access Level Change
                            </h4>
                            
                            <div className='flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0'>
                                <select
                                    value={roleRequest}
                                    onChange={(e) => setRoleRequest(e.target.value)}
                                    className="flex-grow border border-purple-300 p-3 rounded-lg focus:ring-purple-500 focus:border-purple-500 shadow-sm bg-white text-gray-800"
                                >
                                    <option value="">-- Select Requested Role --</option>
                                    {/* <option value="admin">Admin (Full Control)</option>
                                    <option value="supervisor">Supervisor (Management)</option> */}
                                    <option value="c1">C1 (Clinical Year 1 Student)</option>
                                    <option value="c2">C2 (Clinical Year 2 Student)</option>
                                    <option value="intern">Intern</option>
                                </select>
                                <button
                                    type="button"
                                    onClick={handleRoleChangeRequest}
                                    disabled={sendingRole || !roleRequest}
                                    className={`flex-shrink-0 px-6 py-3 rounded-lg font-semibold text-sm text-white shadow-md transition duration-150 ${
                                        sendingRole || !roleRequest
                                            ? 'bg-green-400 cursor-not-allowed'
                                            : 'bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                                    }`}
                                >
                                    {sendingRole ? "Sending..." : "Send Request"}
                                </button>
                            </div>
                            <p className="text-xs text-purple-700 mt-2">Your current role: **{user?.role || 'Guest'}**</p>
                        </div>

                        <div className="w-full flex justify-end space-x-3 pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2 text-sm font-semibold rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-150 shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-5 py-2 text-sm font-semibold rounded-lg text-white shadow-lg transition duration-150 transform hover:scale-[1.02] ${
                                    loading
                                        ? 'bg-indigo-400 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                }`}
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </span>
                                ) : 'Save Changes'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    );
};

export default Profile;