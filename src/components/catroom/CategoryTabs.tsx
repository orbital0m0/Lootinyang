import { motion } from 'framer-motion';

type Category = 'all' | 'wallpaper' | 'floor' | 'furniture' | 'decoration';

interface CategoryTabsProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
}

const categoryInfo: Record<Category, { label: string; icon: string }> = {
  all: { label: '전체', icon: '✨' },
  wallpaper: { label: '벽지', icon: '🏠' },
  floor: { label: '바닥', icon: '🪵' },
  furniture: { label: '가구', icon: '🛋️' },
  decoration: { label: '장식', icon: '🌸' },
};

export function CategoryTabs({ selectedCategory, onSelectCategory }: CategoryTabsProps) {
  const categories = Object.keys(categoryInfo) as Category[];

  return (
    <div
      className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-1 px-1"
      role="tablist"
      aria-label="아이템 카테고리"
    >
      {categories.map((cat) => (
        <motion.button
          key={cat}
          onClick={() => onSelectCategory(cat)}
          className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-heading font-semibold whitespace-nowrap transition-all border-3 ${
            selectedCategory === cat
              ? 'bg-cozy-orange text-white border-cozy-orange-dark shadow-md'
              : 'bg-cozy-cream text-cozy-brown border-cozy-brown-light hover:border-cozy-orange'
          }`}
          style={{ borderWidth: '3px' }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          role="tab"
          aria-selected={selectedCategory === cat}
          aria-controls={`${cat}-panel`}
        >
          <span aria-hidden="true">{categoryInfo[cat].icon}</span>
          <span>{categoryInfo[cat].label}</span>
        </motion.button>
      ))}
    </div>
  );
}
