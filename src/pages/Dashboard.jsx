import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  CalendarIcon,
  InboxIcon,
  HomeIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function Dashboard() {
  const { user, logout, authLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/dashboard');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '#', icon: HomeIcon, current: activeTab === 'dashboard' },
    { name: 'Events', href: '#', icon: CalendarIcon, current: activeTab === 'events' },
    { name: 'Emails', href: '#', icon: InboxIcon, current: activeTab === 'emails' },
    { name: 'Settings', href: '#', icon: Cog6ToothIcon, current: activeTab === 'settings' },
  ];

  const handleLogout = async () => {
    await logout();
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <header className="mb-8">
              <h2 className="text-3xl font-bold">Welcome Back, {user?.name} 👋</h2>
              <p className="text-gray-400">Here's your summary for today</p>
            </header>

            {/* Stats Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Events Created"
                value={dashboardData?.events_created || 0}
                icon={<CalendarIcon className="h-8 w-8 text-white" />}
                bg="from-purple-600 to-indigo-600"
              />
              <StatCard
                title="Upcoming Events"
                value={dashboardData?.upcoming_events || 0}
                icon={<InboxIcon className="h-8 w-8 text-white" />}
                bg="from-pink-500 to-red-500"
              />
              <StatCard
                title="Past Events"
                value={dashboardData?.past_events || 0}
                icon={<ChartBarIcon className="h-8 w-8 text-white" />}
                bg="from-green-500 to-emerald-600"
              />
            </section>

            {/* Upcoming Events */}
            <div className="bg-gray-800 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
              {dashboardData?.upcoming_events > 0 ? (
                <div className="space-y-4">
                  {dashboardData.upcoming_events_items.map((event, index) => (
                    <div key={index} className="p-4 bg-gray-700 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-medium">{event.events_created}</h4>
                          <p className="text-gray-300">{event.location}</p>
                          <p className="text-gray-300">{event.date} at {event.time}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">Organizer</p>
                          <p className="text-gray-300">{event.email_received}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No upcoming events</p>
              )}
            </div>

            {/* Today's Events */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Today's Events</h3>
              {dashboardData?.today_events && dashboardData.today_events.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.today_events.map((event, index) => (
                    <div key={index} className="p-4 bg-gray-700 rounded-lg">
                      <h4 className="text-lg font-medium">{event.name}</h4>
                      <p className="text-gray-300">{event.location}</p>
                      <p className="text-gray-300">{event.time}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No events scheduled for today</p>
              )}
            </div>
          </div>
        );

      case 'events':
        return (
          <div>
            <header className="mb-8">
              <h2 className="text-3xl font-bold">Events Management</h2>
              <p className="text-gray-400">Manage your events and schedules</p>
            </header>
            <div className="bg-gray-800 rounded-xl p-6">
              <p className="text-gray-300">Events content goes here...</p>
            </div>
          </div>
        );

      case 'emails':
        return (
          <div>
            <header className="mb-8">
              <h2 className="text-3xl font-bold">Email Campaigns</h2>
              <p className="text-gray-400">Manage your email marketing</p>
            </header>
            <div className="bg-gray-800 rounded-xl p-6">
              <p className="text-gray-300">Emails content goes here...</p>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div>
            <header className="mb-8">
              <h2 className="text-3xl font-bold">Settings</h2>
              <p className="text-gray-400">Configure your account preferences</p>
            </header>
            <div className="bg-gray-800 rounded-xl p-6">
              <p className="text-gray-300">Settings content goes here...</p>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <header className="mb-8">
              <h2 className="text-3xl font-bold">Welcome Back 👋</h2>
              <p className="text-gray-400">Select a section from the sidebar</p>
            </header>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-tr from-black via-gray-900 to-black text-white">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static w-64 bg-gray-950 p-6 border-r border-gray-800 h-screen z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-800 rounded"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-3 mb-8 p-4 bg-gray-900 rounded-lg">
          <img
            src={user?.avatar || '/default-avatar.png'}
            alt={user?.name}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 mb-8">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                setActiveTab(item.name.toLowerCase());
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${item.current
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={authLoading}
          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {authLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
          )}
          <span>{authLoading ? 'Logging out...' : 'Logout'}</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-10 overflow-auto">
        {/* Mobile header */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-800 rounded"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-3">
            <img
              src={user?.avatar || '/default-avatar.png'}
              alt={user?.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm font-medium">{user?.name}</span>
          </div>
        </div>

        {renderContent()}
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, bg }) {
  return (
    <div
      className={`bg-gradient-to-tr ${bg} p-6 rounded-xl shadow-md flex items-center justify-between hover:scale-105 transition-transform duration-200`}
    >
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-3xl font-bold mt-1 text-white">{value}</p>
      </div>
      <div className="bg-black/20 p-3 rounded-full">
        {icon}
      </div>
    </div>
  );
}