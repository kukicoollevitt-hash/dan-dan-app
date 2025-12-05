#!/usr/bin/env python3
"""
bio_06~20.html 파일의 Q1/Q2 선지와 Q3/Q4를 새 콘텐츠에 맞게 업데이트
"""

import re
import os

# 새 콘텐츠 정의 (bio_06~20)
BIO_QUIZ_DATA = {
    'bio_06': {
        'q1_text': '이 글의 내용과 일치하는 것은 무엇인가요?',
        'q1_opts': [
            '① 뿌리털은 줄기에 있어서 물을 저장한다.',
            '② 물관은 잎에서 만든 양분을 뿌리로 운반한다.',
            '③ 체관은 잎에서 만들어진 양분을 뿌리나 열매로 운반한다.',
            '④ 기공은 뿌리에 있어서 물을 흡수한다.'
        ],
        'q2_text': '이 글의 전개 방식으로 가장 알맞은 것은 무엇인가요?',
        'q2_opts': [
            '① 식물의 한 기관을 시간 순서대로 설명하는 방식',
            '② 뿌리, 줄기, 잎의 구조와 기능을 차례로 설명하는 방식',
            '③ 식물과 동물의 공통점을 비교하는 방식',
            '④ 여러 과학자의 주장을 반박하는 방식'
        ],
        'q3_html': '줄기 안에는 물과 무기 양분을 위로 운반하는 <input class="inline-input" id="q3-1" type="text" placeholder="ㅁㄱ">과 양분을 아래로 운반하는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅊㄱ">이 있습니다.',
        'q4_html': '잎 표면의 <input class="inline-input" id="q4-1" type="text" placeholder="ㄱㄱ">을 통해 이산화탄소를 흡수하고, <input class="inline-input" id="q4-2" type="text" placeholder="ㅈㅅ ㅈㅇ">을 통해 수증기를 내보냅니다.'
    },
    'bio_07': {
        'q1_text': '이 글의 내용과 일치하는 것은 무엇인가요?',
        'q1_opts': [
            '① 광합성은 동물의 근육에서 일어난다.',
            '② 엽록소는 빨간색 색소로 열을 흡수한다.',
            '③ 광합성을 통해 포도당과 산소가 만들어진다.',
            '④ 광합성에는 산소와 포도당이 재료로 필요하다.'
        ],
        'q2_text': '이 글의 전개 방식으로 가장 알맞은 것은 무엇인가요?',
        'q2_opts': [
            '① 광합성의 정의 → 재료와 과정 → 생태계에서의 중요성 순서로 설명',
            '② 한 식물의 일생을 시간 순서대로 설명',
            '③ 광합성에 대한 찬반 의견을 비교하여 제시',
            '④ 여러 과학자의 실험 결과를 나열'
        ],
        'q3_html': '광합성은 식물 잎의 <input class="inline-input" id="q3-1" type="text" placeholder="ㅇㄹㅊ">에서 일어나며, 그 안의 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㄹㅅ">가 빛을 흡수합니다.',
        'q4_html': '광합성의 재료는 빛, 물, <input class="inline-input" id="q4-1" type="text" placeholder="ㅇㅅㅎㅌㅅ">이고, 결과물은 포도당과 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅ">입니다.'
    },
    'bio_08': {
        'q1_text': '이 글의 내용과 일치하는 것은 무엇인가요?',
        'q1_opts': [
            '① 세포벽은 동물 세포에만 있다.',
            '② 미토콘드리아는 빛을 흡수해 광합성을 한다.',
            '③ 식물 세포에는 엽록체와 세포벽이 있어 동물 세포와 다르다.',
            '④ 핵은 영양분을 저장하는 역할을 한다.'
        ],
        'q2_text': '이 글의 전개 방식으로 가장 알맞은 것은 무엇인가요?',
        'q2_opts': [
            '① 세포의 정의 → 세포 내부 구조 → 동물 세포와 식물 세포 비교 순서로 설명',
            '② 과학자의 일대기를 시간 순서로 서술',
            '③ 세포에 대한 찬성과 반대 의견을 나열',
            '④ 특정 세포의 하루 일과를 묘사'
        ],
        'q3_html': '세포 안의 <input class="inline-input" id="q3-1" type="text" placeholder="ㅎ">에는 DNA가 있어 세포 활동을 지휘하고, <input class="inline-input" id="q3-2" type="text" placeholder="ㅁㅌㅋㄷㄹㅇ">는 에너지를 만듭니다.',
        'q4_html': '식물 세포에는 광합성을 하는 <input class="inline-input" id="q4-1" type="text" placeholder="ㅇㄹㅊ">가 있고, 세포막 바깥에 단단한 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅍㅂ">이 있습니다.'
    },
    'bio_09': {
        'q1_text': '이 글의 내용과 일치하는 것은 무엇인가요?',
        'q1_opts': [
            '① 세포 분열은 간기에 실제로 일어난다.',
            '② 체세포 분열 결과 유전 정보가 다른 세포가 만들어진다.',
            '③ 생장점은 뿌리 끝과 줄기 끝에 있어 식물 성장을 담당한다.',
            '④ 암세포는 주변 신호에 따라 분열을 멈춘다.'
        ],
        'q2_text': '이 글의 전개 방식으로 가장 알맞은 것은 무엇인가요?',
        'q2_opts': [
            '① 세포 분열의 정의와 주기 → 체세포 분열 과정 → 생장점과 암세포 순서로 설명',
            '② 한 과학자의 연구 일지를 시간 순으로 서술',
            '③ 세포 분열에 대한 여러 가설을 비교',
            '④ 실험 결과를 그래프로 제시하고 해석'
        ],
        'q3_html': '세포 주기는 세포가 자라는 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ">와 실제 분열이 일어나는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅂㄹㄱ">로 나눌 수 있습니다.',
        'q4_html': '식물의 <input class="inline-input" id="q4-1" type="text" placeholder="ㅅㅈㅈ">에서 세포 분열이 활발하고, <input class="inline-input" id="q4-2" type="text" placeholder="ㅇㅅㅍ">는 분열이 멈추지 않아 문제가 됩니다.'
    },
    'bio_10': {
        'q1_text': '이 글의 내용과 일치하는 것은 무엇인가요?',
        'q1_opts': [
            '① 아밀레이스는 위에서 단백질을 분해한다.',
            '② 소장의 융털은 흡수 면적을 줄여 소화를 느리게 한다.',
            '③ 대장에서는 수분을 흡수하고 장내 세균이 비타민을 합성한다.',
            '④ 음식물 소화는 대장에서 시작된다.'
        ],
        'q2_text': '이 글의 전개 방식으로 가장 알맞은 것은 무엇인가요?',
        'q2_opts': [
            '① 입 → 위 → 소장 → 대장 순서로 소화 과정을 설명하는 방식',
            '② 소화에 대한 찬반 의견을 나열하는 방식',
            '③ 한 영양소의 흡수 과정만 집중적으로 설명하는 방식',
            '④ 과거와 현재의 소화 연구를 비교하는 방식'
        ],
        'q3_html': '침 속의 <input class="inline-input" id="q3-1" type="text" placeholder="ㅇㅁㄹㅇㅅ">는 녹말을 분해하고, 위액 속의 <input class="inline-input" id="q3-2" type="text" placeholder="ㅍㅅ">은 단백질을 분해합니다.',
        'q4_html': '<input class="inline-input" id="q4-1" type="text" placeholder="ㅅㅈ">의 융털에서 영양소가 흡수되고, <input class="inline-input" id="q4-2" type="text" placeholder="ㄷㅈ">에서 수분이 흡수됩니다.'
    },
    'bio_11': {
        'q1_text': '이 글의 내용과 일치하는 것은 무엇인가요?',
        'q1_opts': [
            '① 동맥은 벽이 얇고 판막이 있다.',
            '② 정맥에는 판막이 있어 혈액의 역류를 막는다.',
            '③ 모세 혈관은 가장 두꺼운 혈관이다.',
            '④ 폐순환에서 혈액은 산소를 내보내고 이산화탄소를 받는다.'
        ],
        'q2_text': '이 글의 전개 방식으로 가장 알맞은 것은 무엇인가요?',
        'q2_opts': [
            '① 혈액과 심장 → 혈관의 종류 → 순환 경로 순서로 설명',
            '② 한 적혈구의 여행을 일기 형식으로 서술',
            '③ 여러 과학자의 순환 이론을 비교',
            '④ 혈액 순환에 대한 찬반 의견을 나열'
        ],
        'q3_html': '심장의 위쪽 <input class="inline-input" id="q3-1" type="text" placeholder="ㅅㅂ">은 혈액을 받아들이고, 아래쪽 <input class="inline-input" id="q3-2" type="text" placeholder="ㅅㅅ">은 혈액을 밀어냅니다.',
        'q4_html': '<input class="inline-input" id="q4-1" type="text" placeholder="ㅍㅅㅎ">은 폐에서 산소를 받고, 체순환은 세포에 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅ">와 영양소를 전달합니다.'
    },
    'bio_12': {
        'q1_text': '이 글의 내용과 일치하는 것은 무엇인가요?',
        'q1_opts': [
            '① 외호흡은 세포에서 에너지를 만드는 과정이다.',
            '② 콩팥은 공기를 걸러 이산화탄소를 배출한다.',
            '③ 폐포에서 산소와 이산화탄소의 기체 교환이 일어난다.',
            '④ 암모니아는 콩팥에서 요소로 바뀐다.'
        ],
        'q2_text': '이 글의 전개 방식으로 가장 알맞은 것은 무엇인가요?',
        'q2_opts': [
            '① 호흡의 원리와 과정 → 호흡 운동 → 배설의 과정 순서로 설명',
            '② 한 산소 분자의 여행을 이야기 형식으로 서술',
            '③ 호흡에 대한 다양한 가설을 비교',
            '④ 실험 결과를 그래프로 제시'
        ],
        'q3_html': '<input class="inline-input" id="q3-1" type="text" placeholder="ㅍㅍ">에서 산소와 이산화탄소가 교환되는 것을 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅎㅎ">이라 합니다.',
        'q4_html': '간에서 암모니아가 <input class="inline-input" id="q4-1" type="text" placeholder="ㅇㅅ">로 바뀌고, <input class="inline-input" id="q4-2" type="text" placeholder="ㅋㅍ">에서 오줌이 만들어집니다.'
    },
    'bio_13': {
        'q1_text': '이 글의 내용과 일치하는 것은 무엇인가요?',
        'q1_opts': [
            '① 반사는 뇌에서 충분히 생각한 후에 일어나는 느린 반응이다.',
            '② 중추 신경계는 온몸에 퍼져 있는 신경들이다.',
            '③ 척수는 뇌와 몸을 연결하고 반사를 처리하기도 한다.',
            '④ 말초 신경계는 뇌와 척수로만 이루어져 있다.'
        ],
        'q2_text': '이 글의 전개 방식으로 가장 알맞은 것은 무엇인가요?',
        'q2_opts': [
            '① 자극과 반응의 정의 → 신경계의 구조 → 반사의 원리 순서로 설명',
            '② 한 뉴런의 하루를 일기 형식으로 서술',
            '③ 신경계에 대한 찬반 의견을 비교',
            '④ 실험 방법만 자세히 설명'
        ],
        'q3_html': '신경계의 기본 단위는 <input class="inline-input" id="q3-1" type="text" placeholder="ㄴㄹ">이고, <input class="inline-input" id="q3-2" type="text" placeholder="ㅈㅊ ㅅㄱㄱ">는 뇌와 척수로 이루어져 있습니다.',
        'q4_html': '<input class="inline-input" id="q4-1" type="text" placeholder="ㅂㅅ">는 척수에서 바로 일어나고, 그 경로를 <input class="inline-input" id="q4-2" type="text" placeholder="ㅂㅅㄱ">이라 합니다.'
    },
    'bio_14': {
        'q1_text': '이 글의 내용과 일치하는 것은 무엇인가요?',
        'q1_opts': [
            '① 골수는 뼈 바깥쪽에 있어 뼈를 보호한다.',
            '② 심장근은 우리 의지대로 조절할 수 있는 수의근이다.',
            '③ 팔을 구부릴 때 이두근은 수축하고 삼두근은 이완한다.',
            '④ 근육은 밀고 당기는 힘을 모두 낼 수 있다.'
        ],
        'q2_text': '이 글의 전개 방식으로 가장 알맞은 것은 무엇인가요?',
        'q2_opts': [
            '① 뼈의 구조와 기능 → 근육의 종류 → 근육의 작용 원리 순서로 설명',
            '② 한 운동선수의 훈련 과정을 시간 순으로 서술',
            '③ 뼈와 근육에 대한 찬반 의견을 나열',
            '④ 여러 실험 결과만 제시'
        ],
        'q3_html': '뼈와 뼈가 만나는 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㅈ"> 덕분에 움직일 수 있고, 근육은 <input class="inline-input" id="q3-2" type="text" placeholder="ㅎㅈ">로 뼈에 연결됩니다.',
        'q4_html': '팔을 구부릴 때 <input class="inline-input" id="q4-1" type="text" placeholder="ㅇㄷㄱ">이 수축하고, 이처럼 반대로 작용하는 근육 쌍을 <input class="inline-input" id="q4-2" type="text" placeholder="ㄱㅎㄱ">이라 합니다.'
    },
    'bio_15': {
        'q1_text': '이 글의 내용과 일치하는 것은 무엇인가요?',
        'q1_opts': [
            '① 열성 특성은 항상 겉으로 드러난다.',
            '② 사람은 46쌍의 염색체를 가진다.',
            '③ 잡종 부모끼리 교배하면 자녀의 우성:열성 비율은 3:1이다.',
            '④ 유전자는 세포막 위에 있다.'
        ],
        'q2_text': '이 글의 전개 방식으로 가장 알맞은 것은 무엇인가요?',
        'q2_opts': [
            '① 유전의 정의와 우성·열성 → 유전자와 염색체 → 분리의 법칙 순서로 설명',
            '② 멘델의 일대기를 시간 순으로 서술',
            '③ 유전에 대한 찬반 의견을 나열',
            '④ 실험 방법만 자세히 제시'
        ],
        'q3_html': '유전되는 특성에는 겉으로 드러나는 <input class="inline-input" id="q3-1" type="text" placeholder="ㅇㅅ">과 숨겨지는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅅ">이 있습니다.',
        'q4_html': '<input class="inline-input" id="q4-1" type="text" placeholder="ㅇㅈㅈ">는 염색체 위에 있고, 잡종끼리 교배하면 우성:열성 비율이 <input class="inline-input" id="q4-2" type="text" placeholder="숫자:숫자">로 나타납니다.'
    },
    'bio_16': {
        'q1_text': '이 글의 내용과 일치하는 것은 무엇인가요?',
        'q1_opts': [
            '① DNA는 세포막 바깥에 존재한다.',
            '② A 염기는 C 염기와 짝을 이룬다.',
            '③ DNA는 이중 나선 구조이고 염기 상보성 규칙을 따른다.',
            '④ DNA 복제 시 원본은 완전히 사라진다.'
        ],
        'q2_text': '이 글의 전개 방식으로 가장 알맞은 것은 무엇인가요?',
        'q2_opts': [
            '① DNA의 정의와 구조 → 염기의 종류와 상보성 → 복제와 활용 순서로 설명',
            '② 왓슨과 크릭의 일대기를 시간 순으로 서술',
            '③ DNA에 대한 찬반 의견을 나열',
            '④ 실험 방법만 자세히 설명'
        ],
        'q3_html': 'DNA는 <input class="inline-input" id="q3-1" type="text" placeholder="ㅇㅈ ㄴㅅ"> 구조이고, A는 T와, G는 <input class="inline-input" id="q3-2" type="text" placeholder="알파벳">와 짝을 이룹니다.',
        'q4_html': 'DNA 복제 시 원래 가닥이 반씩 보존되는 것을 <input class="inline-input" id="q4-1" type="text" placeholder="ㅂㅂㅈㅈ ㅂㅈ">라 하고, DNA의 염기 배열이 <input class="inline-input" id="q4-2" type="text" placeholder="ㅇㅈㅈ">를 결정합니다.'
    },
    'bio_17': {
        'q1_text': '이 글의 내용과 일치하는 것은 무엇인가요?',
        'q1_opts': [
            '① 분해자는 광합성으로 양분을 만든다.',
            '② 에너지는 각 영양 단계를 거치며 100% 전달된다.',
            '③ 먹이 그물이 복잡할수록 생태계가 안정적이다.',
            '④ 최상위 포식자의 수가 가장 많다.'
        ],
        'q2_text': '이 글의 전개 방식으로 가장 알맞은 것은 무엇인가요?',
        'q2_opts': [
            '① 생태계의 구성 → 먹이 사슬과 그물 → 에너지 흐름 순서로 설명',
            '② 한 동물의 하루를 시간 순으로 서술',
            '③ 생태계에 대한 찬반 의견을 나열',
            '④ 실험 결과만 제시'
        ],
        'q3_html': '광합성으로 스스로 양분을 만드는 <input class="inline-input" id="q3-1" type="text" placeholder="ㅅㅅㅈ">와 죽은 생물을 분해하는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅂㅎㅈ">가 생태계에서 중요한 역할을 합니다.',
        'q4_html': '복잡하게 얽힌 먹이 관계를 <input class="inline-input" id="q4-1" type="text" placeholder="ㅁㅇ ㄱㅁ">이라 하고, 에너지는 각 단계에서 약 <input class="inline-input" id="q4-2" type="text" placeholder="숫자">%만 전달됩니다.'
    },
    'bio_18': {
        'q1_text': '이 글의 내용과 일치하는 것은 무엇인가요?',
        'q1_opts': [
            '① 대부분의 식물은 공기 중 질소 기체를 직접 흡수한다.',
            '② 탄소는 광합성으로 생물체 안으로 들어가고 호흡으로 대기로 돌아간다.',
            '③ 에너지는 생태계에서 계속 순환하며 사라지지 않는다.',
            '④ 물의 순환은 생태계와 관련이 없다.'
        ],
        'q2_text': '이 글의 전개 방식으로 가장 알맞은 것은 무엇인가요?',
        'q2_opts': [
            '① 탄소 순환 → 질소 순환 → 물의 순환 순서로 설명',
            '② 한 탄소 원자의 여행을 이야기 형식으로 서술',
            '③ 물질 순환에 대한 찬반 의견을 나열',
            '④ 실험 방법만 자세히 설명'
        ],
        'q3_html': '<input class="inline-input" id="q3-1" type="text" placeholder="ㅈㅅ ㄱㅈ ㅅㄱ">이 공기 중 질소를 암모니아로 바꾸는 과정을 <input class="inline-input" id="q3-2" type="text" placeholder="ㅈㅅ ㄱㅈ">이라 합니다.',
        'q4_html': '물이 햇빛을 받아 <input class="inline-input" id="q4-1" type="text" placeholder="ㅈㅂ">하고, 수증기가 식어 <input class="inline-input" id="q4-2" type="text" placeholder="ㅇㄱ">하여 구름이 됩니다.'
    },
    'bio_19': {
        'q1_text': '이 글의 내용과 일치하는 것은 무엇인가요?',
        'q1_opts': [
            '① 바이러스는 세균보다 크고 현미경으로 쉽게 볼 수 있다.',
            '② 세균은 모두 해로운 병원균이다.',
            '③ 바이러스는 숙주 세포 없이는 스스로 증식할 수 없다.',
            '④ 항생제는 바이러스 감염에 효과가 있다.'
        ],
        'q2_text': '이 글의 전개 방식으로 가장 알맞은 것은 무엇인가요?',
        'q2_opts': [
            '① 세균의 특징 → 바이러스의 특징 → 감염과 치료 순서로 설명',
            '② 한 바이러스의 일대기를 시간 순으로 서술',
            '③ 세균에 대한 찬반 의견을 나열',
            '④ 실험 결과만 제시'
        ],
        'q3_html': '<input class="inline-input" id="q3-1" type="text" placeholder="ㅂㅇㄹㅅ">는 세포가 아니라 유전 물질과 단백질 껍질로 이루어져 있고, <input class="inline-input" id="q3-2" type="text" placeholder="ㅅㅈ ㅅㅍ"> 없이는 증식하지 못합니다.',
        'q4_html': '세균 감염에는 <input class="inline-input" id="q4-1" type="text" placeholder="ㅎㅅㅈ">가 효과적이고, 바이러스 질환은 <input class="inline-input" id="q4-2" type="text" placeholder="ㅂㅅ">으로 예방합니다.'
    },
    'bio_20': {
        'q1_text': '이 글의 내용과 일치하는 것은 무엇인가요?',
        'q1_opts': [
            '① 인슐린은 현재도 동물에서만 추출한다.',
            '② 크리스퍼는 유전자를 정밀하게 편집하는 기술이다.',
            '③ 생명공학에는 윤리적 문제가 전혀 없다.',
            '④ GMO 농작물은 식량 생산량을 줄인다.'
        ],
        'q2_text': '이 글의 전개 방식으로 가장 알맞은 것은 무엇인가요?',
        'q2_opts': [
            '① 생명공학의 정의 → 의료 분야 활용 → 기타 응용과 윤리 문제 순서로 설명',
            '② 한 과학자의 연구 일지를 시간 순으로 서술',
            '③ 생명공학에 대한 찬반 의견만 나열',
            '④ 실험 방법만 자세히 설명'
        ],
        'q3_html': '유전자를 인위적으로 조작하는 기술을 <input class="inline-input" id="q3-1" type="text" placeholder="ㅇㅈㄱㅎ">이라 하고, 유전자가 변형된 생물을 <input class="inline-input" id="q3-2" type="text" placeholder="영문약자">라 합니다.',
        'q4_html': '<input class="inline-input" id="q4-1" type="text" placeholder="ㅋㄹㅅㅍ"> 기술로 유전자를 정밀하게 편집할 수 있고, <input class="inline-input" id="q4-2" type="text" placeholder="ㅈㄱㅅㅍ">는 손상된 조직을 재생하는 데 활용됩니다.'
    }
}

def update_html_file(file_path, unit_key):
    """HTML 파일의 Q1/Q2/Q3/Q4를 업데이트"""
    if unit_key not in BIO_QUIZ_DATA:
        print(f"  {unit_key}: 데이터 없음, 건너뜀")
        return False

    quiz_data = BIO_QUIZ_DATA[unit_key]

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Q1 선지 교체 패턴
    q1_pattern = r'(<div class="quiz-num">01.*?<p class="quiz-q">).*?(</p>\s*<ul class="quiz-options">).*?(</ul>)'

    def q1_replacement(m):
        opts_html = '\n'.join([
            f'                <li><label><input type="radio" name="q1" value="{i+1}"><span>{opt}</span></label></li>'
            for i, opt in enumerate(quiz_data['q1_opts'])
        ])
        return f'{m.group(1)}{quiz_data["q1_text"]}{m.group(2)}\n{opts_html}\n              {m.group(3)}'

    content = re.sub(q1_pattern, q1_replacement, content, flags=re.DOTALL)

    # Q2 선지 교체 패턴
    q2_pattern = r'(<div class="quiz-num">02.*?<p class="quiz-q">).*?(</p>\s*<ul class="quiz-options">).*?(</ul>)'

    def q2_replacement(m):
        opts_html = '\n'.join([
            f'                <li><label><input type="radio" name="q2" value="{i+1}"><span>{opt}</span></label></li>'
            for i, opt in enumerate(quiz_data['q2_opts'])
        ])
        return f'{m.group(1)}{quiz_data["q2_text"]}{m.group(2)}\n{opts_html}\n              {m.group(3)}'

    content = re.sub(q2_pattern, q2_replacement, content, flags=re.DOTALL)

    # Q3 교체 (03 빈칸 채우기)
    q3_pattern = r'(<div class="quiz-num">03.*?<p class="quiz-q">\s*)[\s\S]*?(</p>\s*</div>\s*</div>)'
    q3_replacement = r'\g<1>\n                ' + quiz_data['q3_html'] + r'\n              \2'
    content = re.sub(q3_pattern, q3_replacement, content, flags=re.DOTALL)

    # Q4 교체 (04 빈칸 채우기)
    q4_pattern = r'(<div class="quiz-num">04.*?<p class="quiz-q">\s*)[\s\S]*?(</p>\s*</div>\s*</div>)'
    q4_replacement = r'\g<1>\n                ' + quiz_data['q4_html'] + r'\n              \2'
    content = re.sub(q4_pattern, q4_replacement, content, flags=re.DOTALL)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    return True

# 메인 실행
base_path = 'public/BRAINUP/science'

for i in range(6, 21):
    unit_key = f'bio_{i:02d}'
    file_path = os.path.join(base_path, f'{unit_key}.html')

    if os.path.exists(file_path):
        success = update_html_file(file_path, unit_key)
        if success:
            print(f"✅ {unit_key}.html 업데이트 완료")
        else:
            print(f"⚠️ {unit_key}.html 업데이트 실패")
    else:
        print(f"❌ {file_path} 파일 없음")

print("\n모든 HTML 파일 업데이트 완료!")
