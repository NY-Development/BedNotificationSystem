import React, { useEffect, useState } from 'react';
import { useAssignment } from '../context/AssignmentContext';
import { useAuth } from '../context/AuthContext';
import GoBack from '../components/GoBack';
// Swapping lucide-react for react-icons/fa for unified look and better icons
import { FaPlus, FaMinus, FaSpinner, FaBed, FaHospital, FaUserMd, FaHourglassEnd, FaCheckCircle } from 'react-icons/fa'; 
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
    // userAssign.beds is an array of bed OBJECTS from the controller's formatting
    userAssign.beds.forEach(bedObject => { 
      const ward = userAssign.ward || 'Unassigned Ward'; 
      if (!groupedBeds[ward]) {
        groupedBeds[ward] = [];
      }
      // Pushing the raw bed OBJECT
      groupedBeds[ward].push(bedObject);
    });
  }

  // Find the currently assigned department/ward
  const currentDept = allDepartments?.find(d => d.name === userAssign?.department);
  const currentWard = currentDept?.wards.find(w => w.name === userAssign?.ward);

  // Filter available beds in the current ward that are NOT already assigned to the user
  const bedsToOffer = currentWard 
    ? currentWard.beds.filter(bed => {
        // Bed must not be assigned to anyone, AND must not be in the current user's assignment list (use bed.id to check against objects)
        return !bed.assignedUser && !userAssign.beds.some(uab => uab.id === bed.id);
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
    
    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    }
  // -----------------------------


  // --- Core Update Logic (Add/Remove) ---
  const handleUpdateAssignment = async (action, bedIdString) => { // bedIdString is the plain string ID
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

      } else if (action === 'remove' && bedIdString) { // Use the string ID
        setRemovingBedId(bedIdString); // Set loading state with the string ID
        await removeBedsFromAssignment(assignmentId, [bedIdString]);
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
        <div className='flex items-end justify-between border-b pb-4 mb-8 mt-4'>
            <div className='flex items-center'>
                <FaHospital className='text-5xl text-blue-600 mr-4' />
                <h1 className='text-3xl sm:text-4xl font-extrabold text-gray-900'>Your Assignments</h1>
            </div>
            <p className='text-sm text-gray-500 font-medium'>
                {userAssign ? `${userAssign.department} / ${userAssign.ward}` : 'Loading...'}
            </p>
        </div>

        {/* --- LOADING STATE --- */}
        {loading ? (
          <div className='flex flex-col items-center justify-center p-16 bg-white rounded-xl shadow-lg border border-gray-100'>
            <FaSpinner className="text-6xl text-blue-500 mb-4 animate-spin" />
            <p className='text-xl font-semibold text-gray-700 mt-4'>Retrieving current assignments...</p>
          </div>
        ) : hasAssignments ? (
          
          <div>
            {/* --- ADD BED FUNCTIONALITY (Beautified) --- */}
            <div className='bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200'>
              <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center'>
                <FaPlus className='w-4 h-4 mr-2 text-green-500' /> Add Bed to Current Assignment
              </h2>
              
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-sm font-medium'>
                <div className='p-3 bg-blue-50 rounded-lg'>Department: <span className='text-blue-700 font-bold'>{userAssign.department}</span></div>
                <div className='p-3 bg-blue-50 rounded-lg'>Ward: <span className='text-blue-700 font-bold'>{userAssign.ward}</span></div>
                <div className='p-3 bg-blue-50 rounded-lg'>Beds Assigned: <span className='text-blue-700 font-bold'>{userAssign.beds.length}</span></div>
              </div>

              <div className='flex flex-col sm:flex-row gap-3'>
                <select
                  className='flex-1 border border-gray-300 p-3 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-inner text-gray-700'
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
                  className={`py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center shadow-md ${
                    isAdding || !selectedBedToAdd || isUpdatingAny
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg'
                  }`}
                >
                  {isAdding ? <FaSpinner className='w-4 h-4 mr-2 animate-spin' /> : <FaPlus className='w-4 h-4 mr-1' />} 
                  {isAdding ? 'Adding Bed...' : 'Assign New Bed'}
                </button>
              </div>
            </div>
            {/* --------------------------------- */}

            {/* --- DISPLAY ASSIGNED BEDS (Beautified) --- */}
            {Object.keys(groupedBeds).map(ward => (
              <div key={ward} className='mb-12'>
                <h2 className='text-2xl font-bold text-gray-700 mb-6 border-l-4 border-blue-500 pl-3 flex items-center'>
                    <FaBed className='mr-2 text-blue-500' /> Assigned Beds in {ward}
                </h2>
                
                {/* Assignment Expiry Information Card (Moved here for relevance) */}
                <div className='flex justify-between items-center p-4 mb-6 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg shadow-inner'>
                    <div className='flex items-center'>
                        <FaHourglassEnd className='text-xl text-yellow-600 mr-3' />
                        <div>
                            <p className='text-sm font-semibold text-yellow-800'>Assignment Expiry:</p>
                            <p className='text-md text-gray-700'>
                                Ward: <span className='font-bold'>{formatDate(userAssign.wardExpiry)}</span> | 
                                Department: <span className='font-bold'>{formatDate(userAssign.deptExpiry)}</span>
                            </p>
                        </div>
                    </div>
                    <Link
                      to="/update-expiry"
                      className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition duration-150"
                    >
                      Update Dates &rarr;
                    </Link>
                </div>
                
                {/* Beds Grid */}
                <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                  {groupedBeds[ward].map((bedObject) => (
                    <div
                      key={bedObject.id} // Use the string ID for the key
                      className='bg-white shadow-xl rounded-xl border-t-4 border-blue-500 overflow-hidden transition-all duration-300 hover:shadow-2xl'
                    >
                      {/* Bed ID Header */}
                      <div className={`p-4 bg-gray-50 border-b`}> 
                        <FaBed className='inline text-xl text-blue-600 mr-2' />
                        <h3 className='inline text-lg font-extrabold text-gray-800'>{`BED ID: ${bedObject.id}`}</h3>
                      </div>
                      
                      {/* Assignment Details */}
                      <div className='p-4 text-gray-700'>
                        <div className='mb-3'>
                            <p className='text-xs uppercase font-semibold text-gray-500'>
                                Assigned To
                            </p>
                            <p className='text-md font-medium mt-1'>{userAssign.createdBy.name}</p>
                        </div>
                        <div className='mb-3'>
                            <p className='text-xs uppercase font-semibold text-gray-500'>
                                Role
                            </p>
                            <p className='text-sm font-semibold text-blue-600'>
                                {getRoleName(userAssign.createdBy.role)}
                            </p>
                        </div>
                        <div>
                            <p className='text-xs uppercase font-semibold text-gray-500'>Status</p>
                            <p className='text-sm font-bold text-green-500 flex items-center mt-1'>
                                <FaCheckCircle className='w-3 h-3 mr-1'/> Active
                            </p>
                        </div>
                      </div>
                      
                      {/* Action Footer */}
                      <div className='p-4 bg-gray-100 border-t border-gray-200 flex justify-end'>
                        {/* --- REMOVE BED BUTTON --- */}
                        <button
                          // 🚨 CRITICAL FIX: Pass the string ID: bedObject.id
                          onClick={() => handleUpdateAssignment('remove', bedObject.id)} 
                          // Use the string ID for comparison
                          disabled={removingBedId === bedObject.id || groupedBeds[ward].length === 1 || isAdding}
                          className={`cp py-2 px-4 rounded-lg text-sm font-semibold transition-colors flex items-center shadow-md ${
                            removingBedId === bedObject.id || groupedBeds[ward].length === 1 || isAdding
                              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                              : 'bg-red-500 text-white hover:bg-red-600'
                          }`}
                        >
                          {removingBedId === bedObject.id ? (
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
            
          </div>

        ) : (
          /* --- EMPTY STATE (Beautified) --- */
          <div className='flex flex-col items-center justify-center p-20 bg-white rounded-xl shadow-lg border-2 border-dashed border-gray-300'>
            <div className='text-6xl text-gray-400 mb-6'>😴</div>
            <p className='text-2xl font-bold text-gray-700'>You're Unassigned</p>
            <p className='text-lg text-gray-500 mt-2 text-center'>No beds are currently assigned to you. Enjoy your well-deserved break!</p>
            {/* Optional: Add a link for admins/supervisors */}
            {user?.role !== 'student' && (
              <Link to="/assign-beds" className="mt-6 text-blue-600 font-semibold hover:underline">
                Go to Bed Assignment Page &rarr;
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAssignments;