// src/pages/SelectSchool.jsx
import React, { useState } from 'react';
import hosData from '../data/data';
import SchoolCard from '../components/SchoolCard';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';

const SelectSchool = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [confirmData, setConfirmData] = useState({});

    const handleSchoolSelect = (school) => {
        toast.success(`You have selected ${school.name}`);
        setIsOpen(false);
    };

    const openConfirm = (title, message, onConfirmCallback) => {
        setConfirmData({ title, message, onConfirm: onConfirmCallback });
        setIsOpen(true);
    };

    return (
        <div className='bg-gray-100 min-h-screen p-8 flex flex-col items-center'>
            <div className='container mx-auto max-w-5xl'>
                <h1 className='text-center text-5xl font-extrabold text-gray-800 mb-10'>
                    Select Your School
                </h1>
                <p className='text-center text-lg text-gray-600 mb-12'>
                    Please choose your school to see available departments and beds.
                </p>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                    {hosData.schools.map((school) => (
                        <SchoolCard
                            key={school.name}
                            school={school}
                            onClick={() => openConfirm(
                                `Confirm Selection`,
                                `Are you sure you want to select ${school.name}?`,
                                () => handleSchoolSelect(school)
                            )}
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

export default SelectSchool;