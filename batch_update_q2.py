#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re

# 파일 읽기
file_path = '/Users/dandan/Desktop/dan-dan-app_1217/public/BRAINUP/person/on_people2_content.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 유닛별 수정 데이터
updates = {
    '05': {
        'old_q2_text': "q2_text: '이 글의 전개 구조로 가장 알맞은 것은 무엇인가요?',",
        'old_q2_opts': """q2_opts: [
        '아인슈타인의 어린 시절 → 상대성 이론의 탄생 → 업적과 교훈',
        '상대성 이론 설명 → 아인슈타인의 어린 시절 → 노벨상 수상',
        '노벨상 수상 → 어린 시절 회상 → 이론 설명',
        '문제 제기 → 해결 방법 → 결론'
      ],""",
        'new_q2_text': "q2_text: '각 문단의 중심 내용으로 알맞은 것은?',",
        'new_q2_opts': """q2_opts: [
        '1문단 : 평범해 보였지만 상상하기 좋아한 어린 시절',
        '2문단 : 노벨상 수상과 상상력의 중요성',
        '3문단 : 빛을 타고 달린다는 질문, 특허청 근무하며 상대성 이론 발표',
        '4문단 : E=mc² 발견과 혁명적인 이론'
      ],""",
        'old_explain': "q2:'해설: 글은 어린 시절 → 상대성 이론의 탄생 → 업적과 교훈 순서로 전개됩니다.',",
        'new_explain': "q2:'해설: 1문단의 중심 내용은 평범해 보였지만 상상하기 좋아한 어린 시절입니다. 2문단은 빛을 타고 달린다는 질문, 특허청 근무하며 상대성 이론 발표, 3문단은 E=mc² 발견과 혁명적인 이론, 4문단은 노벨상 수상과 상상력의 중요성입니다.',"
    },
    '06': {
        'old_q2_text': "q2_text: '이 글의 전개 구조로 가장 알맞은 것은 무엇인가요?',",
        'old_q2_opts': """q2_opts: [
        '노벨상 수상 → 어린 시절 → 연구 과정',
        '어린 시절과 도전 → 연구와 발견 → 업적과 의미',
        '과학 원리 설명 → 인물 소개 → 결론',
        '문제 제기 → 해결 방법 → 결론'
      ],""",
        'new_q2_text': "q2_text: '각 문단의 중심 내용으로 알맞은 것은?',",
        'new_q2_opts': """q2_opts: [
        '1문단 : 폴로늄과 라듐 발견, 두 번의 노벨상',
        '2문단 : 방사능 연구와 수천 번의 실험',
        '3문단 : 어려운 환경에서도 과학의 꿈을 키운 어린 시절',
        '4문단 : 폴로늄과 라듐 발견, 두 번의 노벨상'
      ],""",
        'old_explain': "q2:'해설: 글은 어린 시절과 도전 → 연구와 발견 → 업적과 의미 순서로 전개됩니다.',",
        'new_explain': "q2:'해설: 1문단의 중심 내용은 어려운 환경에서도 과학의 꿈을 키운 어린 시절입니다. 2문단은 방사능 연구와 수천 번의 실험, 3문단은 폴로늄과 라듐 발견, 두 번의 노벨상, 4문단은 암 치료와 의학 발전에 기여, 여성 과학자의 개척자입니다.',"
    }
}

# 유닛 05 수정
if '05' in updates:
    u = updates['05']
    content = content.replace(u['old_q2_text'], u['new_q2_text'])
    content = content.replace(u['old_q2_opts'], u['new_q2_opts'])
    content = content.replace(u['old_explain'], u['new_explain'])

# 유닛 06 수정
if '06' in updates:
    u = updates['06']
    content = content.replace(u['old_q2_text'], u['new_q2_text'])
    content = content.replace(u['old_q2_opts'], u['new_q2_opts'])
    content = content.replace(u['old_explain'], u['new_explain'])

# 파일 저장
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("유닛 05, 06 수정 완료")
