import { useState } from "react";
import SearchBar from "./SearchBar";
import "./LeftSideBar.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaSatellite } from "react-icons/fa";
import CollectionsPanel from "./Collections/CollectionsPanel";

type SidebarProps = {
  onSearch: (query: string) => void;
  satelliteNames: string[];
};


export default function Sidebar({ onSearch, satelliteNames }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`sidebar-container ${collapsed ? "collapsed" : ""}`}>
      {!collapsed ? (
        <div className="sidebar-content">
          <div className="sidebar-header">
            <FaSatellite size={20} />
            <span className="logo-text">SatTrack</span>
            <button className="collapse-btn" onClick={() => setCollapsed(true)}>
              <FiChevronLeft size={18} />
            </button>
          </div>
          <div className="sidebar-body">
            <SearchBar 
            onSearch={onSearch} 
            suggestions={satelliteNames}
            />
            <CollectionsPanel />

          </div>
        </div>
      ) : (
        <button className="expand-btn" onClick={() => setCollapsed(false)}>
          <FiChevronRight size={20} />
        </button>
      )}
    </div>
  );
}
