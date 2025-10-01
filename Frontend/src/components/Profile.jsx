import React, { useState } from 'react';
import { uploadProfileImage } from '../services/profileAPI'; // Adjust the import path as necessary
import toast from 'react-hot-toast';

const Profile = ({ onClose, user }) => {
  const [image, setImage] = useState(user?.image || '');
  const [file, setFile] = useState(null); // State to hold the file object
  const [name, setName] = useState(user?.name || ''); // State for name
  const [email, setEmail] = useState(user?.email || ''); // State for email
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      setFile(selectedFile); // Store the selected file
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file); // Append the file to the form data
    formData.append('name', name); // Append the name to the form data
    formData.append('email', email); // Append the email to the form data

    try {
      const uploadResponse = await uploadProfileImage(formData);
      toast.success('Profile Updated Successfully.');
      onClose(); // Close the modal after submission
    } catch (err) {
      setError(err.message); // Set error message
      toast.error('Error Updating Profile.');
      console.error('Upload failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs z-50">
      <div className="bg-white w-120 p-4 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-black text-center">Update Profile</h2>
        {error && <p className="text-red-500 text-center">{error}</p>} {/* Show error message */}
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <input 
            type="file" 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" // Hide the input
            id="file-input"
          />
          <label 
            htmlFor="file-input" 
            className="w-32 h-32 rounded-full bg-gray-200 cursor-pointer overflow-hidden mb-4 flex items-center justify-center"
          >
            {image ? (
              <img 
                src={image} 
                alt="Profile" 
                className="w-full h-full object-cover" 
              />
            ) : (
              <span className="text-gray-500">Upload Photo</span>
            )}
          </label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Your Name" 
            className="border border-black text-black mb-2 p-2 rounded w-full"
            required
          />
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Your Email" 
            className="border border-black text-black mb-4 p-2 rounded w-full"
            required
          />
          <button 
            type="submit" 
            className={`cp bg-blue-500 text-white px-4 py-2 rounded mb-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Uploading...' : 'Update'}
          </button>
          <button type="button" onClick={onClose} className="cp bg-gray-300 text-black px-4 py-2 rounded">Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;