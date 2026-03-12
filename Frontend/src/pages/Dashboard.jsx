import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import Assignments from "./Assignments";
import toast from "react-hot-toast";
import {
  Menu,
  Bed,
  Bell,
  Users,
  LayoutDashboard,
  MessageCircleReply,
  Timer,
  Lock,
  ChevronRight,
  ShieldAlert,
  Stethoscope,
  Activity,
  CheckCircle2
} from "lucide-react";
import { getUnreadNotificationsCount } from "../services/notification";

const Dashboard = () => {
  const { user, loading, expiry, deptExpiry, wardExpiry } = useAuth();
  const [open, setOpen] = useState(false);
  const [forceRequired, setForceRequired] = useState(false);
  const [updateAssign, setUpdateAssign] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const isSubscribed = user?.subscription?.isActive;

  /* ---------------- Calculate Days Remaining ---------------- */
  const daysLeft = useMemo(() => {
    if (!user?.subscription?.endDate) return 0;
    const end = new Date(user.subscription.endDate);
    const now = new Date();
    const diff = end - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  }, [user]);

  /* ---------------- Auth & Redirect Logic ---------------- */
  useEffect(() => {
    if (user && user.firstLoginDone === false) {
      setForceRequired(true);
      setOpen(true);
      setUpdateAssign(false);
    } else {
      setForceRequired(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === "admin") {
      window.location.href = "/admin";
    }
  }, [user]);

  const hasExpiredAssignment = useMemo(() => {
    if (!expiry) return false;
    const todayStr = new Date().toLocaleDateString("en-CA");
    return (
      (deptExpiry && todayStr >= deptExpiry) ||
      (wardExpiry && todayStr >= wardExpiry)
    );
  }, [expiry, deptExpiry, wardExpiry]);

  useEffect(() => {
    if (!loading && user && hasExpiredAssignment && user.role !== "intern") {
      navigate("/update-expiry", { replace: true });
    }
  }, [loading, user, hasExpiredAssignment, navigate]);

  /* ---------------- Subscription Toast ---------------- */
  const showLockedToast = () => {
    toast.custom((t) => (
      <div className={`${t.visible ? "animate-enter" : "animate-leave"} max-w-md w-full bg-white shadow-2xl rounded-[2rem] pointer-events-auto flex ring-1 ring-black/5 overflow-hidden border border-blue-50`}>
        <div className="flex-1 p-6">
          <div className="flex items-start">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                <Stethoscope size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-bold text-slate-900">Module Locked</p>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed font-medium">
                Dr. {user?.name}, your clinical access is currently restricted. Please renew your subscription to unlock this module.
              </p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => { toast.dismiss(t.id); navigate('/screenshot'); }} 
          className="px-6 border-l border-slate-100 text-xs font-black uppercase text-blue-600 hover:bg-blue-50 transition-colors"
        >
          Upgrade
        </button>
      </div>
    ));
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ---------------- DYNAMIC SUBSCRIPTION BANNER ---------------- */}
      {isSubscribed ? (
        <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-2 flex items-center justify-center gap-2 sticky top-0 z-[60]">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest">
            Subscription Active • <span className="animate-pulse text-emerald-600"><strong>{daysLeft} Days Remaining</strong></span>
          </p>
        </div>
      ) : (
        <div className="bg-amber-50 border-b border-amber-100 px-6 py-2 flex items-center justify-center gap-2 sticky top-0 z-[60]">
          <ShieldAlert size={16} className="text-amber-600" />
          <p className="text-[11px] font-bold text-amber-800 uppercase tracking-widest">
            Pending Subscription: Clinical modules are in view-only mode.
          </p>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Medical Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-2">
                <Activity size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Hospital System v1.0</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Clinical Dashboard</h1>
            <p className="text-slate-500 font-medium mt-1">
              Practitioner: <span className="text-slate-900 font-bold">Dr. {user.name}</span>
            </p>
          </div>
          
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Duty Role</p>
                <p className="text-sm font-bold text-teal-600 uppercase italic">{user.role}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden">
                <img src={user?.image || `https://ui-avatars.com/api/?name=${user.name}`} alt="profile" />
            </div>
          </div>
        </div>

        {/* Medical Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <MedicalCard
            to="/beds"
            icon={<Bed size={26} />}
            title="Ward Beds"
            desc="Assign and monitor ward beds"
            accent="teal"
            isSubscribed={isSubscribed}
            onLockedClick={showLockedToast}
          />

          {user.role !== "intern" && (
            <>
              <MedicalCard
                to="/notifications"
                icon={<Bell size={26} />}
                title="Notifications"
                desc="New admissions & alerts"
                accent="blue"
                badge={unreadCount}
                isSubscribed={isSubscribed}
                onLockedClick={showLockedToast}
              />
              <MedicalCard
                to="/myassignments"
                icon={<LayoutDashboard size={26} />}
                title="Assignments"
                desc="Your current ward duties"
                accent="purple"
                isSubscribed={isSubscribed}
                onLockedClick={showLockedToast}
              />
              <MedicalCard
                to="/support-responses"
                icon={<MessageCircleReply size={26} />}
                title="Support Desk"
                desc="Responses from administration"
                accent="slate"
                isSubscribed={isSubscribed}
                onLockedClick={showLockedToast}
              />
            </>
          )}

          {user.role === "supervisor" && (
            <MedicalCard
              to="/supervisor"
              icon={<Users size={26} />}
              title="Supervisor Panel"
              desc="Staff & system oversight"
              accent="teal"
              isSubscribed={isSubscribed}
              onLockedClick={showLockedToast}
            />
          )}
        </div>
      </div>

      {!forceRequired && (
        <button
          onClick={() => { setOpen(true); setUpdateAssign(!!user.firstLoginDone); }}
          className="fixed bottom-10 left-10 z-50 h-16 w-16 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:bg-blue-600 transition-all hover:scale-110 group active:scale-95"
        >
          <Menu size={28} className="group-hover:rotate-180 transition-transform duration-500" />
        </button>
      )}

      <Modal isOpen={open} onClose={() => !forceRequired && setOpen(false)} forceRequired={forceRequired} updateAssign={updateAssign}>
        <Assignments 
          updateAssign={updateAssign} 
          closeModal={() => !forceRequired && setOpen(false)} 
          onFirstAssignmentComplete={() => { setForceRequired(false); setOpen(false); }} 
        />
      </Modal>
    </div>
  );
};

/* ---------------- Card Component ---------------- */
const MedicalCard = ({ to, icon, title, desc, accent, badge, isSubscribed, onLockedClick }) => {
  const themes = {
    teal: "text-teal-600 bg-teal-50",
    blue: "text-blue-600 bg-blue-50",
    purple: "text-purple-600 bg-purple-50",
    slate: "text-slate-600 bg-slate-50",
  };

  const CardWrapper = (
    <div className={`group relative bg-white rounded-[2rem] p-7 border border-slate-100 transition-all duration-500 h-full flex flex-col ${isSubscribed ? 'hover:shadow-2xl hover:border-blue-100 hover:-translate-y-1' : ''}`}>
      {!isSubscribed && (
        <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-[2px] rounded-[2rem] flex flex-col items-center justify-center">
            <div className="bg-white/90 p-3 rounded-2xl shadow-xl border border-white">
                <Lock size={20} className="text-slate-400" />
            </div>
        </div>
      )}

      {badge > 0 && isSubscribed && (
        <span className="absolute top-6 right-6 h-6 w-6 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-lg ring-4 ring-white animate-pulse">
          {badge}
        </span>
      )}

      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${themes[accent]}`}>
        {icon}
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-2 uppercase tracking-tight">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed font-medium mb-6 flex-grow">{desc}</p>
      
      <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${isSubscribed ? 'text-blue-600' : 'text-slate-300'}`}>
        <span>Access Module</span>
        <ChevronRight size={14} />
      </div>
    </div>
  );

  return isSubscribed ? (
    <Link to={to} className="block h-full">{CardWrapper}</Link>
  ) : (
    <div onClick={onLockedClick} className="cursor-pointer block h-full">{CardWrapper}</div>
  );
};

const LoadingScreen = () => (
    <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="absolute inset-0 border-4 border-blue-50 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                    <Activity size={32} />
                </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 tracking-widest">Syncing Records</p>
        </div>
    </div>
);

export default Dashboard;