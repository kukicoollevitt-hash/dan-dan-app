#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fix explain and detail structure for fit_world1_02 through fit_world1_40
This version properly handles newline characters as \\n escape sequences
"""

import re
import sys

# Mapping for circled numbers
CIRCLED_NUMBERS = {
    '1': '①', '2': '②', '3': '③', '4': '④', '5': '⑤',
    '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨', '10': '⑩'
}

def extract_answer_from_opts(opts_list, answer_index):
    """Extract the answer text from the quiz options"""
    try:
        idx = int(answer_index) - 1
        if 0 <= idx < len(opts_list):
            return opts_list[idx]
    except:
        pass
    return ""

def process_file(filepath):
    """Process the fit_world1_content.js file"""

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Process units 02 through 40
    for unit_num in range(2, 41):
        unit_str = f"{unit_num:02d}"
        unit_name = f"fit_world1_{unit_str}"

        print(f"Processing {unit_name}...")

        # Find the unit block - more precise pattern
        # Match from fit_world1_XX: { to the closing }, before the next /* or end
        unit_start_pattern = rf"  {unit_name}: \{{"
        unit_start_match = re.search(unit_start_pattern, content)

        if not unit_start_match:
            print(f"  ⚠️  Could not find start of {unit_name}")
            continue

        start_pos = unit_start_match.start()

        # Find the matching closing brace
        # Look for the pattern: detail block followed by closing brace
        detail_end_pattern = r"detail: \{[^}]*\n    \}\n  \}"
        detail_end_match = re.search(detail_end_pattern, content[start_pos:], re.DOTALL)

        if not detail_end_match:
            print(f"  ⚠️  Could not find end of {unit_name}")
            continue

        end_pos = start_pos + detail_end_match.end()
        unit_block = content[start_pos:end_pos]

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

        # Extract quiz options to get short answer texts
        quiz_opts = {}
        for q_num in ['1', '2', '3', '4']:
            opts_pattern = rf"q{q_num}_opts: \[(.*?)\]"
            opts_match = re.search(opts_pattern, unit_block, re.DOTALL)
            if opts_match:
                opts_str = opts_match.group(1)
                # Parse the array of strings
                opts_list = re.findall(r"'([^']*(?:\\'[^']*)*)'", opts_str)
                quiz_opts[q_num] = opts_list

        # Extract current explain block
        explain_match = re.search(r"explain: \{(.*?)\n    \}", unit_block, re.DOTALL)
        if not explain_match:
            print(f"  ⚠️  Could not find explain for {unit_name}")
            continue

        explain_content = explain_match.group(1)

        # Parse explain entries more carefully
        explain_entries = {}
        # Match q1:'...', q2:'...', etc. handling escaped quotes
        for q_match in re.finditer(r"q(\d+):'((?:[^'\\]|\\.)*)'", explain_content):
            q_num = q_match.group(1)
            q_text = q_match.group(2)
            explain_entries[q_num] = q_text

        # Extract current detail block
        detail_match = re.search(r"detail: \{(.*?)\n    \}", unit_block, re.DOTALL)
        if not detail_match:
            print(f"  ⚠️  Could not find detail for {unit_name}")
            continue

        detail_content = detail_match.group(1)

        # Parse detail entries
        detail_entries = {}
        for q_match in re.finditer(r"q(\d+):'((?:[^'\\]|\\.)*)'", detail_content):
            q_num = q_match.group(1)
            q_text = q_match.group(2)
            detail_entries[q_num] = q_text

        # Build new explain block
        new_explain_lines = []
        for q_num in sorted(explain_entries.keys(), key=lambda x: int(x)):
            current_text = explain_entries[q_num]

            # For q5, keep "예시 답안:" format
            if q_num == '5':
                if not current_text.startswith('예시 답안:'):
                    current_text = f"예시 답안: {current_text}"
                new_explain_lines.append(f"      q{q_num}:'{current_text}'")
            else:
                # For q1-q4, update format
                answer_num = answers.get(q_num, '1')

                # Get the short answer from quiz options
                short_answer = ""
                if q_num in quiz_opts and q_num in answers:
                    short_answer = extract_answer_from_opts(quiz_opts[q_num], answers[q_num])

                # Remove existing "정답:" prefix if present
                text_without_answer = re.sub(r'^정답:\s*[①②③④⑤⑥⑦⑧⑨⑩]번\.?\s*', '', current_text)
                text_without_answer = re.sub(r'^정답:\s*\\d+\\s*—\\s*', '', text_without_answer)
                text_without_answer = re.sub(r'^정답:\s*\d+\s*—\s*', '', text_without_answer)

                # Get the highlight text (what's already in explain)
                highlight = text_without_answer.strip()

                # Build new format with \\n escape sequence (not actual newline)
                if short_answer and highlight:
                    new_text = f"정답: {answer_num} — {short_answer}\\n{highlight}"
                elif short_answer:
                    new_text = f"정답: {answer_num} — {short_answer}"
                else:
                    # Fallback if we can't extract short answer
                    new_text = f"정답: {answer_num} — {highlight}"

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
            text_without_answer = re.sub(r'^정답:\s*\\d+\\s*—\\s*', '', text_without_answer)
            text_without_answer = re.sub(r'^정답:\s*\d+\s*—\s*', '', text_without_answer)

            # Build new format
            new_text = f"정답: {circled_num}번. {text_without_answer.strip()}"

            new_detail_lines.append(f"      q{q_num}:'{new_text}'")

        new_detail_block = ",\n".join(new_detail_lines)

        # Build new unit block
        new_unit_block = re.sub(
            r"explain: \{.*?\n    \}",
            f"explain: {{\n{new_explain_block}\n    }}",
            unit_block,
            flags=re.DOTALL,
            count=1
        )

        new_unit_block = re.sub(
            r"detail: \{.*?\n    \}",
            f"detail: {{\n{new_detail_block}\n    }}",
            new_unit_block,
            flags=re.DOTALL,
            count=1
        )

        # Replace in content
        content = content[:start_pos] + new_unit_block + content[end_pos:]

        print(f"  ✓ Updated {unit_name}")

    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print("\n✅ All units processed successfully!")

if __name__ == '__main__':
    filepath = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/worldlit/fit_world1_content.js'
    process_file(filepath)
