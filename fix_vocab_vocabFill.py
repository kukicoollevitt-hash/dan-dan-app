#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Unit 21~25의 vocab과 vocabFill을 정확히 15개로 수정하는 스크립트
"""

import re

file_path = '/Users/dandan/Desktop/dan-dan-app_1212/public/BRAINUP/worldlit/deep_world2_content.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Unit 21 vocab 수정 (정확한 매칭)
unit21_old_vocab = """    vocab: [
      ['표류','물결에 떠밀려 정처 없이 떠다님.'],
      ['생존','살아남음.'],
      ['지혜','사물의 이치를 빠르게 깨닫는 슬기.'],
      ['근면','부지런히 일함.'],
      ['개척','새로운 분야나 땅을 열어 나감.'],
      ['적응','환경에 맞추어 익숙해짐.'],
      ['귀환','본래의 곳으로 돌아감.'],
      ['의지','어떤 일을 이루려는 마음.'],
      ['난파','배가 부서지거나 가라앉음.'],
      ['용기','겁내지 않고 씩씩하게 나아가는 마음.']
    ],
    vocabFill: {
      instructions: '',
      items: [
        { no: 1, text: '물결에 떠밀려 정처 없이 떠다니는 것을 (      )라고 해요.', answer: '표류', initials: 'ㅍㄹ', aliases: ['표류'] },
        { no: 2, text: '살아남는 것을 (      )이라고 해요.', answer: '생존', initials: 'ㅅㅈ', aliases: ['생존'] },
        { no: 3, text: '사물의 이치를 빠르게 깨닫는 슬기를 (      )라고 해요.', answer: '지혜', initials: 'ㅈㅎ', aliases: ['지혜'] },
        { no: 4, text: '부지런히 일하는 것을 (      )이라고 해요.', answer: '근면', initials: 'ㄱㅁ', aliases: ['근면'] },
        { no: 5, text: '새로운 분야나 땅을 열어 나가는 것을 (      )이라고 해요.', answer: '개척', initials: 'ㄱㅊ', aliases: ['개척'] },
        { no: 6, text: '환경에 맞추어 익숙해지는 것을 (      )이라고 해요.', answer: '적응', initials: 'ㅈㅇ', aliases: ['적응'] },
        { no: 7, text: '본래의 곳으로 돌아가는 것을 (      )이라고 해요.', answer: '귀환', initials: 'ㄱㅎ', aliases: ['귀환'] },
        { no: 8, text: '어떤 일을 이루려는 마음을 (      )라고 해요.', answer: '의지', initials: 'ㅇㅈ', aliases: ['의지'] },
        { no: 9, text: '배가 부서지거나 가라앉는 것을 (      )라고 해요.', answer: '난파', initials: 'ㄴㅍ', aliases: ['난파'] },
        { no: 10, text: '겁내지 않고 씩씩하게 나아가는 마음을 (      )라고 해요.', answer: '용기', initials: 'ㅇㄱ', aliases: ['용기'] }
      ]
    },"""

unit21_new_vocab = """    vocab: [
      ['표류','물결에 떠밀려 정처 없이 떠다님.'],
      ['생존','살아남음.'],
      ['지혜','사물의 이치를 빠르게 깨닫는 슬기.'],
      ['근면','부지런히 일함.'],
      ['개척','새로운 분야나 땅을 열어 나감.'],
      ['적응','환경에 맞추어 익숙해짐.'],
      ['귀환','본래의 곳으로 돌아감.'],
      ['의지','어떤 일을 이루려는 마음.'],
      ['난파','배가 부서지거나 가라앉음.'],
      ['용기','겁내지 않고 씩씩하게 나아가는 마음.'],
      ['고독','외롭고 쓸쓸함.'],
      ['집중','한 곳에 마음이나 힘을 모음.'],
      ['확보','필요한 것을 확실히 가짐.'],
      ['자급자족','스스로 필요한 것을 만들어 씀.'],
      ['동료','함께 일하거나 생활하는 사람.']
    ],
    vocabFill: {
      instructions: '',
      items: [
        { no: 1, text: '물결에 떠밀려 정처 없이 떠다니는 것을 (      )라고 해요.', answer: '표류', initials: 'ㅍㄹ', aliases: ['표류'] },
        { no: 2, text: '살아남는 것을 (      )이라고 해요.', answer: '생존', initials: 'ㅅㅈ', aliases: ['생존'] },
        { no: 3, text: '사물의 이치를 빠르게 깨닫는 슬기를 (      )라고 해요.', answer: '지혜', initials: 'ㅈㅎ', aliases: ['지혜'] },
        { no: 4, text: '부지런히 일하는 것을 (      )이라고 해요.', answer: '근면', initials: 'ㄱㅁ', aliases: ['근면'] },
        { no: 5, text: '새로운 분야나 땅을 열어 나가는 것을 (      )이라고 해요.', answer: '개척', initials: 'ㄱㅊ', aliases: ['개척'] },
        { no: 6, text: '환경에 맞추어 익숙해지는 것을 (      )이라고 해요.', answer: '적응', initials: 'ㅈㅇ', aliases: ['적응'] },
        { no: 7, text: '본래의 곳으로 돌아가는 것을 (      )이라고 해요.', answer: '귀환', initials: 'ㄱㅎ', aliases: ['귀환'] },
        { no: 8, text: '어떤 일을 이루려는 마음을 (      )라고 해요.', answer: '의지', initials: 'ㅇㅈ', aliases: ['의지'] },
        { no: 9, text: '배가 부서지거나 가라앗는 것을 (      )라고 해요.', answer: '난파', initials: 'ㄴㅍ', aliases: ['난파'] },
        { no: 10, text: '겁내지 않고 씩씩하게 나아가는 마음을 (      )라고 해요.', answer: '용기', initials: 'ㅇㄱ', aliases: ['용기'] },
        { no: 11, text: '외롭고 쓸쓸한 것을 (      )이라고 해요.', answer: '고독', initials: 'ㄱㄷ', aliases: ['고독'] },
        { no: 12, text: '한 곳에 마음이나 힘을 모으는 것을 (      )이라고 해요.', answer: '집중', initials: 'ㅈㅈ', aliases: ['집중'] },
        { no: 13, text: '필요한 것을 확실히 가지는 것을 (      )라고 해요.', answer: '확보', initials: 'ㅎㅂ', aliases: ['확보'] },
        { no: 14, text: '스스로 필요한 것을 만들어 쓰는 것을 (          )이라고 해요.', answer: '자급자족', initials: 'ㅈㄱㅈㅈ', aliases: ['자급자족'] },
        { no: 15, text: '함께 일하거나 생활하는 사람을 (      )라고 해요.', answer: '동료', initials: 'ㄷㄹ', aliases: ['동료'] }
      ]
    },"""

# Unit 21 수정 (deep_world2_21 컨텍스트 내에서만)
# 먼저 deep_world2_21 블록 찾기
match = re.search(r'(deep_world2_21: \{[\s\S]*?)(deep_world2_22:)', content)
if match:
    unit21_block = match.group(1)
    # 이 블록 내에서 vocab 교체
    new_unit21_block = unit21_block.replace(unit21_old_vocab, unit21_new_vocab)
    if unit21_block != new_unit21_block:
        content = content.replace(unit21_block, new_unit21_block)
        print("Unit 21 vocab/vocabFill 수정 완료!")
    else:
        print("Unit 21 수정 실패 - 패턴 불일치")
else:
    print("Unit 21 블록을 찾을 수 없음")

# 파일 저장
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("="*60)
print("수정 완료! 파일 저장됨")
print("="*60)
