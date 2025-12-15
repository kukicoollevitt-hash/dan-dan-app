#!/usr/bin/env python3
import re

with open('public/BRAINUP/science/deep_earth_content.js', 'r', encoding='utf-8') as f:
    content = f.read()

# deep_earth_XX: { ... title: '제목' ... } 패턴 찾기
pattern = r"deep_earth_(\d+):\s*\{[^}]*?title:\s*'([^']+)'"
matches = re.findall(pattern, content, re.DOTALL)

print("딥지구과학 제목 목록:")
print("=" * 100)
for num, title in matches:
    print(f'        "{title}",')
