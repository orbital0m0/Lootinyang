import { motion, AnimatePresence } from 'framer-motion';
import { CuteCatIllustration } from '../CuteCatIllustration';

interface Item {
  id: string;
  name: string;
  icon: string;
  category: 'wallpaper' | 'floor' | 'furniture' | 'decoration';
  unlocked: boolean;
  position?: { x: number; y: number };
}

interface RoomDisplayProps {
  placedItems: Item[];
  catReaction: 'happy' | 'love' | 'normal';
  onDragStart: (item: Item) => void;
  onDragEnd: (event: React.DragEvent) => void;
  onRemoveItem: (itemId: string) => void;
  onCatClick: () => void;
}

export function RoomDisplay({
  placedItems,
  catReaction,
  onDragStart,
  onDragEnd,
  onRemoveItem,
  onCatClick,
}: RoomDisplayProps) {
  return (
    <>
      {/* Room container */}
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
        onDrop={onDragEnd}
        role="region"
        aria-label="고양이 방 꾸미기 영역"
      >
        {/* Room background decorations */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-4 left-4 text-3xl opacity-30">🌿</div>
          <div className="absolute top-4 right-4 text-3xl opacity-30">🌿</div>
          <div className="absolute bottom-20 left-8 text-2xl opacity-40">🌱</div>
          <div className="absolute bottom-24 right-12 text-2xl opacity-40">🌱</div>
        </div>

        {/* Window */}
        <motion.div
          className="absolute top-8 left-1/2 transform -translate-x-1/2 w-24 h-20 bg-gradient-to-b from-game-exp to-cozy-sage-light rounded-xl border-4 border-cozy-brown flex items-center justify-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          aria-label="창문"
        >
          <span className="text-3xl" aria-hidden="true">☀️</span>
        </motion.div>

        {/* Placed items */}
        {placedItems.map((item) => {
          const isBackground = item.category === 'wallpaper' || item.category === 'floor';
          if (isBackground) return null;

          return (
            <motion.div
              key={item.id}
              draggable
              onDragStart={() => onDragStart(item)}
              className="absolute cursor-move"
              style={{ left: item.position?.x, top: item.position?.y }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.15, zIndex: 10 }}
              whileDrag={{ scale: 1.2, zIndex: 20 }}
              aria-label={`${item.name} - 드래그하여 이동 가능`}
            >
              <div className="relative">
                <span className="text-5xl drop-shadow-lg" aria-hidden="true">{item.icon}</span>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveItem(item.id);
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-cozy-rose border-2 border-cozy-brown rounded-full text-white text-xs font-bold shadow-md"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`${item.name} 제거`}
                >
                  <span aria-hidden="true">✕</span>
                </motion.button>
              </div>
            </motion.div>
          );
        })}

        {/* Cat character */}
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
          onClick={onCatClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          role="button"
          aria-label="고양이 쓰다듬기"
        >
          <CuteCatIllustration size="md" animate={false} />
          <AnimatePresence>
            {catReaction !== 'normal' && (
              <motion.div
                className="absolute -top-10 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0, y: 10, scale: 0.5 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.5 }}
                aria-hidden="true"
              >
                <span className="text-3xl">
                  {catReaction === 'love' ? '💕' : '😻'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Floor line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-20"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(139, 115, 85, 0.2) 100%)',
          }}
          aria-hidden="true"
        />
      </motion.div>

      {/* Help message */}
      <motion.div
        className="mt-4 card py-3 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-sm text-cozy-brown font-body">
          <span className="mr-2" aria-hidden="true">💡</span>
          아이템을 드래그해서 배치하고, 고양이를 터치해보세요!
        </p>
      </motion.div>
    </>
  );
}
