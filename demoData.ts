import { Goal, Category, MonthlyRecord } from './types';

// Demo user
export const DEMO_USER = {
    id: 'demo-user',
    email: 'demo@example.com',
    username: '데모 사용자'
};

// Demo categories
export const DEMO_CATEGORIES: Category[] = [
    {
        id: 'cat-1',
        name: '건강',
        color: 'bg-green-100 text-green-700',
        orderIndex: 0
    },
    {
        id: 'cat-2',
        name: '커리어',
        color: 'bg-blue-100 text-blue-700',
        orderIndex: 1
    },
    {
        id: 'cat-3',
        name: '재정',
        color: 'bg-purple-100 text-purple-700',
        orderIndex: 2
    }
];

// Demo monthly records (current month)
const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();

// Demo goals
export const DEMO_GOALS: Goal[] = [
    {
        id: 'goal-1',
        categoryId: 'cat-1',
        year: currentYear,
        title: '매일 아침 운동하기',
        description: '건강한 하루를 위한 아침 루틴',
        emoji: '🏃',
        type: 'NUMERIC',
        targetValue: 30,
        unit: '일',
        orderIndex: 0
    },
    {
        id: 'goal-2',
        categoryId: 'cat-1',
        year: currentYear,
        title: '물 2L 마시기',
        description: '하루 권장 수분 섭취량 달성',
        emoji: '💧',
        type: 'NUMERIC',
        targetValue: 30,
        unit: '일',
        orderIndex: 1
    },
    {
        id: 'goal-3',
        categoryId: 'cat-2',
        year: currentYear,
        title: '새로운 기술 스택 학습',
        description: 'React와 TypeScript 마스터하기',
        emoji: '💻',
        type: 'BOOLEAN',
        orderIndex: 2
    },
    {
        id: 'goal-4',
        categoryId: 'cat-2',
        year: currentYear,
        title: '온라인 강의 수강',
        description: '전문성 향상을 위한 학습',
        emoji: '📚',
        type: 'NUMERIC',
        targetValue: 20,
        unit: '시간',
        orderIndex: 3
    },
    {
        id: 'goal-5',
        categoryId: 'cat-3',
        year: currentYear,
        title: '저축 목표 달성',
        description: '매월 일정 금액 저축하기',
        emoji: '💰',
        type: 'NUMERIC',
        targetValue: 500000,
        unit: '원',
        orderIndex: 4
    },
    {
        id: 'goal-6',
        categoryId: 'cat-3',
        year: currentYear,
        title: '불필요한 지출 줄이기',
        description: '충동구매 자제하기',
        emoji: '💸',
        type: 'BOOLEAN',
        orderIndex: 5
    }
];



// Generate demo records for all 12 months with varied patterns
export const DEMO_RECORDS: MonthlyRecord[] = [
    // January - Strong start
    { id: 'r-1-1', goalId: 'goal-1', year: currentYear, month: 1, numericValue: 28 },
    { id: 'r-1-2', goalId: 'goal-2', year: currentYear, month: 1, numericValue: 30 },
    { id: 'r-1-3', goalId: 'goal-3', year: currentYear, month: 1, status: 'SUCCESS', achieved: true },
    { id: 'r-1-4', goalId: 'goal-4', year: currentYear, month: 1, numericValue: 22 },
    { id: 'r-1-5', goalId: 'goal-5', year: currentYear, month: 1, numericValue: 500000 },
    { id: 'r-1-6', goalId: 'goal-6', year: currentYear, month: 1, status: 'SUCCESS', achieved: true },

    // February - Slight dip
    { id: 'r-2-1', goalId: 'goal-1', year: currentYear, month: 2, numericValue: 24 },
    { id: 'r-2-2', goalId: 'goal-2', year: currentYear, month: 2, numericValue: 26 },
    { id: 'r-2-3', goalId: 'goal-3', year: currentYear, month: 2, status: 'HOLD', achieved: false },
    { id: 'r-2-4', goalId: 'goal-4', year: currentYear, month: 2, numericValue: 18 },
    { id: 'r-2-5', goalId: 'goal-5', year: currentYear, month: 2, numericValue: 450000 },

    // March - Recovery
    { id: 'r-3-1', goalId: 'goal-1', year: currentYear, month: 3, numericValue: 29 },
    { id: 'r-3-2', goalId: 'goal-2', year: currentYear, month: 3, numericValue: 31 },
    { id: 'r-3-3', goalId: 'goal-3', year: currentYear, month: 3, status: 'SUCCESS', achieved: true },
    { id: 'r-3-4', goalId: 'goal-4', year: currentYear, month: 3, numericValue: 21 },
    { id: 'r-3-5', goalId: 'goal-5', year: currentYear, month: 3, numericValue: 520000 },
    { id: 'r-3-6', goalId: 'goal-6', year: currentYear, month: 3, status: 'SUCCESS', achieved: true },

    // April - Excellent month
    { id: 'r-4-1', goalId: 'goal-1', year: currentYear, month: 4, numericValue: 30 },
    { id: 'r-4-2', goalId: 'goal-2', year: currentYear, month: 4, numericValue: 30 },
    { id: 'r-4-3', goalId: 'goal-3', year: currentYear, month: 4, status: 'SUCCESS', achieved: true },
    { id: 'r-4-4', goalId: 'goal-4', year: currentYear, month: 4, numericValue: 24 },
    { id: 'r-4-5', goalId: 'goal-5', year: currentYear, month: 4, numericValue: 550000 },
    { id: 'r-4-6', goalId: 'goal-6', year: currentYear, month: 4, status: 'SUCCESS', achieved: true },

    // May - Burnout
    { id: 'r-5-1', goalId: 'goal-1', year: currentYear, month: 5, numericValue: 18 },
    { id: 'r-5-2', goalId: 'goal-2', year: currentYear, month: 5, numericValue: 22 },
    { id: 'r-5-3', goalId: 'goal-3', year: currentYear, month: 5, status: 'FAIL', achieved: false },
    { id: 'r-5-4', goalId: 'goal-4', year: currentYear, month: 5, numericValue: 12 },
    { id: 'r-5-5', goalId: 'goal-5', year: currentYear, month: 5, numericValue: 400000 },

    // June - Gradual recovery
    { id: 'r-6-1', goalId: 'goal-1', year: currentYear, month: 6, numericValue: 25 },
    { id: 'r-6-2', goalId: 'goal-2', year: currentYear, month: 6, numericValue: 27 },
    { id: 'r-6-3', goalId: 'goal-3', year: currentYear, month: 6, status: 'HOLD', achieved: false },
    { id: 'r-6-4', goalId: 'goal-4', year: currentYear, month: 6, numericValue: 16 },
    { id: 'r-6-5', goalId: 'goal-5', year: currentYear, month: 6, numericValue: 480000 },
    { id: 'r-6-6', goalId: 'goal-6', year: currentYear, month: 6, status: 'HOLD', achieved: false },

    // July - Summer vacation impact
    { id: 'r-7-1', goalId: 'goal-1', year: currentYear, month: 7, numericValue: 20 },
    { id: 'r-7-2', goalId: 'goal-2', year: currentYear, month: 7, numericValue: 25 },
    { id: 'r-7-4', goalId: 'goal-4', year: currentYear, month: 7, numericValue: 10 },
    { id: 'r-7-5', goalId: 'goal-5', year: currentYear, month: 7, numericValue: 300000 },

    // August - Back on track
    { id: 'r-8-1', goalId: 'goal-1', year: currentYear, month: 8, numericValue: 27 },
    { id: 'r-8-2', goalId: 'goal-2', year: currentYear, month: 8, numericValue: 29 },
    { id: 'r-8-3', goalId: 'goal-3', year: currentYear, month: 8, status: 'SUCCESS', achieved: true },
    { id: 'r-8-4', goalId: 'goal-4', year: currentYear, month: 8, numericValue: 20 },
    { id: 'r-8-5', goalId: 'goal-5', year: currentYear, month: 8, numericValue: 500000 },
    { id: 'r-8-6', goalId: 'goal-6', year: currentYear, month: 8, status: 'SUCCESS', achieved: true },

    // September - Strong performance
    { id: 'r-9-1', goalId: 'goal-1', year: currentYear, month: 9, numericValue: 29 },
    { id: 'r-9-2', goalId: 'goal-2', year: currentYear, month: 9, numericValue: 30 },
    { id: 'r-9-3', goalId: 'goal-3', year: currentYear, month: 9, status: 'SUCCESS', achieved: true },
    { id: 'r-9-4', goalId: 'goal-4', year: currentYear, month: 9, numericValue: 23 },
    { id: 'r-9-5', goalId: 'goal-5', year: currentYear, month: 9, numericValue: 530000 },
    { id: 'r-9-6', goalId: 'goal-6', year: currentYear, month: 9, status: 'SUCCESS', achieved: true },

    // October - Maintaining momentum
    { id: 'r-10-1', goalId: 'goal-1', year: currentYear, month: 10, numericValue: 28 },
    { id: 'r-10-2', goalId: 'goal-2', year: currentYear, month: 10, numericValue: 29 },
    { id: 'r-10-3', goalId: 'goal-3', year: currentYear, month: 10, status: 'SUCCESS', achieved: true },
    { id: 'r-10-4', goalId: 'goal-4', year: currentYear, month: 10, numericValue: 21 },
    { id: 'r-10-5', goalId: 'goal-5', year: currentYear, month: 10, numericValue: 510000 },
    { id: 'r-10-6', goalId: 'goal-6', year: currentYear, month: 10, status: 'SUCCESS', achieved: true },

    // November - Year-end push
    { id: 'r-11-1', goalId: 'goal-1', year: currentYear, month: 11, numericValue: 30 },
    { id: 'r-11-2', goalId: 'goal-2', year: currentYear, month: 11, numericValue: 30 },
    { id: 'r-11-3', goalId: 'goal-3', year: currentYear, month: 11, status: 'SUCCESS', achieved: true },
    { id: 'r-11-4', goalId: 'goal-4', year: currentYear, month: 11, numericValue: 25 },
    { id: 'r-11-5', goalId: 'goal-5', year: currentYear, month: 11, numericValue: 600000 },
    { id: 'r-11-6', goalId: 'goal-6', year: currentYear, month: 11, status: 'SUCCESS', achieved: true },

    // December - Current month (partial data)
    { id: 'r-12-1', goalId: 'goal-1', year: currentYear, month: 12, numericValue: 22 },
    { id: 'r-12-2', goalId: 'goal-2', year: currentYear, month: 12, numericValue: 28 },
    { id: 'r-12-3', goalId: 'goal-3', year: currentYear, month: 12, status: 'SUCCESS', achieved: true },
    { id: 'r-12-4', goalId: 'goal-4', year: currentYear, month: 12, numericValue: 18 },
];

// Demo retrospectives for all 12 months (diary-style tone)
export const DEMO_RETROSPECTIVES: { [key: number]: { id: string; year: number; month: number; content: string } } = {
    1: {
        id: 'retro-1',
        year: currentYear,
        month: 1,
        content: `<p>새해 첫 달이라 그런지 의욕이 넘쳤다! 💪</p>

<p class="font-bold text-base mt-4 mb-2">잘한 것들</p>
<ul>
  <li>아침 운동을 거의 매일 했다. 일찍 일어나는 게 생각보다 괜찮네</li>
  <li>물 마시기도 잘 챙겼고, 새 기술 스택 공부도 완료했다</li>
  <li>저축 목표도 딱 맞춰서 달성! 기분 좋다</li>
</ul>

<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-500 my-2">
이 기세로 1년 내내 갈 수 있을까? 일단 2월도 화이팅!
</blockquote>`
    },
    2: {
        id: 'retro-2',
        year: currentYear,
        month: 2,
        content: `<p>2월은 좀 힘들었다... 😓</p>

<p class="font-bold text-base mt-4 mb-2">아쉬운 점</p>
<ul>
  <li>운동을 며칠 빼먹었다. 날씨가 추워서 핑계가 많았음</li>
  <li>기술 스택 공부는 진도가 안 나갔다. 회사 일이 바빠서...</li>
  <li>저축도 목표보다 조금 적게 했다</li>
</ul>

<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-500 my-2">
완벽할 순 없지. 3월엔 다시 페이스 찾아보자!
</blockquote>`
    },
    3: {
        id: 'retro-3',
        year: currentYear,
        month: 3,
        content: `<p>다시 궤도에 올라왔다! 🚀</p>

<p class="font-bold text-base mt-4 mb-2">좋았던 점</p>
<ul>
  <li>운동 루틴을 다시 잡았다. 아침형 인간 성공!</li>
  <li>물도 잘 마셨고, 기술 공부도 완료</li>
  <li>충동구매를 안 했더니 저축이 더 잘 됐다</li>
</ul>

<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-500 my-2">
2월 슬럼프를 잘 극복한 것 같다. 이제 리듬을 찾은 느낌!
</blockquote>`
    },
    4: {
        id: 'retro-4',
        year: currentYear,
        month: 4,
        content: `<p>완벽한 한 달이었다! 🎉</p>

<p class="font-bold text-base mt-4 mb-2">대박 달성</p>
<ul>
  <li>모든 목표를 100% 달성했다!</li>
  <li>운동 30일 완주, 물 마시기도 완벽</li>
  <li>강의도 목표보다 더 많이 들었고, 저축도 초과 달성</li>
</ul>

<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-500 my-2">
이런 달이 또 올까? 너무 뿌듯하다. 5월도 이 기세로!
</blockquote>`
    },
    5: {
        id: 'retro-5',
        year: currentYear,
        month: 5,
        content: `<p>번아웃이 왔다... 😵</p>

<p class="font-bold text-base mt-4 mb-2">힘들었던 점</p>
<ul>
  <li>4월에 너무 열심히 해서 그런가, 5월엔 지쳤다</li>
  <li>운동도 많이 빠지고, 공부도 거의 못 했다</li>
  <li>스트레스로 쇼핑을 좀 했다. 저축 실패...</li>
</ul>

<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-500 my-2">
쉬어가는 것도 필요하다는 걸 배웠다. 무리하지 말자.
</blockquote>`
    },
    6: {
        id: 'retro-6',
        year: currentYear,
        month: 6,
        content: `<p>천천히 회복 중... 🌱</p>

<p class="font-bold text-base mt-4 mb-2">조금씩 나아지는 중</p>
<ul>
  <li>운동을 다시 시작했다. 매일은 아니지만 꾸준히</li>
  <li>물 마시기는 잘 챙기고 있다</li>
  <li>저축도 다시 정상 궤도로</li>
</ul>

<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-500 my-2">
완벽하지 않아도 괜찮다. 조금씩 나아지면 되지!
</blockquote>`
    },
    7: {
        id: 'retro-7',
        year: currentYear,
        month: 7,
        content: `<p>여름휴가 다녀왔다 🏖️</p>

<p class="font-bold text-base mt-4 mb-2">휴가의 영향</p>
<ul>
  <li>휴가 가느라 운동을 많이 못 했다</li>
  <li>그래도 여행 가서 많이 걸었으니... 운동이라고 치자</li>
  <li>여행 경비 때문에 저축이 적었다. 예상했던 일!</li>
</ul>

<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-500 my-2">
휴가는 필요하다. 재충전 완료! 8월부터 다시 시작!
</blockquote>`
    },
    8: {
        id: 'retro-8',
        year: currentYear,
        month: 8,
        content: `<p>재충전 효과가 있었다! ⚡</p>

<p class="font-bold text-base mt-4 mb-2">다시 돌아온 열정</p>
<ul>
  <li>운동을 열심히 했다. 휴가 후 체력 회복 완료</li>
  <li>새 기술 공부도 재미있게 했다</li>
  <li>저축도 정상화. 충동구매도 안 했다!</li>
</ul>

<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-500 my-2">
역시 쉬는 것도 중요하구나. 이제 하반기 화이팅!
</blockquote>`
    },
    9: {
        id: 'retro-9',
        year: currentYear,
        month: 9,
        content: `<p>가을이 왔고, 나도 성장했다 🍂</p>

<p class="font-bold text-base mt-4 mb-2">최고의 달</p>
<ul>
  <li>거의 모든 목표를 달성했다</li>
  <li>운동도, 공부도, 저축도 완벽!</li>
  <li>건강도 좋고 기분도 좋다</li>
</ul>

<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-500 my-2">
올해 가장 잘한 달인 것 같다. 이 기분 오래 가길!
</blockquote>`
    },
    10: {
        id: 'retro-10',
        year: currentYear,
        month: 10,
        content: `<p>꾸준함의 힘을 느낀다 💪</p>

<p class="font-bold text-base mt-4 mb-2">안정적인 한 달</p>
<ul>
  <li>특별한 일 없이 목표들을 잘 달성했다</li>
  <li>이제 운동이 습관이 된 것 같다</li>
  <li>저축도 자동으로 되는 느낌</li>
</ul>

<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-500 my-2">
습관이 되니까 힘들지 않네. 이게 성장인가?
</blockquote>`
    },
    11: {
        id: 'retro-11',
        year: currentYear,
        month: 11,
        content: `<p>연말 스퍼트! 🏃‍♂️💨</p>

<p class="font-bold text-base mt-4 mb-2">마지막 힘내기</p>
<ul>
  <li>올해 마지막이라고 생각하니 더 열심히 했다</li>
  <li>모든 목표 100% 달성!</li>
  <li>저축도 목표보다 더 많이 했다</li>
</ul>

<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-500 my-2">
12월도 이렇게 마무리하고 싶다. 올해 잘 마무리하자!
</blockquote>`
    },
    12: {
        id: 'retro-12',
        year: currentYear,
        month: 12,
        content: `<p>한 해의 마지막 달... 🎄</p>

<p class="font-bold text-base mt-4 mb-2">아직 진행 중</p>
<ul>
  <li>아직 달이 끝나지 않았지만 잘 하고 있다</li>
  <li>연말이라 바쁘지만 목표는 놓치지 않으려고 노력 중</li>
  <li>올해를 잘 마무리하고 싶다</li>
</ul>

<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-500 my-2">
올해 정말 많이 성장했다. 내년엔 더 멋진 목표를 세워봐야지!
</blockquote>`
    }
};

// Helper function to get retrospective for a specific month
export const getDemoRetrospective = (month: number) => {
    return DEMO_RETROSPECTIVES[month] || DEMO_RETROSPECTIVES[currentMonth];
};

// Demo resolution (year's commitment) - diary-style
export const DEMO_RESOLUTION = `<p>새해가 밝았다! 🌅 올해는 정말 제대로 해보고 싶다.</p>

<p class="font-bold text-base mt-4 mb-2">올해의 3가지 핵심 목표</p>
<ol>
  <li><strong>건강한 몸 만들기</strong> - 매일 운동하고, 물 충분히 마시기</li>
  <li><strong>커리어 성장</strong> - 새로운 기술 배우고, 강의 들으며 전문성 높이기</li>
  <li><strong>경제적 안정</strong> - 매달 저축하고 충동구매 줄이기</li>
</ol>

<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-500 my-2">
"작은 습관이 모여 큰 변화를 만든다" - 이게 올해의 좌우명!
</blockquote>

<p>힘들 때도 있겠지만, 포기하지 않고 꾸준히 해나가자. 💪</p>
<p>1년 뒤에 이 글을 다시 읽을 때 뿌듯할 수 있도록!</p>`;
