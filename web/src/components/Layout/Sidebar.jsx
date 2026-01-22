// ==================== web/src/components/Layout/Sidebar.jsx ====================
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  ClipboardList, 
  BarChart3 
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { cn } from '../../utils/helpers';

const Sidebar = () => {
  const { user } = useAuthStore();
  const isManager = user?.role === 'manager';

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['manager', 'karyawan'],
    },
    {
      name: 'Devisi',
      path: '/devisi',
      icon: Building2,
      roles: ['manager'],
    },
    {
      name: 'KPI',
      path: '/kpi',
      icon: ClipboardList,
      roles: ['manager', 'karyawan'],
    },
    {
      name: 'Users',
      path: '/users',
      icon: Users,
      roles: ['manager'],
    },
    {
      name: 'Reports',
      path: '/reports',
      icon: BarChart3,
      roles: ['manager'],
    },
  ];

  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">S45</span>
          </div>
          <div>
            <p className="font-bold text-gray-900">Soerbaja 45</p>
            <p className="text-xs text-gray-500">KPI System</p>
          </div>
        </div>

        <nav className="space-y-2">
          {filteredMenu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User Info at bottom */}
      <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500">
          <p>Logged in as:</p>
          <p className="font-semibold text-gray-900 truncate">{user?.email}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
