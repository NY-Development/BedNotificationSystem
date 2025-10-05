import API from "./axios";

// Function to get the user profile
export const fetchUserProfile = async () => {
  try {
    const response = await API.get("/auth/profile");
    return response.data; // Returns user profile data
  } catch (error) {
    throw new Error(error.response.data.message || "Failed to fetch profile");
  }
};

// Function to upload a profile image
export const uploadProfileImage = async (formData) => {
  try {
    const response = await API.post("/auth/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Ensure the request is sent as form-data
      },
    });
    return response.data; // Returns the response from the upload
  } catch (error) {
    throw new Error(error.response.data.message || "Failed to upload image");
  }
};