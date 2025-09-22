// MyAssignments.js
import React, { useEffect, useState } from 'react';
import { useAssignment } from '../context/AssignmentContext';
import { useAuth } from '../context/AuthContext';
import GoBack from '../components/GoBack';
import { Timer } from 'lucide-react';

const MyAssignments = () => {
  const { getUserAssignment, userAssign } = useAssignment();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      try {
        if (user) {
          await getUserAssignment();
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, [user]);

  const hasAssignments = userAssign && userAssign.beds && userAssign.beds.length > 0;

  const groupedBeds = {};
  if (hasAssignments) {
    userAssign.beds.forEach(bed => {
      const ward = userAssign.ward || 'Unassigned Ward'; 
      if (!groupedBeds[ward]) {
        groupedBeds[ward] = [];
      }
      groupedBeds[ward].push(bed);
    });
  }

  return (
    <div className='bg-gray-100 min-h-screen p-8'>
      <div className='container mx-auto max-w-4xl'>
        <GoBack />
        <h1 className='text-center text-5xl font-extrabold text-gray-800 mb-10'>Your Bed Assignments 🛏️</h1>
        {loading ? (
          <div className='flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-xl border border-gray-200'>
            <Timer size={64} className="text-gray-400 mb-4 animate-pulse" />
            <div
              className="w-16 h-16 rounded-full border-4 border-gray-300 border-t-indigo-500 spinner-border mt-4"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
            <p className='text-2xl font-semibold text-gray-700 mt-4'>Getting your assignments...</p>
          </div>
        ) : hasAssignments ? (
          <div>
            {Object.keys(groupedBeds).map(ward => (
              <div key={ward} className='mb-12'>
                <h2 className='text-3xl font-bold text-gray-700 mb-6 border-b-2 border-gray-300 pb-2'>{ward}</h2>
                <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
                  {groupedBeds[ward].map((uab, index) => (
                    <div
                      key={index}
                      className='bg-white shadow-xl rounded-2xl overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl'
                    >
                      <div className={`p-6 ${uab.status === 'available' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                        <h3 className='text-2xl font-bold text-white'>{`Bed ID: ${uab.id}`}</h3>
                        <p className='text-white text-lg font-semibold'>{uab.status}</p>
                      </div>
                      <div className='p-6 text-gray-700'>
                        <p className='text-sm uppercase font-semibold text-gray-500'>Assigned To</p>
                        <p className='text-lg font-medium mb-1'>{userAssign.createdBy.name}</p>
                        <p className='text-md text-gray-600 mb-1'>{userAssign.createdBy.email}</p>
                        <p className='text-md text-gray-600'>{userAssign.createdBy.role === 'c1' ? (
                          `Clinical Year I Student`
                        ) : (
                          userAssign.createdBy.role === 'c2' ? (
                          `Clinical Year II Student`) : 
                          ( userAssign.createdBy.role === 'admin' ? (
                            `Admin`
                          ) :(
                            `Intern`
                          )
                        ))}</p>
                      </div>
                      <div className='p-6 bg-gray-50 border-t border-gray-200'>
                        <p className='text-sm uppercase font-semibold text-gray-500'>Location</p>
                        <p className='text-lg font-medium'>{userAssign.department}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-xl border border-gray-200'>
            <div className='text-6xl text-gray-400 mb-4'>😴</div>
            <p className='text-2xl font-semibold text-gray-700'>You've earned a break! No beds assigned to you right now.</p>
            <p className='text-lg text-gray-500 mt-2'>Check back later for new assignments.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAssignments;