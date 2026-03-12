import React, { useEffect, useState } from 'react';
import { useAssignment } from '../context/AssignmentContext';
import { useAuth } from '../context/AuthContext';
import GoBack from '../components/GoBack';
import { 
  FaPlus, 
  FaMinus, 
  FaSpinner, 
  FaBed, 
  FaHospital, 
  FaHourglassEnd, 
  FaCheckCircle,
  FaArrowRight
} from 'react-icons/fa'; 
import { Lock } from 'lucide-react';
import { addBedsToAssignment, removeBedsFromAssignment } from '../services/assignment'; 
import toast from 'react-hot-toast';                        
import { useBed } from '../context/BedContext'; 
import { Link } from 'react-router-dom';

const MyAssignments = () => {
  const { getUserAssignment, userAssign } = useAssignment();
  const { user } = useAuth();
  const { departments, loadDepartments } = useBed(); 
  const [loading, setLoading] = useState(false);

  const [isAdding, setIsAdding] = useState(false);
  const [removingBedId, setRemovingBedId] = useState(null);
  const [allDepartments, setAllDepartments] = useState([]);
  const [selectedBedToAdd, setSelectedBedToAdd] = useState('');

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      try {
        if (user) {
          await getUserAssignment();
          await loadDepartments(); 
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, [user]); 

  useEffect(() => {
    setAllDepartments(departments);
  }, [departments]);
  
  const hasAssignments = userAssign && userAssign.beds && userAssign.beds.length > 0;

  const groupedBeds = {};
  if (hasAssignments) {
    userAssign.beds.forEach(bedObject => { 
      const ward = userAssign.ward || 'Unassigned Ward'; 
      if (!groupedBeds[ward]) groupedBeds[ward] = [];
      groupedBeds[ward].push(bedObject);
    });
  }

  const currentDept = allDepartments?.find(d => d.name === userAssign?.department);
  const currentWard = currentDept?.wards.find(w => w.name === userAssign?.ward);

  const bedsToOffer = currentWard 
    ? currentWard.beds.filter(bed => !bed.assignedUser && !userAssign.beds.some(uab => uab.id === bed.id))
    : [];

  const getRoleName = (role) => {
      switch (role) {
          case 'c1': return 'Clinical Year I';
          case 'c2': return 'Clinical Year II';
          case 'admin': return 'Administrator';
          case 'intern': return 'Medical Intern';
          default: return 'Medical Staff';
      }
  };
    
  const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
      });
  }

  const handleUpdateAssignment = async (action, bedIdString) => {
    if (!userAssign || !userAssign._id) {
      toast.error("No current assignment found.");
      return;
    }
    const assignmentId = userAssign._id;
    try {
      if (action === 'add') {
        setIsAdding(true); 
        await addBedsToAssignment(assignmentId, [selectedBedToAdd]);
        toast.success('Assignment synchronized.');
      } else if (action === 'remove' && bedIdString) {
        setRemovingBedId(bedIdString);
        await removeBedsFromAssignment(assignmentId, [bedIdString]);
        toast.success('Unit removed from protocol.');
      }
      await getUserAssignment(); 
      await loadDepartments(); 
      setSelectedBedToAdd(''); 
    } catch (err) {
      toast.error(`Sync error: ${err.message}`);
    } finally {
      setIsAdding(false);
      setRemovingBedId(null);
    }
  };
  if (!user?.subscription?.isActive) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-[3rem] shadow-2xl text-center border-2 border-slate-100">
           <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Lock size={40} />
           </div>
           <h2 className="text-2xl font-black text-slate-900 uppercase italic">Access Denied</h2>
           <p className="text-slate-500 text-sm mt-3 mb-8 font-bold">
             You need an active Platform Subscription to access the My Assignments Live Feed.
           </p>
           <button 
             onClick={() => window.location.href = '/screenshot'} 
             className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest"
           >
             Upgrade Plan
           </button>
        </div>
      </div>
    );
  }
  return (
    <div className='bg-slate-50/50 min-h-screen pt-28 pb-20 px-6 font-sans'>
      <div className='max-w-6xl mx-auto'>
        <div className="mb-6"><GoBack /></div>
        
        {/* Unified Clinical Header */}
        <div className='flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-200 pb-8 mb-10 gap-4'>
            <div>
              <div className="flex items-center gap-2 mb-2 text-indigo-600">
                <FaHospital size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Duty Station</span>
              </div>
              <h1 className='text-4xl md:text-5xl font-black text-slate-900 tracking-tighter italic'>My Assignments</h1>
            </div>
            <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm">
               <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1'>Current Department/Ward</p>
               <p className='text-sm font-bold text-indigo-600 uppercase tracking-tight'>
                  {userAssign ? `${userAssign.department} / ${userAssign.ward}` : 'Locating...'}
               </p>
            </div>
        </div>

        {loading ? (
          <div className='flex flex-col items-center justify-center p-20 bg-white rounded-[2rem] border border-slate-200 shadow-sm'>
            <FaSpinner className="text-4xl text-indigo-600 mb-4 animate-spin" />
            <p className='text-xs font-black uppercase tracking-[0.2em] text-slate-400'>Polling Central Database...</p>
          </div>
        ) : hasAssignments ? (
          <div className="space-y-8">
            
            {/* Clinical Expiry Banner */}
            <div className='flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm'>
                <div className='flex items-center gap-4'>
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                       <FaHourglassEnd size={20} />
                    </div>
                    <div>
                        <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Protocol Expiry</p>
                        <p className='text-sm font-bold text-slate-700'>
                            Ward: <span className='text-indigo-600'>{formatDate(userAssign.wardExpiry)}</span> | 
                            Dept: <span className='text-indigo-600'>{formatDate(userAssign.deptExpiry)}</span>
                        </p>
                    </div>
                </div>
                <Link to="/update-expiry" className="cp text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition-all">
                  Update Dates
                </Link>
            </div>

            {/* Assignment Expansion Unit */}
            <div className='bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm'>
              <h2 className='text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2'>
                <FaPlus className='text-indigo-600' /> Expand Current Assignment
              </h2>
              
              <div className='flex flex-col sm:flex-row gap-4'>
                <select
                  className='cp flex-1 border-2 border-slate-100 p-4 rounded-xl font-bold text-slate-700 focus:border-indigo-600 outline-none bg-slate-50/50'
                  value={selectedBedToAdd}
                  onChange={(e) => setSelectedBedToAdd(e.target.value)}
                  disabled={isAdding || !!removingBedId || bedsToOffer.length === 0}
                >
                  <option value="">
                    {bedsToOffer.length > 0 
                        ? `-- Select Unit To Add (${bedsToOffer.length} Available) --` 
                        : `No vacant units in ${userAssign.ward}`}
                  </option>
                  {bedsToOffer.map(bed => (
                    <option key={bed.id} value={bed.id}>Unit ID: {bed.id}</option>
                  ))}
                </select>
                <button
                  onClick={() => handleUpdateAssignment('add')}
                  disabled={isAdding || !selectedBedToAdd || !!removingBedId}
                  className={`cp px-8 rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${
                    isAdding || !selectedBedToAdd || !!removingBedId
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-slate-900 shadow-lg'
                  }`}
                >
                  {isAdding ? <FaSpinner className='animate-spin' /> : <FaPlus />} 
                  {isAdding ? 'Syncing...' : 'Add to Protocol'}
                </button>
              </div>
            </div>

            {/* Beds Grid Section */}
            {Object.keys(groupedBeds).map(ward => (
              <div key={ward}>
                <h2 className='text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3'>
                  <div className="h-px bg-slate-200 flex-1"></div>
                  Assigned Ward: {ward}
                  <div className="h-px bg-slate-200 flex-1"></div>
                </h2>
                
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                  {groupedBeds[ward].map((bedObject) => (
                    <div key={bedObject.id} className='group bg-white border border-slate-200 rounded-[1.5rem] overflow-hidden hover:border-indigo-600 transition-all shadow-sm'>
                      <div className='p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center'>
                        <div className="flex items-center gap-2">
                           <FaBed className='text-indigo-600' />
                           <span className='font-black text-slate-900 italic'>Bed {bedObject.id}</span>
                        </div>
                        <FaCheckCircle className='text-emerald-500' size={14} />
                      </div>
                      
                      <div className='p-6 space-y-4'>
                        <div>
                          <p className='text-[9px] font-black text-slate-400 uppercase tracking-widest'>Practitioner</p>
                          <p className='text-xs font-bold text-slate-700 uppercase'>{userAssign.createdBy.name}</p>
                        </div>
                        <div>
                          <p className='text-[9px] font-black text-slate-400 uppercase tracking-widest'>Designation</p>
                          <p className='text-xs font-bold text-indigo-600 uppercase'>{getRoleName(userAssign.createdBy.role)}</p>
                        </div>
                        
                        <button
                          onClick={() => handleUpdateAssignment('remove', bedObject.id)} 
                          disabled={removingBedId === bedObject.id || groupedBeds[ward].length === 1 || isAdding}
                          className={`cp w-full py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                            removingBedId === bedObject.id || groupedBeds[ward].length === 1 || isAdding
                              ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
                              : 'border-slate-100 text-red-400 hover:bg-red-50 hover:border-red-100'
                          }`}
                        >
                          {removingBedId === bedObject.id ? <FaSpinner className='animate-spin mx-auto' /> : 'Remove Bed'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center p-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200'>
            <div className='text-4xl mb-6 grayscale'>🩺</div>
            <p className='text-xl font-black text-slate-900 italic tracking-tight uppercase'>Terminal Idle</p>
            <p className='text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest'>No active clinical assignments found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAssignments;