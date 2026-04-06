import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore"; // ✅ Global theme state
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User, Bell, Trash2, Save, Moon, Sun } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const SettingsAdmin = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile, deleteAccount, isLoading: authLoading } = useAuthStore();
  const { darkMode, toggleTheme } = useThemeStore(); // ✅ Global theme state

  const [confirmationText, setConfirmationText] = useState("");
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    notifications: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: user?.name || "",
      email: user?.email || "",
    }));
  }, [user?.name, user?.email]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleToggle = (field) => {
    setForm({ ...form, [field]: !form[field] });
  };

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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await updateProfile({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password.trim() || undefined,
      });
      setForm((prev) => ({ ...prev, password: "" }));
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  return (
         <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Page Title */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tight uppercase">Admin Settings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Manage administrative profile and system preferences.
          </p>
        </div>

        {/* Profile Settings */}
        <Card className="rounded-3xl border-none shadow-sm bg-white dark:bg-black dark:border dark:border-white/10 overflow-hidden">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-2 mb-2">
             
              <h2 className="text-lg font-bold uppercase tracking-tight">Public Profile</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Full Name</Label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="bg-gray-50/50 dark:bg-black border-gray-200 dark:border-white/10 rounded-xl focus:ring-indigo-500/10"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Email Address</Label>
                <Input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="bg-gray-50/50 dark:bg-black border-gray-200 dark:border-white/10 rounded-xl focus:ring-indigo-500/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">New Password</Label>
              <Input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="bg-gray-50/50 dark:bg-black border-gray-200 dark:border-white/10 rounded-xl focus:ring-indigo-500/10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="rounded-3xl border-none shadow-sm bg-white dark:bg-black dark:border dark:border-white/10 overflow-hidden">
          <CardContent className="p-8 space-y-4">
            <div className="flex items-center gap-2 mb-2">
         
              <h2 className="text-lg font-bold uppercase tracking-tight">Preferences</h2>
            </div>

            {/* Dark Mode Switch */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-black border border-gray-100 dark:border-white/10">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-white dark:bg-white/5 text-slate-600 dark:text-white shadow-sm border dark:border-white/10">
                  {darkMode ? <Moon size={18} /> : <Sun size={18} />}
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold">Appearance</p>
                  <p className="text-xs text-gray-500 dark:text-slate-500">Enable dark theme across the dashboard</p>
                </div>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-indigo-600"
              />
            </div>

            {/* Notifications Switch */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-black border border-gray-100 dark:border-white/10">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-white dark:bg-white/5 text-slate-600 dark:text-white shadow-sm border dark:border-white/10">
                  <Bell size={18} />
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold">Notifications</p>
                  <p className="text-xs text-gray-500 dark:text-slate-500">Receive system updates and alerts</p>
                </div>
              </div>
              <Switch
                checked={form.notifications}
                onCheckedChange={() => handleToggle("notifications")}
                className="data-[state=checked]:bg-indigo-600"
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl">
                <Trash2 size={16} />
                {loading || authLoading ? "Deleting..." : "Delete Account"}
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent className="bg-white dark:bg-black border-none dark:border dark:border-white/10 rounded-3xl shadow-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl font-bold dark:text-white uppercase tracking-tight">Verify Deletion</AlertDialogTitle>
                <AlertDialogDescription className="dark:text-slate-400">
                  This action is permanent. To confirm, type{" "}
                  <strong className="text-red-500 font-bold underline">DELETE</strong> below:
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="my-4">
                <Input
                  placeholder="Type DELETE"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  className="bg-gray-50 dark:bg-black border-gray-200 dark:border-white/10 h-12 rounded-xl text-center font-black tracking-widest"
                />
              </div>

              <AlertDialogFooter className="gap-2">
                <AlertDialogCancel className="rounded-xl border-gray-200 dark:border-white/10 dark:bg-black">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={confirmationText !== "DELETE" || loading || authLoading}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
                >
                  Confirm Deletion
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
  onClick={handleSubmit}
  disabled={loading || authLoading}
  className="w-full md:w-auto px-8 py-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-widest text-[9px] shadow-lg shadow-indigo-600/10 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 group"
>
  {loading || authLoading ? (
    <div className="flex items-center gap-2">
      <div className="h-3 w-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      <span className="opacity-80">Saving...</span>
    </div>
  ) : (
    <>
      <Save size={14} className="group-hover:translate-y-[-1px] transition-transform" />
      <span>Save Changes</span>
    </>
  )}
</Button>
        </div>
      </div>
  );
};

export default SettingsAdmin;


