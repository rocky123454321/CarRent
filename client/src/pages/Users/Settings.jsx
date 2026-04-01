import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore"; // ✅ import your auth store
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom"; // ✅ for redirect after deletion
import { toast } from "sonner";
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
    darkMode: false,
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
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>

        {/* Profile Settings */}
        <Card className="rounded-2xl shadow">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Profile</h2>

            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter new password"
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="rounded-2xl shadow">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Preferences</h2>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-gray-500">Enable dark theme</p>
              </div>
              <Switch
                checked={form.darkMode}
                onCheckedChange={() => handleToggle("darkMode")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notifications</p>
                <p className="text-sm text-gray-500">Receive updates</p>
              </div>
              <Switch
                checked={form.notifications}
                onCheckedChange={() => handleToggle("notifications")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-between items-center">
        <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" disabled={loading || isLoading}>
            {loading || isLoading ? "Deleting..." : "Delete Account"}
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. To confirm, type{" "}
              <strong>DELETE</strong> below:
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="my-4">
            <Input
              placeholder="Type DELETE to confirm"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={confirmationText !== "DELETE" || loading || isLoading}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

          <Button
            onClick={handleSubmit}
            disabled={loading || isLoading}
            className="rounded-xl"
          >
            {loading || isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;