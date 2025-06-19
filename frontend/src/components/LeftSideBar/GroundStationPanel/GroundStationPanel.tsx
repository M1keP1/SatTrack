import { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface GroundStationPanelProps {
  onGroundStationChange?: (location: { lat: number; lon: number; name: string } | null) => void;
  visibleFromGroundStation?: number;
}

export function GroundStationPanel({ onGroundStationChange }: GroundStationPanelProps) {
  const [groundStationActive, setGroundStationActive] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number; name: string } | null>(null);
  const [locationQuery, setLocationQuery] = useState("");

  const predefinedLocations: Record<string, { lat: number; lon: number }> = {
    darmstadt: { lat: 49.8728, lon: 8.6512 },
    frankfurt: { lat: 50.1109, lon: 8.6821 },
    hamburg: { lat: 53.5488, lon: 9.9872 },
    berlin: { lat: 52.5200, lon: 13.4050 },
    munich: { lat: 48.1351, lon: 11.5820 },
    london: { lat: 51.5074, lon: -0.1278 },
    paris: { lat: 48.8566, lon: 2.3522 },
    tokyo: { lat: 35.6762, lon: 139.6503 },
  };

  const fallbackLocation = () => {
    const fallback = { lat: 49.8728, lon: 8.6512, name: "Darmstadt (Default)" };
    setUserLocation(fallback);
    setGroundStationActive(true);
    onGroundStationChange?.(fallback);
    toast("📍 Fallback to Darmstadt");
  };

  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lon: pos.coords.longitude, name: "Current Location" };
          setUserLocation(loc);
          setGroundStationActive(true);
          onGroundStationChange?.(loc);
          toast.success("📍 Using current location");
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

  const setLocationFromQuery = () => {
    const cityKey = locationQuery.trim().toLowerCase();
    const coords = predefinedLocations[cityKey];
    if (coords) {
      const location = { ...coords, name: locationQuery.trim() };
      setUserLocation(location);
      setGroundStationActive(true);
      onGroundStationChange?.(location);
      toast.success(`📍 Location set to ${location.name}`);
    } else {
      toast.error(`❌ "${locationQuery}" not found`);
    }
  };

  const containerClass = cn(
    "rounded-xl p-4 border backdrop-blur-sm text-white space-y-4 transition",
    groundStationActive ? "bg-green-500/10 border-green-400" : "bg-white/10 border-white/20"
  );

  return (
    <div className={containerClass}>
      {/* Header */}
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
            groundStationActive && "!bg-green-500/20 !text-green-400 !border-green-400"
          )}
          onClick={handleSetLocationClick}
        >
          {groundStationActive ? "Disable" : "Enable"}
        </Button>
      </div>

      {/* Search Field (always visible) */}
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

      {/* Info */}
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
