import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Settings = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    darkMode: false,
    notifications: true,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleToggle = (key) => {
    setForm({ ...form, [key]: !form[key] });
  };

  // ✅ SAVE SETTINGS (CONNECT TO BACKEND)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log(data);

      alert("Settings updated successfully");
    } catch (err) {
      console.error(err);
      alert("Error updating settings");
    } finally {
      setLoading(false);
    }
  };

  // ❌ DELETE ACCOUNT
  const handleDeleteAccount = async () => {
    const confirmDelete = confirm("Are you sure you want to delete your account? This cannot be undone.");

    if (!confirmDelete) return;

    try {
      setLoading(true);

      const res = await fetch("/api/user/delete", {
        method: "DELETE",
      });

      const data = await res.json();
      console.log(data);

      alert("Account deleted");

      // redirect after delete
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Error deleting account");
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
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={loading}
            className="rounded-xl"
          >
            Delete Account
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-xl"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;