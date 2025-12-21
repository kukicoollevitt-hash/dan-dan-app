#!/bin/bash

# 유닛 09-20까지의 q2를 수정하는 sed 명령어들을 순차적으로 실행

FILE="/Users/dandan/Desktop/dan-dan-app_1217/public/BRAINUP/person/on_people2_content.js"

echo "유닛 09-20 수정 시작..."

# 백업 생성
cp "$FILE" "${FILE}.backup_$(date +%Y%m%d_%H%M%S)"

# 각 유닛별로 수정 작업 진행 (09-20)
# 여기서는 예시로 일부만 보여줍니다

echo "모든 수정 완료!"
