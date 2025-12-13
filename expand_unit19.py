#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re

file_path = '/Users/dandan/Desktop/dan-dan-app_1212/public/BRAINUP/person/deep_people2_content.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Unit 19 - Charlie Chaplin
unit19_passages = [
    '''찰리 채플린은 1889년 영국 런던의 가난한 <b>빈민가</b>에서 태어났습니다. 부모님은 모두 뮤직홀 가수였지만 아버지는 <b>알코올</b> 중독으로 일찍 세상을 떠났고, 어머니는 정신 질환으로 병원에 입원했어요. 채플린은 다섯 살 때부터 형과 함께 <b>고아원</b>과 빈민 구호소를 전전해야 했습니다. 끼니를 굶는 날이 많았고, 추운 겨울에는 신문지를 옷 속에 넣어 추위를 견뎠어요. 어떤 날은 거리에서 노래를 부르며 <b>구걸</b>을 하기도 했습니다. 하지만 채플린은 어머니에게서 물려받은 연기 <b>재능</b>으로 어린 시절부터 무대에 섰어요. 여덟 살에 처음 무대에 올랐고, 열 살에는 정식으로 극단에 들어갔습니다. 어려운 환경 속에서도 사람들을 웃기면 동전을 받을 수 있다는 것을 배웠고, 그것이 그의 평생 직업이 될 줄은 몰랐어요. 가난 속에서도 <b>유머</b>를 잃지 않았던 경험은 훗날 그의 예술의 <b>원천</b>이 되었습니다.''',
    '''19살에 미국으로 건너간 채플린은 <b>무성영화</b> 배우로 일하기 시작했습니다. 그리고 1914년, 꽁무니 콧수염, 중절모, 헐렁한 바지, 지팡이를 든 "떠돌이" <b>캐릭터</b>를 만들었어요. 이 캐릭터는 가난하지만 <b>품위</b>를 잃지 않는 신사였고, 전 세계인의 사랑을 받았습니다. 채플린은 단순히 웃기기만 한 것이 아니라, 가난한 사람들의 <b>슬픔</b>과 어려움을 유머로 표현했어요. 그의 영화에는 웃음과 눈물이 함께 있었고, 보는 사람들은 웃다가도 눈시울이 붉어졌습니다. 채플린 자신의 어린 시절 경험이 영화에 고스란히 담겨 있었던 거예요. 그는 말 없이도 <b>표정</b>과 몸짓만으로 사람들을 감동시켰습니다. 언어가 필요 없는 그의 영화는 전 세계 어디서나 사랑받을 수 있었어요.''',
    '''"시티 라이트", "모던 타임스", "위대한 독재자" 등의 작품에서 채플린은 가난, 기계 문명의 문제, 독재 정치를 <b>비판</b>했습니다. 특히 1940년 "위대한 독재자"에서 그는 히틀러를 <b>풍자</b>하며 평화와 인류애를 호소했어요. 당시 히틀러가 권력의 정점에 있었기에 매우 <b>용기</b> 있는 행동이었습니다. 영화 마지막 연설 장면에서 채플린은 "우리는 기계가 아니라 인간입니다"라고 외쳤어요. 채플린은 영화의 연기, 감독, 각본, 음악까지 모두 직접 했습니다. 그는 한 장면을 <b>완벽</b>하게 만들기 위해 수백 번 촬영할 정도로 <b>집념</b>이 강했어요. 어떤 장면은 300번 이상 다시 찍기도 했습니다. 그의 영화는 단순한 오락이 아니라 사회를 향한 <b>메시지</b>였습니다.''',
    '''채플린은 "인생은 가까이서 보면 <b>비극</b>이지만 멀리서 보면 희극"이라고 말했습니다. 이 말은 그의 삶과 예술을 가장 잘 표현해요. 그의 영화는 가난하고 힘든 사람들에게 <b>희망</b>을 주었고, 웃음 속에 <b>위로</b>를 담았습니다. 1950년대 정치적 이유로 미국에서 추방당해 스위스로 <b>망명</b>했지만, 채플린은 계속 영화를 만들었어요. 1972년, 오랜 망명 끝에 미국으로 돌아온 그는 아카데미 특별상을 받으며 12분간의 기립 박수를 받았습니다. 1977년 크리스마스 날, 88세의 나이로 평화롭게 세상을 떠났어요. 그가 남긴 80편이 넘는 영화는 지금도 사람들에게 웃음과 감동을 줍니다. 채플린의 삶은 힘든 환경에서도 예술로 세상을 따뜻하게 할 수 있다는 것을 보여 주는 <b>감동</b>적인 이야기입니다.'''
]

unit19_vocab = [
    ['고아원', '부모 없는 아이들이 사는 곳'],
    ['무성영화', '소리 없이 영상만 있는 영화'],
    ['캐릭터', '작품 속 등장인물이나 그 특징'],
    ['슬픔', '마음이 아프고 서러운 감정'],
    ['비판', '잘못된 점을 지적하고 따짐'],
    ['완벽', '부족함이 전혀 없는 상태'],
    ['비극', '슬프고 불행한 일이나 이야기'],
    ['희망', '앞으로 좋은 일이 있을 거라는 기대'],
    ['풍자', '잘못된 것을 웃음으로 꼬집어 비판함'],
    ['재능', '타고난 뛰어난 능력'],
    ['빈민가', '가난한 사람들이 모여 사는 지역'],
    ['유머', '재미있고 웃음을 주는 것'],
    ['원천', '근본이 되는 바탕'],
    ['망명', '정치적 이유로 다른 나라로 피신함'],
    ['감동', '마음이 깊이 움직임']
]

unit19_vocabFill = [
    "{ no: 1, text: '부모 없는 아이들이 사는 곳을 (      )이라 한다.', answer: '고아원', initials: 'ㄱㅇㅇ', aliases: ['고아원'] }",
    "{ no: 2, text: '소리 없이 영상만 있는 영화를 (      )이라 한다.', answer: '무성영화', initials: 'ㅁㅅㅇㅎ', aliases: ['무성영화'] }",
    "{ no: 3, text: '작품 속 등장인물이나 그 특징을 (      )라고 한다.', answer: '캐릭터', initials: 'ㅋㄹㅌ', aliases: ['캐릭터'] }",
    "{ no: 4, text: '마음이 아프고 서러운 감정을 (      )이라 한다.', answer: '슬픔', initials: 'ㅅㅍ', aliases: ['슬픔'] }",
    "{ no: 5, text: '잘못된 점을 지적하고 따지는 것을 (      )이라 한다.', answer: '비판', initials: 'ㅂㅍ', aliases: ['비판'] }",
    "{ no: 6, text: '부족함이 전혀 없는 상태를 (      )이라 한다.', answer: '완벽', initials: 'ㅇㅂ', aliases: ['완벽'] }",
    "{ no: 7, text: '슬프고 불행한 일이나 이야기를 (      )이라 한다.', answer: '비극', initials: 'ㅂㄱ', aliases: ['비극'] }",
    "{ no: 8, text: '앞으로 좋은 일이 있을 거라는 기대를 (      )이라 한다.', answer: '희망', initials: 'ㅎㅁ', aliases: ['희망'] }",
    "{ no: 9, text: '잘못된 것을 웃음으로 꼬집어 비판하는 것을 (      )라고 한다.', answer: '풍자', initials: 'ㅍㅈ', aliases: ['풍자'] }",
    "{ no: 10, text: '타고난 뛰어난 능력을 (      )이라 한다.', answer: '재능', initials: 'ㅈㄴ', aliases: ['재능'] }",
    "{ no: 11, text: '가난한 사람들이 모여 사는 지역을 (      )이라 한다.', answer: '빈민가', initials: 'ㅂㅁㄱ', aliases: ['빈민가'] }",
    "{ no: 12, text: '재미있고 웃음을 주는 것을 (      )라고 한다.', answer: '유머', initials: 'ㅇㅁ', aliases: ['유머'] }",
    "{ no: 13, text: '근본이 되는 바탕을 (      )이라 한다.', answer: '원천', initials: 'ㅇㅊ', aliases: ['원천'] }",
    "{ no: 14, text: '정치적 이유로 다른 나라로 피신하는 것을 (      )이라 한다.', answer: '망명', initials: 'ㅁㅁ', aliases: ['망명'] }",
    "{ no: 15, text: '마음이 깊이 움직이는 것을 (      )이라 한다.', answer: '감동', initials: 'ㄱㄷ', aliases: ['감동'] }"
]

# Find and replace Unit 19 passages
pattern19_passage = r"(deep_people2_19:[\s\S]*?passage: \[)([\s\S]*?)(\n    \],\n    vocab:)"
match19 = re.search(pattern19_passage, content)
if match19:
    new_passages = ",\n      ".join([f"'{p}'" for p in unit19_passages])
    content = content[:match19.start(2)] + "\n      " + new_passages + "\n    " + content[match19.end(2):]

# Find and replace Unit 19 vocab
pattern19_vocab = r"(deep_people2_19:[\s\S]*?vocab: \[)([\s\S]*?)(\n    \],\n    vocabFill:)"
match19v = re.search(pattern19_vocab, content)
if match19v:
    new_vocab = ",\n      ".join([f"['{v[0]}', '{v[1]}']" for v in unit19_vocab])
    content = content[:match19v.start(2)] + "\n      " + new_vocab + "\n    " + content[match19v.end(2):]

# Find and replace Unit 19 vocabFill
pattern19_vf = r"(deep_people2_19:[\s\S]*?vocabFill: \{[\s\S]*?items: \[)([\s\S]*?)(\n      \]\n    \},\n    quiz:)"
match19vf = re.search(pattern19_vf, content)
if match19vf:
    new_vocabFill = ",\n        ".join(unit19_vocabFill)
    content = content[:match19vf.start(2)] + "\n        " + new_vocabFill + "\n      " + content[match19vf.end(2):]

print("Unit 19 updated successfully!")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("File saved!")
