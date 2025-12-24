#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fix explain and detail structure for fit_world1_02 through fit_world1_40
"""

import re
import sys

# Mapping for circled numbers
CIRCLED_NUMBERS = {
    '1': '①', '2': '②', '3': '③', '4': '④', '5': '⑤',
    '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨', '10': '⑩'
}

def process_file(filepath):
    """Process the fit_world1_content.js file"""

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Process units 02 through 40
    for unit_num in range(2, 41):
        unit_str = f"{unit_num:02d}"
        unit_name = f"fit_world1_{unit_str}"

        print(f"Processing {unit_name}...")

        # Find the unit block
        unit_pattern = rf"(  {unit_name}: \{{.*?)\n(  \}}(?:,?\n\n  /\* =====|,?\n\}};))"
        match = re.search(unit_pattern, content, re.DOTALL)

        if not match:
            print(f"  ⚠️  Could not find {unit_name}")
            continue

        unit_block = match.group(1)
        end_part = match.group(2)

        # Extract answerKey
        answer_key_match = re.search(r"answerKey: \{([^}]+)\}", unit_block)
        if not answer_key_match:
            print(f"  ⚠️  Could not find answerKey for {unit_name}")
            continue

        answer_key_str = answer_key_match.group(1)
        answers = {}
        for q_match in re.finditer(r"q(\d+):\s*['\"](\d+)['\"]", answer_key_str):
            q_num = q_match.group(1)
            answer_num = q_match.group(2)
            answers[q_num] = answer_num

        # Extract current explain and detail blocks
        explain_match = re.search(r"explain: \{(.*?)\n    \}", unit_block, re.DOTALL)
        detail_match = re.search(r"detail: \{(.*?)\n    \}", unit_block, re.DOTALL)

        if not explain_match or not detail_match:
            print(f"  ⚠️  Could not find explain/detail for {unit_name}")
            continue

        explain_content = explain_match.group(1)
        detail_content = detail_match.group(1)

        # Parse current explain entries
        explain_entries = {}
        for q_match in re.finditer(r"q(\d+):\s*'((?:[^'\\]|\\.)*)(?<!\\)'", explain_content):
            q_num = q_match.group(1)
            q_text = q_match.group(2)
            explain_entries[q_num] = q_text

        # Parse current detail entries
        detail_entries = {}
        for q_match in re.finditer(r"q(\d+):\s*'((?:[^'\\]|\\.)*)(?<!\\)'", detail_content):
            q_num = q_match.group(1)
            q_text = q_match.group(2)
            detail_entries[q_num] = q_text

        # Build new explain block
        new_explain_lines = []
        for q_num in sorted(explain_entries.keys(), key=lambda x: int(x)):
            current_text = explain_entries[q_num]

            # For q5, keep "예시 답안:" format
            if q_num == '5':
                # Check if it already has the correct format
                if not current_text.startswith('예시 답안:'):
                    current_text = f"예시 답안: {current_text}"
                new_explain_lines.append(f"      q{q_num}:'{current_text}'")
            else:
                # For q1-q4, update format
                answer_num = answers.get(q_num, '1')

                # Remove existing "정답:" prefix if present
                text_without_answer = re.sub(r'^정답:\s*[①②③④⑤⑥⑦⑧⑨⑩]번\.?\s*', '', current_text)
                text_without_answer = re.sub(r'^정답:\s*\d+\s*—\s*', '', text_without_answer)

                # Check if there's already a newline separator
                if '\\n' in text_without_answer:
                    parts = text_without_answer.split('\\n', 1)
                    short_answer = parts[0].strip()
                    highlight = parts[1].strip() if len(parts) > 1 else ''
                else:
                    # Try to find separator like " / "
                    if ' / ' in text_without_answer:
                        parts = text_without_answer.split(' / ', 1)
                        short_answer = parts[0].strip()
                        highlight = parts[1].strip()
                    else:
                        # No clear separator, keep as is
                        short_answer = text_without_answer.strip()
                        highlight = ''

                # Build new format
                if highlight:
                    new_text = f"정답: {answer_num} — {short_answer}\\n{highlight}"
                else:
                    new_text = f"정답: {answer_num} — {short_answer}"

                new_explain_lines.append(f"      q{q_num}:'{new_text}'")

        new_explain_block = ",\n".join(new_explain_lines)

        # Build new detail block
        new_detail_lines = []
        for q_num in sorted(detail_entries.keys(), key=lambda x: int(x)):
            current_text = detail_entries[q_num]

            # Skip q5 as it usually doesn't exist in detail
            if q_num == '5':
                continue

            answer_num = answers.get(q_num, '1')
            circled_num = CIRCLED_NUMBERS.get(answer_num, f"#{answer_num}")

            # Remove existing "정답:" prefix if present
            text_without_answer = re.sub(r'^정답:\s*[①②③④⑤⑥⑦⑧⑨⑩]번\.?\s*', '', current_text)
            text_without_answer = re.sub(r'^정답:\s*\d+\s*—\s*', '', text_without_answer)

            # Build new format
            new_text = f"정답: {circled_num}번. {text_without_answer.strip()}"

            new_detail_lines.append(f"      q{q_num}:'{new_text}'")

        new_detail_block = ",\n".join(new_detail_lines)

        # Replace in unit block
        new_unit_block = re.sub(
            r"explain: \{.*?\n    \}",
            f"explain: {{\n{new_explain_block}\n    }}",
            unit_block,
            flags=re.DOTALL
        )

        new_unit_block = re.sub(
            r"detail: \{.*?\n    \}",
            f"detail: {{\n{new_detail_block}\n    }}",
            new_unit_block,
            flags=re.DOTALL
        )

        # Replace in content
        content = content.replace(match.group(0), new_unit_block + end_part)

        print(f"  ✓ Updated {unit_name}")

    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print("\n✅ All units processed successfully!")

if __name__ == '__main__':
    filepath = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/worldlit/fit_world1_content.js'
    process_file(filepath)
