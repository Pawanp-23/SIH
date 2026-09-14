import React, { useState, useRef } from 'react';
import {
  X,
  Download,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Shield,
  Layers,
  Cpu,
  Server,
  Smartphone,
  Globe,
  Database,
  Lock,
  Activity,
  CheckCircle2,
  ArrowRight,
  Info,
  FileCode,
  Share2,
  ExternalLink
} from 'lucide-react';

interface SihArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ComponentDetail = {
  id: string;
  name: string;
  layer: string;
  technology: string;
  files: string[];
  purpose: string;
  protocols: string;
  security: string;
  inputs: string;
  outputs: string;
};

const COMPONENT_DETAILS: Record<string, ComponentDetail> = {
  client_layer: {
    id: 'client_layer',
    name: 'Client Layer (Personnel PWA & Mobile)',
    layer: 'Frontend Presentation Layer',
    technology: 'React 18, TypeScript, Tailwind CSS, Lucide, Web Audio API',
    files: ['src/components/personnel/PersonnelDashboard.tsx', 'src/components/personnel/MentalHealthChatbot.tsx', 'src/components/common/TacticalResetModal.tsx'],
    purpose: 'Provides confidential, daily wellness check-ins, sleep tracking, 1-min tactical resets, and voice-assisted AI counseling for armed forces personnel.',
    protocols: 'HTTPS / REST (port 3000), WSS (encrypted check-in emit)',
    security: 'Section 14 Medical Secrecy, local client-side hashing, camera privacy avatars',
    inputs: 'Daily sleep hours, duty cycle duration, fatigue rating (1-5), perceived stress score',
    outputs: 'Encrypted JSON payload containing daily check-in attributes & biometric indicators'
  },
  sensor_api: {
    id: 'sensor_api',
    name: 'HTML5 Sensor & Biometrics API',
    layer: 'Client Device API Integration',
    technology: 'HTML5 Geolocation (Outpost radius), Web Audio API, IndexedDB Offline Cache',
    files: ['src/components/personnel/PersonnelDashboard.tsx', 'src/api/client.ts'],
    purpose: 'Captures vital self-reported inputs and manages offline synchronization when troops operate in remote or low-connectivity mountain detachments.',
    protocols: 'HTML5 Navigator & Web Storage APIs',
    security: 'Zero persistent geolocation coordinates stored; Outpost IDs masked',
    inputs: 'Sensor readings, vocal audio buffer for tone cadence',
    outputs: 'Biometric telemetry stream and offline queue records'
  },
  personnel_ui: {
    id: 'personnel_ui',
    name: 'Personnel Welfare UI Suite',
    layer: 'Client User Experience',
    technology: 'React 18 Functional Components, Motion/Lucide Icons, Recharts',
    files: ['src/components/personnel/PersonnelDashboard.tsx', 'src/components/personnel/CommunityStoryWall.tsx'],
    purpose: 'Presents personalized recovery dashboards, 7-day strain progression, confidential peer stories, and immediate access to tactical breathing.',
    protocols: 'Internal React Component Tree',
    security: 'Scoped strictly to individual user session; cannot query other service members',
    inputs: 'User check-in form interactions, breathing exercise loop',
    outputs: 'Visual trend charts, non-punitive rest suggestions'
  },
  socket_emitter: {
    id: 'socket_emitter',
    name: 'Socket.IO / WSS Client Emitter',
    layer: 'Real-time Transport Emitter',
    technology: 'WebSocket / Socket.IO Client Protocol',
    files: ['src/api/client.ts'],
    purpose: 'Emits encrypted check-in events instantly to backend for immediate TreeSHAP analysis, and listens for clinical check-in confirmations.',
    protocols: 'WSS (WebSocket Secure) over port 3000',
    security: 'Payload signed with session token & Section 14 credential hash',
    inputs: 'Serialized check-in JSON object',
    outputs: 'WebSocket frame `emit: encryptedCheckIn`'
  },
  backend_server: {
    id: 'backend_server',
    name: 'Backend Server & API Gateway',
    layer: 'Core Application & Service Layer',
    technology: 'Node.js, Express.js (v4/v5), TypeScript (Port 3000)',
    files: ['server.ts', 'src/api/client.ts'],
    purpose: 'Ingests check-ins, runs explainable ML calculations, manages RBAC session authorization, and orchestrates real-time dispatch to welfare officers.',
    protocols: 'HTTP/HTTPS REST API, WebSocket Engine (port 3000)',
    security: 'CORS policy, Bearer Token Validation, Rate Limiter',
    inputs: 'REST API requests from Client Layer, WebSocket connections',
    outputs: 'Computed strain index, TreeSHAP waterfall, JSON responses'
  },
  business_logic: {
    id: 'business_logic',
    name: 'Business Logic & State Engine',
    layer: 'Analytics & Decision Engine',
    technology: 'Node.js Micro-Calculations, Circadian Strain Model, TreeSHAP Attribution',
    files: ['server.ts', 'src/types.ts'],
    purpose: 'Calculates the 0-100 Cumulative Strain Index using additive Shapley values to guarantee zero black-box obscurity for medical officers.',
    protocols: 'Synchronous internal pipeline',
    security: 'Deterministic additive verification; auditable by medical directors',
    inputs: 'Sleep deficit, night duty streaks, ambient temperature, elevation load',
    outputs: 'Net Strain Score + exact mathematical point deviations per factor'
  },
  privacy_vault: {
    id: 'privacy_vault',
    name: 'Section 14 Privacy & In-Memory Store',
    layer: 'Data Vault & Cryptographic Ledger',
    technology: 'SHA-256 Merkle Chain, Cryptographic k-Anonymity Filter, In-Memory Store',
    files: ['server.ts', 'src/types.ts'],
    purpose: 'Maintains active personnel records and automatically suppresses cohort health statistics for outposts with fewer than 10 members.',
    protocols: 'In-Memory / SQLite / Structured State',
    security: 'Section 14 Medical Secrecy certified, k >= 10 Privacy Floor',
    inputs: 'Raw check-in entries and battalion cohort queries',
    outputs: 'k-anonymized brigade statistics, immutable audit hash chain'
  },
  networking_gateway: {
    id: 'networking_gateway',
    name: 'Networking & Gateway Layer',
    layer: 'Edge Ingress & Reverse Proxy',
    technology: 'Nginx Reverse Proxy, Vite Dev Server / Bundler, Port 3000 Ingress',
    files: ['vite.config.ts', 'server.ts'],
    purpose: 'Manages ingress routing, SSL/TLS termination, and proxies WebSocket connections seamlessly across desktop and mobile devices.',
    protocols: 'TCP/IP, HTTPS, WSS, Reverse Proxy mapping',
    security: 'Hardcoded Port 3000 reverse proxy routing, TLS 1.3',
    inputs: 'External client requests from WAN / 4G / Tactical Intranet',
    outputs: 'Routed HTTP and WebSocket streams to internal Express handlers'
  },
  outpost_tiles: {
    id: 'outpost_tiles',
    name: 'GIS Outposts & WHO Benchmark CDN',
    layer: 'External GIS & Standards Cache',
    technology: 'OpenStreetMap Tile CDN, Leaflet.js, WHO GDHM Benchmark Standards',
    files: ['src/components/command/CommanderPortal.tsx'],
    purpose: 'Supplies offline-capable map tiles for battalion tactical deployments and provides WHO Global Digital Health benchmark indices.',
    protocols: 'HTTPS CDN Fetch, Cached Tile Cache',
    security: 'Sanitized coordinate grid; strategic installations masked',
    inputs: 'Leaflet viewport bounding boxes and zoom levels',
    outputs: 'Rendered raster tiles with battalion readiness overlays'
  },
  echelon_portals: {
    id: 'echelon_portals',
    name: '4-Echelon Stakeholder Portals',
    layer: 'RBAC Authorization & Portal Views',
    technology: 'React 18 Role-Based Access Control, SessionStorage Guards',
    files: ['src/components/auth/LoginPortal.tsx', 'src/components/welfare/WelfareOfficerPortal.tsx', 'src/components/command/CommanderPortal.tsx', 'src/components/admin/AdminMlPortal.tsx'],
    purpose: 'Provides strictly segregated portals: Tier 1 Personnel, Tier 2 Medical Welfare, Tier 3 Commanding Officer, Tier 4 Systems Admin.',
    protocols: 'Client-Side Session Token Verification',
    security: 'Strict RBAC; Higher tiers cannot override Section 14 clinical privacy',
    inputs: 'Authenticated Echelon Credentials (PIN / Section 14 Token)',
    outputs: 'Customized views: Clinical Triage, Readiness Matrix, Model Telemetry'
  }
};

export const SihArchitectureModal: React.FC<SihArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<ComponentDetail>(COMPONENT_DETAILS.client_layer);
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'flow' | 'spec'>('visual');
  const svgRef = useRef<SVGSVGElement>(null);

  if (!isOpen) return null;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.15, 1.8));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.15, 0.7));
  const handleResetZoom = () => setZoomLevel(1);

  const handleDownloadSvg = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = 'SAHARA_SIH_System_Architecture_Diagram.svg';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  const handleDownloadPng = () => {
    if (!svgRef.current) return;
    const svgElement = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    canvas.width = 2400;
    canvas.height = 1600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.fillStyle = '#e9e4d8';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'SAHARA_SIH_System_Architecture_HighRes.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
    img.src = url;
  };

  const handleCopyMermaid = () => {
    const mermaidCode = `graph TD
  subgraph Client_Layer["CLIENT LAYER (Frontend - React.js + Vite)"]
    SENS["HTML5 Sensor & Biometric API\\n(Daily Sleep, Fatigue & Vitals)"]
    UI["Personnel Welfare UI\\n(PersonnelDashboard.tsx)"]
    SOCK_C["Socket.IO Client Emitter\\n(WSS Encrypted Dispatch)"]
    SENS --> UI
    UI --> SOCK_C
  end

  subgraph Backend_Server["BACKEND SERVER (Node.js + Express.js - Port 3000)"]
    HTTP["Express.js HTTP Server\\n(CORS, Static SPA, REST APIs)"]
    SOCK_S["Socket.IO Server Engine\\n(Broadcast: clinicalWelfareAlert)"]
    
    subgraph Business_Engine["BUSINESS LOGIC & STATE ENGINE"]
      SHAP["Explainable AI Model\\n(TreeSHAP Factor Waterfall)"]
      SEC14["Section 14 Privacy Vault\\n(SHA-256 Audit Chain)"]
      MEM["In-Memory State Store\\n(Active Personnel & Welfare Cases)"]
      SHAP --> MEM
      SEC14 --> MEM
    end
    HTTP --> SHAP
    SOCK_S --> Business_Engine
  end

  subgraph Networking_Gateway["NETWORKING & GATEWAY LAYER"]
    PROXY["Nginx Reverse Proxy / Port 3000\\n(WAN / SSL / Ingress Routing)"]
    VITE["Vite Dev Server / Proxy\\n(HTTPS / SSL / Port 3000)"]
    MAP["OpenStreetMap / GIS Tiles\\n(Battalion Outposts & Leaflet)"]
    PROXY --> VITE
    VITE --> MAP
  end

  subgraph Echelons["ECHELON STAKEHOLDER PORTALS (Desktop / Mobile)"]
    GUARD["Echelon Auth Guard\\n(SessionStorage / Token)"]
    PORTAL_P["01 Personnel Portal\\n(Daily Check-in & Self Care)"]
    PORTAL_W["02 Medical Welfare Portal\\n(Clinical Triage & Rest Orders)"]
    PORTAL_C["03 Commander Portal\\n(Readiness Matrix & k>=10 Heatmap)"]
    PORTAL_A["04 Admin / ML Console\\n(Model Drift PSI & Audit Logs)"]
    GUARD --> PORTAL_P
    GUARD --> PORTAL_W
    GUARD --> PORTAL_C
    GUARD --> PORTAL_A
  end

  SOCK_C -- "emit: encryptedCheckIn" --> HTTP
  HTTP -- "REST / API" --> PROXY
  SOCK_S -- "WSS / Broadcast" --> Echelons
  MAP -- "Fetch Map Tiles" --> PORTAL_C`;

    navigator.clipboard.writeText(mermaidCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in ${
        isFullscreen ? 'p-0' : ''
      }`}
    >
      <div
        className={`bg-[#e9e4d8] border border-[#D2CBBB] rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all text-[#1E1E1E] ${
          isFullscreen ? 'w-full h-full rounded-none' : 'max-w-7xl w-full h-[92vh]'
        }`}
      >
        {/* Modal Topbar */}
        <div className="px-5 py-4 bg-[#E3DDCF] border-b border-[#D2CBBB] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1d9f76]/20 border border-[#1d9f76]/30 flex items-center justify-center text-[#0f7058] shadow-xs">
              <Layers className="w-5 h-5 text-[#0f7058]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold font-serif text-[#1E1E1E] tracking-tight">
                  SAHARA — System Architecture &amp; Data Flow Diagram
                </h2>
                <span className="text-[10px] font-mono font-bold bg-[#1d9f76]/15 text-[#0f7058] px-2.5 py-0.5 rounded-full border border-[#1d9f76]/30">
                  SIH DEFENSE HEALTH SPECIFICATION
                </span>
              </div>
              <p className="text-xs text-[#5E5A52]">
                Neat structural diagram matching Smart India Hackathon system engineering and data flow requirements
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center space-x-2">
            {/* View Switcher Tabs */}
            <div className="flex items-center bg-[#F4EFE4] p-1 rounded-xl border border-[#D2CBBB] text-xs font-semibold">
              <button
                onClick={() => setActiveTab('visual')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'visual'
                    ? 'bg-[#1d9f76] text-white shadow-xs'
                    : 'text-[#5E5A52] hover:text-[#1E1E1E]'
                }`}
              >
                Diagram View
              </button>
              <button
                onClick={() => setActiveTab('flow')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'flow'
                    ? 'bg-[#1d9f76] text-white shadow-xs'
                    : 'text-[#5E5A52] hover:text-[#1E1E1E]'
                }`}
              >
                Flow Pipeline
              </button>
              <button
                onClick={() => setActiveTab('spec')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'spec'
                    ? 'bg-[#1d9f76] text-white shadow-xs'
                    : 'text-[#5E5A52] hover:text-[#1E1E1E]'
                }`}
              >
                SIH Technical Spec
              </button>
            </div>

            {/* Zoom Controls */}
            {activeTab === 'visual' && (
              <div className="hidden sm:flex items-center bg-[#F4EFE4] px-2 py-1 rounded-xl border border-[#D2CBBB] space-x-1">
                <button
                  onClick={handleZoomOut}
                  className="p-1 rounded hover:bg-[#D2CBBB] text-[#5E5A52] hover:text-[#1E1E1E] transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono text-[#1E1E1E] px-1 font-bold">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="p-1 rounded hover:bg-[#D2CBBB] text-[#5E5A52] hover:text-[#1E1E1E] transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={handleResetZoom}
                  className="p-1 rounded hover:bg-[#D2CBBB] text-[#5E5A52] hover:text-[#1E1E1E] transition-colors"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Export Buttons */}
            <button
              onClick={handleDownloadSvg}
              className="hidden md:flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-[#F4EFE4] hover:bg-[#D2CBBB] text-[#1E1E1E] border border-[#D2CBBB] text-xs font-semibold transition-colors cursor-pointer"
              title="Download Vector SVG for High-Res Presentation"
            >
              <Download className="w-3.5 h-3.5 text-[#0f7058]" />
              <span>SVG</span>
            </button>

            <button
              onClick={handleDownloadPng}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-[#1d9f76] hover:bg-[#0f7058] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Download High-Res 3000x2000 PNG for SIH PPT / Document"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span>Export PNG</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-[#F4EFE4] hover:bg-[#D2CBBB] text-[#5E5A52] hover:text-[#1E1E1E] border border-[#D2CBBB] transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Presentation Mode'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#F4EFE4] hover:bg-rose-100 text-[#5E5A52] hover:text-rose-700 border border-[#D2CBBB] transition-colors cursor-pointer"
              title="Close Diagram"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Main Workspace */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Main Diagram Canvas Area */}
          <div className="flex-1 bg-[#e9e4d8] overflow-auto p-4 flex flex-col items-center justify-start relative">
            {activeTab === 'visual' && (
              <div
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
                className="transition-transform duration-150 ease-out w-full max-w-[1240px] my-auto"
              >
                {/* SVG High Precision Diagram */}
                <svg
                  ref={svgRef}
                  viewBox="0 0 1200 860"
                  className="w-full h-auto drop-shadow-md bg-[#FAF8F5] rounded-3xl border border-[#D2CBBB]"
                  style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif' }}
                >
                  <defs>
                    {/* Markers for Arrows */}
                    <marker id="arrow-solid" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 z" fill="#1E1E1E" />
                    </marker>
                    <marker id="arrow-green" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 z" fill="#1d9f76" />
                    </marker>
                    <marker id="arrow-amber" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 z" fill="#efa02a" />
                    </marker>
                    <marker id="arrow-bidirectional-start" markerWidth="8" markerHeight="8" refX="0" refY="3" orient="auto">
                      <path d="M6,0 L6,6 L0,3 z" fill="#1E1E1E" />
                    </marker>
                    <marker id="arrow-bidirectional-end" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 z" fill="#1E1E1E" />
                    </marker>

                    {/* Gradients */}
                    <linearGradient id="grad-client" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#E9F7F0" />
                      <stop offset="100%" stopColor="#D9F0E4" />
                    </linearGradient>
                    <linearGradient id="grad-backend" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FCF7ED" />
                      <stop offset="100%" stopColor="#F5EBD7" />
                    </linearGradient>
                    <linearGradient id="grad-network" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#F4F1FA" />
                      <stop offset="100%" stopColor="#E8E2F2" />
                    </linearGradient>
                    <linearGradient id="grad-admin" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#F2F7FC" />
                      <stop offset="100%" stopColor="#E1EDF8" />
                    </linearGradient>
                  </defs>

                  {/* Canvas Background & Watermark */}
                  <rect width="1200" height="860" fill="#FAF8F5" rx="24" />

                  {/* Header Title Bar inside diagram for export */}
                  <g transform="translate(40, 25)">
                    <text x="0" y="16" fontSize="16" fontWeight="bold" fill="#1E1E1E" letterSpacing="-0.3">
                      SAHARA — SYSTEM ARCHITECTURE &amp; INTER-TIER DATA FLOW
                    </text>
                    <text x="0" y="32" fontSize="11" fill="#5E5A52">
                      SIH (Smart India Hackathon) System Specification &bull; Compliant with Section 14 Medical Secrecy &amp; WHO GDHM Standards
                    </text>
                    <rect x="940" y="0" width="180" height="24" rx="12" fill="#1d9f76" opacity="0.15" />
                    <text x="1030" y="16" fontSize="10" fontWeight="bold" fill="#0f7058" textAnchor="middle">
                      PORT: 3000 &bull; EXPRESS + VITE
                    </text>
                  </g>

                  {/* ============================================================ */}
                  {/* 1. CLIENT LAYER (Top) */}
                  {/* ============================================================ */}
                  <g
                    transform="translate(40, 70)"
                    className="cursor-pointer"
                    onClick={() => setSelectedComponent(COMPONENT_DETAILS.client_layer)}
                  >
                    {/* Outer Box */}
                    <rect
                      x="0"
                      y="0"
                      width="580"
                      height="130"
                      rx="16"
                      fill="url(#grad-client)"
                      stroke="#86C29E"
                      strokeWidth="1.8"
                    />
                    {/* Title */}
                    <text x="290" y="24" fontSize="13" fontWeight="bold" fill="#0f7058" textAnchor="middle">
                      CLIENT LAYER
                    </text>
                    <text x="290" y="38" fontSize="11" fill="#2E5A44" textAnchor="middle">
                      Frontend — React.js + Vite (TypeScript, Tailwind, Web Audio)
                    </text>

                    {/* Sub-item 1: HTML5 Geolocation / Sensor */}
                    <g
                      transform="translate(15, 52)"
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedComponent(COMPONENT_DETAILS.sensor_api);
                      }}
                    >
                      <rect x="0" y="0" width="165" height="62" rx="10" fill="#FFFFFF" stroke="#86C29E" strokeWidth="1.2" />
                      <circle cx="20" cy="24" r="10" fill="#D9F0E4" />
                      <text x="20" y="28" fontSize="12" textAnchor="middle" fill="#0f7058">📍</text>
                      <text x="36" y="22" fontSize="10.5" fontWeight="bold" fill="#1E1E1E">Daily Check-in API</text>
                      <text x="36" y="36" fontSize="9" fill="#5E5A52">HTML5 Sensors &amp; Audio</text>
                      <text x="36" y="49" fontSize="8" fontStyle="italic" fill="#0f7058">Vitals &amp; Fatigue Inputs</text>
                    </g>

                    {/* Sub-item 2: Personnel Tracker UI */}
                    <g
                      transform="translate(195, 52)"
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedComponent(COMPONENT_DETAILS.personnel_ui);
                      }}
                    >
                      <rect x="0" y="0" width="180" height="62" rx="10" fill="#FFFFFF" stroke="#86C29E" strokeWidth="1.2" />
                      <circle cx="20" cy="24" r="10" fill="#D9F0E4" />
                      <text x="20" y="28" fontSize="12" textAnchor="middle" fill="#0f7058">📱</text>
                      <text x="36" y="22" fontSize="10.5" fontWeight="bold" fill="#1E1E1E">Personnel Welfare UI</text>
                      <text x="36" y="36" fontSize="9" fill="#5E5A52">PersonnelDashboard.tsx</text>
                      <text x="36" y="49" fontSize="8" fontStyle="italic" fill="#0f7058">1-Min Tactical Reset</text>
                    </g>

                    {/* Sub-item 3: Socket.IO Client Emitter */}
                    <g
                      transform="translate(390, 52)"
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedComponent(COMPONENT_DETAILS.socket_emitter);
                      }}
                    >
                      <rect x="0" y="0" width="175" height="62" rx="10" fill="#FFFFFF" stroke="#86C29E" strokeWidth="1.2" />
                      <circle cx="20" cy="24" r="10" fill="#D9F0E4" />
                      <text x="20" y="28" fontSize="12" textAnchor="middle" fill="#0f7058">📡</text>
                      <text x="36" y="22" fontSize="10.5" fontWeight="bold" fill="#1E1E1E">Socket.IO Emitter</text>
                      <text x="36" y="36" fontSize="9" fill="#5E5A52">WSS Encrypted Client</text>
                      <text x="36" y="49" fontSize="8" fontStyle="italic" fill="#0f7058">AES-256 Payload Hash</text>
                    </g>
                  </g>

                  {/* Connecting Arrow from Client Layer to Backend */}
                  <g transform="translate(180, 200)">
                    <line x1="0" y1="0" x2="0" y2="40" stroke="#1E1E1E" strokeWidth="1.6" markerEnd="url(#arrow-solid)" />
                    <rect x="-65" y="12" width="130" height="18" rx="4" fill="#FFFFFF" stroke="#D2CBBB" strokeWidth="0.8" />
                    <text x="0" y="25" fontSize="8.5" fontWeight="bold" fill="#1E1E1E" textAnchor="middle">
                      emit: encryptedCheckIn
                    </text>
                  </g>

                  {/* Horizontal Connector from Client Layer to Networking */}
                  <g transform="translate(620, 135)">
                    <path d="M0,0 L200,0 L200,85" fill="none" stroke="#1E1E1E" strokeWidth="1.6" markerEnd="url(#arrow-solid)" />
                    <rect x="50" y="-12" width="150" height="20" rx="6" fill="#FFFFFF" stroke="#D2CBBB" strokeWidth="0.8" />
                    <text x="125" y="2" fontSize="9" fontWeight="bold" fill="#1E1E1E" textAnchor="middle">
                      WebSocket (WSS) / HTTPS
                    </text>
                  </g>

                  {/* ============================================================ */}
                  {/* 2. BACKEND SERVER (Node.js + Express.js) */}
                  {/* ============================================================ */}
                  <g
                    transform="translate(40, 240)"
                    className="cursor-pointer"
                    onClick={() => setSelectedComponent(COMPONENT_DETAILS.backend_server)}
                  >
                    <rect
                      x="0"
                      y="0"
                      width="310"
                      height="380"
                      rx="16"
                      fill="url(#grad-backend)"
                      stroke="#D8A252"
                      strokeWidth="1.8"
                    />
                    <text x="155" y="24" fontSize="12.5" fontWeight="bold" fill="#9E5F0D" textAnchor="middle">
                      BACKEND SERVER (Node.js + Express.js)
                    </text>
                    <text x="155" y="38" fontSize="10" fill="#7A4B0A" textAnchor="middle">
                      Port: 3000 &bull; Reverse Proxy Integrated
                    </text>

                    {/* Sub-item: Express.js HTTP Server */}
                    <g transform="translate(15, 48)">
                      <rect x="0" y="0" width="280" height="48" rx="10" fill="#FFFFFF" stroke="#E6BE85" strokeWidth="1.2" />
                      <text x="15" y="20" fontSize="12">🌐</text>
                      <text x="36" y="20" fontSize="10.5" fontWeight="bold" fill="#1E1E1E">Express.js HTTP Server</text>
                      <text x="36" y="34" fontSize="8.5" fill="#5E5A52">CORS, Static SPA Hosting, REST APIs</text>
                    </g>

                    {/* Sub-item: Socket.IO Server Engine */}
                    <g transform="translate(15, 104)">
                      <rect x="0" y="0" width="280" height="48" rx="10" fill="#FFFFFF" stroke="#E6BE85" strokeWidth="1.2" />
                      <text x="15" y="20" fontSize="12">⚡</text>
                      <text x="36" y="20" fontSize="10.5" fontWeight="bold" fill="#1E1E1E">Socket.IO Server Engine</text>
                      <text x="36" y="34" fontSize="8.5" fill="#5E5A52">Broadcast: clinicalWelfareAlert</text>
                    </g>

                    {/* Sub-container: BUSINESS LOGIC & STATE ENGINE */}
                    <g
                      transform="translate(12, 160)"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedComponent(COMPONENT_DETAILS.business_logic);
                      }}
                    >
                      <rect x="0" y="0" width="286" height="205" rx="12" fill="#FAF2E3" stroke="#D8A252" strokeWidth="1.2" />
                      <text x="143" y="18" fontSize="10.5" fontWeight="bold" fill="#9E5F0D" textAnchor="middle">
                        BUSINESS LOGIC &amp; STATE ENGINE
                      </text>

                      {/* TreeSHAP Explainability Module */}
                      <g transform="translate(10, 26)">
                        <rect x="0" y="0" width="128" height="74" rx="8" fill="#FFFFFF" stroke="#E6BE85" strokeWidth="1" />
                        <text x="10" y="18" fontSize="11">🔬</text>
                        <text x="28" y="18" fontSize="9.5" fontWeight="bold" fill="#1E1E1E">TreeSHAP Model</text>
                        <text x="10" y="34" fontSize="8" fill="#5E5A52">Point Factor Waterfall</text>
                        <text x="10" y="46" fontSize="7.5" fill="#0f7058">Sleep (-22.4 pts)</text>
                        <text x="10" y="58" fontSize="7.5" fill="#efa02a">Night Rota (+14.1 pts)</text>
                      </g>

                      {/* Section 14 Privacy Guard Module */}
                      <g
                        transform="translate(148, 26)"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedComponent(COMPONENT_DETAILS.privacy_vault);
                        }}
                      >
                        <rect x="0" y="0" width="128" height="74" rx="8" fill="#FFFFFF" stroke="#E6BE85" strokeWidth="1" />
                        <text x="10" y="18" fontSize="11">🔒</text>
                        <text x="28" y="18" fontSize="9.5" fontWeight="bold" fill="#1E1E1E">Section 14 Guard</text>
                        <text x="10" y="34" fontSize="8" fill="#5E5A52">k-Anonymity (k ≥ 10)</text>
                        <text x="10" y="46" fontSize="7.5" fill="#0f7058">Statutory Secrecy</text>
                        <text x="10" y="58" fontSize="7.5" fill="#5E5A52">Immutable Hash Chain</text>
                      </g>

                      {/* In-Memory State Store (Cylinder Style) */}
                      <g
                        transform="translate(20, 110)"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedComponent(COMPONENT_DETAILS.privacy_vault);
                        }}
                      >
                        <rect x="0" y="0" width="246" height="82" rx="10" fill="#FFFFFF" stroke="#D8A252" strokeWidth="1.2" />
                        {/* Cylinder Graphic */}
                        <g transform="translate(15, 18)">
                          <ellipse cx="14" cy="6" rx="14" ry="5" fill="#D9F0E4" stroke="#0f7058" strokeWidth="1" />
                          <path d="M0,6 L0,26 C0,29 28,29 28,26 L28,6" fill="#D9F0E4" stroke="#0f7058" strokeWidth="1" />
                          <ellipse cx="14" cy="26" rx="14" ry="5" fill="#0f7058" opacity="0.3" />
                        </g>
                        <text x="52" y="24" fontSize="10.5" fontWeight="bold" fill="#1E1E1E">In-Memory State Store</text>
                        <text x="52" y="38" fontSize="8.5" fill="#5E5A52">activePersonnel [sessionId: CheckInData]</text>
                        <text x="52" y="50" fontSize="8" fill="#5E5A52">Welfare Case Triage Queue &bull; Roster Sim</text>
                        <text x="52" y="64" fontSize="7.5" fontStyle="italic" fill="#0f7058">
                          Validated against WHO GDHM 4 Pillars
                        </text>
                      </g>
                    </g>
                  </g>

                  {/* Central Forward WebSocket Relay Component */}
                  <g
                    transform="translate(385, 340)"
                    className="cursor-pointer"
                    onClick={() => setSelectedComponent(COMPONENT_DETAILS.networking_gateway)}
                  >
                    <rect x="0" y="0" width="165" height="65" rx="12" fill="#FAF8F5" stroke="#9A84BC" strokeWidth="1.6" />
                    <text x="82.5" y="26" fontSize="10.5" fontWeight="bold" fill="#5D4380" textAnchor="middle">
                      FORWARD WEBSOCKET
                    </text>
                    <text x="82.5" y="42" fontSize="9.5" fontMono="true" fill="#1E1E1E" textAnchor="middle">
                      /socket.io
                    </text>
                    <text x="82.5" y="54" fontSize="8" fill="#5E5A52" textAnchor="middle">
                      Real-time Bidirectional Bus
                    </text>
                  </g>

                  {/* Horizontal Arrows to/from Forward WebSocket */}
                  <line x1="350" y1="372" x2="385" y2="372" stroke="#1E1E1E" strokeWidth="1.6" markerEnd="url(#arrow-solid)" />
                  <line x1="550" y1="372" x2="680" y2="372" stroke="#1E1E1E" strokeWidth="1.6" markerEnd="url(#arrow-solid)" />

                  {/* ============================================================ */}
                  {/* 3. NETWORKING & GATEWAY LAYER (Top Right) */}
                  {/* ============================================================ */}
                  <g
                    transform="translate(680, 220)"
                    className="cursor-pointer"
                    onClick={() => setSelectedComponent(COMPONENT_DETAILS.networking_gateway)}
                  >
                    <rect
                      x="0"
                      y="0"
                      width="480"
                      height="210"
                      rx="16"
                      fill="url(#grad-network)"
                      stroke="#9A84BC"
                      strokeWidth="1.8"
                    />
                    <text x="240" y="24" fontSize="12.5" fontWeight="bold" fill="#5D4380" textAnchor="middle">
                      NETWORKING &amp; GATEWAY LAYER
                    </text>
                    <text x="240" y="38" fontSize="10" fill="#4B336B" textAnchor="middle">
                      Reverse Proxy, SSL Gateway &amp; Tile Server
                    </text>

                    {/* Sub-item: Nginx / Port 3000 Ingress */}
                    <g transform="translate(15, 48)">
                      <rect x="0" y="0" width="450" height="42" rx="10" fill="#FFFFFF" stroke="#BCAED3" strokeWidth="1.2" />
                      <text x="15" y="25" fontSize="12">🔒</text>
                      <text x="36" y="20" fontSize="10" fontWeight="bold" fill="#1E1E1E">Reverse Proxy Ingress (Port 3000)</text>
                      <text x="36" y="34" fontSize="8.5" fill="#5E5A52">Nginx Strict Single-Port Routing for Container WAN/Intranet</text>
                    </g>

                    {/* Sub-item: Vite Dev Server / Proxy */}
                    <g transform="translate(15, 98)">
                      <rect x="0" y="0" width="450" height="42" rx="10" fill="#FFFFFF" stroke="#BCAED3" strokeWidth="1.2" />
                      <text x="15" y="25" fontSize="12">🌐</text>
                      <text x="36" y="20" fontSize="10" fontWeight="bold" fill="#1E1E1E">Vite Dev Server / Proxy</text>
                      <text x="36" y="34" fontSize="8.5" fill="#5E5A52">HTTPS / SSL Termination &bull; Express SPA Integration</text>
                    </g>

                    {/* Sub-item: OpenStreetMap / GIS Outpost Tile Server */}
                    <g
                      transform="translate(15, 148)"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedComponent(COMPONENT_DETAILS.outpost_tiles);
                      }}
                    >
                      <rect x="0" y="0" width="450" height="48" rx="10" fill="#FFFFFF" stroke="#BCAED3" strokeWidth="1.2" />
                      <text x="15" y="28" fontSize="12">🗺️</text>
                      <text x="36" y="20" fontSize="10" fontWeight="bold" fill="#1E1E1E">GIS Tile Server &amp; WHO Benchmark CDN</text>
                      <text x="36" y="33" fontSize="8.5" fill="#5E5A52">OpenStreetMap CDN &bull; High-Altitude Outpost Coordinates</text>
                      <text x="36" y="44" fontSize="7.5" fill="#0f7058">Offline Cacheable Tiles for Tactical Forward Regiments</text>
                    </g>
                  </g>

                  {/* Vertical Connector from Network Layer to Echelon Device */}
                  <g transform="translate(850, 430)">
                    <line x1="0" y1="0" x2="0" y2="40" stroke="#1E1E1E" strokeWidth="1.6" markerEnd="url(#arrow-solid)" />
                    <rect x="-40" y="10" width="80" height="18" rx="4" fill="#FFFFFF" stroke="#D2CBBB" strokeWidth="0.8" />
                    <text x="0" y="23" fontSize="8.5" fontWeight="bold" fill="#1E1E1E" textAnchor="middle">
                      WSS / HTTPS
                    </text>
                  </g>

                  {/* ============================================================ */}
                  {/* 4. ECHELON STAKEHOLDER PORTALS (Bottom Center/Right) */}
                  {/* ============================================================ */}
                  <g
                    transform="translate(385, 470)"
                    className="cursor-pointer"
                    onClick={() => setSelectedComponent(COMPONENT_DETAILS.echelon_portals)}
                  >
                    <rect
                      x="0"
                      y="0"
                      width="775"
                      height="150"
                      rx="16"
                      fill="url(#grad-admin)"
                      stroke="#5B8DB8"
                      strokeWidth="1.8"
                    />
                    <text x="387.5" y="22" fontSize="12.5" fontWeight="bold" fill="#1E4566" textAnchor="middle">
                      4-ECHELON STAKEHOLDER PORTALS (Desktop / Tablet / Mobile Browser)
                    </text>
                    <text x="387.5" y="35" fontSize="9.5" fill="#3B6488" textAnchor="middle">
                      Role-Based Access Control (RBAC) &bull; Strictly Partitioned Clinical vs. Command Portals
                    </text>

                    {/* Top sub-row: Auth Guard & Socket Listener */}
                    <g transform="translate(15, 42)">
                      {/* Socket Listener */}
                      <rect x="0" y="0" width="365" height="34" rx="8" fill="#FFFFFF" stroke="#A6C5DF" strokeWidth="1" />
                      <text x="12" y="21" fontSize="11">📡</text>
                      <text x="30" y="17" fontSize="9.5" fontWeight="bold" fill="#1E1E1E">Socket.IO Client Echelon Listener</text>
                      <text x="30" y="28" fontSize="7.5" fill="#5E5A52">Real-time alerts when personnel strain index ≥ 65</text>

                      {/* Echelon Auth Guard */}
                      <g transform="translate(380, 0)">
                        <rect x="0" y="0" width="365" height="34" rx="8" fill="#FFFFFF" stroke="#A6C5DF" strokeWidth="1" />
                        <text x="12" y="21" fontSize="11">🔐</text>
                        <text x="30" y="17" fontSize="9.5" fontWeight="bold" fill="#1E1E1E">Echelon Auth Guard (SessionStorage / Token)</text>
                        <text x="30" y="28" fontSize="7.5" fill="#5E5A52">Tier 1: Personnel &bull; Tier 2: Welfare &bull; Tier 3: Command &bull; Tier 4: Admin</text>
                      </g>
                    </g>

                    {/* Bottom sub-row: 4 Discrete Portals */}
                    <g transform="translate(15, 84)">
                      {/* Portal 1 */}
                      <g transform="translate(0, 0)">
                        <rect x="0" y="0" width="175" height="52" rx="8" fill="#FFFFFF" stroke="#A6C5DF" strokeWidth="1" />
                        <text x="8" y="16" fontSize="10">👤</text>
                        <text x="24" y="16" fontSize="9" fontWeight="bold" fill="#0f7058">01 Personnel Portal</text>
                        <text x="8" y="30" fontSize="7.5" fill="#5E5A52">Daily Self Check-in</text>
                        <text x="8" y="42" fontSize="7" fill="#5E5A52">1-Min Tactical Breathing</text>
                      </g>

                      {/* Portal 2 */}
                      <g transform="translate(187, 0)">
                        <rect x="0" y="0" width="180" height="52" rx="8" fill="#FFFFFF" stroke="#A6C5DF" strokeWidth="1" />
                        <text x="8" y="16" fontSize="10">🩺</text>
                        <text x="24" y="16" fontSize="9" fontWeight="bold" fill="#efa02a">02 Welfare Officer Portal</text>
                        <text x="8" y="30" fontSize="7.5" fill="#5E5A52">Clinical Triage &bull; TreeSHAP</text>
                        <text x="8" y="42" fontSize="7" fill="#5E5A52">Non-Punitive Rest Orders</text>
                      </g>

                      {/* Portal 3 */}
                      <g transform="translate(379, 0)">
                        <rect x="0" y="0" width="180" height="52" rx="8" fill="#FFFFFF" stroke="#A6C5DF" strokeWidth="1" />
                        <text x="8" y="16" fontSize="10">🎖️</text>
                        <text x="24" y="16" fontSize="9" fontWeight="bold" fill="#1E4566">03 Commander Portal</text>
                        <text x="8" y="30" fontSize="7.5" fill="#5E5A52">Battalion Readiness Matrix</text>
                        <text x="8" y="42" fontSize="7" fill="#0f7058">k ≥ 10 Anonymized Heatmap</text>
                      </g>

                      {/* Portal 4 */}
                      <g transform="translate(571, 0)">
                        <rect x="0" y="0" width="174" height="52" rx="8" fill="#FFFFFF" stroke="#A6C5DF" strokeWidth="1" />
                        <text x="8" y="16" fontSize="10">⚙️</text>
                        <text x="24" y="16" fontSize="9" fontWeight="bold" fill="#5D4380">04 Admin &amp; ML Portal</text>
                        <text x="8" y="30" fontSize="7.5" fill="#5E5A52">Model Telemetry &amp; PSI Drift</text>
                        <text x="8" y="42" fontSize="7" fill="#5E5A52">Immutable Audit Ledger</text>
                      </g>
                    </g>
                  </g>

                  {/* ============================================================ */}
                  {/* 5. SYSTEM FLOW (Bottom Horizontal Pipeline) */}
                  {/* ============================================================ */}
                  <g
                    transform="translate(40, 640)"
                    className="cursor-pointer"
                    onClick={() => setActiveTab('flow')}
                  >
                    <rect
                      x="0"
                      y="0"
                      width="1120"
                      height="130"
                      rx="16"
                      fill="#FFFFFF"
                      stroke="#D2CBBB"
                      strokeWidth="1.8"
                    />
                    <text x="560" y="22" fontSize="12" fontWeight="bold" fill="#1E1E1E" textAnchor="middle">
                      SYSTEM FLOW
                    </text>
                    <text x="560" y="34" fontSize="9" fill="#5E5A52" textAnchor="middle">
                      End-to-End Operational Lifecycle: From Single Personnel Log to Restorative Action
                    </text>

                    {/* START pill */}
                    <g transform="translate(15, 52)">
                      <rect x="0" y="0" width="60" height="42" rx="21" fill="#1d9f76" />
                      <text x="30" y="26" fontSize="11" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">
                        START
                      </text>
                    </g>

                    <line x1="80" y1="73" x2="100" y2="73" stroke="#1E1E1E" strokeWidth="1.6" markerEnd="url(#arrow-solid)" />

                    {/* Step 1: Personnel Device */}
                    <g transform="translate(105, 42)">
                      <rect x="0" y="0" width="220" height="64" rx="10" fill="#E9F7F0" stroke="#86C29E" strokeWidth="1.2" />
                      <text x="12" y="18" fontSize="10" fontWeight="bold" fill="#0f7058">Personnel Mobile / Tablet</text>
                      <text x="12" y="32" fontSize="8" fill="#1E1E1E">&bull; Daily check-in (Sleep, Fatigue, Vitals)</text>
                      <text x="12" y="44" fontSize="8" fill="#1E1E1E">&bull; Offline IndexedDB sync if remote outpost</text>
                      <text x="12" y="56" fontSize="8" fill="#1E1E1E">&bull; Encrypted transmit via WSS / HTTPS</text>
                    </g>

                    <line x1="330" y1="73" x2="350" y2="73" stroke="#1E1E1E" strokeWidth="1.6" markerEnd="url(#arrow-solid)" />

                    {/* Step 2: Backend Server Engine */}
                    <g transform="translate(355, 42)">
                      <rect x="0" y="0" width="235" height="64" rx="10" fill="#FCF7ED" stroke="#D8A252" strokeWidth="1.2" />
                      <text x="12" y="18" fontSize="10" fontWeight="bold" fill="#9E5F0D">Backend Server &amp; ML Model</text>
                      <text x="12" y="32" fontSize="8" fill="#1E1E1E">&bull; Receive &amp; validate schema &amp; token</text>
                      <text x="12" y="44" fontSize="8" fill="#1E1E1E">&bull; Calculate TreeSHAP point attribution</text>
                      <text x="12" y="56" fontSize="8" fill="#1E1E1E">&bull; Append to Section 14 SHA-256 audit log</text>
                    </g>

                    <line x1="595" y1="73" x2="615" y2="73" stroke="#1E1E1E" strokeWidth="1.6" markerEnd="url(#arrow-solid)" />

                    {/* Step 3: Networking & Privacy Gateways */}
                    <g transform="translate(620, 42)">
                      <rect x="0" y="0" width="220" height="64" rx="10" fill="#F4F1FA" stroke="#9A84BC" strokeWidth="1.2" />
                      <text x="12" y="18" fontSize="10" fontWeight="bold" fill="#5D4380">Privacy &amp; Gateway Layer</text>
                      <text x="12" y="32" fontSize="8" fill="#1E1E1E">&bull; Proxy WebSocket bi-directional link</text>
                      <text x="12" y="44" fontSize="8" fill="#1E1E1E">&bull; Enforce k-Anonymity (k ≥ 10 threshold)</text>
                      <text x="12" y="56" fontSize="8" fill="#1E1E1E">&bull; Dispatch to Medical Welfare if Index ≥ 65</text>
                    </g>

                    <line x1="845" y1="73" x2="865" y2="73" stroke="#1E1E1E" strokeWidth="1.6" markerEnd="url(#arrow-solid)" />

                    {/* Step 4: Echelon Portals */}
                    <g transform="translate(870, 42)">
                      <rect x="0" y="0" width="180" height="64" rx="10" fill="#F2F7FC" stroke="#5B8DB8" strokeWidth="1.2" />
                      <text x="12" y="18" fontSize="10" fontWeight="bold" fill="#1E4566">Command &amp; Care Echelons</text>
                      <text x="12" y="32" fontSize="8" fill="#1E1E1E">&bull; Welfare Officer triages alert</text>
                      <text x="12" y="44" fontSize="8" fill="#1E1E1E">&bull; Non-punitive rest orders issued</text>
                      <text x="12" y="56" fontSize="8" fill="#1E1E1E">&bull; Command reviews force readiness</text>
                    </g>

                    <line x1="1055" y1="73" x2="1070" y2="73" stroke="#1E1E1E" strokeWidth="1.6" markerEnd="url(#arrow-solid)" />

                    {/* END pill */}
                    <g transform="translate(1072, 52)">
                      <rect x="0" y="0" width="40" height="42" rx="20" fill="#1E1E1E" />
                      <text x="20" y="26" fontSize="10" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">
                        END
                      </text>
                    </g>
                  </g>

                  {/* ============================================================ */}
                  {/* 6. LEGEND (Bottom Box) */}
                  {/* ============================================================ */}
                  <g transform="translate(40, 785)">
                    <rect
                      x="0"
                      y="0"
                      width="1120"
                      height="52"
                      rx="12"
                      fill="#FAF8F5"
                      stroke="#D2CBBB"
                      strokeWidth="1.2"
                    />
                    <text x="20" y="30" fontSize="11" fontWeight="bold" fill="#1E1E1E">
                      LEGEND
                    </text>

                    {/* Solid Line: HTTP/HTTPS */}
                    <g transform="translate(90, 15)">
                      <line x1="0" y1="15" x2="35" y2="15" stroke="#1E1E1E" strokeWidth="1.8" markerEnd="url(#arrow-solid)" />
                      <text x="45" y="18" fontSize="9" fill="#1E1E1E">HTTP / HTTPS (REST)</text>
                    </g>

                    {/* Bidirectional Arrow: WebSocket */}
                    <g transform="translate(240, 15)">
                      <line
                        x1="5"
                        y1="15"
                        x2="30"
                        y2="15"
                        stroke="#1E1E1E"
                        strokeWidth="1.8"
                        markerStart="url(#arrow-bidirectional-start)"
                        markerEnd="url(#arrow-bidirectional-end)"
                      />
                      <text x="40" y="18" fontSize="9" fill="#1E1E1E">WebSocket (WSS)</text>
                    </g>

                    {/* Dashed Line: Data Flow */}
                    <g transform="translate(390, 15)">
                      <line x1="0" y1="15" x2="35" y2="15" stroke="#0f7058" strokeWidth="1.8" strokeDasharray="3 3" markerEnd="url(#arrow-green)" />
                      <text x="45" y="18" fontSize="9" fill="#0f7058">TreeSHAP Flow</text>
                    </g>

                    {/* Data Store Cylinder Icon */}
                    <g transform="translate(540, 18)">
                      <ellipse cx="6" cy="4" rx="6" ry="2.5" fill="#D9F0E4" stroke="#0f7058" strokeWidth="0.8" />
                      <path d="M0,4 L0,14 C0,16 12,16 12,14 L12,4" fill="#D9F0E4" stroke="#0f7058" strokeWidth="0.8" />
                      <text x="18" y="14" fontSize="9" fill="#1E1E1E">In-Memory / Store</text>
                    </g>

                    {/* Swatches for 4 Tiers */}
                    <g transform="translate(680, 20)">
                      <rect x="0" y="2" width="14" height="14" rx="3" fill="#E9F7F0" stroke="#86C29E" />
                      <text x="20" y="13" fontSize="8.5" fill="#1E1E1E">Client Layer</text>

                      <rect x="90" y="2" width="14" height="14" rx="3" fill="#FCF7ED" stroke="#D8A252" />
                      <text x="110" y="13" fontSize="8.5" fill="#1E1E1E">Backend &amp; ML</text>

                      <rect x="195" y="2" width="14" height="14" rx="3" fill="#F4F1FA" stroke="#9A84BC" />
                      <text x="215" y="13" fontSize="8.5" fill="#1E1E1E">Networking</text>

                      <rect x="290" y="2" width="14" height="14" rx="3" fill="#F2F7FC" stroke="#5B8DB8" />
                      <text x="310" y="13" fontSize="8.5" fill="#1E1E1E">Echelon Portals</text>
                    </g>
                  </g>
                </svg>
              </div>
            )}

            {/* Tab: Detailed Flow Pipeline */}
            {activeTab === 'flow' && (
              <div className="w-full max-w-4xl bg-[#FAF8F5] p-6 rounded-3xl border border-[#D2CBBB] space-y-6 shadow-sm">
                <div className="border-b border-[#D2CBBB] pb-4">
                  <h3 className="text-base font-bold font-serif text-[#1E1E1E]">
                    End-to-End Operational Lifecycle &amp; Telemetry Sequence
                  </h3>
                  <p className="text-xs text-[#5E5A52] mt-1">
                    Traces a single personnel check-in through ingestion, explainable AI attribution, Section 14 privacy guarantees, and clinical resolution.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      step: 'Phase 1: Personnel Daily Self-Checkin',
                      actor: 'Service Member (Client PWA)',
                      detail:
                        'The user inputs sleep duration, shift duty hours, physical strain score (1-5), and emotional state. In remote mountain outposts without active WAN, entries are held in IndexedDB until satellite or Wi-Fi handshake occurs.',
                      protocol: 'Local Storage / HTTPS POST /api/checkin',
                      badge: 'Tier 1'
                    },
                    {
                      step: 'Phase 2: Ingress & Section 14 Hashing',
                      actor: 'Backend API Gateway (Express.js, Port 3000)',
                      detail:
                        'The reverse proxy routes payload to the Node.js backend. The payload receives a SHA-256 Merkle chain signature to prevent retrospective data tampering, compliant with Armed Forces Medical Services audit guidelines.',
                      protocol: 'TLS 1.3 / Express Middleware',
                      badge: 'Security'
                    },
                    {
                      step: 'Phase 3: Explainable AI & TreeSHAP Attribution',
                      actor: 'Analytics Engine (TreeSHAP Algorithm)',
                      detail:
                        'The model computes the Cumulative Strain Index (0-100) and decomposes the score into transparent factors (e.g. +22.4 pts acute sleep debt, +14.1 pts consecutive night duty, -8.5 pts squad rest). Zero black-box obscurity.',
                      protocol: 'Additive Shapley Formulations',
                      badge: 'AI Engine'
                    },
                    {
                      step: 'Phase 4: Cryptographic k-Anonymity Filter',
                      actor: 'Privacy Enforcement Micro-Service',
                      detail:
                        'Before transmitting aggregated readiness stats to Brigade Command, the engine checks detachment headcounts. If any outpost has fewer than 10 soldiers, individual metrics are cryptographically suppressed.',
                      protocol: 'k ≥ 10 Mathematical Suppression',
                      badge: 'Section 14'
                    },
                    {
                      step: 'Phase 5: Automated Clinical Welfare Alerting',
                      actor: 'Medical Welfare Officer Portal',
                      detail:
                        'If consecutive strain exceeds 65 points across 48 hours, the assigned Unit Medical Welfare Officer receives a confidential notification. The officer initiates non-punitive SOP (72h sleep recovery, duty rescheduling).',
                      protocol: 'WebSocket Push (WSS)',
                      badge: 'Tier 2'
                    },
                    {
                      step: 'Phase 6: High-Level Readiness Dashboarding',
                      actor: 'Commanding Officer Portal',
                      detail:
                        'Brigade commanders review macro readiness percentages and outpost stress heatmaps without access to personal health journals or individual clinical files.',
                      protocol: 'Aggregated GIS Heatmap API',
                      badge: 'Tier 3'
                    }
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-2xl bg-[#E3DDCF]/40 border border-[#D2CBBB] flex flex-col sm:flex-row items-start justify-between gap-3 hover:border-[#1d9f76] transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#0f7058] bg-[#1d9f76]/15 px-2 py-0.5 rounded-full border border-[#1d9f76]/30">
                            {item.badge}
                          </span>
                          <h4 className="text-sm font-bold text-[#1E1E1E]">{item.step}</h4>
                        </div>
                        <p className="text-xs text-[#5E5A52] leading-relaxed">{item.detail}</p>
                        <div className="pt-1 flex items-center gap-2 text-[11px] font-mono text-[#0f7058]">
                          <Activity className="w-3.5 h-3.5" />
                          <span>Actor: {item.actor}</span>
                        </div>
                      </div>
                      <span className="shrink-0 text-[10px] font-mono font-medium px-2 py-1 rounded-md bg-[#FAF8F5] text-[#1E1E1E] border border-[#D2CBBB]">
                        {item.protocol}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: SIH Technical Specification */}
            {activeTab === 'spec' && (
              <div className="w-full max-w-4xl bg-[#FAF8F5] p-6 rounded-3xl border border-[#D2CBBB] space-y-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#D2CBBB] pb-4">
                  <div>
                    <h3 className="text-base font-bold font-serif text-[#1E1E1E]">
                      Smart India Hackathon (SIH) Defense Tech Submission Specification
                    </h3>
                    <p className="text-xs text-[#5E5A52]">
                      Technical stack verification, security compliance parameters, and Mermaid diagram source code
                    </p>
                  </div>
                  <button
                    onClick={handleCopyMermaid}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1d9f76] hover:bg-[#0f7058] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <FileCode className="w-3.5 h-3.5 text-white" />
                    <span>{isCopied ? 'Copied Mermaid!' : 'Copy Mermaid Code'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-[#F4EFE4] border border-[#D2CBBB] space-y-2">
                    <span className="font-bold text-[#1E1E1E] block">Core Technology Stack</span>
                    <ul className="space-y-1.5 text-[#5E5A52]">
                      <li>&bull; <strong>Frontend:</strong> React 18, Vite, TypeScript, Tailwind CSS</li>
                      <li>&bull; <strong>Icons &amp; Motion:</strong> Lucide React, Framer Motion</li>
                      <li>&bull; <strong>Backend:</strong> Node.js, Express.js (Port 3000), tsx runner</li>
                      <li>&bull; <strong>Real-Time:</strong> WebSocket / Socket.IO event architecture</li>
                      <li>&bull; <strong>GIS &amp; Mapping:</strong> Leaflet.js, OpenStreetMap tile server</li>
                      <li>&bull; <strong>Analytics:</strong> TreeSHAP additive feature attribution</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F4EFE4] border border-[#D2CBBB] space-y-2">
                    <span className="font-bold text-[#1E1E1E] block">Statutory &amp; Defense Compliance</span>
                    <ul className="space-y-1.5 text-[#5E5A52]">
                      <li>&bull; <strong>Section 14:</strong> Armed Forces Medical Secrecy guarantee</li>
                      <li>&bull; <strong>k-Anonymity:</strong> k ≥ 10 threshold on all echelon rollups</li>
                      <li>&bull; <strong>WHO GDHM:</strong> Benchmarked against 4 global health pillars</li>
                      <li>&bull; <strong>Audit Trails:</strong> SHA-256 cryptographic tamper-evident log</li>
                      <li>&bull; <strong>Network Hardening:</strong> Single Port 3000 Reverse Proxy</li>
                      <li>&bull; <strong>Non-Punitive Mandate:</strong> Care workflows without disciplinary link</li>
                    </ul>
                  </div>
                </div>

                {/* Pre-formatted code box */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-[#5E5A52]">
                    <span>Mermaid.js Architecture Definition (Ready for PPT/Reports):</span>
                    <span>Format: UTF-8 Graph TD</span>
                  </div>
                  <pre className="p-4 bg-[#1E1E1E] text-[#D2CBBB] rounded-2xl text-[11px] font-mono overflow-x-auto border border-[#2E2E2E] leading-relaxed">
{`graph TD
  Client_Layer["CLIENT LAYER (Frontend - React.js + Vite)"]
  Backend_Server["BACKEND SERVER (Node.js + Express.js - Port 3000)"]
  Networking_Gateway["NETWORKING & GATEWAY LAYER (Port 3000 Ingress)"]
  Echelons["4-ECHELON STAKEHOLDER PORTALS (RBAC Segregated)"]

  Client_Layer -- "emit: encryptedCheckIn" --> Backend_Server
  Backend_Server -- "TreeSHAP Attribution & k>=10" --> Networking_Gateway
  Networking_Gateway -- "WSS Clinical Alerts & Macro GIS" --> Echelons`}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Interactive Component Inspector */}
          <div className="w-full lg:w-80 bg-[#F4EFE4] border-t lg:border-t-0 lg:border-l border-[#D2CBBB] p-5 flex flex-col justify-between shrink-0 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#D2CBBB] pb-3">
                <div className="flex items-center space-x-2">
                  <Info className="w-4 h-4 text-[#0f7058]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0f7058]">
                    Element Inspector
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#5E5A52]">Click any node to inspect</span>
              </div>

              <div>
                <h3 className="text-base font-bold font-serif text-[#1E1E1E]">
                  {selectedComponent.name}
                </h3>
                <span className="text-[11px] font-mono font-semibold text-[#0f7058] block mt-0.5">
                  {selectedComponent.layer}
                </span>
              </div>

              <div className="space-y-3 text-xs text-[#5E5A52]">
                <div>
                  <strong className="text-[#1E1E1E] block mb-0.5">Technology &amp; Protocols:</strong>
                  <p className="bg-[#E3DDCF] p-2 rounded-xl border border-[#D2CBBB] font-mono text-[11px] text-[#1E1E1E]">
                    {selectedComponent.technology}
                  </p>
                </div>

                <div>
                  <strong className="text-[#1E1E1E] block mb-0.5">Functional Purpose:</strong>
                  <p className="leading-relaxed bg-[#FAF8F5] p-2.5 rounded-xl border border-[#D2CBBB]">
                    {selectedComponent.purpose}
                  </p>
                </div>

                <div>
                  <strong className="text-[#1E1E1E] block mb-0.5">Security &amp; Privacy Standard:</strong>
                  <p className="bg-[#FAF8F5] p-2 rounded-xl border border-[#D2CBBB] text-[11px] text-[#0f7058]">
                    {selectedComponent.security}
                  </p>
                </div>

                <div>
                  <strong className="text-[#1E1E1E] block mb-0.5">Relevant Source Files:</strong>
                  <div className="space-y-1">
                    {selectedComponent.files.map((file, idx) => (
                      <code
                        key={idx}
                        className="block bg-[#1E1E1E] text-[#D2CBBB] text-[10px] px-2 py-1 rounded-md font-mono truncate"
                      >
                        {file}
                      </code>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D2CBBB] space-y-2">
              <button
                onClick={handleDownloadPng}
                className="w-full py-2 px-3 rounded-full bg-[#1d9f76] hover:bg-[#0f7058] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download High-Res Graphic (PNG)</span>
              </button>
              <button
                onClick={handleDownloadSvg}
                className="w-full py-2 px-3 rounded-full bg-[#E3DDCF] hover:bg-[#D2CBBB] text-[#1E1E1E] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#0f7058]" />
                <span>Save Vector SVG (Infinite Resolution)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
