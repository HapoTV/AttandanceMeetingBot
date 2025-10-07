import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  CalendarDaysIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
  BellAlertIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const links = [
    { name: "Dashboard", path: "/dashboard", icon: HomeIcon },
    { name: "Meetings", path: "/meetings", icon: CalendarDaysIcon },
    { name: "Recordings", path: "/recordings", icon: VideoCameraIcon },
    { name: "Notifications", path: "/notifications", icon: ChatBubbleLeftRightIcon },
    { name: "Calendar", path: "/calendar", icon: CalendarDaysIcon },
    { name: "Agenda", path: "/agenda", icon: ClipboardDocumentListIcon },
    { name: "Reminders", path: "/reminders", icon: BellAlertIcon },
    { name: "Participants", path: "/participants", icon: UsersIcon },
  ];

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col p-4">
      {/* Logo / Brand */}
      <h1 className="text-2xl font-bold mb-8 text-indigo-600">
        AttendanceBot
      </h1>

      {/* Navigation Links */}
      <nav className="space-y-2 flex-1">
        {links.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-xl transition ${
                isActive
                  ? "bg-indigo-100 text-indigo-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{name}</span>
          </NavLink>
        ))}

        {/* Logout */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-xl mt-4 transition ${
              isActive
                ? "bg-green-100 text-green-600 font-semibold"
                : "text-green-600 hover:bg-green-50 hover:text-green-700"
            }`
          }
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          <span>Logout</span>
        </NavLink>
      </nav>

      {/* Footer / Version Info */}
      <div className="mt-auto pt-6 text-xs text-gray-400 text-center">
        © {new Date().getFullYear()} AttendanceBot
      </div>
    </aside>
  );
};

export default Sidebar;
