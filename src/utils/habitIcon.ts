// 습관 이름에 따른 아이콘 반환
export function getHabitIcon(name: string): string {
  if (name.includes('물') || name.includes('water')) return 'water_drop';
  if (name.includes('운동') || name.includes('헬스')) return 'fitness_center';
  if (name.includes('책') || name.includes('독서')) return 'menu_book';
  if (name.includes('명상') || name.includes('meditation')) return 'self_improvement';
  if (name.includes('달리기') || name.includes('걷기')) return 'directions_run';
  if (name.includes('식사') || name.includes('다이어트')) return 'restaurant';
  if (name.includes('수면') || name.includes('잠')) return 'bedtime';
  if (name.includes('코딩') || name.includes('공부')) return 'code';
  return 'check_circle';
}
