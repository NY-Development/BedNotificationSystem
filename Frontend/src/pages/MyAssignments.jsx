import React, { useEffect, useState } from 'react';
import { useAssignment } from '../context/AssignmentContext';
import { useAuth } from '../context/AuthContext';
import GoBack from '../components/GoBack';
import { Timer, Plus, Minus } from 'lucide-react';
import { addBedsToAssignment, removeBedsFromAssignment } from '../services/assignment'; 
import toast from 'react-hot-toast';                        
import { useBed } from '../context/BedContext'; 

const MyAssignments = () => {

  const { getUserAssignment, userAssign } = useAssignment();
  const { user } = useAuth();
  // 🔑 FIX 1 (Data Sync): Destructure loadDepartments from useBed
  const { departments, loadDepartments } = useBed(); 
  const [loading, setLoading] = useState(false);
  // 🔑 FIX 2 (UI Bug): Replaced isUpdating with granular states
  const [isAdding, setIsAdding] = useState(false);
  const [removingBedId, setRemovingBedId] = useState(null);
  
  const [allDepartments, setAllDepartments] = useState([]);
  const [selectedBedToAdd, setSelectedBedToAdd] = useState('');

  // Effect 1: Fetch user assignments
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

  // Effect 2: Set all departments from BedContext
  useEffect(() => {
    setAllDepartments(departments);
  }, [departments]);

  const hasAssignments = userAssign && userAssign.beds && userAssign.beds.length > 0;

  // --- Utility Logic for UI ---
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

  // Find the currently assigned department/ward
  const currentDept = allDepartments?.find(d => d.name === userAssign?.department);
  const currentWard = currentDept?.wards.find(w => w.name === userAssign?.ward);

  // Filter available beds in the current ward that are NOT already assigned to the user
  const bedsToOffer = currentWard 
    ? currentWard.beds.filter(bed => {
        // Bed must not be assigned to anyone, AND must not be in the current user's assignment list
        return !bed.assignedUser && !userAssign.beds.some(uab => uab === bed.id);
      })
    : [];
  // -----------------------------


  // --- Core Update Logic (Add/Remove) ---
  const handleUpdateAssignment = async (action, bedIdToRemove = null) => {
    if (!userAssign || !userAssign._id) {
      toast.error("No current assignment found to modify.");
      return;
    }
    
    if (action === 'add' && !selectedBedToAdd) {
      toast.error("Please select a bed to add.");
      return;
    }

    const assignmentId = userAssign._id;
    
    try {
      if (action === 'add') {
        setIsAdding(true); // Start adding state
        const newBedId = selectedBedToAdd;
        await addBedsToAssignment(assignmentId, [newBedId]);
        toast.success('New Bed added to your Assignments.')

      } else if (action === 'remove' && bedIdToRemove) {
        setRemovingBedId(bedIdToRemove); // Start removing state for THIS bed
        await removeBedsFromAssignment(assignmentId, [bedIdToRemove]);
        toast.success('Assigned Bed Removed Successfully.')
      } else {
        throw new Error("Invalid action or missing bed ID.");
      }
      
      // 3. Reload assignments AND department data to reflect changes
      await getUserAssignment(); 
      // 🔑 CRITICAL FIX 3 (Data Sync): Refresh the source data for bedsToOffer
      await loadDepartments(); 
      
      setSelectedBedToAdd(''); // Reset selection
      
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${action} assignment: ${err.response?.data?.message || err.message || 'Server error'}`);
    } finally {
      // Reset the specific state that was set
      if (action === 'add') setIsAdding(false);
      if (action === 'remove') setRemovingBedId(null);
    }
  };
  // -----------------------------

  // Determine if any operation is running to globally disable main UI parts if necessary
  const isUpdatingAny = isAdding || !!removingBedId; 

  return (
    <div className='bg-gray-100 min-h-screen p-8'>
      <div className='container mx-auto max-w-4xl'>
        <GoBack />
        <h1 className='text-center text-5xl font-extrabold text-gray-800 mb-10'>Your Bed Assignments 🛏️</h1>

        {/* --- ADD BED FUNCTIONALITY --- */}
        {hasAssignments && (
          <div className='bg-white p-6 rounded-xl shadow-lg mb-8 border border-indigo-200'>
            <h2 className='text-xl font-bold text-indigo-700 mb-4 flex items-center'>
              <Plus className='w-5 h-5 mr-2' /> Update Assigned Beds :
            </h2>
            <div className='flex flex-col sm:flex-row gap-4'>
              <select
                className='flex-1 border p-3 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors'
                value={selectedBedToAdd}
                onChange={(e) => setSelectedBedToAdd(e.target.value)}
                disabled={isUpdatingAny || bedsToOffer.length === 0}
              >
                <option value="">{bedsToOffer.length > 0 ? `-- Add a bed in ${userAssign.ward} --` : `No available beds in ${userAssign.ward}`}</option>
                {bedsToOffer.map(bed => (
                  <option key={bed.id} value={bed.id}>
                    {bed.id}
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleUpdateAssignment('add')}
                disabled={isAdding || !selectedBedToAdd || isUpdatingAny}
                className={`cp py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                  isAdding || !selectedBedToAdd || isUpdatingAny
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isAdding ? 'Adding...' : <>Add Bed <Plus className='w-4 h-4 ml-1' /></>}
              </button>
            </div>
            {bedsToOffer.length === 0 && <p className='text-sm text-gray-500 mt-2'>All available beds in **{userAssign.ward}** are currently assigned or occupied.</p>}
            <p className='text-sm text-red-500 mt-2 font-medium'>
              *Note: Only unassigned beds from your current ward ({userAssign.ward}) are available for quick updates.
            </p>
          </div>
        )}
        {/* --------------------------------- */}


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
                      key={uab} // Use the bed ID for the key
                      className='bg-white shadow-xl rounded-2xl overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl'
                    >
                      {/* NOTE: uab is a string (bed ID), so uab.status is undefined. Assuming status is not used here for coloring */}
                      <div className={`p-6 ${uab.status === 'available' ? 'bg-green-400' : 'bg-red-500'}`}> 
                        <h3 className='text-2xl font-bold text-white'>{`Bed ID: ${uab.id}`}</h3>
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
                      <div className='p-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center'>
                        <div>
                          <p className='text-sm uppercase font-semibold text-gray-500'>Location</p>
                          <p className='text-lg font-medium'>{userAssign.department}</p>
                        </div>
                        {/* --- REMOVE BED BUTTON --- */}
                        <button
                          onClick={() => handleUpdateAssignment('remove', uab)} 
                          // 🔑 FIX 2 (UI Bug): Disable only this button if its ID matches the removingBedId
                          disabled={removingBedId === uab || groupedBeds[ward].length === 1 || isAdding}
                          className={`cp py-2 px-4 rounded-lg text-sm font-semibold transition-colors flex items-center ${
                            removingBedId === uab || groupedBeds[ward].length === 1 || isAdding
                              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                              : 'bg-red-500 text-white hover:bg-red-600'
                          }`}
                        >
                          {/* 🔑 FIX 2 (UI Bug): Show removing state only for this bed */}
                          {removingBedId === uab ? 'Removing...' : <>Remove <Minus className='w-4 h-4 ml-1' /></>}
                        </button>
                        {/* --------------------------- */}
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