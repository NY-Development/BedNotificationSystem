import React, { useState } from 'react';

const Profile = ({ onClose, user }) => {
  const [image, setImage] = useState(user?.image || '');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated Image:', image);
    onClose(); // Close the modal after submission
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs z-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-black text-center">Update Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <img src={image} alt="Profile" className="text-center border-2 h-24 w-24 rounded-full mb-2" />
            <input type="file" onChange={handleImageChange} accept="image/*" className='border-2 rounded-full border-black'/>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded cp">Update</button>
          <button type="button" onClick={onClose} className="ml-2 bg-gray-300 text-black px-4 py-2 rounded cp">Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;