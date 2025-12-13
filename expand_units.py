#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
딥세계문학(2) Unit 21~25 확장 스크립트
"""

import re

# 파일 경로
file_path = '/Users/dandan/Desktop/dan-dan-app_1212/public/BRAINUP/worldlit/deep_world2_content.js'

# 파일 읽기
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Unit 21 확장
# passage 확장
unit21_old_passage1 = "      '영국의 젊은이 <b>로빈슨 크루소</b>는 모험을 좋아해 아버지의 반대에도 불구하고 항해를 떠났어요. 아버지는 안정된 삶을 권했지만, 로빈슨은 바다에 대한 꿈을 포기할 수 없었지요. 여러 차례 항해를 하던 중 그의 배는 거대한 폭풍을 만나 <b>난파</b>되었고, 로빈슨만 홀로 살아남아 이름 모를 무인도에 <b>표류</b>하게 되었어요. 섬에는 사람 그림자조차 없었고, 로빈슨은 모든 것을 혼자 해결해야 했어요. 다행히 난파된 배에서 음식, 도구, 총, 화약 등을 건져 올릴 수 있었고, 절망하지 않고 <b>생존</b>을 위해 노력하기 시작했답니다.',"

unit21_new_passage1 = "      '영국의 젊은이 <b>로빈슨 크루소</b>는 모험을 좋아해 아버지의 반대에도 불구하고 항해를 떠났어요. 아버지는 안정된 삶을 권했지만, 로빈슨은 바다에 대한 꿈을 포기할 수 없었지요. 여러 차례 항해를 하던 중 그의 배는 거대한 폭풍을 만나 <b>난파</b>되었고, 로빈슨만 홀로 살아남아 이름 모를 무인도에 <b>표류</b>하게 되었어요. 섬에는 사람 그림자조차 없었고, 로빈슨은 모든 것을 혼자 해결해야 했어요. 다행히 난파된 배에서 음식, 도구, 총, 화약 등을 건져 올릴 수 있었고, 절망하지 않고 <b>생존</b>을 위해 노력하기 시작했답니다. 처음에는 두려움과 <b>고독</b>에 괴로워했지만, 로빈슨은 하루하루 살아가는 것에 <b>집중</b>하며 희망을 잃지 않았어요. 매일 감사한 일을 떠올리며 마음을 다잡았고, 섬에서 살아남을 방법을 하나씩 찾기 시작했지요.',"

content = content.replace(unit21_old_passage1, unit21_new_passage1)

# 파일 저장
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Unit 21 passage 1단락 확장 완료!")
