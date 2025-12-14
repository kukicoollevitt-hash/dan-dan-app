#!/bin/bash

# 딥생물 13-20 Q2 확인 스크립트

for i in 13 14 15 16 17 18 19 20; do
  echo "=== 딥생물 $i ==="

  # answerKey의 q2 값 추출
  answer=$(grep -A 100 "deep_bio_$i:" public/BRAINUP/science/deep_bio_content.js | grep "answerKey:" | head -1 | grep -o "q2:'[0-9]'" | cut -d"'" -f2)

  echo "정답: $answer번"
  echo ""
done
