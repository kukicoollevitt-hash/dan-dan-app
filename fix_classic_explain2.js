const fs = require('fs');

let content = fs.readFileSync('public/BRAINUP/korlit/on_classic_content.js', 'utf8');

// on_classic_28 q1: passage는 "에 깊은 분노를 느꼈습니다" (<b>차별</b> 뒤)
content = content.replace(
  `q1: '길동은 부당한 차별에 깊은 분노를 느꼈습니다',`,
  `q1: '에 깊은 분노를 느꼈습니다',`
);

// on_classic_32 q4: passage에서 찾기 - "수많은 고난과 시련을 겪으며"
content = content.replace(
  `q4: '부모를 원망하지 않고 효도하며 살았어요',`,
  `q4: '수많은 고난과 시련을 겪으며 칼산, 불산, 얼음산을 넘었어요',`
);

// on_classic_33 q1: passage에서 찾기
content = content.replace(
  `q1: '마침내 금방울은 원수를 갚고 나라를 구하는 영웅이 되었습니다',`,
  `q1: '마침내 금방울은 원수를 갚고 나라를 구하는 영웅이 되었어요',`
);

// on_classic_34 q2: "의 교훈을 담고 있으며"
content = content.replace(
  `q2: '의 교훈을 담고 있어요',`,
  `q2: '의 교훈을 담고 있으며, 정의와 충성을 지키면 결국 승리한다는 메시지를 전해줍니다',`
);

// on_classic_35 q2: "의 교훈을 전해주는 감동적인 작품이에요"
content = content.replace(
  `q2: '의 교훈을 전해주는 이야기예요',`,
  `q2: '의 교훈을 전해주는 감동적인 작품이에요',`
);

// on_classic_36 q2: "했어요" -> "했습니다"? passage 확인 필요
content = content.replace(
  `q2: '소대성은 태어나자마자 부모를 잃고 고아가 되어 거리를 떠돌며 구걸하는 생활을 했어요',`,
  `q2: '소대성은 태어나자마자 부모를 잃고 고아가 되어 거리를 떠돌며 구걸하는 생활을 했습니다',`
);

// on_classic_38 q2: passage 확인 필요 - "의 교훈을 담고 있습니다"?
content = content.replace(
  `q2: '의 교훈을 담고 있어요',`,
  `q2: '의 교훈을 담고 있습니다',`
);

// on_classic_39 q2: 원래 값 수정 안됨 - 다시 수정
content = content.replace(
  `q2: '4문단에서 둘은 은하수에서 일 년에 한 번 만날 수 있게 되었고, 진정한 사랑은 어떤 장벽도 넘을 수 있다는 희망을 전해준다고 서술되어 있습니다',`,
  `q2: '둘은 은하수에서 일 년에 한 번 만날 수 있게 되었어요',`
);

// on_classic_40 q1: "돌아왔어요" -> passage 확인
content = content.replace(
  `q1: '최랑은 이미 죽었지만, 이생에 대한 사랑을 잊을 수 없어 귀신이 되어 돌아왔어요',`,
  `q1: '최랑은 이미 죽었지만 이생에 대한 사랑을 잊을 수 없어 귀신이 되어 돌아왔어요',`
);

// on_classic_40 q2: passage 확인
content = content.replace(
  `q2: '이생이 담장 너머로 최랑을 보고 첫눈에 반했어요',`,
  `q2: '둘은 편지를 주고받으며 사랑이 깊어졌고',`
);

// on_classic_40 q3: passage 확인
content = content.replace(
  `q3: '이생규장전은 사랑하는 사람과의 이별이 너무나 슬프다는 것을 보여줍니다',`,
  `q3: '진정한 사랑은 죽음도 막을 수 없다는 것을 보여줍니다',`
);

fs.writeFileSync('public/BRAINUP/korlit/on_classic_content.js', content);
console.log('✅ on_classic 21~40 explain 추가 수정 완료');
