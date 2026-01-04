"use client";

/**
 * --- WHAT IS "use client"? ---
 * In Next.js, files are Server Components by default. We add "use client" because 
 * this page uses React Hooks (useState, useEffect) and interactive events 
 * (button clicks, form typing) which must run in the browser.
 */

import React, { useState, useEffect } from "react";
import { 
  User as UserIcon, 
  Lock, 
  Settings as SettingsIcon, 
  Bell, 
  Moon, 
  Sun, 
  LogOut, 
  Camera,
  ShieldCheck,
  Languages,
} from "lucide-react"; // Premium SVG icons from the Lucide library
import { useTheme } from "next-themes"; // This hook allows us to read/write 'dark' or 'light' mode
import { toast } from "sonner"; // For beautiful, animated pop-up notifications
import Button from "@/components/ui/Button"; // Our custom reusable button component
import Input from "@/components/ui/Input"; // Our custom reusable input component

/**
 * --- THE SETTINGS MODULE ---
 * This is a major feature that acts as a Hub for user personalization.
 * It combines three backend systems: Profile (Public data), Security (Passwords), 
 * and Preferences (App behavior).
 */
export default function SettingsPage() {
  /**
   * --- THEME MANAGEMENT ---
   * useTheme() provides:
   * 1. theme: The current value ('dark' or 'light')
   * 2. setTheme: A function to change that value
   */
  const { theme, setTheme } = useTheme();
  
  /**
   * --- TAB MANAGEMENT ---
   * We use 'activeTab' to control conditional rendering.
   * If activeTab is "profile", we only show the profile form.
   */
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "preferences">("profile");
  
  /**
   * --- USER DATA STATE ---
   * 'user' stores the raw MongoDB object.
   * 'isLoading' prevents the user from clicking buttons while a request is flying.
   */
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  /**
   * --- FORM FIELD STATES ---
   * We store form inputs in 'objects' rather than individual variables.
   * This is much cleaner when dealing with 10+ input fields.
   */
  const [profileData, setProfileData] = useState({ 
    name: "", 
    bio: "", 
    phoneNumber: "", 
    image: "" 
  });

  const [passwordData, setPasswordData] = useState({ 
    currentPassword: "", 
    newPassword: "", 
    confirmPassword: "" 
  });

  const [preferences, setPreferences] = useState({ 
    notificationsEnabled: true, 
    newsletterSubscribed: false 
  });

  /**
   * --- 1. INITIAL DATA FETCH (useEffect) ---
   * useEffect runs once when the page "mounts" (appears).
   * We use it here to go to the server, get the user's current settings,
   * and fill the form inputs automatically.
   */
  useEffect(() => {
    async function fetchProfile() {
      try {
        // We call our custom API route
        const res = await fetch("/api/user/profile");
        const data = await res.json();

        if (res.ok) {
          // Success: Update the state with database values
          setUser(data.user);
          setProfileData({
            name: data.user.name,
            bio: data.user.bio || "",
            phoneNumber: data.user.phoneNumber || "",
            image: data.user.image || "",
          });
          setPreferences(data.user.preferences);
        } else {
          // Error: Probably session expired, so we kick them back to Login
          toast.error("Session expired. Please login.");
          window.location.href = "/auth/login";
        }
      } catch (err) {
        toast.error("Failed to load profile.");
      } finally {
        // Stop the loading spinner regardless of success or failure
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  /**
   * --- 2. UPDATE HANDLERS (PATCH Requests) ---
   * We use the 'PATCH' method because we are "patching" (partially updating) 
   * an existing database record.
   */
  
  /** Update Basic Info (Name, Bio, etc) */
  const handleUpdateProfile = async (e: React.FormEvent) => {
    // e.preventDefault() stops the browser from refreshing the whole page
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData), // Convert the JS object to JSON string for the server
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setUser(data.user); // Update the UI header instantly with the new name/image
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /** Update Notifications/Darkmode preferences */
  const handleUpdatePreferences = async (newPrefs: any) => {
    try {
      const res = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        /**
         * We merge the existing preferences with the updated field.
         * The server also receives the 'darkMode' preference so it can sync.
         */
        body: JSON.stringify({ 
          preferences: { 
            ...preferences, 
            ...newPrefs, 
            darkMode: theme === 'dark' 
          } 
        }),
      });
      if (res.ok) {
        setPreferences({ ...preferences, ...newPrefs });
        toast.success("Preferences saved to your cloud profile");
      }
    } catch (err) {
      toast.error("Failed to update settings");
    }
  };

  /** Update Password with Security Check */
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    // Frontend-only validation for speed
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("New passwords do not match");
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        // Clean the forms for safety
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDERING LOGIC ---
  if (isLoading && !user) return <div className="h-screen flex items-center justify-center font-bold tracking-widest text-indigo-600 animate-pulse">SYNCHRONIZING PROFILE...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] p-4 md:p-12 transition-colors duration-500">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/**
         * HEADER CARD
         * Shows the circular profile image or placeholder icon.
         */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-8 rounded-4xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-3xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl transition-transform duration-500 hover:rotate-2">
                {profileData.image ? (
                  <img src={profileData.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={40} className="text-indigo-600" />
                )}
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold dark:text-white uppercase tracking-tight">{user?.name}</h1>
              <p className="text-slate-500 text-sm font-medium">{user?.email}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  {user?.role} Account
                </span>
                {user?.isVerified && (
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 text-[10px] font-bold rounded-full uppercase tracking-wider flex items-center">
                    <ShieldCheck size={10} className="mr-1" /> Verified
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 dark:border-red-900/30" onClick={() => window.location.href = "/auth/login"}>
            <LogOut size={18} className="mr-2" /> Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/**
           * SIDEBAR NAVIGATION
           * We map() through an array to create the buttons 
           * instead of writing 3 separate button tags. This is "DRY" (Don't Repeat Yourself).
           */}
          <div className="lg:col-span-4 space-y-2">
            {[
              { id: "profile", icon: UserIcon, label: "Your Profile" },
              { id: "security", icon: ShieldCheck, label: "Security & Login" },
              { id: "preferences", icon: SettingsIcon, label: "App Preferences" },
            ].map((tab: any) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 ${
                  activeTab === tab.id 
                  ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 translate-x-1" 
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <tab.icon size={20} />
                <span className="font-semibold">{tab.label}</span>
              </button>
            ))}
          </div>

          {/**
           * MAIN SETTINGS AREA
           * Uses conditional rendering logic: `{activeTab === 'x' && <Component />}`
           */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-4xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 min-h-[500px]">
            
            {/** PROFILE SECTION */}
            {activeTab === "profile" && (
              <form onSubmit={handleUpdateProfile} className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-500">
                <div>
                  <h2 className="text-xl font-bold dark:text-white mb-1">Public Profile</h2>
                  <p className="text-slate-500 text-sm">How you appear to other members.</p>
                </div>
                <Input 
                  label="Full Name" 
                  value={profileData.name} 
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  required
                />
                <Input 
                  label="Profile Image URL" 
                  value={profileData.image} 
                  onChange={(e) => setProfileData({...profileData, image: e.target.value})}
                  placeholder="https://images.unsplash.com/..."
                  helperText="Use a URL from Unsplash or Google Photos"
                />
                <Input 
                  label="Phone Number" 
                  value={profileData.phoneNumber} 
                  onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value})}
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium ml-1">Account Bio</label>
                  <textarea 
                    className="w-full rounded-xl p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none h-32 text-sm transition-all"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    placeholder="Briefly describe yourself..."
                  />
                </div>
                <Button type="submit" isLoading={isLoading} className="w-full md:w-auto px-12">Commit Changes</Button>
              </form>
            )}

            {/** SECURITY SECTION */}
            {activeTab === "security" && (
              <form onSubmit={handleUpdatePassword} className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-500">
                <div>
                  <h2 className="text-xl font-bold dark:text-white mb-1">Account Security</h2>
                  <p className="text-slate-500 text-sm">Update your secret credentials regularly.</p>
                </div>
                <Input 
                  label="Current Password" 
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  required
                />
                <hr className="border-slate-100 dark:border-slate-800 my-2" />
                <Input 
                  label="New Secure Password" 
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  required
                />
                <Input 
                  label="Confirm New Password" 
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  required
                />
                <Button type="submit" isLoading={isLoading} className="w-full md:w-auto px-12">Shield Account</Button>
              </form>
            )}

            {/** PREFERENCES SECTION */}
            {activeTab === "preferences" && (
              <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-500">
                <div>
                  <h2 className="text-xl font-bold dark:text-white mb-1">Interface Customization</h2>
                  <p className="text-slate-500 text-sm">Tune the application to your liking.</p>
                </div>
                
                {/** DARK MODE TOGGLE (System Integration) */}
                <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-transparent dark:border-slate-800">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-indigo-600">
                      {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                    </div>
                    <div>
                      <h4 className="font-bold dark:text-white">Dark Dashboard</h4>
                      <p className="text-xs text-slate-500">Easier on the eyes in low light</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="relative w-14 h-8 bg-slate-200 dark:bg-indigo-600 rounded-full transition-all duration-500 flex items-center p-1"
                  >
                    <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-500 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/** NOTIFICATION SWITCHES (API Integration) */}
                <div className="space-y-4">
                  {[
                    { id: 'notificationsEnabled', icon: Bell, title: 'Activity Alerts', desc: 'Real-time order and security updates' },
                    { id: 'newsletterSubscribed', icon: Languages, title: 'Store Newsletter', desc: 'Weekly curated deals and announcements' }
                  ].map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-transparent dark:border-slate-800">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-indigo-600">
                          <item.icon size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold dark:text-white text-xs uppercase tracking-widest">{item.title}</h4>
                          <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleUpdatePreferences({ [item.id]: !preferences[item.id as keyof typeof preferences] })}
                        className={`relative w-14 h-8 rounded-full transition-all duration-500 p-1 flex items-center ${preferences[item.id as keyof typeof preferences] ? 'bg-green-500' : 'bg-slate-300'}`}
                      >
                         <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-500 ${preferences[item.id as keyof typeof preferences] ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
