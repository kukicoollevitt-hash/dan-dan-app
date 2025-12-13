#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Unit 09 vocab & vocabFill 확장 스크립트
"""

# 파일 읽기
with open('/Users/dandan/Desktop/dan-dan-app_1212/public/BRAINUP/person/deep_people2_content.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Unit 09 - vocab 확장 (10개 → 15개)
old_vocab09 = """    vocab: [
      ['시력', '눈으로 볼 수 있는 능력'],
      ['청력', '귀로 들을 수 있는 능력'],
      ['좌절', '일이 뜻대로 되지 않아 힘들어하는 것'],
      ['가정교사', '집으로 와서 가르치는 선생님'],
      ['깨달음', '무언가를 확실히 알게 되는 것'],
      ['소통', '생각이나 감정을 주고받는 것'],
      ['열정', '어떤 일에 뜨겁게 몰두하는 마음'],
      ['노력', '어떤 목표를 위해 힘을 쓰는 것'],
      ['희망', '앞으로 좋은 일이 이루어지기를 바라는 마음'],
      ['헌신', '자신을 돌보지 않고 다른 사람을 위해 힘쓰는 것']
    ],"""

new_vocab09 = """    vocab: [
      ['시력', '눈으로 볼 수 있는 능력'],
      ['청력', '귀로 들을 수 있는 능력'],
      ['좌절', '일이 뜻대로 되지 않아 힘들어하는 것'],
      ['분노', '매우 화가 난 상태'],
      ['조언', '문제를 해결하도록 도와주는 말'],
      ['가정교사', '집으로 와서 가르치는 선생님'],
      ['인내', '어려움을 참고 견디는 것'],
      ['깨달음', '무언가를 확실히 알게 되는 것'],
      ['소통', '생각이나 감정을 주고받는 것'],
      ['열정', '어떤 일에 뜨겁게 몰두하는 마음'],
      ['점자', '시각장애인이 손가락으로 읽는 글자'],
      ['노력', '어떤 목표를 위해 힘을 쓰는 것'],
      ['끈기', '어려움을 참고 꾸준히 해내는 힘'],
      ['번역', '다른 언어로 옮겨 쓰는 것'],
      ['헌신', '자신을 돌보지 않고 다른 사람을 위해 힘쓰는 것'],
      ['장애인', '몸이나 정신의 기능이 불편한 사람'],
      ['희망', '앞으로 좋은 일이 이루어지기를 바라는 마음'],
      ['용기', '어려움을 두려워하지 않는 마음'],
      ['영감', '마음속에 떠오르는 창조적인 생각']
    ],"""

# 실제로는 15개만 필요하므로 15개로 조정
new_vocab09 = """    vocab: [
      ['시력', '눈으로 볼 수 있는 능력'],
      ['청력', '귀로 들을 수 있는 능력'],
      ['좌절', '일이 뜻대로 되지 않아 힘들어하는 것'],
      ['분노', '매우 화가 난 상태'],
      ['조언', '문제를 해결하도록 도와주는 말'],
      ['가정교사', '집으로 와서 가르치는 선생님'],
      ['인내', '어려움을 참고 견디는 것'],
      ['깨달음', '무언가를 확실히 알게 되는 것'],
      ['소통', '생각이나 감정을 주고받는 것'],
      ['열정', '어떤 일에 뜨겁게 몰두하는 마음'],
      ['점자', '시각장애인이 손가락으로 읽는 글자'],
      ['노력', '어떤 목표를 위해 힘을 쓰는 것'],
      ['끈기', '어려움을 참고 꾸준히 해내는 힘'],
      ['번역', '다른 언어로 옮겨 쓰는 것'],
      ['헌신', '자신을 돌보지 않고 다른 사람을 위해 힘쓰는 것']
    ],"""

content = content.replace(old_vocab09, new_vocab09)

# Unit 09 - vocabFill 확장 (10개 → 15개)
old_vocabFill09 = """    vocabFill: {
      instructions: '[헬렌 켈러 관련 어휘]',
      items: [
        { no: 1, text: '눈으로 볼 수 있는 능력을 (      )이라고 한다.', answer: '시력', initials: 'ㅅㄹ', aliases: ['시력'] },
        { no: 2, text: '귀로 들을 수 있는 능력을 (      )이라고 한다.', answer: '청력', initials: 'ㅊㄹ', aliases: ['청력'] },
        { no: 3, text: '일이 뜻대로 되지 않아 힘들어하는 것을 (      )이라 한다.', answer: '좌절', initials: 'ㅈㅈ', aliases: ['좌절'] },
        { no: 4, text: '집으로 와서 가르치는 선생님을 (        )라고 한다.', answer: '가정교사', initials: 'ㄱㅈㄱㅅ', aliases: ['가정교사'] },
        { no: 5, text: '무언가를 확실히 알게 되는 것을 (      )이라 한다.', answer: '깨달음', initials: 'ㄲㄷㅇ', aliases: ['깨달음'] },
        { no: 6, text: '생각이나 감정을 주고받는 것을 (      )이라 한다.', answer: '소통', initials: 'ㅅㅌ', aliases: ['소통'] },
        { no: 7, text: '어떤 일에 뜨겁게 몰두하는 마음을 (      )이라 한다.', answer: '열정', initials: 'ㅇㅈ', aliases: ['열정'] },
        { no: 8, text: '어떤 목표를 위해 힘을 쓰는 것을 (      )이라 한다.', answer: '노력', initials: 'ㄴㄹ', aliases: ['노력'] },
        { no: 9, text: '앞으로 좋은 일이 이루어지기를 바라는 마음을 (      )이라 한다.', answer: '희망', initials: 'ㅎㅁ', aliases: ['희망'] },
        { no: 10, text: '자신을 돌보지 않고 다른 사람을 위해 힘쓰는 것을 (      )이라 한다.', answer: '헌신', initials: 'ㅎㅅ', aliases: ['헌신'] }
      ]
    },"""

new_vocabFill09 = """    vocabFill: {
      instructions: '[헬렌 켈러 관련 어휘]',
      items: [
        { no: 1, text: '눈으로 볼 수 있는 능력을 (      )이라고 한다.', answer: '시력', initials: 'ㅅㄹ', aliases: ['시력'] },
        { no: 2, text: '귀로 들을 수 있는 능력을 (      )이라고 한다.', answer: '청력', initials: 'ㅊㄹ', aliases: ['청력'] },
        { no: 3, text: '일이 뜻대로 되지 않아 힘들어하는 것을 (      )이라 한다.', answer: '좌절', initials: 'ㅈㅈ', aliases: ['좌절'] },
        { no: 4, text: '매우 화가 난 상태를 (      )라고 한다.', answer: '분노', initials: 'ㅂㄴ', aliases: ['분노'] },
        { no: 5, text: '문제를 해결하도록 도와주는 말을 (      )이라 한다.', answer: '조언', initials: 'ㅈㅇ', aliases: ['조언'] },
        { no: 6, text: '집으로 와서 가르치는 선생님을 (        )라고 한다.', answer: '가정교사', initials: 'ㄱㅈㄱㅅ', aliases: ['가정교사'] },
        { no: 7, text: '어려움을 참고 견디는 것을 (      )라고 한다.', answer: '인내', initials: 'ㅇㄴ', aliases: ['인내'] },
        { no: 8, text: '무언가를 확실히 알게 되는 것을 (      )이라 한다.', answer: '깨달음', initials: 'ㄲㄷㅇ', aliases: ['깨달음'] },
        { no: 9, text: '생각이나 감정을 주고받는 것을 (      )이라 한다.', answer: '소통', initials: 'ㅅㅌ', aliases: ['소통'] },
        { no: 10, text: '어떤 일에 뜨겁게 몰두하는 마음을 (      )이라 한다.', answer: '열정', initials: 'ㅇㅈ', aliases: ['열정'] },
        { no: 11, text: '시각장애인이 손가락으로 읽는 글자를 (      )라고 한다.', answer: '점자', initials: 'ㅈㅈ', aliases: ['점자'] },
        { no: 12, text: '어떤 목표를 위해 힘을 쓰는 것을 (      )이라 한다.', answer: '노력', initials: 'ㄴㄹ', aliases: ['노력'] },
        { no: 13, text: '어려움을 참고 꾸준히 해내는 힘을 (      )이라 한다.', answer: '끈기', initials: 'ㄲㄱ', aliases: ['끈기'] },
        { no: 14, text: '다른 언어로 옮겨 쓰는 것을 (      )이라 한다.', answer: '번역', initials: 'ㅂㅇ', aliases: ['번역'] },
        { no: 15, text: '자신을 돌보지 않고 다른 사람을 위해 힘쓰는 것을 (      )이라 한다.', answer: '헌신', initials: 'ㅎㅅ', aliases: ['헌신'] }
      ]
    },"""

content = content.replace(old_vocabFill09, new_vocabFill09)

# 파일 쓰기
with open('/Users/dandan/Desktop/dan-dan-app_1212/public/BRAINUP/person/deep_people2_content.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Unit 09 vocab & vocabFill 확장 완료!")
