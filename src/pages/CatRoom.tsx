import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CuteCatIllustration } from '../components/CuteCatIllustration';
import { useUser } from '../hooks';

interface Item {
  id: string;
  name: string;
  icon: string;
  category: 'wallpaper' | 'floor' | 'furniture' | 'decoration';
  unlocked: boolean;
  position?: { x: number; y: number };
}

const categoryInfo = {
  all: { label: '전체', icon: '✨' },
  wallpaper: { label: '벽지', icon: '🏠' },
  floor: { label: '바닥', icon: '🪵' },
  furniture: { label: '가구', icon: '🛋️' },
  decoration: { label: '장식', icon: '🌸' },
};

export function CatRoom() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [items] = useState<Item[]>([
    { id: 'w1', name: '기본 벽지', icon: '🏠', category: 'wallpaper', unlocked: true },
    { id: 'w2', name: '별이 빛나는 밤', icon: '🌙', category: 'wallpaper', unlocked: false },
    { id: 'w3', name: '청명한 하늘', icon: '☁️', category: 'wallpaper', unlocked: false },
    { id: 'f1', name: '기본 바닥', icon: '🟫', category: 'floor', unlocked: true },
    { id: 'f2', name: '나무 바닥', icon: '🪵', category: 'floor', unlocked: true },
    { id: 'f3', name: '카펫', icon: '🟤', category: 'floor', unlocked: false },
    { id: 'fu1', name: '작은 베개', icon: '🛋️', category: 'furniture', unlocked: true },
    { id: 'fu2', name: '장난감 상자', icon: '📦', category: 'furniture', unlocked: false },
    { id: 'fu3', name: '야옹이 타워', icon: '🗼', category: 'furniture', unlocked: false },
    { id: 'd1', name: '작은 꽃', icon: '🌸', category: 'decoration', unlocked: true },
    { id: 'd2', name: '반짝이 별', icon: '⭐', category: 'decoration', unlocked: false },
    { id: 'd3', name: '장난감', icon: '🧸', category: 'decoration', unlocked: false },
  ]);

  const [activeTab, setActiveTab] = useState<'room' | 'inventory'>('room');
  const [selectedCategory, setSelectedCategory] = useState<Item['category'] | 'all'>('all');
  const [placedItems, setPlacedItems] = useState<Item[]>([
    { id: 'w1', name: '기본 벽지', icon: '🏠', category: 'wallpaper', unlocked: true, position: { x: 0, y: 0 } },
    { id: 'f1', name: '기본 바닥', icon: '🟫', category: 'floor', unlocked: true, position: { x: 0, y: 0 } },
    { id: 'fu1', name: '작은 베개', icon: '🛋️', category: 'furniture', unlocked: true, position: { x: 150, y: 200 } },
    { id: 'd1', name: '작은 꽃', icon: '🌸', category: 'decoration', unlocked: true, position: { x: 50, y: 180 } },
  ]);

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [draggedItem, setDraggedItem] = useState<Item | null>(null);
  const [catReaction, setCatReaction] = useState<'happy' | 'love' | 'normal'>('normal');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleItemClick = (item: Item) => {
    if (activeTab === 'inventory' && item.unlocked) {
      setSelectedItem(item);
    }
  };

  const handleDragStart = (item: Item) => {
    if (item.category === 'wallpaper' || item.category === 'floor') return;
    setDraggedItem(item);
  };

  const handleDragEnd = (event: React.DragEvent) => {
    if (!draggedItem) return;
    const roomRect = (event.target as HTMLElement).closest('.room-container')?.getBoundingClientRect();
    if (!roomRect) return;
    const x = event.clientX - roomRect.left - 25;
    const y = event.clientY - roomRect.top - 25;
    setPlacedItems(prev => {
      const exists = prev.find(i => i.id === draggedItem.id);
      if (exists) {
        return prev.map(i => i.id === draggedItem.id ? { ...i, position: { x, y } } : i);
      }
      return [...prev, { ...draggedItem, position: { x, y } }];
    });
    setDraggedItem(null);
  };

  const handlePlaceItem = () => {
    if (!selectedItem) return;
    const exists = placedItems.find(i => i.id === selectedItem.id);
    if (!exists) {
      setPlacedItems(prev => [...prev, { ...selectedItem, position: { x: 100, y: 200 } }]);
    }
    setSelectedItem(null);
  };

  const handleRemoveItem = (itemId: string) => {
    if (itemId === 'w1' || itemId === 'f1') return;
    setPlacedItems(prev => prev.filter(i => i.id !== itemId));
  };

  const handleCatClick = () => {
    const reactions: Array<'happy' | 'love'> = ['happy', 'love'];
    setCatReaction(reactions[Math.floor(Math.random() * reactions.length)]);
    setTimeout(() => setCatReaction('normal'), 2000);
  };

  const filteredItems = items.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const unlockedCount = items.filter(i => i.unlocked).length;

  return (
    <div className="min-h-screen pb-24 page-enter">
      {/* 헤더 */}
      <motion.div
        className="pt-6 pb-4 px-5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.span
              className="text-4xl"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              🏠
            </motion.span>
            <div>
              <h2 className="font-display text-2xl text-cozy-brown-dark">고양이 방</h2>
              <p className="text-sm text-cozy-brown font-body">
                아이템으로 방을 꾸며보세요!
              </p>
            </div>
          </div>
          <div className="stat-box py-2 px-4">
            <div className="stat-value text-lg">{unlockedCount}</div>
            <div className="stat-label">보유 아이템</div>
          </div>
        </div>
      </motion.div>

      {/* 탭 전환 */}
      <div className="px-4 mb-4">
        <motion.div
          className="flex bg-cozy-cream rounded-2xl p-1 border-3 border-cozy-brown-light"
          style={{ borderWidth: '3px' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.button
            onClick={() => setActiveTab('room')}
            className={`flex-1 py-3 px-4 rounded-xl font-heading font-semibold text-sm transition-all ${
              activeTab === 'room'
                ? 'bg-cozy-sage text-white shadow-md'
                : 'text-cozy-brown hover:bg-cozy-paper'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            <span className="mr-1">🏠</span> 방 보기
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 py-3 px-4 rounded-xl font-heading font-semibold text-sm transition-all ${
              activeTab === 'inventory'
                ? 'bg-cozy-mustard text-white shadow-md'
                : 'text-cozy-brown hover:bg-cozy-paper'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            <span className="mr-1">📦</span> 아이템
          </motion.button>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'room' ? (
          <motion.div
            key="room"
            className="px-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {/* 방 컨테이너 - Cozy Game Style */}
            <motion.div
              className="room-container relative rounded-3xl overflow-hidden border-4 border-cozy-brown"
              style={{
                height: '480px',
                background: 'linear-gradient(180deg, #FDF6E9 0%, #F5E6D3 50%, #E8D5C4 100%)',
                boxShadow: '0 8px 0 var(--cozy-brown-dark), var(--shadow-cozy-lg)',
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDragEnd}
            >
              {/* 방 배경 장식 */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 left-4 text-3xl opacity-30">🌿</div>
                <div className="absolute top-4 right-4 text-3xl opacity-30">🌿</div>
                <div className="absolute bottom-20 left-8 text-2xl opacity-40">🌱</div>
                <div className="absolute bottom-24 right-12 text-2xl opacity-40">🌱</div>
              </div>

              {/* 창문 */}
              <motion.div
                className="absolute top-8 left-1/2 transform -translate-x-1/2 w-24 h-20 bg-gradient-to-b from-game-exp to-cozy-sage-light rounded-xl border-4 border-cozy-brown flex items-center justify-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-3xl">☀️</span>
              </motion.div>

              {/* 배치된 아이템들 */}
              {placedItems.map((item) => {
                const isBackground = item.category === 'wallpaper' || item.category === 'floor';
                if (isBackground) return null;

                return (
                  <motion.div
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(item)}
                    className="absolute cursor-move"
                    style={{ left: item.position?.x, top: item.position?.y }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.15, zIndex: 10 }}
                    whileDrag={{ scale: 1.2, zIndex: 20 }}
                  >
                    <div className="relative">
                      <span className="text-5xl drop-shadow-lg">{item.icon}</span>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveItem(item.id);
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-cozy-rose border-2 border-cozy-brown rounded-full text-white text-xs font-bold shadow-md"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        ✕
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}

              {/* 고양이 캐릭터 */}
              <motion.div
                className="absolute cursor-pointer"
                style={{ bottom: 80, left: '50%', transform: 'translateX(-50%)' }}
                animate={{
                  y: catReaction !== 'normal' ? [-15, 0, -15] : [0, -8, 0],
                  rotate: catReaction !== 'normal' ? [0, -8, 8, -8, 0] : 0,
                }}
                transition={{
                  duration: catReaction !== 'normal' ? 0.4 : 2.5,
                  repeat: catReaction !== 'normal' ? 3 : Infinity,
                  ease: 'easeInOut',
                }}
                onClick={handleCatClick}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <CuteCatIllustration size="md" animate={false} />
                <AnimatePresence>
                  {catReaction !== 'normal' && (
                    <motion.div
                      className="absolute -top-10 left-1/2 transform -translate-x-1/2"
                      initial={{ opacity: 0, y: 10, scale: 0.5 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.5 }}
                    >
                      <span className="text-3xl">
                        {catReaction === 'love' ? '💕' : '😻'}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* 바닥 라인 */}
              <div
                className="absolute bottom-0 left-0 right-0 h-20"
                style={{
                  background: 'linear-gradient(180deg, transparent 0%, rgba(139, 115, 85, 0.2) 100%)',
                }}
              />
            </motion.div>

            {/* 안내 메시지 */}
            <motion.div
              className="mt-4 card py-3 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-sm text-cozy-brown font-body">
                <span className="mr-2">💡</span>
                아이템을 드래그해서 배치하고, 고양이를 터치해보세요!
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="inventory"
            className="px-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {/* 카테고리 필터 */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-1 px-1">
              {(Object.keys(categoryInfo) as Array<keyof typeof categoryInfo>).map((cat) => (
                <motion.button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-heading font-semibold whitespace-nowrap transition-all border-3 ${
                    selectedCategory === cat
                      ? 'bg-cozy-orange text-white border-cozy-orange-dark shadow-md'
                      : 'bg-cozy-cream text-cozy-brown border-cozy-brown-light hover:border-cozy-orange'
                  }`}
                  style={{ borderWidth: '3px' }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{categoryInfo[cat].icon}</span>
                  <span>{categoryInfo[cat].label}</span>
                </motion.button>
              ))}
            </div>

            {/* 아이템 그리드 */}
            <div className="grid grid-cols-3 gap-3">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className={`relative p-4 text-center cursor-pointer transition-all rounded-2xl border-3 ${
                    item.unlocked
                      ? 'bg-cozy-paper border-cozy-brown-light hover:border-cozy-orange'
                      : 'bg-cozy-cream border-cozy-brown-light opacity-60'
                  } ${selectedItem?.id === item.id ? 'ring-4 ring-cozy-orange ring-opacity-50 border-cozy-orange' : ''}`}
                  style={{
                    borderWidth: '3px',
                    boxShadow: item.unlocked ? '0 3px 0 var(--cozy-terracotta)' : 'none',
                  }}
                  onClick={() => handleItemClick(item)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.04 }}
                  whileHover={item.unlocked ? { scale: 1.05, y: -4 } : {}}
                  whileTap={item.unlocked ? { scale: 0.95 } : {}}
                >
                  <motion.div
                    className="text-4xl mb-2"
                    animate={item.unlocked ? { rotate: [0, -5, 5, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 3, delay: index * 0.2 }}
                  >
                    {item.icon}
                  </motion.div>
                  <div className="text-xs font-heading font-semibold text-cozy-brown-dark">
                    {item.name}
                  </div>
                  {!item.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-cozy-cream bg-opacity-80 rounded-2xl">
                      <div className="text-center">
                        <span className="text-2xl">🔒</span>
                        <p className="text-xs text-cozy-brown mt-1 font-body">잠김</p>
                      </div>
                    </div>
                  )}
                  {selectedItem?.id === item.id && (
                    <motion.div
                      className="absolute -top-2 -right-2 w-6 h-6 bg-game-success border-2 border-cozy-brown rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <span className="text-white text-xs">✓</span>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* 아이템 배치 버튼 */}
            <AnimatePresence>
              {selectedItem && (
                <motion.div
                  className="fixed bottom-24 left-4 right-4 max-w-md mx-auto"
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 40, scale: 0.9 }}
                >
                  <div className="card-reward p-5">
                    <div className="flex items-center gap-4 mb-4">
                      <motion.div
                        className="text-5xl"
                        animate={{ rotate: [0, -10, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        {selectedItem.icon}
                      </motion.div>
                      <div>
                        <div className="font-display text-lg text-cozy-brown-dark">
                          {selectedItem.name}
                        </div>
                        <div className="text-sm text-cozy-brown font-body">
                          방에 배치하시겠습니까?
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <motion.button
                        onClick={() => setSelectedItem(null)}
                        className="flex-1 btn-secondary py-3"
                        whileTap={{ scale: 0.95 }}
                      >
                        취소
                      </motion.button>
                      <motion.button
                        onClick={handlePlaceItem}
                        className="flex-1 btn-primary py-3"
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="mr-1">✨</span> 배치하기
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
