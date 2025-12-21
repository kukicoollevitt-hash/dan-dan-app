#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re

# 파일 읽기
file_path = '/Users/dandan/Desktop/dan-dan-app_1217/public/BRAINUP/person/on_people2_content.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 유닛 07-20의 수정 데이터
# 각 유닛의 (old_pattern, new_q2_text, new_q2_opts, new_explain) 형태

replacements = [
    # Unit 07 - 간디 (answer: 3)
    {
        'unit': '07',
        'find_after': "on_people2_07:",
        'old_q2': r"q2_text: '이 글의 전개 구조로 가장 알맞은 것은 무엇인가요\?',\s*q2_opts: \[[\s\S]*?\],",
        'new_q2': """q2_text: '각 문단의 중심 내용으로 알맞은 것은?',
      q2_opts: [
        '1문단 : 비폭력과 불복종으로 저항, 소금 행진',
        '2문단 : 평화와 정의의 상징, 많은 인권 운동가에게 영감',
        '3문단 : 소금 행진으로 세계의 주목, 인도 독립 이끔',
        '4문단 : 비폭력과 불복종으로 저항, 소금 행진'
      ],""",
        'old_explain': r"q2:'해설: 글은 어린 시절과 각성 → 비폭력 저항 운동 → 업적과 영향 순서로 전개됩니다\.',",
        'new_explain': "q2:'해설: 1문단의 중심 내용은 인도에서 태어나 차별 경험, 불공정에 맞서기로 결심입니다. 2문단은 비폭력과 불복종으로 저항, 소금 행진, 3문단은 소금 행진으로 세계의 주목, 인도 독립 이끔, 4문단은 평화와 정의의 상징, 많은 인권 운동가에게 영감입니다.',"
    },
    # Unit 08 - 라이트 형제 (answer: 4)
    {
        'unit': '08',
        'find_after': "on_people2_08:",
        'old_q2': r"q2_text: '이 글의 전개 구조로 가장 알맞은 것은 무엇인가요\?',\s*q2_opts: \[[\s\S]*?\],",
        'new_q2': """q2_text: '각 문단의 중심 내용으로 알맞은 것은?',
      q2_opts: [
        '1문단 : 수백 번의 실패와 포기하지 않는 노력, 협력',
        '2문단 : 플라이어 호 완성과 인류 최초의 동력 비행',
        '3문단 : 어린 시절의 꿈과 자전거 가게에서 비행 연구 시작',
        '4문단 : 최초의 동력 비행 성공과 항공 산업의 시작'
      ],""",
        'old_explain': r"q2:'해설: 글은 어린 시절의 꿈 → 연구와 실패 극복 → 성공과 의미 순서로 전개됩니다\.',",
        'new_explain': "q2:'해설: 1문단의 중심 내용은 어린 시절의 꿈과 자전거 가게에서 비행 연구 시작입니다. 2문단은 수백 번의 실패와 포기하지 않는 노력, 협력, 3문단은 플라이어 호 완성과 인류 최초의 동력 비행, 4문단은 최초의 동력 비행 성공과 항공 산업의 시작입니다.',"
    }
]

# 수정 적용
for r in replacements:
    # q2 질문과 선지 수정
    pattern = re.compile(r['old_q2'], re.MULTILINE)
    content = pattern.sub(r['new_q2'], content, count=1)
    
    # explain 수정
    pattern_explain = re.compile(r['old_explain'], re.MULTILINE)
    content = pattern_explain.sub(r['new_explain'], content, count=1)
    
    print(f"Unit {r['unit']} 수정 완료")

# 파일 저장
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("\n모든 수정 완료!")
