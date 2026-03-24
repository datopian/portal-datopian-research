"use client";

import { useEffect, useMemo, useState } from "react";
import {
  GeoJSON,
  MapContainer,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatTooltipContent(properties) {
  if (!properties) return null;

  const rows = Object.entries(properties).filter(([, value]) => {
    return value !== null && value !== undefined && `${value}`.trim() !== "";
  });

  if (!rows.length) return null;

  return rows
    .map(([key, value]) => {
      return `<div><strong>${escapeHtml(key)}</strong>: ${escapeHtml(
        String(value)
      )}</div>`;
    })
    .join("");
}

function FitToGeoJson({ data }) {
  const map = useMap();

  useEffect(() => {
    const bounds = L.geoJSON(data).getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [24, 24] });
    }
  }, [data, map]);

  return null;
}

export default function GeoJsonMap({ dataUrl, title }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadGeoJson() {
      try {
        setError(null);
        const response = await fetch(dataUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const json = await response.json();
        if (!cancelled) {
          setData(json);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load map");
        }
      }
    }

    loadGeoJson();

    return () => {
      cancelled = true;
    };
  }, [dataUrl]);

  const geoJsonOptions = useMemo(() => {
    return {
      onEachFeature(feature, layer) {
        const tooltipContent = formatTooltipContent(feature.properties);
        if (tooltipContent && layer.bindTooltip) {
          layer.bindTooltip(tooltipContent, {
            sticky: true,
            direction: "top",
          });
        }
      },
      pointToLayer(_feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 6,
          weight: 2,
          color: "#0f766e",
          fillColor: "#14b8a6",
          fillOpacity: 0.85,
        });
      },
      style() {
        return {
          color: "#0f766e",
          weight: 2,
          fillColor: "#14b8a6",
          fillOpacity: 0.2,
        };
      },
    };
  }, []);

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Failed to load GeoJSON preview: {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-600">
        Loading map preview...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-stone-200">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        scrollWheelZoom={false}
        style={{ height: 600, width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON data={data} {...geoJsonOptions} />
        <FitToGeoJson data={data} />
      </MapContainer>
      {title && (
        <div className="border-t border-stone-200 bg-white px-4 py-2 text-sm text-stone-600">
          {title}
        </div>
      )}
    </div>
  );
}
