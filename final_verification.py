#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re

file_path = '/Users/dandan/Desktop/dan-dan-app_1212/public/BRAINUP/person/deep_people2_content.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

def count_passages(unit_num):
    pattern = f"deep_people2_{unit_num}:.*?passage: \\[(.*?)\\n    \\],\\n    vocab:"
    match = re.search(pattern, content, re.DOTALL)
    if match:
        passages = match.group(1)
        # Count how many passages (each starts with ')
        count = passages.count("'")
        # Divide by 2 (opening and closing quote)
        return count // 2
    return 0

def count_vocab(unit_num):
    pattern = f"deep_people2_{unit_num}:.*?vocab: \\[(.*?)\\n    \\],\\n    vocabFill:"
    match = re.search(pattern, content, re.DOTALL)
    if match:
        vocab_section = match.group(1)
        # Count vocab items - each starts with ['
        count = vocab_section.count("['")
        return count
    return 0

def count_vocabfill(unit_num):
    pattern = f"deep_people2_{unit_num}:.*?vocabFill:.*?items: \\[(.*?)\\n      \\]\\n    \\}},"
    match = re.search(pattern, content, re.DOTALL)
    if match:
        items_section = match.group(1)
        # Count items - each has "no:"
        count = items_section.count('no:')
        return count
    return 0

print("=" * 60)
print("딥세계인물(1) Units 18, 19, 20 확장 작업 최종 검증")
print("=" * 60)
print()

for unit in [18, 19, 20]:
    print(f"Unit {unit}:")
    passages = count_passages(unit)
    vocab = count_vocab(unit)
    vocabfill = count_vocabfill(unit)

    print(f"  - Passages: {passages}개 (목표: 4개) {'✓' if passages == 4 else '✗'}")
    print(f"  - Vocab: {vocab}개 (목표: 15개) {'✓' if vocab == 15 else '✗'}")
    print(f"  - VocabFill: {vocabfill}개 (목표: 15개) {'✓' if vocabfill == 15 else '✗'}")
    print()

print("=" * 60)
