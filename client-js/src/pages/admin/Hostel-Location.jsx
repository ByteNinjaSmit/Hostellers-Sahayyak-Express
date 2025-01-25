// "use client"
import React, { useEffect, useState } from "react"
import { AiOutlinePlus, AiOutlineEdit, AiOutlineEye, AiOutlineClose,AiOutlineHome } from "react-icons/ai"
import { MdLocationOn, MdDeleteOutline } from "react-icons/md"
import { FaCompass, FaGlobe } from "react-icons/fa"
import { BiCircle, BiSave } from "react-icons/bi"
import axios from "axios";
import { useAuth } from "../../store/auth";
import { Link } from "react-router-dom";
import { toast } from "react-toastify"
export default function HostelManagement() {
    const { user, isLoggedIn, isHighAuth, API } = useAuth();

    const [hostels, setHostels] = useState([
        // { id: 1, name: "Sunny Hostel", longitude: "123.456", latitude: "78.910", radius: "500" },
        // { id: 2, name: "Mountain View Inn", longitude: "-45.678", latitude: "12.345", radius: "750" },

    ])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentHostel, setCurrentHostel] = useState({ _id: null, hostelName: "", longitude: "", latitude: "", radius: "" })
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [hostelToDelete, setHostelToDelete] = useState(null)

    const getHostelLocation = async () => {
        try {
            const response = await axios.get(`${API}/api/admin/get-all-hostel-location`)
            const data = response.data
            setHostels(data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getHostelLocation();
    }, []);

    const openModal = (hostel = { _id: null, hostelName: "", longitude: "", latitude: "", radius: "" }) => {
        setCurrentHostel(hostel)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setCurrentHostel({ _id: null, hostelName: "", longitude: "", latitude: "", radius: "" })
    }
    const closeModalViewModel = () => {
        setIsViewModalOpen(false);
        setCurrentHostel({ _id: null, hostelName: "", longitude: "", latitude: "", radius: "" })
    }
    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setCurrentHostel({ _id: null, hostelName: "", longitude: "", latitude: "", radius: "" })

    }


    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        try {
            const response = await axios.post(`${API}/api/admin/new-hostel-location`, {
                hostelName: currentHostel.hostelName,
                longitude: currentHostel.longitude,
                latitude: currentHostel.latitude,
                radius: currentHostel.radius
            });

            // Check if the response status is 201 (Created)
            if (response.status === 201) {
                // Refresh the hostel locations
                getHostelLocation();

                // Clear currentHostel state
                setCurrentHostel({
                    _id: null,
                    hostelName: "",
                    longitude: "",
                    latitude: "",
                    radius: "",
                });

                // Optionally display a success message
                toast.success("Hostel location added successfully!");
            }
        } catch (error) {
            console.error("Error adding hostel location:", error);
            toast.error(error.response?.data?.message || "Failed to New hostel location.");
        } finally {
            // Close the modal in all cases (success or failure)
            closeModal();
        }
    };

    const openDeleteModal = (id) => {
        setHostelToDelete(id)
        setIsDeleteModalOpen(true)
    }

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false)
        setHostelToDelete(null)
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        console.log(currentHostel);

        try {
            const response = await axios.patch(`${API}/api/admin/update-hostel-location/${currentHostel._id}`, {
                hostelName: currentHostel.hostelName,
                longitude: currentHostel.longitude,
                latitude: currentHostel.latitude,
                radius: currentHostel.radius
            })
            if (response.status === 200) {
                getHostelLocation();
                // Clear currentHostel state
                setCurrentHostel({
                    _id: null,
                    hostelName: "",
                    longitude: "",
                    latitude: "",
                    radius: "",
                });
                toast.success(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to Update hostel location.");
        } finally {
            setIsEditModalOpen(false);
            setCurrentHostel({ _id: null, hostelName: "", longitude: "", latitude: "", radius: "" });
        }
    }

    const handleDelete = async (e) => {
        e.preventDefault(); // Prevent the default form behavior
        try {
            // Make the DELETE request
            const response = await axios.delete(`${API}/api/admin/delete-hostel-location/${hostelToDelete}`);

            if (response.status === 200) {
                // Refresh the hostel locations
                getHostelLocation();

                // Show a success toast notification
                toast.success(response.data.message || "Hostel location deleted successfully!");
            }
        } catch (error) {
            // Log the error for debugging
            console.error("Error deleting hostel location:", error);

            // Display an error toast notification
            toast.error(error.response?.data?.message || "Failed to delete hostel location.");
        } finally {
            // Close the delete confirmation modal in all cases
            closeDeleteModal();
        }
    };


    return (
        <div className="container mx-auto p-4">
            <div className="mb-6 flex flex-col sm:flex-row justify-center items-center gap-4">
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-md shadow-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                >
                    <AiOutlinePlus className="text-xl" />
                    Create New Hostel
                </button>
                <Link to="/admin/overview-attendance" className="flex items-center gap-2">
                    <button className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-md shadow-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
                        <AiOutlineHome className="text-xl" />
                        Go Home
                    </button>
                </Link>
            </div>


            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left">Hostel Name</th>
                            <th className="px-4 py-2 text-left">Longitude</th>
                            <th className="px-4 py-2 text-left">Latitude</th>
                            <th className="px-4 py-2 text-left">Radius</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hostels.map((hostel, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                <td className="px-4 py-2">
                                    <div className="flex items-center">
                                        <MdLocationOn className="mr-2 text-gray-500" />
                                        {hostel.hostelName}
                                    </div>
                                </td>
                                <td className="px-4 py-2">
                                    <div className="flex items-center">
                                        <FaCompass className="mr-2 text-gray-500" />
                                        {hostel.longitude}
                                    </div>
                                </td>
                                <td className="px-4 py-2">
                                    <div className="flex items-center">
                                        <FaGlobe className="mr-2 text-gray-500" />
                                        {hostel.latitude}
                                    </div>
                                </td>
                                <td className="px-4 py-2">
                                    <div className="flex items-center">
                                        <BiCircle className="mr-2 text-gray-500" />
                                        {hostel.radius} M
                                    </div>
                                </td>
                                <td className="px-4 py-2">
                                    <div className="flex space-x-2">
                                        <button className="text-blue-500 hover:text-blue-600"
                                            onClick={() => {
                                                setIsEditModalOpen(true);
                                                setCurrentHostel({
                                                    _id: hostel._id,
                                                    hostelName: hostel.hostelName,
                                                    longitude: hostel.longitude,
                                                    latitude: hostel.latitude,
                                                    radius: hostel.radius,
                                                });
                                            }}
                                        >
                                            <AiOutlineEdit size={20} />
                                        </button>
                                        <button onClick={() => openDeleteModal(hostel._id)} className="text-red-500 hover:text-red-600">
                                            <MdDeleteOutline size={20} />
                                        </button>
                                        <button
                                            className="text-green-500 hover:text-green-600"
                                            onClick={() => {
                                                setIsViewModalOpen(true);
                                                setCurrentHostel({
                                                    _id: hostel._id,
                                                    hostelName: hostel.hostelName,
                                                    longitude: hostel.longitude,
                                                    latitude: hostel.latitude,
                                                    radius: hostel.radius,
                                                });
                                            }}
                                        >
                                            <AiOutlineEye size={20} />
                                        </button>

                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                {currentHostel._id ? "Edit Hostel" : "Create New Hostel"}
                            </h3>
                            <form onSubmit={handleSubmit} className="mt-2 text-left">
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                        <MdLocationOn className="inline mr-2" />
                                        Hostel Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={currentHostel.hostelName}
                                        onChange={(e) =>
                                            setCurrentHostel((prevHostel) => ({
                                                ...prevHostel,
                                                hostelName: e.target.value,
                                            }))
                                        }
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Enter hostel name"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="longitude">
                                        <FaCompass className="inline mr-2" />
                                        Longitude
                                    </label>
                                    <input
                                        type="text"
                                        id="longitude"
                                        name="longitude"
                                        value={currentHostel.longitude}
                                        onChange={(e) =>
                                            setCurrentHostel((prevHostel) => ({
                                                ...prevHostel,
                                                longitude: e.target.value,
                                            }))
                                        }
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Enter longitude"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="latitude">
                                        <FaGlobe className="inline mr-2" />
                                        Latitude
                                    </label>
                                    <input
                                        type="text"
                                        id="latitude"
                                        name="latitude"
                                        value={currentHostel.latitude}
                                        onChange={(e) =>
                                            setCurrentHostel((prevHostel) => ({
                                                ...prevHostel,
                                                latitude: e.target.value,
                                            }))
                                        }
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Enter latitude"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="radius">
                                        <BiCircle className="inline mr-2" />
                                        Radius
                                    </label>
                                    <input
                                        type="text"
                                        id="radius"
                                        name="radius"
                                        value={currentHostel.radius}
                                        onChange={(e) =>
                                            setCurrentHostel((prevHostel) => ({
                                                ...prevHostel,
                                                radius: e.target.value,
                                            }))
                                        }
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Enter radius"
                                        required
                                    />
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center transition duration-300"
                                    >
                                        <AiOutlineClose className="mr-2" />
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center transition duration-300"
                                    >
                                        <BiSave className="mr-2" />
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {isEditModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                {currentHostel._id ? "Edit Hostel" : "Create New Hostel"}
                            </h3>
                            <form onSubmit={handleUpdate} className="mt-2 text-left">
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                        <MdLocationOn className="inline mr-2" />
                                        Hostel Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={currentHostel.hostelName}
                                        onChange={(e) =>
                                            setCurrentHostel((prevHostel) => ({
                                                ...prevHostel,
                                                hostelName: e.target.value,
                                            }))
                                        }
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Enter hostel name"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="longitude">
                                        <FaCompass className="inline mr-2" />
                                        Longitude
                                    </label>
                                    <input
                                        type="text"
                                        id="longitude"
                                        name="longitude"
                                        value={currentHostel.longitude}
                                        onChange={(e) =>
                                            setCurrentHostel((prevHostel) => ({
                                                ...prevHostel,
                                                longitude: e.target.value,
                                            }))
                                        }
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Enter longitude"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="latitude">
                                        <FaGlobe className="inline mr-2" />
                                        Latitude
                                    </label>
                                    <input
                                        type="text"
                                        id="latitude"
                                        name="latitude"
                                        value={currentHostel.latitude}
                                        onChange={(e) =>
                                            setCurrentHostel((prevHostel) => ({
                                                ...prevHostel,
                                                latitude: e.target.value,
                                            }))
                                        }
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Enter latitude"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="radius">
                                        <BiCircle className="inline mr-2" />
                                        Radius
                                    </label>
                                    <input
                                        type="text"
                                        id="radius"
                                        name="radius"
                                        value={currentHostel.radius}
                                        onChange={(e) =>
                                            setCurrentHostel((prevHostel) => ({
                                                ...prevHostel,
                                                radius: e.target.value,
                                            }))
                                        }
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Enter radius"
                                        required
                                    />
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditModalOpen(false);
                                            setCurrentHostel({ _id: null, hostelName: "", longitude: "", latitude: "", radius: "" });
                                        }}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center transition duration-300"
                                    >
                                        <AiOutlineClose className="mr-2" />
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center transition duration-300"
                                    >
                                        <BiSave className="mr-2" />
                                        Update
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {isViewModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                {currentHostel._id ? "Edit Hostel" : "Create New Hostel"}
                            </h3>
                            <form onSubmit={handleSubmit} className="mt-2 text-left">
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                        <MdLocationOn className="inline mr-2" />
                                        Hostel Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={currentHostel.hostelName}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Enter hostel name"
                                        readOnly
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="longitude">
                                        <FaCompass className="inline mr-2" />
                                        Longitude
                                    </label>
                                    <input
                                        type="text"
                                        id="longitude"
                                        name="longitude"
                                        value={currentHostel.longitude}
                                        readOnly
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Enter longitude"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="latitude">
                                        <FaGlobe className="inline mr-2" />
                                        Latitude
                                    </label>
                                    <input
                                        type="text"
                                        id="latitude"
                                        name="latitude"
                                        value={currentHostel.latitude}
                                        readOnly
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Enter latitude"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="radius">
                                        <BiCircle className="inline mr-2" />
                                        Radius
                                    </label>
                                    <input
                                        type="text"
                                        id="radius"
                                        name="radius"
                                        value={currentHostel.radius}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Enter radius"
                                        readOnly
                                    />
                                </div>
                                <div className="flex items-center justify-center mt-4">
                                    <button
                                        type="button"
                                        onClick={closeModalViewModel}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center transition duration-300"
                                    >
                                        <AiOutlineClose className="mr-2" />
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">Confirm Deletion</h3>
                        <p className="text-sm text-gray-500">Are you sure you want to delete this hostel?</p>
                        <div className="mt-4 flex justify-end space-x-3">
                            <button
                                onClick={closeDeleteModal}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-300"
                            >
                                No
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

