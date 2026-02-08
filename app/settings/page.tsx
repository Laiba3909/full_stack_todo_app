'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'general' | 'account' | 'notifications' | 'privacy'>('general')
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState({
    // General
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    
    // Account
    email: 'user@example.com',
    name: 'John Doe',
    twoFactor: false,
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    weeklyReports: false,
    
    // Privacy
    dataSharing: false,
    analytics: true,
    autoDelete: '30',
  })

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500)
  }, [])

  const handleSave = () => {
    // Save settings logic here
    alert('Settings saved successfully!')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-600">Manage your account preferences</p>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
              <nav className="space-y-1">
                {[
                  { id: 'general', label: 'General', icon: '⚙️' },
                  { id: 'account', label: 'Account', icon: '👤' },
                  { id: 'notifications', label: 'Notifications', icon: '🔔' },
                  { id: 'privacy', label: 'Privacy & Security', icon: '🔒' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="ml-auto w-2 h-2 bg-indigo-600 rounded-full"></div>
                    )}
                  </button>
                ))}
              </nav>

              {/* Danger Zone */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Danger Zone</h3>
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-red-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="font-medium">Delete Account</span>
                </button>
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">General Settings</h2>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">Appearance</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { id: 'light', label: 'Light', desc: 'Clean and bright interface' },
                          { id: 'dark', label: 'Dark', desc: 'Reduced eye strain' },
                          { id: 'auto', label: 'Auto', desc: 'Follows system theme' },
                        ].map((theme) => (
                          <label
                            key={theme.id}
                            className={`relative cursor-pointer border-2 rounded-xl p-4 transition-all ${
                              settings.theme === theme.id
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="theme"
                              value={theme.id}
                              checked={settings.theme === theme.id}
                              onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                              className="sr-only"
                            />
                            <div className="flex items-center space-x-3">
                              <div className={`w-4 h-4 rounded-full border-2 ${
                                settings.theme === theme.id
                                  ? 'border-indigo-600 bg-indigo-600'
                                  : 'border-gray-300'
                              }`}>
                                {settings.theme === theme.id && (
                                  <div className="w-2 h-2 bg-white rounded-full m-auto"></div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{theme.label}</div>
                                <div className="text-sm text-gray-500">{theme.desc}</div>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Language
                        </label>
                        <select
                          value={settings.language}
                          onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Timezone
                        </label>
                        <select
                          value={settings.timezone}
                          onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        >
                          <option value="UTC">UTC</option>
                          <option value="EST">Eastern Time</option>
                          <option value="PST">Pacific Time</option>
                          <option value="CET">Central European Time</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Settings */}
              {activeTab === 'account' && (
                <div className="p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={settings.name}
                          onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={settings.email}
                          onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                          placeholder="Enter your email"
                        />
                      </div>

                      <div className="pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                            <p className="text-sm text-gray-500">Add an extra layer of security</p>
                          </div>
                          <button
                            onClick={() => setSettings({ ...settings, twoFactor: !settings.twoFactor })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.twoFactor ? 'bg-indigo-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.twoFactor ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-200">
                        <h3 className="font-medium text-gray-900 mb-4">Change Password</h3>
                        <div className="space-y-4">
                          <input
                            type="password"
                            placeholder="Current Password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                          />
                          <input
                            type="password"
                            placeholder="New Password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                          />
                          <input
                            type="password"
                            placeholder="Confirm New Password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                          />
                          <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                            Update Password
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Settings</h2>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      {[
                        { id: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
                        { id: 'pushNotifications', label: 'Push Notifications', desc: 'Get instant browser notifications' },
                        { id: 'taskReminders', label: 'Task Reminders', desc: 'Reminders for upcoming tasks' },
                        { id: 'weeklyReports', label: 'Weekly Reports', desc: 'Weekly productivity summaries' },
                      ].map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                          <div>
                            <h3 className="font-medium text-gray-900">{item.label}</h3>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                          </div>
                          <button
                            onClick={() => setSettings({ 
                              ...settings, 
                              [item.id]: !settings[item.id as keyof typeof settings] 
                            })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings[item.id as keyof typeof settings] ? 'bg-indigo-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings[item.id as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="font-medium text-gray-900 mb-4">Notification Schedule</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Start Time
                          </label>
                          <input
                            type="time"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            defaultValue="09:00"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            End Time
                          </label>
                          <input
                            type="time"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            defaultValue="18:00"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Quiet Days
                          </label>
                          <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all">
                            <option>Weekends</option>
                            <option>None</option>
                            <option>Custom</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <div className="p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Privacy & Security</h2>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      {[
                        { id: 'dataSharing', label: 'Data Sharing', desc: 'Share anonymous usage data to improve the product' },
                        { id: 'analytics', label: 'Analytics', desc: 'Track my usage for personal insights' },
                      ].map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                          <div>
                            <h3 className="font-medium text-gray-900">{item.label}</h3>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                          </div>
                          <button
                            onClick={() => setSettings({ 
                              ...settings, 
                              [item.id]: !settings[item.id as keyof typeof settings] 
                            })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings[item.id as keyof typeof settings] ? 'bg-indigo-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings[item.id as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Auto-delete Completed Tasks
                      </label>
                      <select
                        value={settings.autoDelete}
                        onChange={(e) => setSettings({ ...settings, autoDelete: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      >
                        <option value="7">After 7 days</option>
                        <option value="30">After 30 days</option>
                        <option value="90">After 90 days</option>
                        <option value="never">Never</option>
                      </select>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="font-medium text-gray-900 mb-4">Data Management</h3>
                      <div className="space-y-3">
                        <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                          <div>
                            <h4 className="font-medium text-gray-900">Export Data</h4>
                            <p className="text-sm text-gray-500">Download all your tasks and settings</p>
                          </div>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </button>
                        <button className="w-full flex items-center justify-between p-4 border border-red-200 rounded-xl hover:bg-red-50 transition-colors">
                          <div>
                            <h4 className="font-medium text-red-700">Clear All Data</h4>
                            <p className="text-sm text-red-500">Permanently delete all your tasks</p>
                          </div>
                          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}