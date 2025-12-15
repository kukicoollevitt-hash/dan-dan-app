#!/usr/bin/env python3
"""
딥물리 03~20 문제 자동 생성 스크립트
"""

import json
import re

# 정답 분포 계획
ANSWER_DISTRIBUTION = {
    3: [2,1,4,2],
    4: [1,3,2,1],
    5: [4,2,1,3],
    6: [2,4,2,4],
    7: [3,1,3,1],
    8: [1,2,4,2],
    9: [4,3,1,3],
    10: [2,1,2,4],
    11: [3,4,3,1],
    12: [1,2,1,2],
    13: [4,3,4,3],
    14: [2,1,2,4],
    15: [3,4,1,2],
    16: [1,3,4,1],
    17: [4,2,3,4],
    18: [2,3,1,3],
    19: [3,1,2,2],
    20: [1,4,4,1]
}

print("딥물리 03~20 문제 생성 계획:")
print("=" * 60)
for unit_num, answers in ANSWER_DISTRIBUTION.items():
    print(f"딥물리 {unit_num:02d}: Q1={answers[0]}, Q2={answers[1]}, Q3={answers[2]}, Q4={answers[3]}")
print("=" * 60)
print("\n이 스크립트는 계획만 출력합니다.")
print("실제 문제 생성은 deep_physics_content.js 파일을 직접 수정해야 합니다.")
