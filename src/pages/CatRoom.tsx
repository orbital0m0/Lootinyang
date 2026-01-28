import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks';

interface Item {
  id: string;
  name: string;
  icon: string;
  category: 'clothes' | 'hat' | 'necklace' | 'toy' | 'glasses';
  unlocked: boolean;
  equipped?: boolean;
}

const CAT_ITEMS: Item[] = [
  { id: 'scarf1', name: '빨간 스카프', icon: '🧣', category: 'clothes', unlocked: true, equipped: true },
  { id: 'hat1', name: '밀짚모자', icon: '👒', category: 'hat', unlocked: true },
  { id: 'neck1', name: '빨간 목도리', icon: '🎀', category: 'necklace', unlocked: true },
  { id: 'lock1', name: '잠김', icon: '🔒', category: 'toy', unlocked: false },
  { id: 'glasses1', name: '노란 안경', icon: '🕶️', category: 'glasses', unlocked: true },
  { id: 'bell1', name: '방울', icon: '🔔', category: 'necklace', unlocked: true },
  { id: 'fish1', name: '생선 인형', icon: '🐟', category: 'toy', unlocked: true },
  { id: 'yarn1', name: '털실뭉치', icon: '🧶', category: 'toy', unlocked: true },
];

export function CatRoom() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'closet' | 'room'>('closet');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [items, setItems] = useState<Item[]>(CAT_ITEMS);
  const [coins] = useState(1250);
  const [nextBoxProgress] = useState(85);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const categories = [
    { id: 'all', label: '전체' },
    { id: 'hat', label: '모자' },
    { id: 'necklace', label: '목걸이' },
    { id: 'toy', label: '장난감' },
    { id: 'glasses', label: '안경' },
  ];

  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter(item => item.category === selectedCategory);

  const handleItemClick = (itemId: string) => {
    setItems(prevItems =>
      prevItems.map(item => ({
        ...item,
        equipped: item.id === itemId ? !item.equipped : item.equipped,
      }))
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light pb-[84px] page-enter">
      {/* Header */}
      <div className="flex items-center bg-transparent p-4 pb-2 justify-between">
        <button
          onClick={() => navigate(-1)}
          className="text-slate-800 flex size-12 shrink-0 items-center justify-start cursor-pointer"
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-tight flex-1 text-center">
          내 고양이와 방 꾸미기
        </h2>
        <div className="flex w-12 items-center justify-end">
          <button className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white/50 text-highlight">
            <span className="material-symbols-outlined">shopping_bag</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-bold text-slate-500">다음 상자까지</span>
          <span className="text-[11px] font-bold text-highlight">{nextBoxProgress}%</span>
        </div>
        <div className="w-full h-3 bg-white/40 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-highlight rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${nextBoxProgress}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>

      {/* Cat Display Area */}
      <div className="flex-grow flex flex-col items-center justify-center p-6 relative">
        <div className="w-full max-w-sm aspect-square relative rounded-xl bg-white/30 backdrop-blur-sm border-4 border-white/50 flex items-center justify-center overflow-hidden">
          {/* Cat Shadow */}
          <div className="absolute bottom-10 w-48 h-12 bg-highlight/20 rounded-[100%] blur-sm"></div>

          {/* Cat Character */}
          <motion.div
            className="relative w-48 h-48 flex items-center justify-center"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <div className="text-[120px]">🐱</div>
            {/* Equipped Items Display */}
            {items.filter(i => i.equipped).map(item => (
              <motion.span
                key={item.id}
                className="absolute text-3xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                  top: item.category === 'hat' ? '-10px' : '50%',
                  right: item.category === 'necklace' ? '-20px' : undefined,
                }}
              >
                {item.icon}
              </motion.span>
            ))}
          </motion.div>

          {/* Coins Display */}
          <div className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
            <span className="material-symbols-outlined text-highlight text-sm">potted_plant</span>
            <span className="text-sm font-bold text-slate-700">{coins.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="bg-white rounded-t-3xl shadow-2xl p-4">
        {/* Tab Switch */}
        <div className="flex px-2 py-3">
          <div className="tab-switch flex-1">
            <button
              onClick={() => setActiveTab('closet')}
              className={`tab-item ${activeTab === 'closet' ? 'active' : ''}`}
            >
              옷장
            </button>
            <button
              onClick={() => setActiveTab('room')}
              className={`tab-item ${activeTab === 'room' ? 'active' : ''}`}
            >
              방 꾸미기
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto px-2 py-2 hide-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`filter-pill ${selectedCategory === cat.id ? 'active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-4 gap-4 p-2 mt-2 h-48 overflow-y-auto hide-scrollbar">
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() => item.unlocked && handleItemClick(item.id)}
                  disabled={!item.unlocked}
                  className={`w-full aspect-square rounded-2xl flex items-center justify-center relative overflow-hidden p-2 transition-all ${
                    item.equipped
                      ? 'bg-highlight/10 border-2 border-highlight'
                      : item.unlocked
                      ? 'bg-slate-50 border-2 border-transparent hover:border-slate-200'
                      : 'bg-slate-50 border-2 border-transparent opacity-40'
                  }`}
                >
                  <span className={`text-3xl ${!item.unlocked ? 'blur-[1px]' : ''}`}>
                    {item.icon}
                  </span>
                  {item.equipped && (
                    <div className="absolute top-1 right-1 bg-highlight rounded-full size-4 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[10px] text-white font-bold">
                        check
                      </span>
                    </div>
                  )}
                  {!item.unlocked && (
                    <span className="material-symbols-outlined absolute text-slate-400">
                      lock
                    </span>
                  )}
                </button>
                <span className={`text-[10px] font-bold ${item.equipped ? 'text-highlight' : 'text-slate-400'}`}>
                  {item.equipped ? '착용 중' : item.name}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Save Button */}
        <div className="flex px-2 py-3 mt-2">
          <button className="btn-primary">
            스타일 저장하기
          </button>
        </div>
      </div>
    </div>
  );
}
