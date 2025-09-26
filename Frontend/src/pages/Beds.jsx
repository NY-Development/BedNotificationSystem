import React, { useState } from "react";
import { Menu, X, Hospital, Bed, User, Building2, Timer } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useBed } from "../context/BedContext";
import toast from "react-hot-toast";
import GoBack from '../components/GoBack';
import SearchBar from '../components/SearchBar'; // Import the new SearchBar component

const Beds = () => {
  const { user } = useAuth();
  const { departments, loading, admit, discharge } = useBed();
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Add state for the search term\
  const [isExpand, setIsExpand] = useState(false);
  
  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-xl border border-gray-200'>
        <Timer size={64} className="text-gray-400 mb-4 animate-pulse" />
        <div
          className="w-16 h-16 rounded-full border-4 border-gray-300 border-t-indigo-500 spinner-border mt-4"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
        <p className='text-2xl font-semibold text-gray-700 mt-4'>Getting departments & wards...</p>
      </div>
    );
  }

  // Filter departments based on the search term
  const filteredDepartments = departments.map(dept => {
    const filteredWards = dept.wards.map(ward => {
      const filteredBeds = ward.beds.filter(bed => {
        // Only show beds that are assigned and match the search term
        return bed.assignedUser && bed.assignedUser.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
      return { ...ward, beds: filteredBeds };
    }).filter(ward => ward.beds.length > 0); // Keep only wards that have matching beds
    return { ...dept, wards: filteredWards };
  }).filter(dept => dept.wards.length > 0); // Keep only departments that have matching wards

  // The current view will be either the filtered list or the full list
  const departmentsToDisplay = searchTerm ? filteredDepartments : departments;
  const currentDepartment = selectedDepartment || (departmentsToDisplay.length > 0 ? departmentsToDisplay[0] : null);

  const handleSearch = () => {
    // This function can be used to trigger a search if a button is used.
    // In this implementation, filtering happens on every keystroke, so this might not be strictly necessary,
    // but it's good practice for a button click handler.
    console.log("Searching for:", searchTerm);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 lg:w-64 lg:border-r lg:border-gray-200`}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Departments</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 text-gray-600 hover:text-gray-900 lg:hidden rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {departmentsToDisplay.map((dept) => (
            <button
              key={dept._id}
              onClick={() => {
                setSelectedDepartment(dept);
                setIsSidebarOpen(false);
              }}
              className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                currentDepartment?._id === dept._id
                  ? "bg-indigo-600 text-white shadow-md font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {dept.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="flex justify-between items-start mb-6">
          <GoBack />
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="cursor-pointer fixed bottom-6 left-6 z-50 p-4 bg-indigo-600 text-white rounded-full shadow-lg transition-all duration-300 hover:bg-indigo-700 hover:scale-110 lg:hidden"
          >
            <Menu size={24} />
          </button>
        </div>
        
        {/* Search Bar */}
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchClick={handleSearch}
        />

        {currentDepartment && (
          <>
            <div className="mb-8 text-center mt-8">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 flex items-center justify-center space-x-3 mb-2">
                <Building2 className="h-10 w-10 text-indigo-600" />
                <span>{currentDepartment.name}</span>
              </h1>
              <p className="text-xl text-gray-500">
                {currentDepartment.wards.length} Wards
              </p>
            </div>

            {/* Wards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentDepartment.wards.map((ward, wardIndex) => {
                const totalBeds = ward.beds.length;
                const occupiedBeds = ward.beds.filter(
                  (bed) => bed.status === "occupied"
                ).length;
                const availableBeds = totalBeds - occupiedBeds;

                return (
                  <div
                    key={wardIndex}
                    className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-2xl transition-shadow duration-300"
                  >
                    <div className="flex items-center space-x-2 text-indigo-600 mb-4">
                      <Hospital className="h-8 w-8" />
                      <h3 className="text-2xl font-bold">{ward.name}</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center text-sm font-semibold mb-4">
                      <span className="bg-red-100 text-red-700 p-2 rounded-lg">Occupied: {occupiedBeds}</span>
                      <span className="bg-green-100 text-green-700 p-2 rounded-lg">Available: {availableBeds}</span>
                    </div>
                    <details className="mt-4">
                      <summary 
                      onClick={() => setIsExpand(!isExpand)}
                      className="cursor-pointer bg-indigo-600 text-white py-3 px-4 rounded-lg shadow-inner font-bold flex justify-between items-center transition-colors hover:bg-indigo-700">
                        <span>Bed Details</span>
                        <span className="text-xs text-indigo-200">
                          {`${isExpand ? 'Click to condense' : 'Click to expand'}`}
                        </span>
                      </summary>
                      <div className="mt-4 space-y-4">
                        {ward.beds.map((bed) => (
                          <div
                            key={bed.id}
                            className={`p-4 rounded-lg border-2 shadow-inner transition-colors duration-200 ${
                              bed.status === "occupied"
                                ? "bg-red-50 border-red-200 text-red-800"
                                : "bg-green-50 border-green-200 text-green-800"
                            }`}
                          >
                            <p className="font-bold flex items-center space-x-2">
                              <Bed className="h-5 w-5" />
                              <span>Bed ID: {bed.id}</span>
                            </p>
                            <p className="text-sm mt-2 flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>Assigned to: {bed.assignedUser?.name || "Not assigned"}</span>
                            </p>
                            <p className="text-sm mt-1">
                              Status: <span className="font-semibold">{bed.status}</span>
                            </p>
                            <div className="mt-3 flex flex-col sm:flex-row gap-2">
                              <button
                                onClick={() => {
                                  if (bed.assignedUser?._id === user._id) {
                                    toast.error("You cannot admit yourself.");
                                  } else {
                                    admit(currentDepartment._id, ward.name, bed.id);
                                  }
                                }}
                                disabled={bed.status === "occupied"}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                                  bed.assignedUser === user?._id ? (
                                    'cursor-not-allowed'
                                  ) : (
                                    bed.status === "occupied"
                                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                                  )
                                }`}
                              >
                                {bed.status === "occupied"
                                  ? "Patient Admitted"
                                  : "Admit Patient"}
                              </button>
                              <button
                                onClick={() => {
                                  if (bed.assignedUser?._id === user._id) {
                                    toast.error("You cannot discharge yourself.");
                                  } else {
                                    discharge(currentDepartment._id, ward.name, bed.id);
                                  }
                                }}
                                disabled={bed.status === "available"}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                                  bed.assignedUser === user?._id ? (
                                    'cursor-not-allowed'
                                  ) : (bed.status === "available" ? "bg-gray-300 text-gray-600 cursor-not-allowed" : 
                                    "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                                  )
                                }`}
                              >
                                {bed.status === "available"
                                  ? "Patient Discharged"
                                  : "Discharge Patient"}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Beds;