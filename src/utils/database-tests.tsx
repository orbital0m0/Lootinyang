/* eslint-disable react-refresh/only-export-components */
import { supabase } from '../services/supabase';

// Supabase 테스트 유틸리티
export const testSupabaseConnection = async () => {
  try {
    // Supabase 연결 테스트
    const { data, error } = await supabase.supabase
      .from('users')
      .select('count')
      .single();
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Supabase 연결 성공:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Supabase 연결 실패:', error);
    return { success: false, error };
  }
};

// 사용자 테스트
export const testUserOperations = async () => {
  try {
    console.log('🧪 사용자 CRUD 테스트 시작...');
    
    // 테스트 사용자 생성
    const testUser = {
      auth_id: crypto.randomUUID(),
      email: 'test@example.com',
      username: 'testuser',
      level: 1,
      exp: 0,
      streak: 0,
      total_habits: 0,
    };
    
    // Create
    const { data: createdUser, error: createError } = await supabase.supabase
      .from('users')
      .insert(testUser)
      .select()
      .single();
    
    if (createError) throw createError;
    console.log('✅ 사용자 생성 성공:', createdUser);
    
    // Read
    const { data: readUser, error: readError } = await supabase.supabase
      .from('users')
      .select('*')
      .eq('id', createdUser.id)
      .single();
    
    if (readError) throw readError;
    console.log('✅ 사용자 조회 성공:', readUser);
    
    // Update
    const { data: updatedUser, error: updateError } = await supabase.supabase
      .from('users')
      .update({ level: 2, exp: 50 })
      .eq('id', createdUser.id)
      .select()
      .single();
    
    if (updateError) throw updateError;
    console.log('✅ 사용자 수정 성공:', updatedUser);
    
    // Delete
    const { error: deleteError } = await supabase.supabase
      .from('users')
      .delete()
      .eq('id', createdUser.id);
    
    if (deleteError) throw deleteError;
    console.log('✅ 사용자 삭제 성공');
    
    return { success: true };
  } catch (error) {
    console.error('❌ 사용자 CRUD 테스트 실패:', error);
    return { success: false, error };
  }
};

// 습관 테스트
export const testHabitOperations = async (userId: string) => {
  try {
    console.log('🧪 습관 CRUD 테스트 시작...');
    
    const testHabit = {
      user_id: userId,
      name: '운동하기',
      weekly_target: 3,
    };
    
    // Create
    const { data: createdHabit, error: createError } = await supabase.supabase
      .from('habits')
      .insert(testHabit)
      .select()
      .single();
    
    if (createError) throw createError;
    console.log('✅ 습관 생성 성공:', createdHabit);
    
    // Read
    const { data: readHabits, error: readError } = await supabase.supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId);
    
    if (readError) throw readError;
    console.log('✅ 습관 조회 성공:', readHabits);
    
    // Update
    const { data: updatedHabit, error: updateError } = await supabase.supabase
      .from('habits')
      .update({ name: '매일 운동하기', weekly_target: 5 })
      .eq('id', createdHabit.id)
      .select()
      .single();
    
    if (updateError) throw updateError;
    console.log('✅ 습관 수정 성공:', updatedHabit);
    
    // Delete (Soft delete)
    const { error: deleteError } = await supabase.supabase
      .from('habits')
      .update({ is_active: false })
      .eq('id', createdHabit.id);
    
    if (deleteError) throw deleteError;
    console.log('✅ 습관 비활성화 성공');
    
    return { success: true, habitId: createdHabit.id };
  } catch (error) {
    console.error('❌ 습관 CRUD 테스트 실패:', error);
    return { success: false, error };
  }
};

// 일일 체크 테스트
export const testDailyCheckOperations = async (habitId: string) => {
  try {
    console.log('🧪 일일 체크 CRUD 테스트 시작...');
    
    const today = new Date().toISOString().split('T')[0];
    const testCheck = {
      habit_id: habitId,
      date: today,
      completed: true,
    };
    
    // Create
    const { data: createdCheck, error: createError } = await supabase.supabase
      .from('daily_checks')
      .insert(testCheck)
      .select()
      .single();
    
    if (createError) throw createError;
    console.log('✅ 일일 체크 생성 성공:', createdCheck);
    
    // Read
    const { data: readChecks, error: readError } = await supabase.supabase
      .from('daily_checks')
      .select('*')
      .eq('habit_id', habitId);
    
    if (readError) throw readError;
    console.log('✅ 일일 체크 조회 성공:', readChecks);
    
    // Update
    const { data: updatedCheck, error: updateError } = await supabase.supabase
      .from('daily_checks')
      .update({ completed: false })
      .eq('id', createdCheck.id)
      .select()
      .single();
    
    if (updateError) throw updateError;
    console.log('✅ 일일 체크 수정 성공:', updatedCheck);
    
    // Delete
    const { error: deleteError } = await supabase.supabase
      .from('daily_checks')
      .delete()
      .eq('id', createdCheck.id);
    
    if (deleteError) throw deleteError;
    console.log('✅ 일일 체크 삭제 성공');
    
    return { success: true };
  } catch (error) {
    console.error('❌ 일일 체크 CRUD 테스트 실패:', error);
    return { success: false, error };
  }
};

// 종합 테스트 함수
export const runAllDatabaseTests = async () => {
  console.log('🚀 데이터베이스 종합 테스트 시작...');
  
  const results = {
    connection: false,
    user: false,
    habit: false,
    dailyCheck: false,
    errors: [] as string[],
  };
  
  try {
    // 1. 연결 테스트
    const connectionTest = await testSupabaseConnection();
    results.connection = connectionTest.success;
    if (!connectionTest.success) {
      results.errors.push(`연결 실패: ${connectionTest.error}`);
      return results;
    }
    
    // 2. 사용자 테스트
    const userTest = await testUserOperations();
    results.user = userTest.success;
    if (!userTest.success) {
      results.errors.push(`사용자 테스트 실패: ${userTest.error}`);
      return results;
    }
    
    // 3. 테스트 사용자 재생성 (습관 테스트용)
    const testUser = {
      auth_id: crypto.randomUUID(),
      email: 'habit-test@example.com',
      username: 'habituser',
      level: 1,
      exp: 0,
      streak: 0,
      total_habits: 0,
    };
    
    const { data: tempUser } = await supabase.supabase
      .from('users')
      .insert(testUser)
      .select()
      .single();
    
    // 4. 습관 테스트
    const habitTest = await testHabitOperations(tempUser.id);
    results.habit = habitTest.success;
    if (!habitTest.success) {
      results.errors.push(`습관 테스트 실패: ${habitTest.error}`);
    }
    
    // 5. 일일 체크 테스트
    if (habitTest.success && habitTest.habitId) {
      const dailyCheckTest = await testDailyCheckOperations(habitTest.habitId);
      results.dailyCheck = dailyCheckTest.success;
      if (!dailyCheckTest.success) {
        results.errors.push(`일일 체크 테스트 실패: ${dailyCheckTest.error}`);
      }
    }
    
    // 테스트 데이터 정리
    await supabase.supabase
      .from('users')
      .delete()
      .eq('auth_id', tempUser.auth_id);
    
  } catch (error) {
    results.errors.push(`예상치 못한 오류: ${error}`);
  }
  
  console.log('📊 테스트 결과:', results);
  return results;
};

// React 테스트 컴포넌트
export const DatabaseTestComponent = () => {
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [loading, setLoading] = useState(false);
  
  const runTests = async () => {
    setLoading(true);
    try {
      const results = await runAllDatabaseTests();
      setTestResults(results);
    } catch (error) {
      console.error('테스트 실행 중 오류:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">데이터베이스 테스트</h1>
      
      <button
        onClick={runTests}
        disabled={loading}
        className="btn-primary mb-6"
      >
        {loading ? '테스트 실행 중...' : '데이터베이스 테스트 실행'}
      </button>
      
      {testResults && (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg ${
            testResults.connection ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <h3 className="font-semibold">연결 테스트</h3>
            <p>{testResults.connection ? '✅ 성공' : '❌ 실패'}</p>
          </div>
          
          <div className={`p-4 rounded-lg ${
            testResults.user ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <h3 className="font-semibold">사용자 CRUD 테스트</h3>
            <p>{testResults.user ? '✅ 성공' : '❌ 실패'}</p>
          </div>
          
          <div className={`p-4 rounded-lg ${
            testResults.habit ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <h3 className="font-semibold">습관 CRUD 테스트</h3>
            <p>{testResults.habit ? '✅ 성공' : '❌ 실패'}</p>
          </div>
          
          <div className={`p-4 rounded-lg ${
            testResults.dailyCheck ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <h3 className="font-semibold">일일 체크 CRUD 테스트</h3>
            <p>{testResults.dailyCheck ? '✅ 성공' : '❌ 실패'}</p>
          </div>
          
          {testResults.errors.length > 0 && (
            <div className="p-4 rounded-lg bg-red-100">
              <h3 className="font-semibold text-red-800">오류 목록</h3>
              <ul className="list-disc list-inside text-red-700">
                {testResults.errors.map((error: string, index: number) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};