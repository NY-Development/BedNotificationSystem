import React, { useEffect, useState } from 'react';
import { useAssignment } from '../context/AssignmentContext';
import { useAuth } from '../context/AuthContext';
import GoBack from '../components/GoBack';
// Swapping lucide-react for react-icons/fa for unified look and better icons
import { FaPlus, FaMinus, FaSpinner, FaBed, FaHospital, FaUserMd } from 'react-icons/fa'; 
import { addBedsToAssignment, removeBedsFromAssignment } from '../services/assignment'; 
import toast from 'react-hot-toast';                        
import { useBed } from '../context/BedContext'; 
import { Link } from 'react-router-dom';

const MyAssignments = () => {

  const { getUserAssignment, userAssign } = useAssignment();
  const { user } = useAuth();
  const { departments, loadDepartments } = useBed(); 
  const [loading, setLoading] = useState(false);

  // Granular states for loading/disabling buttons
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
          // Load departments on first mount to populate the bedsToOffer list immediately
          await loadDepartments(); 
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
    userAssign.beds.forEach(bedId => { // NOTE: bedId is a string
      const ward = userAssign.ward || 'Unassigned Ward'; 
      if (!groupedBeds[ward]) {
        groupedBeds[ward] = [];
      }
      // Pushing the raw ID string
      groupedBeds[ward].push(bedId);
    });
  }

  // Find the currently assigned department/ward
  const currentDept = allDepartments?.find(d => d.name === userAssign?.department);
  const currentWard = currentDept?.wards.find(w => w.name === userAssign?.ward);

  // Filter available beds in the current ward that are NOT already assigned to the user
  const bedsToOffer = currentWard 
    ? currentWard.beds.filter(bed => {
        // Bed must not be assigned to anyone, AND must not be in the current user's assignment list
        return !bed.assignedUser && !userAssign.beds.some(uabId => uabId === bed.id);
      })
    : [];

    // Helper to format role names
    const getRoleName = (role) => {
        switch (role) {
            case 'c1': return 'Clinical Year I Student';
            case 'c2': return 'Clinical Year II Student';
            case 'admin': return 'Admin';
            case 'intern': return 'Intern';
            default: return 'User';
        }
    };
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
        setIsAdding(true); 
        const newBedId = selectedBedToAdd;
        await addBedsToAssignment(assignmentId, [newBedId]);
        toast.success('New Bed added to your Assignments.');

      } else if (action === 'remove' && bedIdToRemove) {
        setRemovingBedId(bedIdToRemove); 
        await removeBedsFromAssignment(assignmentId, [bedIdToRemove]);
        toast.success('Assigned Bed Removed Successfully.');
      } else {
        throw new Error("Invalid action or missing bed ID.");
      }
      
      // Reload everything to reflect the new state
      await getUserAssignment(); 
      await loadDepartments(); 
      
      setSelectedBedToAdd(''); 
      
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${action} assignment: ${err.response?.data?.message || err.message || 'Server error'}`);
    } finally {
      if (action === 'add') setIsAdding(false);
      if (action === 'remove') setRemovingBedId(null);
    }
  };
  // -----------------------------

  const isUpdatingAny = isAdding || !!removingBedId; 

  return (
    <div className='bg-gray-50 min-h-screen p-4 sm:p-8'>
      <div className='container mx-auto max-w-5xl'>
        <GoBack />
        
        {/* Header Section */}
        <div className='flex items-center justify-center mb-10 mt-4'>
            <FaBed className='text-6xl text-indigo-600 mr-4' />
            <h1 className='text-4xl sm:text-5xl font-extrabold text-gray-800'>Your Bed Assignments</h1>
        </div>

        {/* --- LOADING STATE --- */}
        {loading ? (
          <div className='flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-xl border border-gray-200'>
            <FaSpinner className="text-6xl text-indigo-500 mb-4 animate-spin" />
            <p className='text-2xl font-semibold text-gray-700 mt-4'>Getting your assignments...</p>
          </div>
        ) : hasAssignments ? (
          
          <div>
            {/* --- ADD BED FUNCTIONALITY --- */}
            <div className='bg-indigo-50 p-6 rounded-2xl shadow-xl mb-10 border border-indigo-300'>
              <h2 className='text-2xl font-bold text-indigo-800 mb-4 flex items-center'>
                <FaPlus className='w-5 h-5 mr-2' /> Quick Add Bed
              </h2>
              <p className='text-sm text-indigo-700 mb-4'>
                Instantly assign an available bed from your current **{userAssign.ward}** ward.
              </p>
              <div className='flex flex-col sm:flex-row gap-4'>
                <select
                  className='flex-1 border border-indigo-300 p-3 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-inner'
                  value={selectedBedToAdd}
                  onChange={(e) => setSelectedBedToAdd(e.target.value)}
                  disabled={isUpdatingAny || bedsToOffer.length === 0}
                >
                  <option value="">
                    {bedsToOffer.length > 0 
                        ? `-- Select an Available Bed (${bedsToOffer.length} found) --` 
                        : `No available beds in ${userAssign.ward}`}
                  </option>
                  {bedsToOffer.map(bed => (
                    <option key={bed.id} value={bed.id}>
                      {bed.id}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleUpdateAssignment('add')}
                  disabled={isAdding || !selectedBedToAdd || isUpdatingAny}
                  className={`cp py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center shadow-md ${
                    isAdding || !selectedBedToAdd || isUpdatingAny
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {isAdding ? <FaSpinner className='w-4 h-4 mr-2 animate-spin' /> : <FaPlus className='w-4 h-4 mr-1' />} 
                  {isAdding ? 'Adding Bed...' : 'Assign Bed'}
                </button>
              </div>
            </div>
            {/* --------------------------------- */}

            {/* --- DISPLAY ASSIGNED BEDS --- */}
            {Object.keys(groupedBeds).map(ward => (
              <div key={ward} className='mb-12'>
                <h2 className='text-3xl font-bold text-gray-700 mb-6 border-b-4 border-indigo-200 pb-3 flex items-center'>
                    <FaHospital className='mr-2 text-indigo-500' /> {ward} Assignments
                </h2>
                <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {groupedBeds[ward].map((bedId) => (
                    <div
                      key={bedId} 
                      className='bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl'
                    >
                      {/* Bed ID Header */}
                      <div className={`p-5 bg-indigo-500 text-white`}> 
                        <FaBed className='inline text-2xl mr-2' />
                        <h3 className='inline text-xl font-extrabold'>{`Bed ID: ${bedId.id}`}</h3>
                      </div>
                      
                      {/* Assignment Details */}
                      <div className='p-5 text-gray-700'>
                        <p className='text-sm uppercase font-semibold text-gray-500 flex items-center'>
                            <FaUserMd className='mr-1 text-base' /> Assigned To
                        </p>
                        <p className='text-lg font-medium mb-1 mt-1'>{userAssign.createdBy.name}</p>
                        <p className='text-md text-gray-600 mb-1'>{userAssign.createdBy.email}</p>
                        <p className='text-md font-semibold text-indigo-500'>
                            {getRoleName(userAssign.createdBy.role)}
                        </p>
                      </div>
                      
                      {/* Action Footer */}
                      <div className='p-5 bg-gray-50 border-t border-gray-200 flex justify-between items-center'>
                        <div>
                          <p className='text-sm uppercase font-semibold text-gray-500'>Department</p>
                          <p className='text-lg font-bold text-gray-800'>{userAssign.department}</p>
                        </div>
                        
                        {/* --- REMOVE BED BUTTON --- */}
                        <button
                          onClick={() => handleUpdateAssignment('remove', bedId)} 
                          // Disable if: currently removing THIS bed, only one bed remains, or adding is in progress
                          disabled={removingBedId === bedId || groupedBeds[ward].length === 1 || isAdding}
                          className={`cp py-2 px-4 rounded-lg text-sm font-semibold transition-colors flex items-center shadow-md ${
                            removingBedId === bedId || groupedBeds[ward].length === 1 || isAdding
                              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                              : 'bg-red-500 text-white hover:bg-red-600'
                          }`}
                        >
                          {removingBedId === bedId ? (
                            <>
                                <FaSpinner className='w-4 h-4 mr-1 animate-spin' /> Removing...
                            </>
                          ) : (
                            <>
                                Remove <FaMinus className='w-4 h-4 ml-1' />
                            </>
                          )}
                        </button>
                        {/* --------------------------- */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Update Date Link */}
            <Link
              to="/update-expiry"
              className="mt-8 inline-flex items-center justify-center w-64 text-center rounded-lg font-bold px-6 py-3 bg-gray-800 text-white hover:bg-black transition duration-200 shadow-lg"
            >
              Update Assignment Expiry Date
            </Link>

          </div>

        ) : (
          /* --- EMPTY STATE --- */
          <div className='flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-xl border border-gray-300'>
            <div className='text-6xl text-gray-400 mb-4'>😴</div>
            <p className='text-2xl font-bold text-gray-700'>You've earned a break!</p>
            <p className='text-lg text-gray-500 mt-2'>No beds are currently assigned to you. Check back later for new assignments.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAssignments;