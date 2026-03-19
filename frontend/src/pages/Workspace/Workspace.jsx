import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { X, Folder, Plus, Edit2, Trash2, LayoutGrid, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import NavBar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import './Workspace.css';

// --- PREMIUM INTERACTIVE GRID PARTICLE SYSTEM ---
const ParticleBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        
        // Track mouse globally for the canvas
        let mouse = { x: null, y: null, radius: 150 };

        const handleMouseMove = (event) => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        };

        const handleMouseOut = () => {
            mouse.x = null;
            mouse.y = null;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseOut);

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        class Particle {
            constructor(x, y) {
                // Base position (The Grid)
                this.baseX = x;
                this.baseY = y;
                
                // Current drawn position
                this.x = x;
                this.y = y;
                
                // Spring physics velocity
                this.vx = 0;
                this.vy = 0;
                
                this.size = 1.7;
                
                // Phase for constant subtle movement
                this.angle = Math.random() * Math.PI * 2;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(240, 138, 93, 0.5)'; // Orange from Home.jsx
                ctx.fill();
            }

            update() {
                // 1. Constant subtle wobble to make the grid feel "alive"
                this.angle += 0.02;
                let targetX = this.baseX + Math.cos(this.angle) * 1.5;
                let targetY = this.baseY + Math.sin(this.angle) * 1.5;

                // 2. Mouse Disturbance Logic
                if (mouse.x != null && mouse.y != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouse.radius) {
                        const force = (mouse.radius - distance) / mouse.radius;
                        // Push the target position away from the mouse
                        const pushStrength = 40; 
                        targetX -= (dx / distance) * force * pushStrength;
                        targetY -= (dy / distance) * force * pushStrength;
                    }
                }

                // 3. Spring physics: Accelerate towards the target position
                const springStrength = 0.08;
                const friction = 0.82;
                
                this.vx += (targetX - this.x) * springStrength;
                this.vy += (targetY - this.y) * springStrength;
                
                // Apply friction so they settle down
                this.vx *= friction;
                this.vy *= friction;

                this.x += this.vx;
                this.y += this.vy;

                this.draw();
            }
        }

        const initParticles = () => {
            particles = [];
            const spacing = 35; // The gap between each dot in the grid
            
            // Generate a strict mathematical grid
            for (let x = 0; x < canvas.width + spacing; x += spacing) {
                for (let y = 0; y < canvas.height + spacing; y += spacing) {
                    particles.push(new Particle(x, y));
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseout', handleMouseOut);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full pointer-events-none" 
        />
    );
};

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
        <div className="min-h-screen relative overflow-hidden pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans bg-[#fff7ed]">
            
            <NavBar />
            
            {/* --- INTERACTIVE CANVAS GRID BACKGROUND --- */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <ParticleBackground />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* --- HEADER --- */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                    <div>
                        <h1 
                            className="text-3xl md:text-4xl font-black text-slate-800 flex items-center gap-3"
                            style={{ fontSize: "clamp(2rem,4vw,3rem)" }}
                        >
                            <LayoutGrid className="text-[#f08a5d]" size={32} />
                            My Workspaces
                        </h1>
                        <p className="text-slate-600 font-medium mt-2 text-lg">Manage your brands, clients, and campaigns.</p>
                    </div>
                    <button 
                        onClick={() => { setInputValue(""); setIsCreateModalOpen(true); }}
                        className="flex items-center gap-2 text-white font-black py-3 px-6 rounded-full shadow-xl shadow-[#f08a5d]/30 hover:shadow-[#f08a5d]/40 hover:-translate-y-1 transition-all duration-300 shimmer-btn bg-[#f08a5d] hover:bg-[#d97346]"
                    >
                        <Plus size={18} strokeWidth={3} /> Create Workspace
                    </button>
                </div>

                {/* --- CONTENT --- */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="bg-white/60 h-48 rounded-3xl animate-pulse border border-orange-100" />
                        ))}
                    </div>
                ) : workspaces.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-xl p-12 rounded-3xl shadow-xl shadow-orange-200/20 text-center border border-orange-100 max-w-2xl mx-auto mt-12 relative overflow-hidden">
                        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-orange-100 relative z-10">
                            <Folder className="text-[#f08a5d] w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-3 relative z-10">No Workspaces Yet</h3>
                        <p className="text-slate-600 mb-8 font-medium relative z-10">Create your first workspace to start organizing your AI-generated campaigns and brand profiles.</p>
                        <button 
                            onClick={() => { setInputValue(""); setIsCreateModalOpen(true); }} 
                            className="inline-flex items-center gap-2 text-[#f08a5d] font-black bg-orange-50 px-6 py-3 rounded-full hover:bg-orange-100 transition-colors border border-orange-200 relative z-10"
                        >
                            Create your first workspace <ArrowRight size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {workspaces.map((workspace) => (
                            <div
                                key={workspace.id}
                                onClick={() => navigate(`/workspace/${workspace.id}`)}
                                className="group relative bg-white/80 backdrop-blur-xl border border-orange-100 shadow-md hover:shadow-2xl hover:shadow-[#f08a5d]/20 rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between min-h-[220px] overflow-hidden"
                            >
                                {/* Decorative Card Flare matching home theme */}
                                <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#f08a5d] rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"></div>

                                <div>
                                    <div className="w-12 h-12 bg-orange-50 rounded-2xl shadow-sm border border-orange-100 flex items-center justify-center mb-5 text-[#f08a5d] group-hover:scale-110 group-hover:text-[#d97346] transition-all duration-300">
                                        <Folder size={22} strokeWidth={2.5} />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800 group-hover:text-[#f08a5d] transition-colors pr-8 line-clamp-2">
                                        {workspace.name}
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-wider">
                                        Created • {new Date(workspace.created_at).toLocaleDateString()}
                                    </p>
                                </div>

                                {/* Hover Actions */}
                                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-orange-100 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                    <button 
                                        onClick={(e) => openEditModal(e, workspace)} 
                                        className="flex-1 flex justify-center items-center gap-1.5 py-2.5 text-xs font-bold text-[#d97346] bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors border border-orange-200/50"
                                    >
                                        <Edit2 size={14} /> Edit
                                    </button>
                                    <button 
                                        onClick={(e) => openDeleteModal(e, workspace)} 
                                        className="flex-1 flex justify-center items-center gap-1.5 py-2.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-100"
                                    >
                                        <Trash2 size={14} /> Delete
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
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-fade-down relative border border-orange-100">
                        <button onClick={() => setIsCreateModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-full transition-colors">
                            <X size={18} />
                        </button>
                        <h2 className="text-2xl font-black text-slate-800 mb-2">Create Workspace</h2>
                        <p className="text-sm text-slate-500 font-medium mb-6">Give your new workspace a descriptive name.</p>
                        
                        <form onSubmit={handleCreateSubmit}>
                            <label className="block text-xs font-black text-[#f08a5d] mb-2 uppercase tracking-widest">Workspace Name</label>
                            <input 
                                type="text" 
                                value={inputValue} 
                                onChange={(e) => setInputValue(e.target.value)} 
                                placeholder="e.g., Summer Marketing Campaign" 
                                className="w-full rounded-2xl px-4 py-3.5 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-white border-2 border-orange-200 focus:border-[#f08a5d] focus:ring-2 focus:ring-[#f08a5d]/20 outline-none transition-all mb-6"
                                autoFocus
                                required
                            />
                            <button type="submit" className="w-full bg-[#f08a5d] hover:bg-[#d97346] text-white font-black py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shimmer-btn">
                                Create Now
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- EDIT MODAL --- */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-fade-down relative border border-orange-100">
                        <button onClick={() => setIsEditModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-full transition-colors">
                            <X size={18} />
                        </button>
                        <h2 className="text-2xl font-black text-slate-800 mb-6">Rename Workspace</h2>
                        <form onSubmit={handleEditSubmit}>
                            <label className="block text-xs font-black text-[#f08a5d] mb-2 uppercase tracking-widest">Workspace Name</label>
                            <input 
                                type="text" 
                                value={inputValue} 
                                onChange={(e) => setInputValue(e.target.value)} 
                                className="w-full rounded-2xl px-4 py-3.5 text-sm text-slate-800 font-semibold bg-white border-2 border-orange-200 focus:border-[#f08a5d] focus:ring-2 focus:ring-[#f08a5d]/20 outline-none transition-all mb-6"
                                autoFocus
                                required
                            />
                            <button type="submit" className="w-full bg-[#f08a5d] hover:bg-[#d97346] text-white font-black py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shimmer-btn">
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- DELETE MODAL --- */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl animate-fade-down text-center relative border border-red-100">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5 text-red-500 border-4 border-red-100">
                            <Trash2 size={28} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 mb-2">Delete Workspace?</h2>
                        <p className="text-slate-600 mb-8 text-sm font-medium">Are you sure you want to delete <strong className="text-slate-800 font-black">"{selectedWorkspace?.name}"</strong>? This will permanently delete all campaigns inside it.</p>
                        
                        <div className="flex gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3.5 font-black text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleDeleteConfirm} className="flex-1 py-3.5 font-black text-white bg-red-500 hover:bg-red-600 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
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