#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# Read the original file
with open('fit_geo_content.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Define the changes for each unit
changes = {
    'fit_geo_16': {
        'start_line': 1572,  # quiz: { line
        'q2_text': "      q2_text: '이 글의 1~4문단 전개 방식으로 가장 알맞은 것은 무엇인가요?',\n",
        'q2_opts': [
            "      q2_opts: [\n",
            "        '1문단에서 화석 연료의 정의와 고갈성을, 2문단에서 석유 고갈 예측과 온난화 문제를, 3문단에서 신재생 에너지의 등장을, 4문단에서 수소·핵융합 등 에너지 전환을 설명한다.',\n",
            "        '1문단에서 화석 연료의 정의와 고갈성을, 2문단에서 신재생 에너지의 등장을, 3문단에서 석유 고갈 예측과 온난화 문제를, 4문단에서 수소·핵융합 등 에너지 전환을 설명한다.',\n",
            "        '1문단에서 화석 연료의 정의와 고갈성을, 2문단에서 석유 고갈 예측과 온난화 문제를, 3문단에서 수소·핵융합 등 에너지 전환을, 4문단에서 신재생 에너지의 등장을 설명한다.',\n",
            "        '1문단에서 화석 연료의 정의와 고갈성을, 2문단에서 수소·핵융합 등 에너지 전환을, 3문단에서 석유 고갈 예측과 온난화 문제를, 4문단에서 신재생 에너지의 등장을 설명한다.'\n",
            "      ],\n"
        ],
        'answerKey_line': 1603,
        'answerKey': "    answerKey: { q1:'4', q2:'1', q3:'3', q4:'2' },\n",
        'explain_line': 1607,
        'explain': "      q2: '오늘날 우리가 사용하는 에너지의 대부분은',\n",
        'detail_line': 1614,
        'detail': "      q2: '정답: ①번. 1문단에서 화석 연료의 정의와 고갈성, 2문단에서 석유 고갈 예측과 온난화 문제, 3문단에서 신재생 에너지의 등장, 4문단에서 수소·핵융합·ESS·스마트 그리드 등 에너지 전환을 설명합니다.\\n\\n<오답 해설>\\n②번: 2문단과 3문단의 순서가 바뀌었습니다. 2문단은 석유 고갈 예측과 온난화 문제입니다.\\n③번: 3문단과 4문단의 순서가 바뀌었습니다. 3문단은 신재생 에너지의 등장입니다.\\n④번: 2~4문단의 순서가 모두 잘못되었습니다.',\n"
    }
}

# Replace lines for fit_geo_16
lines[1580] = changes['fit_geo_16']['q2_text']
lines[1581:1586] = changes['fit_geo_16']['q2_opts']
lines[1603] = changes['fit_geo_16']['answerKey']
lines[1607] = changes['fit_geo_16']['explain']
lines[1614] = changes['fit_geo_16']['detail']

# Write the file back
with open('fit_geo_content.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Modified fit_geo_16 successfully")
