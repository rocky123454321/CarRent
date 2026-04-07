import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore"; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

export const Settings = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile, deleteAccount, isLoading } = useAuthStore();

  const [confirmationText, setConfirmationText] = useState("");
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    darkMode: document.documentElement.classList.contains("dark"),
    notifications: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setForm(prev => ({ ...prev, darkMode: isDark }));
  }, []);

  const toggleDarkMode = (checked) => {
    if (checked) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    setForm(prev => ({ ...prev, darkMode: checked }));
  };

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
      setLoading(false);
      toast.success("Account deleted successfully");
      navigate("/landing", { replace: true });
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message || "Delete failed");
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
    <div className="max-w-4xl mx-auto space-y-12 py-12 ">
      
      {/* ─── SECTION HEADER (Landing Page Style) ─── */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="h-px w-5 bg-zinc-300 dark:bg-zinc-700" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
            Account Management
          </p>
          <span className="h-px w-5 bg-zinc-300 dark:bg-zinc-700" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter leading-[1.1] text-zinc-900 dark:text-white uppercase italic">
          Account <span className="text-zinc-300 dark:text-zinc-700">Settings.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 dark:text-zinc-500 font-medium">
          Manage your personal information and application preferences.
        </p>
      </div>

      <div className="grid gap-6">
        
        {/* Profile Settings - Feature Card Style */}
        <Card className="rounded-2xl border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-900/50 shadow-none transition-all">
          <CardHeader className="p-8 border-b border-zinc-50 dark:border-zinc-800/50">
            <div className="flex items-center gap-3">
             
              <div>
                <CardTitle className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">Public Profile</CardTitle>
                <CardDescription className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Update basic account details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 italic">Full Name</Label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="bg-transparent border-none border-b border-zinc-100 dark:border-zinc-800 rounded-none h-10 focus-visible:ring-0 focus-visible:border-zinc-900 dark:focus-visible:border-white transition-colors dark:text-white font-medium px-0"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 italic">Email Address</Label>
                <Input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="bg-transparent border-none border-b border-zinc-100 dark:border-zinc-800 rounded-none h-10 focus-visible:ring-0 focus-visible:border-zinc-900 dark:focus-visible:border-white transition-colors dark:text-white font-medium px-0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 italic">New Password</Label>
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="bg-transparent border-none border-b border-zinc-100 dark:border-zinc-800 rounded-none h-10 focus-visible:ring-0 focus-visible:border-zinc-900 dark:focus-visible:border-white transition-colors dark:text-white font-medium px-0"
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferences - Testimonial Card Style */}
        <Card className="rounded-2xl border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-900/50 shadow-none transition-all">
          <CardHeader className="p-8 border-b border-zinc-50 dark:border-zinc-800/50">
            <div className="flex items-center gap-3">
            
              <div>
                <CardTitle className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">App Environment</CardTitle>
                <CardDescription className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Control appearance and alerts</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800/50">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 shadow-sm border dark:border-zinc-700">
                  {form.darkMode ? <Moon size={18} /> : <Sun size={18} />}
                </div>
                <div>
                  <Label className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-tight">Appearance</Label>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-tighter">Toggle between light and dark</p>
                </div>
              </div>
              <Switch
                checked={form.darkMode}
                onCheckedChange={toggleDarkMode}
                className="data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-white"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800/50">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 shadow-sm border dark:border-zinc-700">
                  <Bell size={18} />
                </div>
                <div>
                  <Label className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-tight">Notifications</Label>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-tighter">Real-time status updates</p>
                </div>
              </div>
              <Switch
                checked={form.notifications}
                onCheckedChange={() => handleToggle("notifications")}
                className="data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-red-500 transition-colors px-2 italic">
                <Trash2 size={14} />
                Terminate Account
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white dark:bg-zinc-950 border-zinc-100 dark:border-zinc-900 rounded-3xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl font-bold dark:text-white uppercase italic tracking-tighter">Verify Deletion</AlertDialogTitle>
                <AlertDialogDescription className="text-xs text-zinc-400">
                  This action is permanent. Type <strong>DELETE</strong> to proceed:
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Input
                placeholder="DELETE"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                className="bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 h-12 rounded-xl text-center font-bold tracking-[0.3em] text-xs dark:text-white"
              />
              <AlertDialogFooter className="gap-2">
                <AlertDialogCancel className="rounded-xl text-[10px] font-bold uppercase tracking-widest border-zinc-100 dark:border-zinc-800">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={confirmationText !== "DELETE" || loading}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest"
                >
                  Confirm Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full md:w-auto px-10 h-12 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold uppercase tracking-[0.2em] text-[10px] transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="h-3 w-3 border-2 border-white/20 border-t-white dark:border-zinc-900/20 dark:border-t-zinc-900 rounded-full animate-spin" />
            ) : (
              <>
                <Save size={14} />
                <span>Apply Changes</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;