import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import api from '../../services/api';
import NavBar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';

const Workspace = () => {
    const navigate = useNavigate();
    const [workspaces, setWorkspaces] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    // Form States
    const [inputValue, setInputValue] = useState("");
    const [selectedWorkspace, setSelectedWorkspace] = useState(null);

    // Fetch workspaces on component mount
    useEffect(() => {
        fetchWorkspaces();
    }, []);

    const fetchWorkspaces = async () => {
        try {
            const response = await api.get('workspaces/');
            setWorkspaces(response.data);
        } catch (error) {
            console.error("Error fetching workspaces:", error);
            toast.error("Failed to load workspaces.");
        } finally {
            setLoading(false);
        }
    };

    // --- CREATE LOGIC ---
    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        try {
            const response = await api.post('workspaces/', { name: inputValue });
            setWorkspaces([response.data, ...workspaces]);
            toast.success("Workspace created successfully!");
            setIsCreateModalOpen(false);
            setInputValue("");
        } catch (error) {
            console.error("Create error:", error);
            toast.error("Failed to create workspace.");
        }
    };

    // --- EDIT LOGIC ---
    // Added 'e' parameter to stop event propagation
    const openEditModal = (e, workspace) => {
        e.stopPropagation(); 
        setSelectedWorkspace(workspace);
        setInputValue(workspace.name);
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || inputValue === selectedWorkspace.name) {
            setIsEditModalOpen(false);
            return;
        }

        try {
            const response = await api.patch(`workspaces/${selectedWorkspace.id}/`, { name: inputValue });
            setWorkspaces(workspaces.map(ws => ws.id === selectedWorkspace.id ? response.data : ws));
            toast.success("Workspace updated!");
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Edit error:", error);
            toast.error("Failed to update workspace.");
        }
    };

    // --- DELETE LOGIC ---
    // Added 'e' parameter to stop event propagation
    const openDeleteModal = (e, workspace) => {
        e.stopPropagation(); 
        setSelectedWorkspace(workspace);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await api.delete(`workspaces/${selectedWorkspace.id}/`);
            setWorkspaces(workspaces.filter(ws => ws.id !== selectedWorkspace.id));
            toast.success("Workspace deleted.");
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete workspace.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative">
            <NavBar />
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-black text-slate-800">My Workspaces</h1>
                    <button 
                        onClick={() => { setInputValue(""); setIsCreateModalOpen(true); }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition-all hover:-translate-y-0.5"
                    >
                        + Create Workspace
                    </button>
                </div>

                {loading ? (
                    <div className="text-center text-slate-500 py-10">Loading workspaces...</div>
                ) : workspaces.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl shadow-sm text-center border border-slate-200">
                        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-indigo-500 text-2xl">📁</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No Workspaces Yet</h3>
                        <p className="text-slate-500 mb-6">Create your first workspace to start organizing your campaigns.</p>
                        <button 
                            onClick={() => { setInputValue(""); setIsCreateModalOpen(true); }} 
                            className="text-indigo-600 font-bold hover:underline"
                        >
                            Create your first workspace →
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {workspaces.map((workspace) => (
                            <div 
                                key={workspace.id} 
                                onClick={() => navigate(`/workspace/${workspace.id}`)} 
                                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between h-48 group cursor-pointer"
                            >
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800 mb-2 truncate group-hover:text-indigo-600 transition-colors">
                                        {workspace.name}
                                    </h2>
                                    <p className="text-xs text-slate-400 font-medium">
                                        Created: {new Date(workspace.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex justify-end gap-4 mt-4 pt-4 border-t border-slate-100">
                                    <button 
                                        onClick={(e) => openEditModal(e, workspace)}
                                        className="text-sm font-bold text-indigo-500 hover:text-indigo-700 transition-colors z-10"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={(e) => openDeleteModal(e, workspace)}
                                        className="text-sm font-bold text-red-400 hover:text-red-600 transition-colors z-10"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* --- CREATE MODAL --- */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-fade-down relative">
                        <button onClick={() => setIsCreateModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
                            <X size={20} />
                        </button>
                        <h2 className="text-2xl font-black text-slate-800 mb-6">Create Workspace</h2>
                        <form onSubmit={handleCreateSubmit}>
                            <label className="block text-xs font-black text-indigo-700 mb-2 uppercase tracking-widest">Workspace Name</label>
                            <input 
                                type="text" 
                                value={inputValue} 
                                onChange={(e) => setInputValue(e.target.value)} 
                                placeholder="e.g., Summer Marketing Campaign" 
                                className="w-full rounded-xl px-4 py-3 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 focus:ring-0 outline-none transition-all mb-6"
                                autoFocus
                                required
                            />
                            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-xl transition-colors">
                                Create Now
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- EDIT MODAL --- */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-fade-down relative">
                        <button onClick={() => setIsEditModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
                            <X size={20} />
                        </button>
                        <h2 className="text-2xl font-black text-slate-800 mb-6">Edit Workspace</h2>
                        <form onSubmit={handleEditSubmit}>
                            <label className="block text-xs font-black text-indigo-700 mb-2 uppercase tracking-widest">Workspace Name</label>
                            <input 
                                type="text" 
                                value={inputValue} 
                                onChange={(e) => setInputValue(e.target.value)} 
                                className="w-full rounded-xl px-4 py-3 text-sm text-slate-800 font-semibold bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 focus:ring-0 outline-none transition-all mb-6"
                                autoFocus
                                required
                            />
                            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-xl transition-colors">
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- DELETE MODAL --- */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl animate-fade-down text-center relative">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                            <X size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 mb-2">Delete Workspace?</h2>
                        <p className="text-slate-500 mb-8 text-sm">Are you sure you want to delete <strong className="text-slate-700">"{selectedWorkspace?.name}"</strong>? This action cannot be undone.</p>
                        
                        <div className="flex gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleDeleteConfirm} className="flex-1 py-3 font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors">
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Workspace;