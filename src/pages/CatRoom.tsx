import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, useItems } from '../hooks';
import type { UserItem } from '../types';

// 아이템 카테고리를 표시 카테고리에 매핑 (v2)
function getItemCategory(category: string): string {
  switch (category) {
    case 'theme': return 'hat';
    case 'font': return 'necklace';
    default: return 'toy';
  }
}

export function CatRoom() {
  const navigate = useNavigate();
  const { user, isUpdating } = useUser();
  const { items: userItems, loading } = useItems(user.id);

  const [activeTab, setActiveTab] = useState<'closet' | 'room'>('closet');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [equippedIds, setEquippedIds] = useState<Set<string>>(() => new Set<string>());

  const categories = [
    { id: 'all', label: '전체' },
    { id: 'hat', label: '모자' },
    { id: 'necklace', label: '목걸이' },
    { id: 'toy', label: '장난감' },
  ];

  // 카테고리별 필터링
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return userItems;
    return userItems.filter((ui: UserItem) => {
      const cat = getItemCategory(ui.item?.category ?? 'theme');
      return cat === selectedCategory;
    });
  }, [userItems, selectedCategory]);

  const handleItemClick = (userItemId: string) => {
    setEquippedIds(prev => {
      const next = new Set(prev);
      if (next.has(userItemId)) {
        next.delete(userItemId);
      } else {
        next.add(userItemId);
      }
      return next;
    });
  };

  // 장착 포인트 총합 (코인 대용)
  const totalPoints = userItems.reduce((sum: number, ui: UserItem) => sum + ui.quantity, 0);

  // 장착 아이템 프리뷰
  const equippedItems = userItems.filter((ui: UserItem) => equippedIds.has(ui.id));

  const handleSave = async () => {
    // equipped_items 필드는 v2에서 INVENTORY로 관리 (Task 3에서 구현 예정)
    void equippedIds;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light pb-[84px] page-enter">
      {/* Header */}
      <div className="flex items-center bg-transparent p-4 pb-2 justify-between">
        <button
          onClick={() => navigate('/')}
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
          <span className="text-[11px] font-bold text-slate-500">보유 아이템</span>
          <span className="text-[11px] font-bold text-highlight">{totalPoints}개</span>
        </div>
        <div className="w-full h-3 bg-white/40 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-highlight rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((totalPoints / 20) * 100, 100)}%` }}
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
            {equippedItems.map((ui: UserItem) => (
              <motion.span
                key={ui.id}
                className="absolute text-3xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                  top: '50%',
                  right: undefined,
                }}
              >
                {ui.item?.category === 'theme' ? '🎨' : ui.item?.category === 'font' ? '✍️' : '🎁'}
              </motion.span>
            ))}
          </motion.div>

          {/* Points Display */}
          <div className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
            <span className="material-symbols-outlined text-highlight text-sm">potted_plant</span>
            <span className="text-sm font-bold text-slate-700">{totalPoints}</span>
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

        {activeTab === 'closet' ? (
          <>
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
              {loading ? (
                <div className="col-span-4 flex items-center justify-center">
                  <motion.div
                    className="text-2xl"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    🧶
                  </motion.div>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="col-span-4 flex items-center justify-center text-gray-400 text-sm">
                  보유한 아이템이 없어요
                </div>
              ) : (
                <AnimatePresence>
                  {filteredItems.map((userItem: UserItem, index: number) => {
                    const isEquipped = equippedIds.has(userItem.id);
                    return (
                      <motion.div
                        key={userItem.id}
                        className="flex flex-col items-center gap-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <button
                          onClick={() => handleItemClick(userItem.id)}
                          className={`w-full aspect-square rounded-2xl flex items-center justify-center relative overflow-hidden p-2 transition-all ${
                            isEquipped
                              ? 'bg-highlight/10 border-2 border-highlight'
                              : 'bg-slate-50 border-2 border-transparent hover:border-slate-200'
                          }`}
                        >
                          <span className="text-3xl">
                            {userItem.item?.category === 'theme' ? '🎨' : userItem.item?.category === 'font' ? '✍️' : '🎁'}
                          </span>
                          {isEquipped && (
                            <div className="absolute top-1 right-1 bg-highlight rounded-full size-4 flex items-center justify-center">
                              <span className="material-symbols-outlined text-[10px] text-white font-bold">
                                check
                              </span>
                            </div>
                          )}
                        </button>
                        <span className={`text-[10px] font-bold ${isEquipped ? 'text-highlight' : 'text-slate-400'}`}>
                          {isEquipped ? '착용 중' : userItem.item?.nameKo ?? '아이템'}
                        </span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </>
        ) : (
          <div className="h-56 flex items-center justify-center text-gray-400 text-sm">
            방 꾸미기 기능은 준비 중이에요 🛠️
          </div>
        )}

        {/* Save Button */}
        <div className="flex px-2 py-3 mt-2">
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={isUpdating}
          >
            {isUpdating ? '저장 중...' : '스타일 저장하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
