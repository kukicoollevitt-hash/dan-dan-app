const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/worldlit/deep_world1_content.js", "utf8");

// vocab과 vocabFill에서 제거할 항목들 (vocabFill 미사용 또는 passage에 없음)
const removals = {
  'deep_world1_01': ['고백하다'],
  'deep_world1_02': ['표류'],
  'deep_world1_03': ['간절함', '고귀하다', '황홀함', '용감하다'],
  'deep_world1_04': ['시험(試驗)', '사제(司祭)', '엄숙하다', '인도하다'],
  'deep_world1_05': ['길들이다', '애쓰다', '깨닫다', '유일하다', '외롭다'],
  'deep_world1_06': ['수상하다'],
  'deep_world1_07': ['신기하다', '뉘우치다'],
  'deep_world1_08': ['신비롭다', '깨닫다'],
  'deep_world1_09': ['혼란스럽다'],
  'deep_world1_12': ['명령'],
  'deep_world1_13': ['상징', '재미'],
  'deep_world1_14': ['고통', '구원자', '결혼'],
  'deep_world1_15': ['칼'],
  'deep_world1_19': ['교훈'],
  'deep_world1_20': ['지혜'],
  'deep_world1_22': ['용기'],
  'deep_world1_23': ['지혜'],
  'deep_world1_24': ['우아하다'],
  'deep_world1_26': ['협력', '결혼'],
  'deep_world1_27': ['변신'],
  'deep_world1_28': ['피리 부는 사나이', '음악', '복수'],
  'deep_world1_29': ['장화 신은 고양이', '지혜'],
  'deep_world1_31': ['구출', '속임수'],
  'deep_world1_32': ['저주'],
  'deep_world1_36': ['마법'],
  'deep_world1_38': ['관계'],
  'deep_world1_39': ['위기', '교훈'],
  'deep_world1_40': ['겸손', '인내', '성공']
};

Object.entries(removals).forEach(([unit, words]) => {
  words.forEach(word => {
    // vocab 배열에서 제거
    const escapedWord = word.replace(/[()]/g, '\\$&');
    const vocabRegex = new RegExp(`\\s*\\['${escapedWord}',\\s*'[^']*'\\],?\\n?`, 'g');
    const before = content;
    content = content.replace(vocabRegex, '');
    if (before !== content) {
      console.log(`vocab 제거: ${unit} - ${word}`);
    }

    // vocabFill에서 제거
    const vocabFillRegex = new RegExp(`\\s*\\{\\s*no:\\s*\\d+,\\s*text:\\s*'[^']*',\\s*answer:\\s*'${escapedWord}'[^}]*\\},?\\n?`, 'g');
    const before2 = content;
    content = content.replace(vocabFillRegex, '');
    if (before2 !== content) {
      console.log(`vocabFill 제거: ${unit} - ${word}`);
    }
  });
});

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/worldlit/deep_world1_content.js", content);
console.log("\nvocab 제거 완료!");
