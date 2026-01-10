import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

export function CatRoom() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [items] = useState<Item[]>([
    // 벽지
    { id: 'w1', name: '기본 벽지', icon: '🏠', category: 'wallpaper', unlocked: true },
    { id: 'w2', name: '별이 빛나는 밤', icon: '🌙', category: 'wallpaper', unlocked: false },
    { id: 'w3', name: '청명한 하늘', icon: '☁️', category: 'wallpaper', unlocked: false },
    // 바닥
    { id: 'f1', name: '기본 바닥', icon: '🟫', category: 'floor', unlocked: true },
    { id: 'f2', name: '나무 바닥', icon: '🪵', category: 'floor', unlocked: true },
    { id: 'f3', name: '카펫', icon: '🟤', category: 'floor', unlocked: false },
    // 가구
    { id: 'fu1', name: '작은 베개', icon: '🛋️', category: 'furniture', unlocked: true },
    { id: 'fu2', name: '장난감 상자', icon: '📦', category: 'furniture', unlocked: false },
    { id: 'fu3', name: '야옹이 타워', icon: '🏗️', category: 'furniture', unlocked: false },
    // 장식
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
      setPlacedItems(prev => [
        ...prev,
        { ...selectedItem, position: { x: 100, y: 200 } },
      ]);
    }
    setSelectedItem(null);
  };

  const handleRemoveItem = (itemId: string) => {
    if (itemId === 'w1' || itemId === 'f1') return; // 기본 아이템은 제거 불가
    setPlacedItems(prev => prev.filter(i => i.id !== itemId));
  };

  const filteredItems = items.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-orange-50 to-pink-50">
      {/* 헤더 */}
      <motion.div
        className="pt-6 pb-4 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-gray-800">🏠 고양이 방</h2>
        <p className="text-sm text-gray-600 mt-1">
          달성한 아이템으로 고양이 방을 꾸미세요!
        </p>
      </motion.div>

      {/* 탭 전환 */}
      <div className="px-4 mb-4">
        <div className="flex bg-white rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('room')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'room'
                ? 'bg-gradient-to-r from-cat-orange to-cat-pink text-white shadow-md'
                : 'text-gray-600'
            }`}
          >
            🏠 방 보기
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'inventory'
                ? 'bg-gradient-to-r from-cat-orange to-cat-pink text-white shadow-md'
                : 'text-gray-600'
            }`}
          >
            📦 아이템 목록
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'room' ? (
          <motion.div
            key="room"
            className="px-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* 방 컨테이너 */}
            <motion.div
              className="room-container relative bg-gradient-to-b from-orange-100 to-pink-100 rounded-2xl shadow-lg overflow-hidden"
              style={{ height: '500px' }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDragEnd}
            >
              {/* 배치된 아이템들 */}
              {placedItems.map((item) => {
                const isBackground = item.category === 'wallpaper' || item.category === 'floor';

                return (
                  <motion.div
                    key={item.id}
                    draggable={!isBackground}
                    onDragStart={() => handleDragStart(item)}
                    className={`absolute ${isBackground ? 'inset-0 flex items-center justify-center' : ''}`}
                    style={!isBackground ? { left: item.position?.x, top: item.position?.y } : {}}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={!isBackground ? { scale: 1.1 } : {}}
                    whileDrag={!isBackground ? { scale: 1.2 } : {}}
                  >
                    <div className="text-6xl opacity-80">
                      {item.icon}
                    </div>
                    {!isBackground && (
                      <motion.button
                        onClick={() => handleRemoveItem(item.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs font-bold"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        ✕
                      </motion.button>
                    )}
                  </motion.div>
                );
              })}

              {/* 고양이 캐릭터 */}
              <motion.div
                className="absolute"
                style={{ bottom: 100, left: '50%', transform: 'translateX(-50%)' }}
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <CuteCatIllustration size="md" animate={false} />
              </motion.div>
            </motion.div>

            {/* 안내 메시지 */}
            <motion.div
              className="mt-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-sm text-gray-600">
                💡 아이템을 드래그해서 배치하세요!
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
            transition={{ duration: 0.3 }}
          >
            {/* 카테고리 필터 */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-cat-orange to-cat-pink text-white'
                    : 'bg-white text-gray-600'
                }`}
              >
                전체
              </button>
              <button
                onClick={() => setSelectedCategory('wallpaper')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === 'wallpaper'
                    ? 'bg-gradient-to-r from-cat-orange to-cat-pink text-white'
                    : 'bg-white text-gray-600'
                }`}
              >
                🏠 벽지
              </button>
              <button
                onClick={() => setSelectedCategory('floor')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === 'floor'
                    ? 'bg-gradient-to-r from-cat-orange to-cat-pink text-white'
                    : 'bg-white text-gray-600'
                }`}
              >
                🟫 바닥
              </button>
              <button
                onClick={() => setSelectedCategory('furniture')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === 'furniture'
                    ? 'bg-gradient-to-r from-cat-orange to-cat-pink text-white'
                    : 'bg-white text-gray-600'
                }`}
              >
                🛋️ 가구
              </button>
              <button
                onClick={() => setSelectedCategory('decoration')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === 'decoration'
                    ? 'bg-gradient-to-r from-cat-orange to-cat-pink text-white'
                    : 'bg-white text-gray-600'
                }`}
              >
                ✨ 장식
              </button>
            </div>

            {/* 아이템 그리드 */}
            <div className="grid grid-cols-3 gap-3">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className={`card p-3 text-center cursor-pointer transition-all ${
                    !item.unlocked ? 'opacity-50' : ''
                  } ${selectedItem?.id === item.id ? 'ring-2 ring-cat-orange' : ''}`}
                  onClick={() => handleItemClick(item)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={item.unlocked ? { scale: 1.05, y: -3 } : {}}
                  whileTap={item.unlocked ? { scale: 0.95 } : {}}
                >
                  <div className="text-3xl mb-1">{item.icon}</div>
                  <div className="text-xs font-medium text-gray-800">{item.name}</div>
                  {!item.unlocked && (
                    <div className="text-xs text-gray-500 mt-1">🔒 잠김</div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* 아이템 배치 버튼 */}
            {selectedItem && (
              <motion.div
                className="fixed bottom-24 left-4 right-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <div className="card p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-4xl">{selectedItem.icon}</div>
                    <div>
                      <div className="font-semibold">{selectedItem.name}</div>
                      <div className="text-sm text-gray-600">
                        배치하시겠습니까?
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium"
                    >
                      취소
                    </button>
                    <button
                      onClick={handlePlaceItem}
                      className="flex-1 py-3 bg-gradient-to-r from-cat-orange to-cat-pink text-white rounded-lg font-medium"
                    >
                      배치
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// AnimatePresence를 사용하기 위해 import 추가
import { AnimatePresence } from 'framer-motion';
