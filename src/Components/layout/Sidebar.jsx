import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, FileText, User, LogOut, BrainCircuit, BookOpen, X } from 'lucide-react'

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/documents', label: 'Documents', icon: FileText },
        { to: '/flashcards', label: 'Flashcards', icon: BookOpen },
        { to: '/profile', label: 'Profile', icon: User },
    ];

    return (
        <>
            {/* Mobile overlay */}
            <div
                className={`fixed inset-0 bg-black/30 z-40 md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={toggleSidebar}
                aria-hidden="true"
            />

            {/* Sidebar panel */}
            <aside
                className={`fixed z-50 inset-y-0 left-0 w-64 bg-white border-r border-slate-200 shadow-lg transform transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                            <BrainCircuit className="h-5 w-5" strokeWidth={2.25} />
                        </div>
                        <div className="leading-tight">
                            <p className="text-xs uppercase tracking-[0.18em] text-emerald-600/80 font-semibold">AI</p>
                            <p className="text-sm font-semibold text-slate-900">Learning Assistant</p>
                        </div>
                    </div>
                    <button onClick={toggleSidebar} className="md:hidden p-2 rounded-lg hover:bg-slate-100" aria-label="Close sidebar">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <nav className="px-3 py-4 space-y-1">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`
                            }
                            onClick={toggleSidebar}
                        >
                            <link.icon className="h-5 w-5" />
                            <span>{link.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-auto px-3 pb-4">
                    <button
                        onClick={handleLogout}
                        className="w-full inline-flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar