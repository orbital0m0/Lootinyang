import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks';
import { RoomDisplay, ItemGrid, CategoryTabs } from '../components/catroom';

interface Item {
  id: string;
  name: string;
  icon: string;
  category: 'wallpaper' | 'floor' | 'furniture' | 'decoration';
  unlocked: boolean;
  position?: { x: number; y: number };
}

const initialItems: Item[] = [
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
];

const initialPlacedItems: Item[] = [
  { id: 'w1', name: '기본 벽지', icon: '🏠', category: 'wallpaper', unlocked: true, position: { x: 0, y: 0 } },
  { id: 'f1', name: '기본 바닥', icon: '🟫', category: 'floor', unlocked: true, position: { x: 0, y: 0 } },
  { id: 'fu1', name: '작은 베개', icon: '🛋️', category: 'furniture', unlocked: true, position: { x: 150, y: 200 } },
  { id: 'd1', name: '작은 꽃', icon: '🌸', category: 'decoration', unlocked: true, position: { x: 50, y: 180 } },
];

export function CatRoom() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [items] = useState<Item[]>(initialItems);
  const [activeTab, setActiveTab] = useState<'room' | 'inventory'>('room');
  const [selectedCategory, setSelectedCategory] = useState<Item['category'] | 'all'>('all');
  const [placedItems, setPlacedItems] = useState<Item[]>(initialPlacedItems);
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
      {/* Header */}
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
              aria-hidden="true"
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
          <div className="stat-box py-2 px-4" aria-label={`보유 아이템 ${unlockedCount}개`}>
            <div className="stat-value text-lg">{unlockedCount}</div>
            <div className="stat-label">보유 아이템</div>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="px-4 mb-4">
        <motion.div
          className="flex bg-cozy-cream rounded-2xl p-1 border-3 border-cozy-brown-light"
          style={{ borderWidth: '3px' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          role="tablist"
          aria-label="고양이 방 탭"
        >
          <motion.button
            onClick={() => setActiveTab('room')}
            className={`flex-1 py-3 px-4 rounded-xl font-heading font-semibold text-sm transition-all ${
              activeTab === 'room'
                ? 'bg-cozy-sage text-white shadow-md'
                : 'text-cozy-brown hover:bg-cozy-paper'
            }`}
            whileTap={{ scale: 0.98 }}
            role="tab"
            aria-selected={activeTab === 'room'}
            aria-controls="room-panel"
          >
            <span className="mr-1" aria-hidden="true">🏠</span> 방 보기
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 py-3 px-4 rounded-xl font-heading font-semibold text-sm transition-all ${
              activeTab === 'inventory'
                ? 'bg-cozy-mustard text-white shadow-md'
                : 'text-cozy-brown hover:bg-cozy-paper'
            }`}
            whileTap={{ scale: 0.98 }}
            role="tab"
            aria-selected={activeTab === 'inventory'}
            aria-controls="inventory-panel"
          >
            <span className="mr-1" aria-hidden="true">📦</span> 아이템
          </motion.button>
        </motion.div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'room' ? (
          <motion.div
            key="room"
            className="px-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            id="room-panel"
            role="tabpanel"
          >
            <RoomDisplay
              placedItems={placedItems}
              catReaction={catReaction}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onRemoveItem={handleRemoveItem}
              onCatClick={handleCatClick}
            />
          </motion.div>
        ) : (
          <motion.div
            key="inventory"
            className="px-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            id="inventory-panel"
            role="tabpanel"
          >
            <CategoryTabs
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            <ItemGrid
              items={filteredItems}
              selectedItem={selectedItem}
              onItemClick={handleItemClick}
              onPlaceItem={handlePlaceItem}
              onCancelSelect={() => setSelectedItem(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
