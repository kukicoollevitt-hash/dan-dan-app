#!/usr/bin/env python3
import re

# on_chem_content.js 파일 읽기
with open('/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/science/on_chem_content.js', 'r', encoding='utf-8') as f:
    content = f.read()

for unit_match in re.finditer(r'on_chem_(\d{2}):\s*\{', content):
    unit_num = unit_match.group(1)
    start_pos = unit_match.end()

    # answerKey 찾기
    answer_match = re.search(r"answerKey:\s*\{([^}]+)\}", content[start_pos:start_pos+15000])
    if not answer_match:
        continue

    answer_block = answer_match.group(1)
    answers = {}
    for q in ['q1', 'q2', 'q3', 'q4']:
        m = re.search(rf"{q}:\s*'(\d)'", answer_block)
        if m:
            answers[q] = m.group(1)

    # quiz 옵션 찾기
    quiz_match = re.search(r"quiz:\s*\{(.*?)\},\s*answerKey:", content[start_pos:start_pos+15000], re.DOTALL)
    if not quiz_match:
        continue

    quiz_block = quiz_match.group(1)

    # explain 찾기
    explain_match = re.search(r"explain:\s*\{([^}]+)\}", content[start_pos:start_pos+15000], re.DOTALL)
    if not explain_match:
        continue

    explain_block = explain_match.group(1)

    # detail 찾기
    detail_match = re.search(r"detail:\s*\{([^}]+)\}", content[start_pos:start_pos+15000], re.DOTALL)
    if not detail_match:
        continue

    detail_block = detail_match.group(1)

    print(f"\n{'='*60}")
    print(f"=== on_chem_{unit_num} ===")
    print(f"{'='*60}")

    for q in ['q1', 'q2', 'q3', 'q4']:
        if q not in answers:
            continue

        ans_num = answers[q]

        # 정답 옵션 찾기
        opts_match = re.search(rf"{q}_opts:\s*\[(.*?)\]", quiz_block, re.DOTALL)
        if opts_match:
            opts_text = opts_match.group(1)
            opts = re.findall(r"'([^']*)'", opts_text)
            if opts and int(ans_num) <= len(opts):
                correct_opt = opts[int(ans_num)-1][:40]
            else:
                correct_opt = "?"
        else:
            correct_opt = "?"

        # explain 값
        exp_match = re.search(rf"{q}:\s*'([^']*)'", explain_block)
        exp_text = exp_match.group(1)[:50] if exp_match else "없음"

        # detail 값
        det_match = re.search(rf"{q}:\s*'([^']*)'", detail_block)
        det_text = det_match.group(1)[:60] if det_match else "없음"

        print(f"\n{q} 정답: {ans_num}번 - {correct_opt}...")
        print(f"  explain: {exp_text}...")
        print(f"  detail: {det_text}...")

print("\n\n=== 완료 ===")
