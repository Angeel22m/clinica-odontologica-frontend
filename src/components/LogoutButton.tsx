// components/LogoutButton.tsx
import React from 'react';
import { LogOut } from 'lucide-react';

interface LogoutButtonProps {
  onLogout: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  return (
    <button
      onClick={onLogout}
      className="absolute top-4 right-4 px-3 py-2 flex items-center gap-1 bg-accent text-light font-semibold rounded-lg shadow hover:bg-primary hover:text-light transition-colors"
    >
      <LogOut className="w-5 h-5" />
      Logout
    </button>
  );
};

export default LogoutButton;
