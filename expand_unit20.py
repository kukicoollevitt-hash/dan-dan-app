#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re

file_path = '/Users/dandan/Desktop/dan-dan-app_1212/public/BRAINUP/person/deep_people2_content.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Unit 20 - Jane Goodall
unit20_passages = [
    '''제인 구달은 1934년 영국 런던에서 태어났습니다. 어린 시절부터 동물을 너무 좋아해서 닭장에서 몇 시간씩 닭을 <b>관찰</b>하기도 했어요. 네 살 때는 닭이 어디서 알을 낳는지 궁금해서 닭장에 숨어 무려 네 시간이나 기다렸습니다. 가족들은 제인이 사라졌다고 <b>경찰</b>에 신고할 뻔했어요. 열 살 때 "타잔" 책을 읽고 아프리카에 가서 동물들과 함께 살겠다는 꿈을 꾸었습니다. 당시 여성에게 그런 기회는 거의 없었지만, 어머니는 "포기하지 않고 <b>노력</b>하면 꿈을 이룰 수 있다"고 <b>격려</b>해 주었어요. 제인은 그 말을 평생 가슴에 새겼습니다. 어머니의 <b>지지</b>는 제인이 어떤 어려움에도 좌절하지 않는 힘이 되었어요. 제인은 어릴 때부터 <b>자연</b>을 사랑했고, 동물들의 행동을 끊임없이 <b>연구</b>하고 싶어 했습니다.''',
    '''대학에 갈 돈이 없었던 제인은 비서 학교를 다니며 돈을 모았어요. 23살에 드디어 친구의 초대로 아프리카 케냐에 갈 수 있었습니다. 그곳에서 유명한 <b>고고학자</b> 루이스 리키 박사를 만났고, 그의 제안으로 탄자니아 곰베 <b>국립공원</b>에서 <b>침팬지</b> 연구를 시작하게 되었어요. 1960년, 26살의 제인은 어머니와 함께 곰베 숲으로 들어갔습니다. 제인의 연구 방법은 당시로서는 <b>파격</b>적이었어요. 과학자들은 멀리서 망원경으로 동물을 관찰했지만, 제인은 침팬지 무리 가까이 다가가 함께 생활했습니다. 처음에 침팬지들은 그녀를 두려워하며 피했지만, 제인은 매일 같은 시간에 같은 장소에 나타나며 <b>인내</b>심 있게 다가갔어요. 몇 년간 끈기 있게 노력한 끝에 침팬지들은 마침내 제인을 무리의 일원처럼 받아들였습니다.''',
    '''제인은 놀라운 <b>발견</b>을 했어요. 침팬지가 나뭇가지를 다듬어 도구를 만들고, 그것으로 흰개미 굴에서 개미를 꺼내 먹는다는 것이었습니다. 당시 "도구 사용"은 인간만의 특징이라고 여겨졌기에, 이 발견은 과학계를 뒤흔들었어요. 제인의 스승인 리키 박사는 "이제 인간을 다시 정의하거나, 침팬지를 인간으로 받아들여야 한다"고 말했습니다. 그녀는 침팬지에게 번호 대신 데이비드, 플로, 피피 같은 이름을 붙여주며 각각의 <b>개성</b>을 존중했어요. 과학자들은 동물에게 이름을 붙이면 객관적인 연구가 안 된다고 <b>비판</b>했지만, 제인은 침팬지도 기쁨, 슬픔, 두려움을 느끼는 <b>감정</b>이 있다는 것을 증명해냈습니다. 그녀의 연구는 동물에 대한 인간의 생각을 완전히 바꾸어 놓았어요.''',
    '''제인은 1980년대에 숲이 파괴되면서 침팬지가 빠르게 사라지는 것을 보고, <b>환경</b> <b>보호</b> 운동에 적극적으로 나섰습니다. 1991년에는 청소년 환경 단체 "뿌리와 새싹(Roots & Shoots)"을 만들어 전 세계 100개국 이상에서 활동하고 있어요. "뿌리와 새싹"은 젊은이들이 지역 사회의 환경 문제를 해결하도록 돕는 프로그램입니다. 지금도 90살이 넘은 나이에 1년에 300일 이상 전 세계를 다니며 동물 보호와 환경 보전의 중요성을 알리고 있습니다. "우리 모두가 매일 하는 작은 <b>선택</b>이 세상을 바꿀 수 있다"고 제인은 말해요. 그녀는 UN 평화 대사로 활동하며 수많은 상을 받았습니다. 제인 구달의 삶은 꿈을 향해 끈기 있게 나아가면 <b>불가능</b>해 보이는 일도 이룰 수 있다는 것을 보여 줍니다.'''
]

unit20_vocab = [
    ['관찰', '자세히 살펴보는 것'],
    ['침팬지', '아프리카에 사는 유인원'],
    ['파격', '기존의 틀을 깨는 새로운 방식'],
    ['발견', '미처 몰랐던 것을 찾아냄'],
    ['개성', '각자가 가진 고유한 특성'],
    ['감정', '기쁨, 슬픔 등 마음의 상태'],
    ['보호', '지키고 돌보는 것'],
    ['불가능', '이룰 수 없다고 여겨지는 것'],
    ['격려', '용기를 북돋아 힘을 줌'],
    ['선택', '여러 가지 중에서 골라 정함'],
    ['자연', '인간이 만들지 않은 본래의 세계'],
    ['연구', '깊이 있게 조사하고 공부함'],
    ['인내', '어려움을 참고 견디는 것'],
    ['환경', '우리를 둘러싼 주위의 모든 것'],
    ['비판', '잘못된 점을 지적하고 따짐']
]

unit20_vocabFill = [
    "{ no: 1, text: '자세히 살펴보는 것을 (      )이라 한다.', answer: '관찰', initials: 'ㄱㅊ', aliases: ['관찰'] }",
    "{ no: 2, text: '아프리카에 사는 유인원을 (      )라고 한다.', answer: '침팬지', initials: 'ㅊㅍㅈ', aliases: ['침팬지'] }",
    "{ no: 3, text: '기존의 틀을 깨는 새로운 방식을 (      )이라 한다.', answer: '파격', initials: 'ㅍㄱ', aliases: ['파격'] }",
    "{ no: 4, text: '미처 몰랐던 것을 찾아내는 것을 (      )이라 한다.', answer: '발견', initials: 'ㅂㄱ', aliases: ['발견'] }",
    "{ no: 5, text: '각자가 가진 고유한 특성을 (      )이라 한다.', answer: '개성', initials: 'ㄱㅅ', aliases: ['개성'] }",
    "{ no: 6, text: '기쁨, 슬픔 등 마음의 상태를 (      )이라 한다.', answer: '감정', initials: 'ㄱㅈ', aliases: ['감정'] }",
    "{ no: 7, text: '지키고 돌보는 것을 (      )라고 한다.', answer: '보호', initials: 'ㅂㅎ', aliases: ['보호'] }",
    "{ no: 8, text: '이룰 수 없다고 여겨지는 것을 (      )이라 한다.', answer: '불가능', initials: 'ㅂㄱㄴ', aliases: ['불가능'] }",
    "{ no: 9, text: '용기를 북돋아 힘을 주는 것을 (      )라고 한다.', answer: '격려', initials: 'ㄱㄹ', aliases: ['격려'] }",
    "{ no: 10, text: '여러 가지 중에서 골라 정하는 것을 (      )이라 한다.', answer: '선택', initials: 'ㅅㅌ', aliases: ['선택'] }",
    "{ no: 11, text: '인간이 만들지 않은 본래의 세계를 (      )이라 한다.', answer: '자연', initials: 'ㅈㅇ', aliases: ['자연'] }",
    "{ no: 12, text: '깊이 있게 조사하고 공부하는 것을 (      )라고 한다.', answer: '연구', initials: 'ㅇㄱ', aliases: ['연구'] }",
    "{ no: 13, text: '어려움을 참고 견디는 것을 (      )이라 한다.', answer: '인내', initials: 'ㅇㄴ', aliases: ['인내'] }",
    "{ no: 14, text: '우리를 둘러싼 주위의 모든 것을 (      )이라 한다.', answer: '환경', initials: 'ㅎㄱ', aliases: ['환경'] }",
    "{ no: 15, text: '잘못된 점을 지적하고 따지는 것을 (      )이라 한다.', answer: '비판', initials: 'ㅂㅍ', aliases: ['비판'] }"
]

# Find and replace Unit 20 passages
pattern20_passage = r"(deep_people2_20:[\s\S]*?passage: \[)([\s\S]*?)(\n    \],\n    vocab:)"
match20 = re.search(pattern20_passage, content)
if match20:
    new_passages = ",\n      ".join([f"'{p}'" for p in unit20_passages])
    content = content[:match20.start(2)] + "\n      " + new_passages + "\n    " + content[match20.end(2):]

# Find and replace Unit 20 vocab
pattern20_vocab = r"(deep_people2_20:[\s\S]*?vocab: \[)([\s\S]*?)(\n    \],\n    vocabFill:)"
match20v = re.search(pattern20_vocab, content)
if match20v:
    new_vocab = ",\n      ".join([f"['{v[0]}', '{v[1]}']" for v in unit20_vocab])
    content = content[:match20v.start(2)] + "\n      " + new_vocab + "\n    " + content[match20v.end(2):]

# Find and replace Unit 20 vocabFill
pattern20_vf = r"(deep_people2_20:[\s\S]*?vocabFill: \{[\s\S]*?items: \[)([\s\S]*?)(\n      \]\n    \},\n    quiz:)"
match20vf = re.search(pattern20_vf, content)
if match20vf:
    new_vocabFill = ",\n        ".join(unit20_vocabFill)
    content = content[:match20vf.start(2)] + "\n        " + new_vocabFill + "\n      " + content[match20vf.end(2):]

print("Unit 20 updated successfully!")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("File saved!")
