import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Shield,
  Clock,
  Calendar,
  UserCheck,
  CheckCircle2,
  Lock,
  FileText,
  Wind,
  Sparkles,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface Specialist {
  id: string;
  name: string;
  role: string;
  unit: string;
  qualification: string;
  availability: string;
  avatarInitials: string;
  bio: string;
}

interface Appointment {
  id: string;
  specialistName: string;
  specialistRole: string;
  date: string;
  time: string;
  type: 'Video Consultation' | 'Confidential Audio Call';
  status: 'Confirmed' | 'Completed';
}

interface CounsellingVideoRoomProps {
  onOpenTacticalReset?: () => void;
}

export const CounsellingVideoRoom: React.FC<CounsellingVideoRoomProps> = ({
  onOpenTacticalReset
}) => {
  const [isInCall, setIsInCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [isNotesSaved, setIsNotesSaved] = useState(false);

  // Booking state
  const [selectedSpecialist, setSelectedSpecialist] = useState<string>('spec-1');
  const [bookingDate, setBookingDate] = useState('2026-09-14');
  const [bookingSlot, setBookingSlot] = useState('14:30 HRS');
  const [bookingType, setBookingType] = useState<'Video Consultation' | 'Confidential Audio Call'>('Video Consultation');
  const [bookingReason, setBookingReason] = useState('Sleep debt & post-patrol fatigue decompression');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'apt-1',
      specialistName: 'Capt. (Dr.) Ananya Sen',
      specialistRole: 'Military Psychiatrist (AMC)',
      date: '2026-09-14',
      time: '14:30 HRS',
      type: 'Video Consultation',
      status: 'Confirmed'
    }
  ]);

  const userVideoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const specialists: Specialist[] = [
    {
      id: 'spec-1',
      name: 'Capt. (Dr.) Ananya Sen',
      role: 'Military Psychiatrist, Army Medical Corps (AMC)',
      unit: 'HQ 19th Infantry Division Hospital',
      qualification: 'MD Psychiatry (AFMC), Combat Neuro-Psychiatry Specialist',
      availability: 'Today: 14:30, 16:00, 18:30 HRS',
      avatarInitials: 'AS',
      bio: '12 years treating frontline combat stress, high-altitude cognitive strain, and sleep desynchrony under statutory privilege.'
    },
    {
      id: 'spec-2',
      name: 'Major Vikram Joshi',
      role: 'Welfare & Trauma Officer',
      unit: 'Directorate of Operational Health',
      qualification: 'MA Clinical Psychology, Combat Veteran Support Lead',
      availability: 'Tomorrow: 09:00, 11:30 HRS',
      avatarInitials: 'VJ',
      bio: 'Specializes in proactive unit decompression, operational reassignment advocacy, and stigma-free psychological first aid.'
    },
    {
      id: 'spec-3',
      name: 'Subedar R. Verma',
      role: 'Certified Peer Recovery Specialist',
      unit: '102nd Mountain Battalion Decompression Post',
      qualification: 'Senior Sentry Lead & Tactical Health Master Trainer',
      availability: 'Available Now for On-Demand Call',
      avatarInitials: 'RV',
      bio: 'Frontline NCO peer counseling, guiding box breathing rituals, patrol sleep resets, and stress debriefs.'
    }
  ];

  // Camera handling
  useEffect(() => {
    if (isInCall && !isVideoMuted) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isInCall, isVideoMuted]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false
        });
        streamRef.current = stream;
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }
      }
    } catch (err: any) {
      console.warn('Camera access error (using tactical fallback avatar):', err);
      setCameraError('Camera access not permitted or unavailable. Showing protected identity avatar.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (userVideoRef.current) {
      userVideoRef.current.srcObject = null;
    }
  };

  // Call timer
  useEffect(() => {
    let interval: any;
    if (isInCall) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [isInCall]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const spec = specialists.find((s) => s.id === selectedSpecialist);
    if (!spec) return;

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      specialistName: spec.name,
      specialistRole: spec.role,
      date: bookingDate,
      time: bookingSlot,
      type: bookingType,
      status: 'Confirmed'
    };

    setAppointments([newApt, ...appointments]);
    setBookingConfirmed(true);
    setTimeout(() => {
      setBookingConfirmed(false);
    }, 2500);
  };

  return (
    <div className="space-y-6 text-[#1E1E1E]">
      {/* If in active call, display the built-in video session room */}
      {isInCall ? (
        <div className="bg-[#1E1E1E] text-[#F4EFE4] rounded-3xl border border-[#D2CBBB] overflow-hidden shadow-2xl relative">
          {/* Top Call HUD */}
          <div className="p-4 bg-black/60 border-b border-[#2E2E2E] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="w-3 h-3 rounded-full bg-[#1d9f76] animate-pulse" />
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-[#F4EFE4]">Live Confidential Consultation</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1d9f76]/30 text-emerald-300 border border-[#1d9f76]/40">
                    AES-256 E2EE Link
                  </span>
                </div>
                <p className="text-[11px] text-[#A89F8F]">
                  Capt. (Dr.) Ananya Sen &bull; Section 14 Protected Session
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#2E2E2E] text-xs font-mono text-emerald-400 border border-[#5E5A52]">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTimer(callDuration)}</span>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-1 rounded-full bg-[#efa02a]/20 text-[#efa02a] border border-[#efa02a]/30">
                Non-Punitive Care
              </span>
            </div>
          </div>

          {/* Video Split Screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 min-h-[380px] bg-black/80 relative">
            {/* Doctor Feed */}
            <div className="bg-[#1E1E1E] rounded-2xl border border-[#2E2E2E] overflow-hidden relative flex flex-col items-center justify-center p-4">
              <div className="w-24 h-24 rounded-full bg-[#1d9f76]/20 border-2 border-[#1d9f76] flex items-center justify-center text-white text-2xl font-bold font-serif mb-3 shadow-lg shadow-[#1d9f76]/20">
                AS
              </div>
              <h4 className="text-sm font-bold text-[#F4EFE4]">Capt. (Dr.) Ananya Sen</h4>
              <p className="text-xs text-[#A89F8F]">AMC Psychiatrist &bull; Live On-Call</p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-800/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Audio stream active &bull; Listening attentively</span>
              </div>

              {/* Watermark */}
              <div className="absolute top-3 left-3 text-[10px] font-mono text-[#5E5A52] flex items-center gap-1 pointer-events-none">
                <Shield className="w-3 h-3 text-[#1d9f76]" />
                <span>SECTION 14 CLINICAL PRIVILEGE</span>
              </div>
            </div>

            {/* User Camera Feed */}
            <div className="bg-[#1E1E1E] rounded-2xl border border-[#2E2E2E] overflow-hidden relative flex flex-col items-center justify-center p-4">
              {!isVideoMuted && !cameraError ? (
                <video
                  ref={userVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-4">
                  <div className="w-24 h-24 rounded-full bg-[#efa02a]/20 border-2 border-[#efa02a] flex items-center justify-center text-[#efa02a] text-2xl font-bold font-serif mb-3">
                    RV
                  </div>
                  <h4 className="text-sm font-bold text-[#F4EFE4]">Const. Rahul Verma</h4>
                  <p className="text-xs text-[#A89F8F]">
                    {isVideoMuted ? 'Camera disabled by user' : 'Protected identity avatar active'}
                  </p>
                </div>
              )}

              <div className="absolute top-3 right-3 flex items-center gap-2">
                {isMicMuted && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono">
                    MIC MUTED
                  </span>
                )}
                {isVideoMuted && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono">
                    VIDEO OFF
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* In-Call Controls Bar */}
          <div className="p-4 bg-black/90 border-t border-[#2E2E2E] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              {/* Mic Toggle */}
              <button
                onClick={() => setIsMicMuted(!isMicMuted)}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isMicMuted
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-[#2E2E2E] hover:bg-[#3E3E3E] text-[#F4EFE4] border-[#5E5A52]'
                }`}
                title={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
              >
                {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span className="text-xs">{isMicMuted ? 'Muted' : 'Mic On'}</span>
              </button>

              {/* Video Toggle */}
              <button
                onClick={() => setIsVideoMuted(!isVideoMuted)}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isVideoMuted
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-[#2E2E2E] hover:bg-[#3E3E3E] text-[#F4EFE4] border-[#5E5A52]'
                }`}
                title={isVideoMuted ? 'Turn on camera' : 'Turn off camera'}
              >
                {isVideoMuted ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                <span className="text-xs">{isVideoMuted ? 'Camera Off' : 'Camera On'}</span>
              </button>

              {/* In-Call Box Breathing Tool */}
              {onOpenTacticalReset && (
                <button
                  onClick={onOpenTacticalReset}
                  className="px-3 py-2.5 rounded-2xl bg-[#efa02a]/20 hover:bg-[#efa02a]/30 text-[#efa02a] border border-[#efa02a]/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Wind className="w-4 h-4 text-[#efa02a]" />
                  <span>1-Min Reset</span>
                </button>
              )}
            </div>

            {/* End Call Button */}
            <button
              onClick={() => {
                stopCamera();
                setIsInCall(false);
              }}
              className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Conclude Session</span>
            </button>
          </div>

          {/* In-Session Encrypted Notes Scratchpad */}
          <div className="p-4 bg-[#1E1E1E] border-t border-[#2E2E2E]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#D2CBBB] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#1d9f76]" />
                <span>Confidential Personal Takeaways &amp; Recovery Plan (Stored Locally Only)</span>
              </span>
              {isNotesSaved && (
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Encrypted to Local Storage</span>
                </span>
              )}
            </div>
            <textarea
              rows={2}
              value={clinicalNotes}
              onChange={(e) => {
                setClinicalNotes(e.target.value);
                setIsNotesSaved(false);
              }}
              placeholder="Record Doctor's guidance, sleep schedule notes, or prescribed decompression ritual..."
              className="w-full text-xs rounded-xl bg-black/60 border border-[#2E2E2E] text-[#F4EFE4] p-2.5 focus:outline-none focus:ring-1 focus:ring-[#1d9f76]"
            />
            <div className="flex justify-end mt-1.5">
              <button
                onClick={() => setIsNotesSaved(true)}
                className="px-3 py-1 rounded-full bg-[#2E2E2E] hover:bg-[#3E3E3E] text-[#D2CBBB] text-[11px] font-medium transition-colors cursor-pointer"
              >
                Save Encrypted Note
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Main Appointments & Roster View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Specialists Roster */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-base font-serif text-[#1E1E1E] tracking-tight">
                  Medical Officers &amp; Trauma Specialists
                </h3>
                <p className="text-xs text-[#5E5A52]">
                  Direct confidential access without commander authorization
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1d9f76]/20 text-[#0f7058] border border-[#1d9f76]/30 font-bold">
                100% Free
              </span>
            </div>

            <div className="space-y-3">
              {specialists.map((spec) => {
                const isSelected = selectedSpecialist === spec.id;
                return (
                  <div
                    key={spec.id}
                    onClick={() => setSelectedSpecialist(spec.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#E3DDCF] border-[#1d9f76] shadow-sm'
                        : 'bg-[#F4EFE4] hover:bg-[#E3DDCF]/60 border-[#D2CBBB]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${
                            isSelected
                              ? 'bg-[#1d9f76] text-white'
                              : 'bg-[#1d9f76]/20 text-[#0f7058] border border-[#1d9f76]/30'
                          }`}
                        >
                          {spec.avatarInitials}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-bold text-[#1E1E1E]">{spec.name}</h4>
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-[#1d9f76]" />
                            )}
                          </div>
                          <div className="text-xs text-[#0f7058] font-semibold">{spec.role}</div>
                          <div className="text-[11px] text-[#5E5A52] mt-0.5">{spec.qualification}</div>
                          <p className="text-xs text-[#5E5A52] mt-2 leading-relaxed">
                            {spec.bio}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#D2CBBB] flex items-center justify-between text-[11px]">
                      <span className="text-[#0f7058] font-medium font-mono">{spec.availability}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSpecialist(spec.id);
                        }}
                        className="text-xs font-bold text-[#1d9f76] hover:underline"
                      >
                        Select Specialist
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Book Appointment & Upcoming Sessions */}
        <div className="lg:col-span-5 space-y-4">
          {/* Booking Form */}
          <div className="bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#D2CBBB] pb-3">
              <h3 className="font-bold text-sm font-serif text-[#1E1E1E] flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#1d9f76]" />
                <span>Book Confidential Session</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E3DDCF] text-[#5E5A52] border border-[#D2CBBB]">
                Zero Paperwork
              </span>
            </div>

            {bookingConfirmed && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Session successfully booked &amp; encrypted. Link active below.</span>
              </div>
            )}

            <form onSubmit={handleBookAppointment} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#1E1E1E] mb-1">
                  Selected Specialist
                </label>
                <div className="p-2.5 bg-[#E3DDCF] rounded-xl border border-[#D2CBBB] text-xs font-medium text-[#1E1E1E]">
                  {specialists.find((s) => s.id === selectedSpecialist)?.name}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-[#1E1E1E] mb-1">Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full text-xs rounded-xl bg-[#E3DDCF] border border-[#D2CBBB] p-2 text-[#1E1E1E] focus:outline-none focus:ring-1 focus:ring-[#1d9f76]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E1E1E] mb-1">Time Slot</label>
                  <select
                    value={bookingSlot}
                    onChange={(e) => setBookingSlot(e.target.value)}
                    className="w-full text-xs rounded-xl bg-[#E3DDCF] border border-[#D2CBBB] p-2 text-[#1E1E1E] focus:outline-none focus:ring-1 focus:ring-[#1d9f76]"
                  >
                    <option value="10:00 HRS">10:00 HRS</option>
                    <option value="12:00 HRS">12:00 HRS</option>
                    <option value="14:30 HRS">14:30 HRS</option>
                    <option value="16:00 HRS">16:00 HRS</option>
                    <option value="18:30 HRS">18:30 HRS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E1E1E] mb-1">Session Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingType('Video Consultation')}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      bookingType === 'Video Consultation'
                        ? 'bg-[#1d9f76] text-white border-[#1d9f76]'
                        : 'bg-[#E3DDCF] text-[#5E5A52] border-[#D2CBBB]'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Video Call</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBookingType('Confidential Audio Call')}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      bookingType === 'Confidential Audio Call'
                        ? 'bg-[#1d9f76] text-white border-[#1d9f76]'
                        : 'bg-[#E3DDCF] text-[#5E5A52] border-[#D2CBBB]'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Audio Only</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E1E1E] mb-1">
                  Confidential Clinical Focus
                </label>
                <input
                  type="text"
                  value={bookingReason}
                  onChange={(e) => setBookingReason(e.target.value)}
                  placeholder="e.g. Patrol decompression, insomnia, anxiety..."
                  className="w-full text-xs rounded-xl bg-[#E3DDCF] border border-[#D2CBBB] p-2 text-[#1E1E1E] focus:outline-none focus:ring-1 focus:ring-[#1d9f76]"
                />
              </div>

              <div className="p-2.5 bg-[#E3DDCF] rounded-xl border border-[#D2CBBB] text-[11px] text-[#5E5A52] flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-[#1d9f76] shrink-0" />
                <span>Statutory privilege protects this appointment from command notice.</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-[#1d9f76] hover:bg-[#0f7058] text-white font-bold text-xs transition-all shadow-sm cursor-pointer"
              >
                Confirm Confidential Booking
              </button>
            </form>
          </div>

          {/* Upcoming Active Sessions Card */}
          <div className="bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-sm font-serif text-[#1E1E1E]">Active Appointments</h3>
            {appointments.length > 0 ? (
              appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-3.5 rounded-2xl bg-[#E3DDCF] border border-[#D2CBBB] space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#1E1E1E]">{apt.specialistName}</div>
                      <div className="text-[10px] text-[#5E5A52]">{apt.specialistRole}</div>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {apt.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#0f7058] font-mono">
                    <span>{apt.date} &bull; {apt.time}</span>
                    <span>{apt.type}</span>
                  </div>

                  <button
                    onClick={() => setIsInCall(true)}
                    className="w-full py-2 rounded-full bg-[#1d9f76] hover:bg-[#0f7058] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Enter Live Video Room Now</span>
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#5E5A52]">No upcoming appointments booked.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
