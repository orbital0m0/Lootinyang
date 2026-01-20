import { motion, AnimatePresence } from 'framer-motion';

interface Item {
  id: string;
  name: string;
  icon: string;
  category: 'wallpaper' | 'floor' | 'furniture' | 'decoration';
  unlocked: boolean;
  position?: { x: number; y: number };
}

interface ItemGridProps {
  items: Item[];
  selectedItem: Item | null;
  onItemClick: (item: Item) => void;
  onPlaceItem: () => void;
  onCancelSelect: () => void;
}

export function ItemGrid({
  items,
  selectedItem,
  onItemClick,
  onPlaceItem,
  onCancelSelect,
}: ItemGridProps) {
  return (
    <>
      {/* Item grid */}
      <div className="grid grid-cols-3 gap-3" role="list" aria-label="아이템 목록">
        {items.map((item, index) => (
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
            onClick={() => onItemClick(item)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.04 }}
            whileHover={item.unlocked ? { scale: 1.05, y: -4 } : {}}
            whileTap={item.unlocked ? { scale: 0.95 } : {}}
            role="listitem"
            aria-selected={selectedItem?.id === item.id}
            aria-disabled={!item.unlocked}
          >
            <motion.div
              className="text-4xl mb-2"
              animate={item.unlocked ? { rotate: [0, -5, 5, 0] } : {}}
              transition={{ repeat: Infinity, duration: 3, delay: index * 0.2 }}
              aria-hidden="true"
            >
              {item.icon}
            </motion.div>
            <div className="text-xs font-heading font-semibold text-cozy-brown-dark">
              {item.name}
            </div>
            {!item.unlocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-cozy-cream bg-opacity-80 rounded-2xl">
                <div className="text-center">
                  <span className="text-2xl" aria-hidden="true">🔒</span>
                  <p className="text-xs text-cozy-brown mt-1 font-body">잠김</p>
                </div>
              </div>
            )}
            {selectedItem?.id === item.id && (
              <motion.div
                className="absolute -top-2 -right-2 w-6 h-6 bg-game-success border-2 border-cozy-brown rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                aria-hidden="true"
              >
                <span className="text-white text-xs">✓</span>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Place item modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed bottom-24 left-4 right-4 max-w-md mx-auto"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
          >
            <div className="card-reward p-5" role="dialog" aria-labelledby="place-item-title">
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  className="text-5xl"
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  aria-hidden="true"
                >
                  {selectedItem.icon}
                </motion.div>
                <div>
                  <div id="place-item-title" className="font-display text-lg text-cozy-brown-dark">
                    {selectedItem.name}
                  </div>
                  <div className="text-sm text-cozy-brown font-body">
                    방에 배치하시겠습니까?
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <motion.button
                  onClick={onCancelSelect}
                  className="flex-1 btn-secondary py-3"
                  whileTap={{ scale: 0.95 }}
                >
                  취소
                </motion.button>
                <motion.button
                  onClick={onPlaceItem}
                  className="flex-1 btn-primary py-3"
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="mr-1" aria-hidden="true">✨</span> 배치하기
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
