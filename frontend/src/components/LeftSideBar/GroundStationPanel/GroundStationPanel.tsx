/**
 * This file is part of the SatTrack project, submitted for academic purposes only.
 * It is intended solely for evaluation in an educational context.
 */

import { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { RefObject } from "react";
import type { Viewer } from "cesium";
import { geocodeAndFlyTo } from "@/services/geocodeAndFlyTo";
import { getCoordinatesByName } from "@/services/getCoordinatesByName";

// ==========================
// 📦 Props
// ==========================

interface GroundStationPanelProps {
  viewerRef: RefObject<Viewer | null>;
  onGroundStationChange?: (location: { lat: number; lon: number; name: string } | null) => void;
  visibleFromGroundStation?: number;
  groundStationActive: boolean;
  setGroundStationActive: (active: boolean) => void;
  userLocation: { lat: number; lon: number; name: string } | null;
  setUserLocation: (loc: { lat: number; lon: number; name: string } | null) => void;
}

// ==========================
// 🧩 Component
// ==========================

/**
 * GroundStationPanel allows users to enable/disable a virtual ground station and
 * set its location manually or via geolocation.
 */
export function GroundStationPanel({
  viewerRef,
  onGroundStationChange,
  groundStationActive,
  setGroundStationActive,
  userLocation,
  setUserLocation,
}: GroundStationPanelProps) {
  const [locationQuery, setLocationQuery] = useState("");

  // ==========================
  // 📍 Fallback Location
  // ==========================

  const fallbackLocation = () => {
    const fallback = { lat: 49.8728, lon: 8.6512, name: "Darmstadt" };
    setUserLocation(fallback);
    setGroundStationActive(true);
    onGroundStationChange?.(fallback);
    if (viewerRef.current) {
      //geocodeAndFlyTo(viewerRef.current, fallback.name, 10);
    }
    toast("📍 Fallback to Darmstadt");
  };

  // ==========================
  // 📡 Get User Location
  // ==========================

  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            name: "Darmstadt", // Placeholder
          };
          setUserLocation(loc);
          setGroundStationActive(true);
          onGroundStationChange?.(loc);
          if (viewerRef.current) {
            //geocodeAndFlyTo(viewerRef.current, loc.name, 10);
          }
          console.log("📍 [User Location] Called geocodeAndFlyTo with:", loc.name);
          toast.success(`📡 Ground station set to ${loc.name}`);
        },
        fallbackLocation
      );
    } else {
      fallbackLocation();
    }
  };

  // ==========================
  // 🖱️ Enable/Disable Toggle
  // ==========================

  const handleSetLocationClick = () => {
    if (groundStationActive) {
      setGroundStationActive(false);
      setUserLocation(null);
      onGroundStationChange?.(null);
      toast("📡 Ground station disabled");
    } else {
      getUserLocation();
    }
  };

  // ==========================
  // 🔍 Manual Location Search
  // ==========================

  const setLocationFromQuery = async () => {
    const trimmed = locationQuery.trim();
    const cleaned = trimmed.replace(/^["']|["']$/g, ""); // Remove extra quotes

    if (!cleaned) return;

    try {
      console.log("📡 [Manual Location] Attempting geocode:", cleaned);
      let success = false;
      if (viewerRef.current) {
        success = await geocodeAndFlyTo(viewerRef.current, cleaned, 5);
      }

      if (success) {
        const coords = await getCoordinatesByName(viewerRef.current!, cleaned);
        const location = coords
          ? { lat: coords.lat, lon: coords.lon, name: cleaned }
          : { lat: 0, lon: 0, name: cleaned }; // fallback

        setUserLocation(location);
        setGroundStationActive(true);
        onGroundStationChange?.(location);
        toast.success(`📡 Ground station set to ${location.name}`);
      } else {
        toast.error(`❌ "${cleaned}" not found`);
      }
    } catch (err) {
      console.error("❌ Geocode error:", err);
      toast.error("❌ Could not set location");
    }
  };

  // ==========================
  // 🧱 Render UI
  // ==========================

  const containerClass = cn(
    "rounded-xl p-4 border backdrop-blur-sm text-white space-y-4 transition",
    groundStationActive ? "bg-green-500/10 border-green-400" : "bg-white/10 border-white/20"
  );

  return (
    <div className={containerClass}>
      {/* 🗺️ Header */}
      <div className="flex items-center justify-between">
        <div className="relative group flex items-center gap-2 font-semibold text-sm cursor-default">
          <FaMapMarkerAlt className="text-green-400" />
          <span>Ground Station</span>

          {/* Tooltip */}
          <div className="absolute left-0 top-full mt-1 z-50 hidden group-hover:block bg-black/90 text-white text-xs p-2 rounded-md shadow-lg border border-white/20 w-64">
            🛰️ Coming soon: Coverage rings and pass prediction tables!
          </div>
        </div>

        {/* Enable/Disable Button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-7 w-16 px-0 !text-xs !bg-teal-500/20 !text-teal-300 !hover:bg-teal-500/40 border border-teal-400/40",
            !groundStationActive && "animate-pulse",
            groundStationActive && "!bg-green-500/20 !text-green-400 !border-green-400"
          )}
          onClick={handleSetLocationClick}
        >
          {groundStationActive ? "Disable" : "Enable"}
        </Button>
      </div>

      {/* 🔍 Manual Location Input */}
      <div className="space-y-2 text-sm">
        <div className="text-white/60 text-xs">Search Location:</div>
        <div className="flex gap-2">
          <Input
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setLocationFromQuery()}
            placeholder="e.g. Darmstadt, Berlin, Tokyo..."
            className="text-xs border-white/20 bg-white/10 text-white placeholder:text-white/50 h-8"
            disabled={!groundStationActive}
          />
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-3 text-xs !text-green-400 !border-green-400/60 !bg-green-500/10 !hover:bg-green-500/30 font-bold"
            onClick={setLocationFromQuery}
            disabled={!groundStationActive}
          >
            Set
          </Button>
        </div>
      </div>

      {/* 📍 Active Location Info */}
      {groundStationActive && userLocation && (
        <div className="space-y-2 text-xs text-white/70">
          <div className="flex justify-between">
            <span className="text-white/60">Location:</span>
            <span>{userLocation.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Coordinates:</span>
            <span>
              {userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
