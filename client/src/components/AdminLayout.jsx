import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationService, messageService } from '../services/api';
import { useToast } from '../components/Toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  CalendarRange, 
  Search, 
  Bell, 
  LogOut, 
  Home, 
  ChevronsUpDown, 
  Building,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Settings,
  MessageSquare,
  Trash,
  Check,
  Send,
  UserPlus,
  AlertCircle,
  Clock,
  UserCheck,
  FileText,
  Calendar,
  Smile
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Notifications State
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Messaging State
  const [showChat, setShowChat] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [chatPartner, setChatPartner] = useState(null); // Selected user profile
  const [chatMessages, setChatMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [typing, setTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const notifDropdownRef = useRef(null);
  const chatDropdownRef = useRef(null);

  const getMenuItems = () => {
    const role = user?.role || '';
    if (role === 'ADMIN') {
      return [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Doctors', path: '/doctor-management', icon: Users },
        { name: 'Appointments', path: '/appointment-management', icon: CalendarRange },
      ];
    } else if (role === 'DOCTOR') {
      return [
        { name: 'Schedules', path: '/doctor/dashboard', icon: CalendarRange },
      ];
    } else if (role === 'PATIENT') {
      return [
        { name: 'My Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
        { name: 'Book Consultation', path: '/book-appointment', icon: PlusCircle },
      ];
    }
    return [];
  };

  const menuItems = getMenuItems();

  // Load notifications & conversations
  const loadNotifications = async () => {
    try {
      const res = await notificationService.getAll();
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  const loadConversations = async () => {
    try {
      const res = await messageService.getConversations();
      setConversations(res.data);
    } catch (err) {
      console.error("Failed to load conversations", err);
    }
  };

  useEffect(() => {
    if (user) {
      loadNotifications();
      loadConversations();
      // Poll every 8 seconds for notifications and chat lists
      const interval = setInterval(() => {
        loadNotifications();
        loadConversations();
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Load chat history when partner is selected
  useEffect(() => {
    let interval;
    if (chatPartner) {
      const loadChat = async () => {
        try {
          const res = await messageService.getChat(chatPartner.id);
          setChatMessages(res.data);
          scrollToBottom();
        } catch (err) {
          console.error("Failed to load chat messages", err);
        }
      };
      loadChat();
      // Poll active chat every 3 seconds
      interval = setInterval(loadChat, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [chatPartner]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
    setTimeout(() => navigate('/'), 800);
  };

  // Notification actions
  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      loadNotifications();
    } catch (err) {
      showToast('Could not mark notification as read', 'error');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      loadNotifications();
      showToast('All notifications marked as read', 'success');
    } catch (err) {
      showToast('Failed to clear notifications', 'error');
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await notificationService.delete(id);
      loadNotifications();
    } catch (err) {
      showToast('Failed to delete notification', 'error');
    }
  };

  // Message Actions
  const handleSearchUser = async (e) => {
    const q = e.target.value;
    setSearchUserQuery(q);
    if (q.trim().length > 1) {
      try {
        const res = await messageService.searchUsers(q);
        // Filter out current user from search
        setUserSearchResults(res.data.filter(u => u.id !== user.id));
      } catch (err) {
        console.error("Failed to search users", err);
      }
    } else {
      setUserSearchResults([]);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !chatPartner) return;
    try {
      const payload = {
        receiverId: chatPartner.id,
        message: messageText.trim()
      };
      await messageService.sendMessage(payload);
      setMessageText('');
      // Reload chat instantly
      const res = await messageService.getChat(chatPartner.id);
      setChatMessages(res.data);
      loadConversations();
      scrollToBottom();
    } catch (err) {
      showToast('Failed to send message', 'error');
    }
  };

  const handleSelectPartner = (partner) => {
    setChatPartner({
      id: partner.partnerId || partner.id,
      name: partner.partnerName || partner.name,
      role: partner.partnerRole || partner.role
    });
    setShowUserSearch(false);
  };

  // Click outside detection for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (chatDropdownRef.current && !chatDropdownRef.current.contains(event.target)) {
        // Only close if not currently chatting in the popup
        if (!chatPartner) {
          setShowChat(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [chatPartner]);

  // Helpers for notifications icons
  const getNotifIcon = (type) => {
    switch (type) {
      case 'EMERGENCY':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'APPOINTMENT_REQUEST':
        return <Calendar className="h-4 w-4 text-cyan-405" />;
      case 'APPOINTMENT_ACCEPTED':
        return <UserCheck className="h-4 w-4 text-emerald-500" />;
      case 'DOCTOR_CREATED':
        return <Users className="h-4 w-4 text-purple-400" />;
      case 'PATIENT_REGISTERED':
        return <UserPlus className="h-4 w-4 text-blue-500" />;
      case 'PRESCRIPTION_READY':
        return <FileText className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-slate-400" />;
    }
  };

  const unreadNotifCount = notifications.filter(n => !n.isRead).length;
  const unreadMsgCount = conversations.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0);

  return (
    <div className="min-h-screen bg-[#070709] text-slate-100 flex font-sans overflow-x-hidden antialiased text-left select-none relative">
      {ToastComponent}

      {/* Sidebar - Desktop */}
      <aside 
        className={`hidden lg:flex flex-col bg-[#0b0b0e]/70 border-r border-slate-900/60 backdrop-blur-2xl p-5 fixed top-0 left-0 h-screen justify-between z-30 transition-all duration-300 ${
          collapsed ? 'w-24' : 'w-[280px]'
        }`}
      >
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-red-650 via-red-500 to-rose-400 flex items-center justify-center shadow-lg shadow-red-500/10 shrink-0">
                <Building className="h-5 w-5 text-white" />
              </div>
              {!collapsed && (
                <div>
                  <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">HealthSync</span>
                  <p className="text-[9px] text-red-500 uppercase tracking-widest font-black">Clinical Command</p>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 bg-slate-900/60 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1.5">
            {!collapsed && (
              <p className="px-3 text-[9px] uppercase font-bold text-slate-500 tracking-wider mb-2">Hospital Console</p>
            )}
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  title={collapsed ? item.name : undefined}
                  className={`flex items-center rounded-xl text-sm font-semibold transition-all duration-255 group ${
                    collapsed ? 'justify-center p-3' : 'gap-3.5 px-4 py-3'
                  } ${
                    isActive 
                      ? 'bg-gradient-to-r from-red-600/15 to-rose-500/5 border border-red-500/20 text-white' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/30 border border-transparent'
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-red-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  {!collapsed && <span>{item.name}</span>}
                  {!collapsed && isActive && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-red-450 shadow-md shadow-red-450/80 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer Utilities */}
        <div className="space-y-4 pt-4 border-t border-slate-800/40">
          <Link
            to="/"
            title={collapsed ? "Hospital Home" : undefined}
            className={`flex items-center rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800/30 transition-colors ${
              collapsed ? 'justify-center p-3' : 'gap-3.5 px-4 py-3'
            }`}
          >
            <Home className="h-4.5 w-4.5" />
            {!collapsed && <span>Hospital Portal</span>}
          </Link>

          <div className={`bg-[#0d0d10]/90 border border-slate-850/65 rounded-2xl flex items-center justify-between ${
            collapsed ? 'p-2 flex-col gap-2' : 'p-3'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-black text-white text-sm shadow-md shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              {!collapsed && (
                <div className="text-left">
                  <p className="text-xs font-bold text-white max-w-[110px] truncate">{user?.name || 'Admin User'}</p>
                  <p className="text-[9px] text-cyan-400 uppercase tracking-wider font-extrabold">{user?.role || 'SYSTEM ADMIN'}</p>
                </div>
              )}
            </div>
            <button 
              onClick={handleLogout}
              title="Logout Session"
              className="p-2 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-lg transition-colors group cursor-pointer"
            >
              <LogOut className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" 
              onClick={() => setMobileOpen(false)} 
            />
            <motion.aside 
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative flex flex-col w-72 bg-[#09090c] border-r border-slate-900 p-6 justify-between h-full z-50 text-left"
            >
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-red-650 via-red-500 to-rose-450 flex items-center justify-center shadow-lg shadow-red-500/15">
                      <Building className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <span className="font-bold text-base text-white">HealthSync</span>
                      <p className="text-[9px] text-red-550 tracking-wider">Clinical command</p>
                    </div>
                  </div>
                  <button onClick={() => setMobileOpen(false)} className="p-1 hover:bg-slate-800 rounded-lg text-slate-455">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                          isActive 
                            ? 'bg-red-600/15 border border-red-500/20 text-white' 
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Icon className="h-4.5 w-4.5 text-red-400" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white">
                  <Home className="h-4.5 w-4.5" />
                  <span>Hospital Home</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold text-sm transition-all"
                >
                  <LogOut className="h-4.5 w-4.5" />
                  <span>Logout Session</span>
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main Workspace: dynamically sets pl on desktop to match fixed sidebar */}
      <div 
        className={`flex-grow min-h-screen flex flex-col min-w-0 transition-all duration-300 w-full ${
          collapsed ? 'lg:pl-24' : 'lg:pl-[280px]'
        }`}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-20 backdrop-blur-md bg-[#070709]/75 border-b border-slate-900/60 px-6 py-4 flex items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileOpen(true)} 
              className="lg:hidden p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Quick Search */}
            <div className="hidden md:flex items-center gap-2.5 px-3.5 py-2 bg-white/5 border border-white/5 rounded-xl w-80 focus-within:border-red-500/25 transition-all">
              <Search className="h-4 w-4 text-slate-550" />
              <input
                type="text"
                placeholder="Search telemetry records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-slate-200 placeholder-slate-600 w-full"
              />
              <span className="text-[9px] font-mono text-slate-600 bg-slate-950 px-1.5 py-0.5 rounded">⌘K</span>
            </div>
          </div>

          {/* Right Header Navigation Panel */}
          <div className="flex items-center gap-4 relative">
            
            {/* Chat Trigger and Popup */}
            <div className="relative" ref={chatDropdownRef}>
              <button 
                onClick={() => { setShowChat(!showChat); setShowNotifications(false); }}
                className="relative p-2.5 bg-white/5 border border-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer flex items-center justify-center"
              >
                <MessageSquare className="h-4 w-4" />
                {unreadMsgCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-500 border-2 border-[#070709] flex items-center justify-center text-[8px] font-black text-white animate-bounce">
                    {unreadMsgCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showChat && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 md:w-[360px] bg-[#0c0c0e]/95 border border-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden z-40"
                  >
                    {chatPartner ? (
                      /* CHAT SCREEN */
                      <div className="flex flex-col h-96">
                        <div className="bg-white/5 border-b border-white/5 p-4 flex items-center justify-between">
                          <button 
                            onClick={() => setChatPartner(null)}
                            className="text-slate-450 hover:text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            ← Back
                          </button>
                          <div className="text-center">
                            <h4 className="text-xs font-extrabold text-white">{chatPartner.name}</h4>
                            <p className="text-[8px] text-cyan-405 uppercase font-bold tracking-widest">{chatPartner.role}</p>
                          </div>
                          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>

                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                          {chatMessages.length === 0 ? (
                            <p className="text-[10px] text-slate-500 italic text-center pt-8">No message logs. Send a greeting below.</p>
                          ) : (
                            chatMessages.map((msg) => {
                              const isMe = msg.senderId === user.id;
                              return (
                                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                  <div className={`p-3 rounded-xl max-w-[80%] text-[11px] leading-relaxed ${
                                    isMe 
                                      ? 'bg-blue-600 text-white rounded-br-none' 
                                      : 'bg-white/5 text-slate-205 rounded-bl-none border border-white/5'
                                  }`}>
                                    {msg.message}
                                  </div>
                                  <span className="text-[8px] text-slate-600 mt-1 font-mono">{msg.createdAt ? msg.createdAt.substring(11, 16) : ''}</span>
                                </div>
                              );
                            })
                          )}
                          <div ref={messagesEndRef} />
                        </div>

                        {/* Send bar */}
                        <form onSubmit={handleSendMessage} className="p-3 border-t border-white/5 bg-[#0f0f12] flex gap-2 items-center">
                          <input 
                            type="text"
                            placeholder="Type encryption message..."
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            className="flex-1 bg-white/5 border border-white/5 focus:border-blue-500 rounded-xl px-3 py-2 text-xs outline-none text-slate-200 placeholder-slate-600"
                          />
                          <button 
                            type="submit"
                            className="h-8 w-8 bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center justify-center text-white shrink-0 cursor-pointer"
                          >
                            <Send className="h-3.5 w-3.5" />
                          </button>
                        </form>
                      </div>
                    ) : (
                      /* CONVERSATION LIST & SEARCH */
                      <div className="flex flex-col h-96">
                        <div className="bg-white/5 p-4 border-b border-white/5 flex justify-between items-center">
                          <h4 className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-1.5"><MessageSquare className="h-4 w-4 text-blue-450" /> Message Hub</h4>
                          <button 
                            onClick={() => setShowUserSearch(!showUserSearch)}
                            className="px-2 py-1 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-400 text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1"
                          >
                            <UserPlus className="h-3 w-3" /> New Chat
                          </button>
                        </div>

                        {showUserSearch ? (
                          /* USER SEARCH LAYER */
                          <div className="flex-1 flex flex-col p-4 space-y-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-white/5 rounded-xl text-xs">
                              <Search className="h-3.5 w-3.5 text-slate-550" />
                              <input 
                                type="text" 
                                placeholder="Search users by name..."
                                value={searchUserQuery}
                                onChange={handleSearchUser}
                                className="bg-transparent border-none outline-none text-xs text-slate-200 placeholder-slate-650 w-full"
                              />
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-2">
                              {userSearchResults.length === 0 ? (
                                <p className="text-[10px] text-slate-500 italic text-center pt-8">Type at least 2 characters to search...</p>
                              ) : (
                                userSearchResults.map(u => (
                                  <div 
                                    key={u.id} 
                                    onClick={() => handleSelectPartner(u)}
                                    className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl flex items-center justify-between cursor-pointer"
                                  >
                                    <div>
                                      <p className="text-xs font-bold text-white">{u.name}</p>
                                      <p className="text-[8px] text-slate-500 font-mono">{u.email}</p>
                                    </div>
                                    <span className="text-[8px] font-black text-cyan-405 bg-cyan-950 border border-cyan-800/40 px-2 py-0.5 rounded-full uppercase tracking-wider">{u.role}</span>
                                  </div>
                                ))
                              )}
                            </div>
                            <button 
                              onClick={() => setShowUserSearch(false)}
                              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] rounded-lg cursor-pointer"
                            >
                              Cancel Search
                            </button>
                          </div>
                        ) : (
                          /* CONVERSATIONS DISPLAY */
                          <div className="flex-grow overflow-y-auto p-4 space-y-3">
                            {conversations.length === 0 ? (
                              <p className="text-[10px] text-slate-500 italic text-center pt-16">No conversations logs active.</p>
                            ) : (
                              conversations.map((conv, idx) => (
                                <div 
                                  key={idx} 
                                  onClick={() => handleSelectPartner(conv)}
                                  className="p-3 bg-white/5 hover:bg-[#181822] border border-white/5 rounded-2xl flex justify-between items-center gap-4 cursor-pointer transition-colors relative"
                                >
                                  <div className="space-y-1 text-left min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs font-extrabold text-white truncate max-w-[120px]">{conv.partnerName}</span>
                                      <span className="text-[8px] font-bold text-slate-500 bg-white/5 px-1.5 py-0.5 rounded uppercase">{conv.partnerRole}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-455 truncate leading-relaxed max-w-[200px]">
                                      {conv.lastMessage}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                                    <span className="text-[8px] text-slate-600 font-mono">
                                      {conv.lastMessageTime ? conv.lastMessageTime.substring(11, 16) : ''}
                                    </span>
                                    {conv.unreadCount > 0 && (
                                      <span className="h-4.5 w-4.5 rounded-full bg-blue-500 flex items-center justify-center text-[9px] font-bold text-white">
                                        {conv.unreadCount}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notification Center */}
            <div className="relative" ref={notifDropdownRef}>
              <button 
                onClick={() => { setShowNotifications(!showNotifications); setShowChat(false); }}
                className="relative p-2.5 bg-white/5 border border-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer flex items-center justify-center"
              >
                <Bell className="h-4 w-4" />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 border-2 border-[#070709] flex items-center justify-center text-[8px] font-black text-white animate-bounce">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 md:w-96 bg-[#0c0c0e]/95 border border-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden z-40 text-left"
                  >
                    <div className="bg-white/5 p-4 border-b border-white/5 flex justify-between items-center">
                      <div>
                        <h4 className="text-xs font-black uppercase text-white tracking-wider">Telemetry Alerts</h4>
                        <p className="text-[9px] text-slate-500 mt-0.5">{unreadNotifCount} unread system codes</p>
                      </div>
                      <button 
                        onClick={handleMarkAllRead}
                        className="text-[9px] text-red-405 hover:underline font-bold cursor-pointer"
                      >
                        Mark All Read
                      </button>
                    </div>

                    {/* Scrollable list */}
                    <div className="max-h-96 overflow-y-auto p-4 space-y-3">
                      {notifications.length === 0 ? (
                        <p className="text-[10px] text-slate-550 italic text-center py-8">Alert journal is completely clear.</p>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id}
                            className={`p-3 border rounded-xl flex items-start justify-between gap-3 transition-colors ${
                              notif.isRead 
                                ? 'bg-white/5 border-white/5 text-slate-500' 
                                : 'bg-red-500/5 border-red-500/10 text-white'
                            }`}
                          >
                            <div className="flex gap-2.5 items-start">
                              <div className="mt-0.5 bg-white/5 p-1.5 rounded-lg">
                                {getNotifIcon(notif.type)}
                              </div>
                              <div className="text-left space-y-0.5">
                                <p className="text-xs font-extrabold flex items-center gap-1.5">
                                  {notif.title}
                                  {!notif.isRead && (
                                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                  )}
                                </p>
                                <p className="text-[10px] text-slate-400 leading-normal">{notif.message}</p>
                                <span className="text-[8px] text-slate-600 font-mono block pt-1">
                                  {notif.createdAt ? notif.createdAt.replace('T', ' ').substring(0, 16) : ''}
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-1.5 items-center shrink-0">
                              {!notif.isRead && (
                                <button 
                                  onClick={() => handleMarkRead(notif.id)}
                                  className="p-1 hover:bg-white/5 rounded text-emerald-450 cursor-pointer"
                                  title="Mark read"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </button>
                              )}
                              <button 
                                onClick={() => handleDeleteNotification(notif.id)}
                                className="p-1 hover:bg-white/5 rounded text-red-405 cursor-pointer"
                                title="Delete alert"
                              >
                                <Trash className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-8 w-px bg-slate-800/60 hidden sm:block" />

            {/* Command Wing Selector */}
            <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/5 px-3.5 py-1.5 rounded-xl text-xs text-slate-400 cursor-pointer hover:bg-white/10 transition-all">
              <Building className="h-3.5 w-3.5 text-red-500" />
              <span className="font-bold text-slate-200">StackKraft Medical Console</span>
              <ChevronsUpDown className="h-3 w-3 text-slate-500" />
            </div>

          </div>
        </header>

        {/* Main Work Area - REMOVED mx-auto max-w-7xl constraint to enforce 100% width */}
        <main className="flex-grow p-6 md:p-8 w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
