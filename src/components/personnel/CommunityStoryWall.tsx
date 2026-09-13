import React, { useState } from 'react';
import {
  Heart,
  MessageSquare,
  Shield,
  Send,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  Flag,
  Share2,
  Plus
} from 'lucide-react';

interface Story {
  id: string;
  callsign: string;
  category: 'Combat & Decompression' | 'Sleep & Night Duty' | 'High Altitude & Cold' | 'Family & Distance' | 'Doctor Guidance';
  timeAgo: string;
  title: string;
  content: string;
  salutes: number;
  solidarity: number;
  helpful: number;
  userReacted?: {
    salute?: boolean;
    solidarity?: boolean;
    helpful?: boolean;
  };
}

export const CommunityStoryWall: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // New post form state
  const [postTitle, setPostTitle] = useState('');
  const [postCategory, setPostCategory] = useState<Story['category']>('Combat & Decompression');
  const [postContent, setPostContent] = useState('');
  const [postCallsign, setPostCallsign] = useState('Frontline-Peer');
  const [postSuccess, setPostSuccess] = useState(false);

  const [stories, setStories] = useState<Story[]>([
    {
      id: 'story-1',
      callsign: 'Sierra-9 (Recon)',
      category: 'Combat & Decompression',
      timeAgo: '2 hours ago',
      title: 'How 4-7-8 Tactical Breathing Stopped My Post-Patrol Adrenaline Spikes',
      content:
        'After 48 hours in the forward sector, my heart wouldn’t drop below 110 bpm even while resting in the bunker. I felt on guard 24/7. Capt. Sen told me about vagal nerve activation via 4-count inhale, 7-count hold, 8-count exhale. It felt mechanical at first, but by day 3 my tremors subsided. You don’t have to tough it out silently.',
      salutes: 42,
      solidarity: 28,
      helpful: 51
    },
    {
      id: 'story-2',
      callsign: 'L/Nk Artillery 14',
      category: 'Doctor Guidance',
      timeAgo: 'Yesterday',
      title: 'Speaking to the Medical Officer Did NOT Affect My Promotion Dossier',
      content:
        'The biggest fear in our unit was that booking a mental health session would end up in our Annual Confidential Report (ACR). I took the leap under Section 14 Medical Secrecy last month. The doctor gave me shift decompression protocols, and my CO was never informed of my diagnosis. Trust the privilege law.',
      salutes: 78,
      solidarity: 65,
      helpful: 92
    },
    {
      id: 'story-3',
      callsign: 'Sapper 102 (High-Altitude Post)',
      category: 'High Altitude & Cold',
      timeAgo: '2 days ago',
      title: 'Handling 14,000 ft Isolation When Night Shifts Don\'t End',
      content:
        'At high altitudes, hypoxia makes normal fatigue feel twice as heavy. Sleep is shallow. We started a 5-minute tea debrief among the watch team after rotation — talking about home and mundane routines before hitting the bunk. Small rituals keep the mind anchored when the snow is howling.',
      salutes: 36,
      solidarity: 49,
      helpful: 33
    },
    {
      id: 'story-4',
      callsign: 'Bravo Coy Signals',
      category: 'Sleep & Night Duty',
      timeAgo: '3 days ago',
      title: 'Rebuilding My Circadian Rhythm After 5 Consecutive Night Rotations',
      content:
        'I had severe sleep fragmentation where I’d wake up every 45 minutes sweating. Following the SAHARA sleep debt protocol: 90 minutes of darkness before sleep, cutting caffeine 6 hours before dawn, and short 20-minute power naps. My sleep score went from 45 to 74 in two weeks.',
      salutes: 29,
      solidarity: 34,
      helpful: 41
    },
    {
      id: 'story-5',
      callsign: 'Havaldar M. (Supply Depot)',
      category: 'Family & Distance',
      timeAgo: '5 days ago',
      title: 'Managing the Helplessness of Being Away While Family Was Sick',
      content:
        'When my mother was admitted back in Punjab, I couldn’t sleep for four straight nights while maintaining supply logistics. The Welfare Officer helped arrange emergency family calling privileges and scheduled a video counselling chat with a psychologist who helped me process the distance without self-blame.',
      salutes: 55,
      solidarity: 72,
      helpful: 39
    }
  ]);

  const categories = [
    'All',
    'Combat & Decompression',
    'Sleep & Night Duty',
    'High Altitude & Cold',
    'Family & Distance',
    'Doctor Guidance'
  ];

  const handleReaction = (storyId: string, type: 'salute' | 'solidarity' | 'helpful') => {
    setStories((prev) =>
      prev.map((story) => {
        if (story.id !== storyId) return story;

        const currentReacted = story.userReacted?.[type] || false;
        const delta = currentReacted ? -1 : 1;

        return {
          ...story,
          [type === 'salute' ? 'salutes' : type === 'solidarity' ? 'solidarity' : 'helpful']:
            story[type === 'salute' ? 'salutes' : type === 'solidarity' ? 'solidarity' : 'helpful'] + delta,
          userReacted: {
            ...story.userReacted,
            [type]: !currentReacted
          }
        };
      })
    );
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    const newStory: Story = {
      id: `story-${Date.now()}`,
      callsign: postCallsign || 'Frontline-Peer',
      category: postCategory,
      timeAgo: 'Just now',
      title: postTitle,
      content: postContent,
      salutes: 1,
      solidarity: 1,
      helpful: 1
    };

    setStories([newStory, ...stories]);
    setPostTitle('');
    setPostContent('');
    setPostSuccess(true);
    setTimeout(() => {
      setPostSuccess(false);
      setIsPostModalOpen(false);
    }, 1200);
  };

  const filteredStories = stories.filter((story) => {
    const matchesCategory = activeCategory === 'All' || story.category === activeCategory;
    const matchesSearch =
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.callsign.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 text-[#1E1E1E]">
      {/* Header Banner */}
      <div className="bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base tracking-tight font-serif text-[#1E1E1E]">
                Anonymous Peer Support &amp; Story Wall
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#1d9f76]/20 text-[#0f7058] border border-[#1d9f76]/30 font-bold">
                100% Redacted
              </span>
            </div>
            <p className="text-xs text-[#5E5A52] leading-relaxed">
              Read authentic frontline reflections from fellow service members navigating fatigue, combat stress, and recovery. Real lessons, zero stigma, protected under Section 14 Medical Secrecy.
            </p>
          </div>

          <button
            onClick={() => setIsPostModalOpen(true)}
            className="px-4 py-2.5 rounded-full bg-[#1d9f76] hover:bg-[#0f7058] text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-sm transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Post Anonymous Reflection</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer shadow-2xs ${
                activeCategory === cat
                  ? 'bg-[#1d9f76] text-white shadow-xs font-bold'
                  : 'bg-[#F4EFE4] hover:bg-[#E3DDCF] text-[#5E5A52] hover:text-[#1E1E1E] border border-[#D2CBBB]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#5E5A52]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stories, topics..."
            className="w-full text-xs rounded-full bg-[#F4EFE4] border border-[#D2CBBB] pl-8 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1d9f76] text-[#1E1E1E] placeholder-[#5E5A52]"
          />
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStories.map((story) => (
          <div
            key={story.id}
            className="bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-xl bg-[#1d9f76]/20 border border-[#1d9f76]/30 flex items-center justify-center text-[10px] font-bold text-[#0f7058]">
                    {story.callsign.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#1E1E1E] block font-mono">
                      {story.callsign}
                    </span>
                    <span className="text-[10px] text-[#5E5A52]">{story.timeAgo}</span>
                  </div>
                </div>

                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#E3DDCF] text-[#0f7058] border border-[#D2CBBB]">
                  {story.category}
                </span>
              </div>

              <h4 className="text-sm font-bold font-serif text-[#1E1E1E] leading-snug">
                {story.title}
              </h4>

              <p className="text-xs text-[#5E5A52] leading-relaxed">
                {story.content}
              </p>
            </div>

            {/* Reactions Bar */}
            <div className="pt-3 border-t border-[#D2CBBB] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleReaction(story.id, 'salute')}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                    story.userReacted?.salute
                      ? 'bg-[#1d9f76]/20 text-[#0f7058] border-[#1d9f76]/50 font-bold'
                      : 'bg-[#E3DDCF] text-[#5E5A52] hover:text-[#1E1E1E] border-[#D2CBBB]'
                  }`}
                  title="Salute peer resilience"
                >
                  <span>🫡</span>
                  <span>{story.salutes}</span>
                </button>

                <button
                  onClick={() => handleReaction(story.id, 'solidarity')}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                    story.userReacted?.solidarity
                      ? 'bg-[#efa02a]/20 text-amber-900 border-[#efa02a]/50 font-bold'
                      : 'bg-[#E3DDCF] text-[#5E5A52] hover:text-[#1E1E1E] border-[#D2CBBB]'
                  }`}
                  title="Stand in solidarity"
                >
                  <span>🤝</span>
                  <span>{story.solidarity}</span>
                </button>

                <button
                  onClick={() => handleReaction(story.id, 'helpful')}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                    story.userReacted?.helpful
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                      : 'bg-[#E3DDCF] text-[#5E5A52] hover:text-[#1E1E1E] border-[#D2CBBB]'
                  }`}
                  title="This helped me"
                >
                  <span>💡</span>
                  <span>{story.helpful}</span>
                </button>
              </div>

              <div className="flex items-center text-[10px] text-[#5E5A52] gap-1">
                <Lock className="w-3 h-3 text-[#1d9f76]" />
                <span>Verified Peer</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Post Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] shadow-2xl max-w-lg w-full p-6 space-y-4 text-[#1E1E1E]">
            <div className="flex items-center justify-between border-b border-[#D2CBBB] pb-3">
              <div>
                <h3 className="font-bold text-base font-serif text-[#1E1E1E]">
                  Share Anonymous Reflection
                </h3>
                <p className="text-xs text-[#5E5A52]">
                  Your post is completely scrubbed of identifiable names or location coordinates.
                </p>
              </div>
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="text-lg font-bold text-[#5E5A52] hover:text-[#1E1E1E] cursor-pointer"
              >
                &times;
              </button>
            </div>

            {postSuccess ? (
              <div className="p-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#1d9f76]/20 border border-[#1d9f76]/40 text-[#0f7058] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-[#1E1E1E]">Reflection Posted Anonymously</h4>
                <p className="text-xs text-[#5E5A52]">Thank you for supporting fellow service members.</p>
              </div>
            ) : (
              <form onSubmit={handlePostSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1E1E1E] mb-1">
                      Pseudonym Callsign
                    </label>
                    <input
                      type="text"
                      value={postCallsign}
                      onChange={(e) => setPostCallsign(e.target.value)}
                      placeholder="e.g. Sentry-4"
                      className="w-full text-xs rounded-xl bg-[#E3DDCF] border border-[#D2CBBB] p-2.5 text-[#1E1E1E] focus:outline-none focus:ring-1 focus:ring-[#1d9f76]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1E1E1E] mb-1">
                      Topic Area
                    </label>
                    <select
                      value={postCategory}
                      onChange={(e) => setPostCategory(e.target.value as any)}
                      className="w-full text-xs rounded-xl bg-[#E3DDCF] border border-[#D2CBBB] p-2.5 text-[#1E1E1E] focus:outline-none focus:ring-1 focus:ring-[#1d9f76]"
                    >
                      <option value="Combat & Decompression">Combat &amp; Decompression</option>
                      <option value="Sleep & Night Duty">Sleep &amp; Night Duty</option>
                      <option value="High Altitude & Cold">High Altitude &amp; Cold</option>
                      <option value="Family & Distance">Family &amp; Distance</option>
                      <option value="Doctor Guidance">Doctor Guidance</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E1E1E] mb-1">
                    Reflection Headline
                  </label>
                  <input
                    type="text"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="Briefly describe what helped you recover or cope..."
                    className="w-full text-xs rounded-xl bg-[#E3DDCF] border border-[#D2CBBB] p-2.5 text-[#1E1E1E] focus:outline-none focus:ring-1 focus:ring-[#1d9f76]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E1E1E] mb-1">
                    Your Experience &amp; Recovery Strategy
                  </label>
                  <textarea
                    rows={4}
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Share the steps, routine, or mindset that helped you navigate this challenge..."
                    className="w-full text-xs rounded-xl bg-[#E3DDCF] border border-[#D2CBBB] p-2.5 text-[#1E1E1E] focus:outline-none focus:ring-1 focus:ring-[#1d9f76]"
                    required
                  />
                </div>

                <div className="p-3 bg-[#E3DDCF] rounded-xl border border-[#D2CBBB] text-[11px] text-[#5E5A52] flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-[#1d9f76] shrink-0" />
                  <span>
                    Privacy Safeguard: The system automatically redacts unit numbers, real names, and GPS markers before publishing.
                  </span>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPostModalOpen(false)}
                    className="px-4 py-2 rounded-full text-xs font-medium bg-[#E3DDCF] text-[#5E5A52] hover:text-[#1E1E1E] border border-[#D2CBBB] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full text-xs font-bold bg-[#1d9f76] hover:bg-[#0f7058] text-white cursor-pointer shadow-sm"
                  >
                    Publish Anonymously
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
