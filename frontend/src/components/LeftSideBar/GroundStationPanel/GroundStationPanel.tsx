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
interface GroundStationPanelProps {
  viewerRef: RefObject<Viewer | null>;
  onGroundStationChange?: (location: { lat: number; lon: number; name: string } | null) => void;
  visibleFromGroundStation?: number;
  groundStationActive: boolean;
  setGroundStationActive: (active: boolean) => void;
  userLocation: { lat: number; lon: number; name: string } | null;
  setUserLocation: (loc: { lat: number; lon: number; name: string } | null) => void;
}

export function GroundStationPanel({
  viewerRef,
  onGroundStationChange,
  groundStationActive,
  setGroundStationActive,
  userLocation,
  setUserLocation,
}: GroundStationPanelProps)
 {

  const [locationQuery, setLocationQuery] = useState("");


  const fallbackLocation = () => {
    const fallback = { lat: 49.8728, lon: 8.6512, name: "Darmstadt" };
    setUserLocation(fallback);
    setGroundStationActive(true);

    onGroundStationChange?.(fallback);
    if (viewerRef.current) {
      geocodeAndFlyTo(viewerRef.current, fallback.name, 10);
    }
    toast("📍 Fallback to Darmstadt");
  };

  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            name: "Darmstadt", // Default dummy name, can be updated later
          };
          setUserLocation(loc);
          setGroundStationActive(true);
          onGroundStationChange?.(loc);
          if (viewerRef.current) {
            geocodeAndFlyTo(viewerRef.current,loc.name,10);
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

  const setLocationFromQuery = async () => {
    const trimmed = locationQuery.trim();
    const cleaned = trimmed.replace(/^["']|["']$/g, ""); // Remove quotes

    if (!cleaned) return;

    try {
      console.log("📡 [Manual Location] Attempting geocode:", cleaned);
      
      let success = false;
      if (viewerRef.current) {
        success = await geocodeAndFlyTo(viewerRef.current, cleaned, 10);
      }

      if (success) {
        const coords = await getCoordinatesByName(viewerRef.current!, cleaned);
        const location = coords
          ? { lat: coords.lat, lon: coords.lon, name: cleaned }
          : { lat: 0, lon: 0, name: cleaned }; // fallback if coords not found
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


  const containerClass = cn(
    "rounded-xl p-4 border backdrop-blur-sm text-white space-y-4 transition",
    groundStationActive ? "bg-green-500/10 border-green-400" : "bg-white/10 border-white/20"
  );

  return (
    <div className={containerClass}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <FaMapMarkerAlt className="text-green-400" />
          <span>Ground Station</span>
        </div>
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
