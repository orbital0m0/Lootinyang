// 고양이 캐릭터 감정 상태
export type CatMood = 'happy' | 'normal' | 'sleepy' | 'excited';

// 고양이 캐릭터 props
interface CatCharacterProps {
  mood?: CatMood;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onMoodChange?: (mood: CatMood) => void;
}

// 고양이 캐릭터 컴포넌트
export function CatCharacter({ mood = 'normal', size = 'md', className = '', onMoodChange }: CatCharacterProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const moodClasses = {
    happy: 'animate-bounce-slow',
    normal: '',
    sleepy: 'opacity-75',
    excited: 'animate-pulse-slow',
  };

  const eyeClasses = {
    happy: 'scale-125',
    normal: 'scale-100',
    sleepy: 'scale-50',
    excited: 'scale-150',
  };

  const mouthClasses = {
    happy: 'w-6 h-2',
    normal: 'w-4 h-1.5',
    sleepy: 'w-3 h-1',
    excited: 'w-7 h-2.5',
  };

  const accessoryClasses = {
    happy: 'translate-y-[-4px] translate-x-1/2 scale-150',
    normal: 'translate-y-[-2px] translate-x-1/2 scale-100',
    sleepy: 'translate-y-[0px] translate-x-1/2 scale-75',
    excited: 'translate-y-[-6px] translate-x-1/2 scale-200',
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* 고양이 얼굴 */}
      <div className="absolute inset-0 bg-gradient-to-br from-cat-orange to-cat-orange-dark rounded-full shadow-lg">
        
        {/* 왼쪽 귀 */}
        <div className="absolute -top-3 -left-2 w-6 h-6 bg-cat-orange rounded-t-full transform -rotate-12" />
        
        {/* 오른쪽 귀 */}
        <div className="absolute -top-3 -right-2 w-6 h-6 bg-cat-orange rounded-t-full transform rotate-12" />
        
        {/* 왼쪽 눈 */}
        <div className={`absolute top-8 left-6 w-3 h-4 bg-gray-800 rounded-full transition-transform ${eyeClasses[mood]}`}>
          <div className={`absolute inset-1 bg-white rounded-full ${moodClasses[mood]}`}>
            <div className="absolute inset-1 bg-gray-900 rounded-full w-1 h-1" />
          </div>
        </div>
        
        {/* 오른쪽 눈 */}
        <div className={`absolute top-8 right-6 w-3 h-4 bg-gray-800 rounded-full transition-transform ${eyeClasses[mood]}`}>
          <div className={`absolute inset-1 bg-white rounded-full ${moodClasses[mood]}`}>
            <div className="absolute inset-1 bg-gray-900 rounded-full w-1 h-1" />
          </div>
        </div>
        
        {/* 코 */}
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-pink-400 rounded-full" />
        
        {/* 입 */}
        <div className={`absolute top-14 left-1/2 transform -translate-x-1/2 border-b-2 border-gray-800 rounded-b-full ${mouthClasses[mood]}`} />
        
        {/* 졸린 때 하트 */}
        {mood === 'sleepy' && (
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-error-400 text-2xl animate-bounce-slow">
            <span className="inline-block">💤</span>
          </div>
        )}
        
        {/* 행복할 때 하트 */}
        {mood === 'happy' && (
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-pink-400 text-2xl animate-sparkle">
            <span className="inline-block">💖</span>
          </div>
        )}
        
        {/* 흥분할 때 하트 */}
        {mood === 'excited' && (
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-cat-pink-dark text-2xl animate-pulse-slow">
            <span className="inline-block">😸</span>
          </div>
        )}
      </div>
      
      {/* 꼬리 */}
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
        <div className={`w-3 h-8 bg-cat-orange rounded-full ${mood === 'happy' ? 'animate-wiggle' : ''}`} 
             style={{ transformOrigin: 'top center' }}>
          {/* 꼬리 털 */}
          <div className="absolute -top-1 left-1/2 w-1 h-4 bg-cat-pink-dark rounded-full" />
        </div>
      </div>
      
      {/* 감정 전환 버튼 */}
      <button
        onClick={() => onMoodChange?.('happy')}
        className={`absolute -bottom-4 left-1/2 transform -translate-y-1/2 p-1.5 rounded-full ${accessoryClasses[mood]} transition-transform duration-200 hover:scale-110 active:scale-95`}
        aria-label="행복 상태 전환"
      >
        <span className="text-xl">😊</span>
      </button>
    </div>
  );
}