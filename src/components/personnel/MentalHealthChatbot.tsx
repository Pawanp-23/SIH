import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  Shield,
  Wind,
  Video,
  BookOpen,
  MessageSquare,
  AlertCircle,
  RefreshCw,
  Heart,
  UserCheck
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionTag?: 'breathing' | 'video' | 'stories' | 'privacy';
}

interface MentalHealthChatbotProps {
  onOpenTacticalReset?: () => void;
  onOpenVideoCounselling?: () => void;
  onOpenStoryWall?: () => void;
  onOpenPrivacy?: () => void;
}

export const MentalHealthChatbot: React.FC<MentalHealthChatbotProps> = ({
  onOpenTacticalReset,
  onOpenVideoCounselling,
  onOpenStoryWall,
  onOpenPrivacy
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: 'Namaste and welcome. I am your confidential SAHARA Mental Health Support Assistant. Everything you share here is protected under Section 14 Medical Privilege — never shared with chain-of-command or recorded in conduct dossiers. How are you feeling today after your recent duties?',
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const quickPrompts = [
    'I haven\'t slept after 3 night shifts',
    'Feeling anxious and hyper-vigilant after patrol',
    'Is this conversation private from my CO?',
    'Guide me through a quick calming decompression',
    'Can I talk to a military doctor confidentially?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setSpeechError(null);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsListening(false);
          if (event.error !== 'no-speech') {
            setSpeechError('Microphone input interrupted. You can still type below.');
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Speech recognition initialization error:', err);
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setSpeechError('Voice input is not supported in this browser. Please use text.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        setSpeechError(null);
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Error starting speech recognition:', err);
        setIsListening(false);
      }
    }
  };

  const speakText = (text: string) => {
    if (!isSpeakingEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // AI Cognitive Triage Engine
    setTimeout(() => {
      const response = generateAIResponse(query);
      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionTag: response.actionTag
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
      speakText(response.text);
    }, 900);
  };

  const generateAIResponse = (input: string): { text: string; actionTag?: Message['actionTag'] } => {
    const q = input.toLowerCase();

    if (q.includes('privacy') || q.includes('co') || q.includes('command') || q.includes('retaliation') || q.includes('log') || q.includes('see this')) {
      return {
        text: 'You have 100% legal immunity under Section 14 Statutory Medical Secrecy. Your commanding officers only receive aggregate unit health averages (k ≥ 10 anonymity). Neither your search queries, feelings, nor chatbot interactions can ever be subpoenaed, viewed by unit clerks, or factored into Annual Confidential Reports (ACR).',
        actionTag: 'privacy'
      };
    }

    if (q.includes('sleep') || q.includes('insomnia') || q.includes('night shift') || q.includes('tired') || q.includes('fatigue')) {
      return {
        text: 'Severe sleep fragmentation is normal after night sentry rotations. Under SOP 4.2, circadian desynchrony impairs micro-reaction time by up to 34%. I recommend initiating a 48-hour restorative sleep protocol: 4-7-8 tactical box breathing, light-blocking eye shelter, and requesting non-punitive guard reassignment.',
        actionTag: 'breathing'
      };
    }

    if (q.includes('anxious') || q.includes('panic') || q.includes('stress') || q.includes('edge') || q.includes('calm') || q.includes('heart')) {
      return {
        text: 'Take a deep breath with me right now. Your nervous system is currently in tactical sympathetic overdrive (fight-or-flight). That is a natural combat reflex, but your body needs to downregulate. Let\'s do a 1-Minute Box Breathing session together to reset your vagus nerve and slow your pulse.',
        actionTag: 'breathing'
      };
    }

    if (q.includes('doctor') || q.includes('counsel') || q.includes('appointment') || q.includes('psychiatrist') || q.includes('talk')) {
      return {
        text: 'You can meet directly with Capt. (Dr.) Ananya Sen (AMC Psychiatrist) or Maj. Vikram Joshi through a 100% confidential, peer-encrypted video session right inside this portal. No paperwork or commander permission is needed.',
        actionTag: 'video'
      };
    }

    if (q.includes('alone') || q.includes('others') || q.includes('story') || q.includes('peer') || q.includes('community')) {
      return {
        text: 'You are never alone on this front. Over 400 service members have posted anonymous reflections on our Community Story Wall about coping with high-altitude watch, separation from family, and recovery wins.',
        actionTag: 'stories'
      };
    }

    return {
      text: 'I hear you. Balancing demanding military duty with physical and emotional health is deeply challenging. I am here 24/7 to listen, guide your recovery pacing, or connect you with our medical officers in complete confidence. Would you like to try a short breathing reset or review recovery recommendations?',
      actionTag: 'breathing'
    };
  };

  return (
    <div className="bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] shadow-md flex flex-col h-[640px] overflow-hidden text-[#1E1E1E]">
      {/* Top Chat Header */}
      <div className="p-4 bg-[#E3DDCF] border-b border-[#D2CBBB] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#1d9f76]/20 border border-[#1d9f76]/40 flex items-center justify-center text-[#0f7058] shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold font-serif text-[#1E1E1E]">SAHARA Care AI</h3>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#1d9f76]/20 text-[#0f7058] border border-[#1d9f76]/30 font-bold">
                Voice &amp; Text
              </span>
            </div>
            <p className="text-[11px] text-[#5E5A52] flex items-center gap-1">
              <Shield className="w-3 h-3 text-[#1d9f76]" />
              <span>Section 14 Medical Secrecy &bull; 24/7 Decompression Companion</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Audio Playback Toggle */}
          <button
            onClick={() => {
              if (isSpeakingEnabled) window.speechSynthesis?.cancel();
              setIsSpeakingEnabled(!isSpeakingEnabled);
            }}
            className={`p-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
              isSpeakingEnabled
                ? 'bg-[#1d9f76]/15 text-[#0f7058] border-[#1d9f76]/30'
                : 'bg-[#F4EFE4] text-[#5E5A52] border-[#D2CBBB]'
            }`}
            title={isSpeakingEnabled ? 'Voice responses active' : 'Voice responses muted'}
          >
            {isSpeakingEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2.5 bg-[#e9e4d8] border-b border-[#D2CBBB] overflow-x-auto flex items-center gap-2 scrollbar-none">
        <span className="text-[10px] font-mono text-[#5E5A52] shrink-0 font-bold uppercase">Topics:</span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="text-[11px] font-medium px-3 py-1 rounded-full bg-[#F4EFE4] hover:bg-[#1d9f76]/10 text-[#1E1E1E] hover:text-[#0f7058] border border-[#D2CBBB] whitespace-nowrap shrink-0 transition-all cursor-pointer shadow-2xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FAF8F5]">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                  isUser
                    ? 'bg-[#1d9f76] text-white rounded-tr-none'
                    : 'bg-[#F4EFE4] text-[#1E1E1E] border border-[#D2CBBB] rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Contextual Action Button */}
                {!isUser && msg.actionTag && (
                  <div className="mt-3 pt-2.5 border-t border-[#D2CBBB]/60 flex flex-wrap gap-2">
                    {msg.actionTag === 'breathing' && onOpenTacticalReset && (
                      <button
                        onClick={onOpenTacticalReset}
                        className="px-3 py-1.5 rounded-full bg-[#efa02a] hover:bg-[#efa02a]/90 text-[#1E1E1E] font-bold text-[11px] flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                      >
                        <Wind className="w-3.5 h-3.5 text-[#1E1E1E]" />
                        <span>Start 1-Min Box Breathing</span>
                      </button>
                    )}

                    {msg.actionTag === 'video' && onOpenVideoCounselling && (
                      <button
                        onClick={onOpenVideoCounselling}
                        className="px-3 py-1.5 rounded-full bg-[#1d9f76] hover:bg-[#0f7058] text-white font-bold text-[11px] flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Launch Confidential Video Session</span>
                      </button>
                    )}

                    {msg.actionTag === 'stories' && onOpenStoryWall && (
                      <button
                        onClick={onOpenStoryWall}
                        className="px-3 py-1.5 rounded-full bg-[#0f7058] hover:bg-[#1d9f76] text-white font-bold text-[11px] flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Open Community Story Wall</span>
                      </button>
                    )}

                    {msg.actionTag === 'privacy' && onOpenPrivacy && (
                      <button
                        onClick={onOpenPrivacy}
                        className="px-3 py-1.5 rounded-full bg-[#E3DDCF] hover:bg-[#D2CBBB] text-[#1E1E1E] font-bold text-[11px] flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                      >
                        <Shield className="w-3.5 h-3.5 text-[#0f7058]" />
                        <span>Review Section 14 Certificate</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-[#5E5A52] font-mono mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center space-x-2 text-xs text-[#5E5A52] p-2 bg-[#F4EFE4] border border-[#D2CBBB] rounded-2xl w-fit">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#1d9f76]" />
            <span>SAHARA AI is formulating gentle clinical guidance...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Listening State Banner */}
      {isListening && (
        <div className="px-4 py-2 bg-[#efa02a]/15 border-t border-[#efa02a]/30 text-xs font-semibold text-[#1E1E1E] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#efa02a] animate-ping" />
            <span>Listening to your voice... speak naturally.</span>
          </div>
          <button
            onClick={toggleListening}
            className="text-[11px] underline text-[#0f7058] hover:text-[#1d9f76] cursor-pointer"
          >
            Done
          </button>
        </div>
      )}

      {speechError && (
        <div className="px-4 py-1.5 bg-rose-50 border-t border-rose-200 text-rose-800 text-[11px] flex items-center justify-between">
          <span>{speechError}</span>
          <button onClick={() => setSpeechError(null)} className="font-bold ml-2 cursor-pointer">
            &times;
          </button>
        </div>
      )}

      {/* Input Form with Voice & Text */}
      <div className="p-3 bg-[#E3DDCF] border-t border-[#D2CBBB]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Microphone Toggle Button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`p-3 rounded-2xl border transition-all cursor-pointer shrink-0 shadow-xs ${
              isListening
                ? 'bg-[#efa02a] text-[#1E1E1E] border-[#efa02a] ring-2 ring-[#efa02a]/50 animate-pulse'
                : 'bg-[#F4EFE4] hover:bg-[#D2CBBB] text-[#0f7058] border-[#D2CBBB]'
            }`}
            title={isListening ? 'Stop listening' : 'Speak your question'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your reflection or ask a confidential question..."
            className="flex-1 text-xs sm:text-sm rounded-2xl bg-[#F4EFE4] border border-[#D2CBBB] text-[#1E1E1E] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1d9f76] focus:border-transparent placeholder-[#5E5A52]"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-3 rounded-2xl bg-[#1d9f76] hover:bg-[#0f7058] disabled:opacity-50 text-white transition-all cursor-pointer shrink-0 shadow-sm"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
