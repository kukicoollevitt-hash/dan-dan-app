#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
deep_bio_13~20의 Q1 explain을 본문 근거를 들어 자세하게 수정
"""

import re

# 파일 경로
file_path = '/Users/dandan/Desktop/dan-dan-app_1214/public/BRAINUP/science/deep_bio_content.js'

# 각 항목별 새로운 explain (실제 본문 근거 포함)
# 주의: answerKey와 다를 수 있음 (본문의 실제 내용 기준)
new_explains = {
    'deep_bio_13': "3번 선택지가 정답이다. 글에서 시냅스에서 전기 신호는 신경 전달 물질이라는 화학 물질로 전환되어 다음 세포로 전달된다고 명시되어 있으므로, 전기 신호가 화학 물질로 전환되지 않고 전기 신호 그대로 다음 뉴런에 직접 전달된다는 설명은 내용과 일치하지 않는다.",

    'deep_bio_14': "4번 선택지가 정답이다. 글에서 골격근은 뼈에 부착되어 수의적으로 움직인다고 설명했으므로, 골격근은 수의적으로 조절할 수 없으며 심장근과 마찬가지로 불수의적으로만 움직인다는 설명은 내용과 일치하지 않는다.",

    'deep_bio_15': "4번 선택지가 정답이다. 글에서 유전자 발현은 전사와 번역 두 단계로 이루어지며, 전사에서는 DNA의 유전 정보가 mRNA로 복사되고 번역에서는 mRNA의 코드에 따라 리보솜에서 단백질이 합성된다고 설명했으므로, DNA 정보가 직접 단백질로 번역되며 mRNA는 전사 과정에 전혀 관여하지 않는다는 설명은 내용과 일치하지 않는다.",

    'deep_bio_16': "4번 선택지가 정답이다. 글에서 생태계에서 에너지는 먹이 사슬을 따라 한 방향으로 흐르며, 10% 법칙에 따라 각 영양 단계를 거칠 때마다 약 10%만 다음 단계로 전달되고 나머지는 호흡과 열로 손실된다고 설명했으므로, 에너지가 물질과 마찬가지로 생태계 내에서 순환하며 상위 영양 단계로 갈수록 이용 가능한 에너지양이 증가한다는 설명은 내용과 일치하지 않는다.",

    'deep_bio_17': "4번 선택지가 정답이다. 글에서 미세 플라스틱은 큰 플라스틱이 물리적 마모, 자외선에 의한 분해, 화학적 풍화 등을 거쳐 5mm 미만의 작은 입자로 쪼개진 것이라고 설명했으므로, 미세 플라스틱은 물리적 마모로만 생성되며 자외선에 의한 분해는 전혀 일어나지 않는다는 설명은 내용과 일치하지 않는다.",

    'deep_bio_18': "4번 선택지가 정답이다. 글에서 유전적 다양성이 높을수록 환경 변화나 질병에 대한 적응력이 높아진다고 설명했으므로, 유전적 다양성이 높을수록 환경 변화와 질병에 대한 적응력이 낮아져 멸종 위험이 증가한다는 설명은 내용과 일치하지 않는다.",

    'deep_bio_19': "4번 선택지가 정답이다. 글에서 모든 생물이 기후 변화에 충분히 빠르게 적응할 수 있는 것은 아니며, 적응 속도보다 기후 변화 속도가 빠르면 멸종 위험이 높아진다고 설명했으므로, 모든 생물은 가소성, 유전적 적응, 분포역 이동 중 어느 방법으로든 기후 변화에 완벽하게 적응할 수 있다는 설명은 내용과 일치하지 않는다.",

    'deep_bio_20': "4번 선택지가 정답이다. 글에서 생식세포 편집은 정자, 난자, 초기 배아의 유전자를 수정하는 것으로 편집된 유전자가 다음 세대로 유전된다고 명시했으므로, 생식세포 편집은 해당 개체에만 영향을 미치고 다음 세대로 유전되지 않아 윤리적 문제가 전혀 없다는 설명은 내용과 일치하지 않는다."
}

# 파일 읽기
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 각 deep_bio 항목에 대해 explain 수정
for bio_num in range(13, 21):
    bio_key = f'deep_bio_{bio_num}'
    if bio_key not in new_explains:
        continue

    new_explain = new_explains[bio_key]

    # deep_bio_XX 섹션을 찾아서 explain의 q1 부분만 교체
    # 패턴: q1:'현재 내용',
    # 주의: 작은따옴표 이스케이프 처리
    pattern = rf"(deep_bio_{bio_num}:.*?explain:\s*\{{\s*q1:')[^']*(')"

    # 교체 함수 사용하여 백슬래시 오류 방지
    def replacer(match):
        return match.group(1) + new_explain + match.group(2)

    # 교체 수행
    content = re.sub(
        pattern,
        replacer,
        content,
        flags=re.DOTALL
    )

# 파일 저장
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ deep_bio_13~20의 Q1 explain 수정 완료!")
print("\n수정된 내용:")
for bio_key, explain in new_explains.items():
    print(f"\n{bio_key}:")
    print(f"  {explain}")
