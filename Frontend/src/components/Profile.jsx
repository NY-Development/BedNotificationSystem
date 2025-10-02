import React, { useState } from 'react';
import { uploadProfileImage } from '../services/profileAPI'; // Adjust the import path as necessary
// Assuming you have a role change API function
import { requestRoleChange } from '../services/profileAPI'; 
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
  const [file, setFile] = useState(null); // State to hold the file object
  const [name, setName] = useState(user?.name || ''); // State for name
  const [email, setEmail] = useState(user?.email || ''); // State for email
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [roleRequest, setRoleRequest] = useState('');
  const [sendingRole, setSendingRole] = useState(false);

  // --- Scrollbar Hide Styles ---
  // A common trick to hide the scrollbar without a plugin is to use a specific class
  // and style it in an external CSS file or style block for webkit browsers.
  // For this component, we'll use a wrapper and rely on simple overflow/padding on the card.
  
  // The actual scroll hiding must be done with custom CSS if you don't use a Tailwind plugin:
  // @layer utilities {
  //   .no-scrollbar::-webkit-scrollbar {
  //     display: none;
  //   }
  //   .no-scrollbar {
  //     -ms-overflow-style: none;  /* IE and Edge */
  //     scrollbar-width: none;  /* Firefox */
  //   }
  // }
  const scrollableClass = "overflow-y-auto no-scrollbar max-h-[90vh]"; // Max height + scrollable class

  const handleRoleChangeRequest = async () => {
    if (!roleRequest) {
      toast.error("Please select a role.");
      return;
    }
    try {
      setSendingRole(true);
      // Ensure requestRoleChange is properly imported and defined in profileAPI
      const res = await requestRoleChange({ requestedRole: roleRequest }); 
      toast.success(res.message || "Role change request sent!");
      setRoleRequest('');
    } catch (err) {
      // Use proper error handling
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
    // Modal Overlay and Backdrop
    // Use `min-h-screen` and `items-start` to better handle content taller than the viewport
    <div className="fixed inset-0 flex items-start justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm z-50 overflow-y-auto pt-10 sm:pt-20">
      
      {/* Modal Card - Responsive scrollable container */}
      <div 
        className={`bg-white w-full max-w-md p-6 sm:p-8 rounded-xl shadow-2xl transform transition-all duration-300 scale-100 opacity-100 mb-10 ${scrollableClass}`}
        // If you were able to use custom CSS, you'd add the 'no-scrollbar' class here:
        // className={`... mb-10 overflow-y-auto max-h-[90vh] no-scrollbar`}
      >
        <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-6 border-b pb-3 sticky top-0 bg-white z-10">
          Update Profile
        </h2>

        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
            </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
          
          {/* Image Upload Section */}
          <div className="flex flex-col items-center mb-6">
            <input 
              type="file" 
              onChange={handleImageChange} 
              accept="image/*" 
              className="hidden"
              id="file-input"
            />
            <label 
              htmlFor="file-input" 
              className="relative w-32 h-32 rounded-full cursor-pointer overflow-hidden border-4 border-indigo-200 hover:border-indigo-400 transition-colors duration-300 group shadow-lg"
            >
              {image ? (
                <img 
                  src={image} 
                  alt="Profile Preview" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                    <span className="text-sm text-center">No Photo</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <CameraIcon />
              </div>
            </label>
            <p className="text-sm text-gray-500 mt-2">Click to change photo</p>
          </div>

          {/* Form Fields */}
          <div className="w-full space-y-4">
            {/* Name Input */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input 
                  id="name"
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Your Name" 
                  className="w-full border border-gray-300 text-gray-900 p-3 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition duration-150"
                  required
                />
            </div>
            
            {/* Email Input */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  id="email"
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Your Email" 
                  className="w-full border border-gray-300 text-gray-900 p-3 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition duration-150"
                  required
                />
            </div>
          </div>
          
          <div className="w-full pt-6">
             <h3 className="text-lg font-bold text-gray-800 border-t pt-4">Other Actions</h3>
          </div>
          
          {/* Role Change Section */}
          <div className="w-full p-4 border border-indigo-100 rounded-lg bg-indigo-50 shadow-inner space-y-3">
            <h4 className="text-base font-semibold text-indigo-800">Request New Role</h4>
            <div className='flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0'>
                <select
                  value={roleRequest}
                  onChange={(e) => setRoleRequest(e.target.value)}
                  className="flex-grow border border-indigo-300 p-3 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm bg-white"
                >
                  <option value="">-- Select Requested Role --</option>
                  <option value="admin">Admin</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="c1">C1 (Level 1)</option>
                  <option value="c2">C2 (Level 2)</option>
                  <option value="intern">Intern</option>
                </select>
                <button
                  type="button"
                  onClick={handleRoleChangeRequest}
                  disabled={sendingRole || !roleRequest}
                  className={`flex-shrink-0 px-6 py-3 rounded-lg font-semibold text-sm text-white shadow-md transition duration-150 ${
                    sendingRole || !roleRequest
                      ? 'bg-indigo-300 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500'
                  }`}
                >
                  {sendingRole ? "Sending..." : "Send Request"}
                </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-semibold rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2 text-sm font-semibold rounded-lg text-white shadow-md transition duration-150 ${
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
  );
};

export default Profile;