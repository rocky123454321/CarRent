import React, { useEffect, useState, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import {
  User, Bell, Trash2, Save, Moon, Sun,
  Camera, Eye, EyeOff, LogOut, Lock,
  AlertTriangle, Mail, Calendar, RefreshCw, ShieldCheck, Clock
} from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const Settings = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile, deleteAccount, isLoading: authLoading } = useAuthStore();
  const { darkMode, toggleTheme } = useThemeStore();

  const [confirmationText, setConfirmationText] = useState("");
  const [loading, setLoading]           = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.profileImage || null);
  const [avatarFile, setAvatarFile]     = useState(null);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name:         user?.name  || "",
    email:        user?.email || "",
    password:     "",
    notifications: true,
  });

  useEffect(() => {
    setForm(prev => ({
      ...prev,
      name:  user?.name  || "",
      email: user?.email || "",
    }));
    setAvatarPreview(user?.profileImage || null);
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ── Avatar upload ─────────────────────────────────────────────
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // ── Save profile ──────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!form.name.trim()) { toast.error("Name cannot be empty"); return; }

    const nameChanged     = form.name.trim() !== (user?.name || "");
    const passwordChanged = form.password.trim().length > 0;
    const imageChanged    = !!avatarFile;

    if (!nameChanged && !passwordChanged && !imageChanged) {
      toast.info("No changes to save");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name",  form.name.trim());
      formData.append("email", form.email.trim());
      if (passwordChanged) formData.append("password", form.password.trim());
      if (avatarFile)      formData.append("profileImage", avatarFile);

      const res = await axios.patch(`${API_URL}/api/auth/profile`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      useAuthStore.setState({ user: res.data.user });
      setForm(prev => ({ ...prev, password: "" }));
      setAvatarFile(null);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  // ── Delete account ────────────────────────────────────────────
  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      await deleteAccount();
      await logout();
      toast.success("Account deleted successfully");
      navigate("/landing", { replace: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // ── Logout ────────────────────────────────────────────────────
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/landing", { replace: true });
    } catch {
      toast.error("Logout failed");
    }
  };

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })
    : "—";

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-10 px-4 md:px-6">

      {/* ── Page Header ───────────────────────────────────────── */}
      <div>
        <div className="inline-flex items-center gap-2 mb-1">
          <span className="h-px w-5 bg-zinc-300 dark:bg-zinc-700" />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
            Account
          </p>
        </div>
        <h1 className="text-3xl font-bold tracking-tighter text-zinc-900 dark:text-white">
          Settings
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Manage your personal information and preferences.
        </p>
      </div>

      {/* ── Profile Card ──────────────────────────────────────── */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-zinc-50 dark:border-zinc-900 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
            <User size={16} />
          </div>
          <div>
            <p className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Profile</p>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Personal information</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden flex items-center justify-center">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-zinc-400 dark:text-zinc-600">{initials}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-7 h-7 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                <Camera size={12} />
              </button>
              <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
            </div>
            <div>
              <p className="font-bold text-zinc-900 dark:text-white">{user?.name || "User"}</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">{user?.email}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded-full">
                  <ShieldCheck size={9} /> {user?.role || "User"}
                </span>
                {user?.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 px-2 py-0.5 rounded-full">
                    ✓ Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-3 border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar size={11} className="text-zinc-400" />
                <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Member Since</p>
              </div>
              <p className="text-xs font-bold text-zinc-900 dark:text-white">{joinedDate}</p>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-3 border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-1.5 mb-1">
                <Mail size={11} className="text-zinc-400" />
                <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Email Status</p>
              </div>
              <p className="text-xs font-bold text-zinc-900 dark:text-white">
                {user?.isVerified ? "✓ Verified" : "⚠ Unverified"}
              </p>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Full Name</Label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="h-11 rounded-xl border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
            />
          </div>

          {/* Email — read only */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Email Address</Label>
            <div className="relative">
              <Input
                name="email"
                value={form.email}
                readOnly
                className="h-11 rounded-xl border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500 cursor-not-allowed pr-10"
              />
              <Lock size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-300 dark:text-zinc-700" />
            </div>
            <p className="text-[9px] text-zinc-400 uppercase tracking-widest">Email cannot be changed</p>
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">New Password</Label>
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                name="password"
                placeholder="Leave blank to keep current"
                value={form.password}
                onChange={handleChange}
                className="h-11 rounded-xl border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Save */}
          <Button
            onClick={handleSubmit}
            disabled={loading || authLoading}
            className="w-full h-11 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold uppercase tracking-widest text-[10px] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            {loading || authLoading ? (
              <RefreshCw size={13} className="animate-spin" />
            ) : (
              <><Save size={13} /> Save Changes</>
            )}
          </Button>
        </div>
      </div>

      {/* ── Preferences ───────────────────────────────────────── */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-zinc-50 dark:border-zinc-900 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
            <Moon size={16} />
          </div>
          <div>
            <p className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Preferences</p>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Appearance & notifications</p>
          </div>
        </div>

        <div className="p-6 space-y-3">
          {/* Dark mode */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
                {darkMode ? <Moon size={15} className="text-zinc-500" /> : <Sun size={15} className="text-zinc-500" />}
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-tight">Dark Mode</p>
                <p className="text-[10px] text-zinc-400">Toggle interface theme</p>
              </div>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={toggleTheme}
              className="data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-white"
            />
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
                <Bell size={15} className="text-zinc-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-tight">Notifications</p>
                <p className="text-[10px] text-zinc-400">Booking & system alerts</p>
              </div>
            </div>
            <Switch
              checked={form.notifications}
              onCheckedChange={() => setForm(p => ({ ...p, notifications: !p.notifications }))}
              className="data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-white"
            />
          </div>
        </div>
      </div>

      {/* ── Session ───────────────────────────────────────────── */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-zinc-50 dark:border-zinc-900 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
            <Lock size={16} />
          </div>
          <div>
            <p className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Session</p>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Active login management</p>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
                <Clock size={15} className="text-zinc-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-tight">Current Session</p>
                <p className="text-[10px] text-zinc-400">Logged in as {user?.role || "User"}</p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-lg transition-colors">
                  <LogOut size={12} /> Sign Out
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white dark:bg-zinc-950 border-zinc-100 dark:border-zinc-900 rounded-3xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-bold dark:text-white tracking-tighter">Sign Out?</AlertDialogTitle>
                  <AlertDialogDescription className="text-zinc-500 dark:text-zinc-400 text-sm">
                    You will be redirected to the login page.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2">
                  <AlertDialogCancel className="rounded-xl border-zinc-200 dark:border-zinc-800 font-bold text-[10px] uppercase tracking-widest">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout} className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-xl font-bold text-[10px] uppercase tracking-widest">
                    Sign Out
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* ── Danger Zone ───────────────────────────────────────── */}
      <div className="bg-white dark:bg-zinc-950 border-2 border-red-100 dark:border-red-950/50 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-red-50 dark:border-red-950/30 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/30 text-red-500">
            <AlertTriangle size={16} />
          </div>
          <div>
            <p className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">Danger Zone</p>
            <p className="text-[10px] text-red-400/70 dark:text-red-500/70 uppercase tracking-widest">Irreversible actions</p>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-950/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-900 border border-red-100 dark:border-red-900/50 flex items-center justify-center">
                <Trash2 size={15} className="text-red-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-tight">Delete Account</p>
                <p className="text-[10px] text-zinc-400">Permanently remove all data. Cannot be undone.</p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 border border-red-200 dark:border-red-900/50 px-3 py-1.5 rounded-lg transition-colors hover:bg-red-50 dark:hover:bg-red-950/20">
                  <Trash2 size={12} /> Delete
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white dark:bg-zinc-950 border-zinc-100 dark:border-zinc-900 rounded-3xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-bold dark:text-white tracking-tighter">Delete Account?</AlertDialogTitle>
                  <AlertDialogDescription className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                    This is permanent. All your data and bookings will be deleted. Type{" "}
                    <strong className="text-red-500 font-black">DELETE</strong> to confirm.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="my-2">
                  <Input
                    placeholder="Type DELETE to confirm"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    className="h-11 rounded-xl text-center font-bold tracking-[0.3em] text-sm border-red-100 dark:border-red-900/50 focus-visible:ring-red-500/20 dark:bg-zinc-900 dark:text-white"
                  />
                </div>
                <AlertDialogFooter className="gap-2">
                  <AlertDialogCancel
                    onClick={() => setConfirmationText("")}
                    className="rounded-xl border-zinc-200 dark:border-zinc-800 font-bold text-[10px] uppercase tracking-widest"
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={confirmationText !== "DELETE" || loading}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-red-600/20"
                  >
                    {loading ? <RefreshCw size={12} className="animate-spin" /> : "Confirm Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;