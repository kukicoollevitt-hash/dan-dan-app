import os
import re

# 추가할 CSS 코드
circle_css = '''    ul.quiz-options li:nth-child(1) label::before { content: '①' !important; }
    ul.quiz-options li:nth-child(2) label::before { content: '②' !important; }
    ul.quiz-options li:nth-child(3) label::before { content: '③' !important; }
    ul.quiz-options li:nth-child(4) label::before { content: '④' !important; }
    ul.quiz-options li label::before {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-size: 16px !important;
      color: #333 !important;
      margin-right: 8px !important;
      flex-shrink: 0 !important;
    }'''

# ul.quiz-options li label 스타일 수정 (display: block -> flex)
label_old = 'display: block !important;'
label_new = 'display: flex !important;\n      align-items: flex-start !important;'

# counter 관련 코드 (이미 있으면 제거)
counter_reset = 'counter-reset: option-counter !important;'
counter_increment = 'counter-increment: option-counter !important;'

base_path = '/Users/dandan/Desktop/dan-dan-app_1217/public/BRAINUP'
folders = ['science', 'person', 'worldlit', 'korlit', 'korilit', 'social']

updated = 0
skipped = 0

for folder in folders:
    folder_path = os.path.join(base_path, folder)
    if not os.path.exists(folder_path):
        continue
    
    for filename in os.listdir(folder_path):
        if not filename.endswith('.html'):
            continue
        
        filepath = os.path.join(folder_path, filename)
        
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # quiz-options가 없으면 스킵
        if 'quiz-options' not in content:
            skipped += 1
            continue
        
        # 이미 동그라미 CSS가 있으면 스킵
        if "content: '①'" in content:
            skipped += 1
            continue
        
        original = content
        
        # 1. display: block -> display: flex 변경
        content = content.replace(
            'ul.quiz-options li label {\n      display: block !important;',
            'ul.quiz-options li label {\n      display: flex !important;\n      align-items: flex-start !important;'
        )
        
        # 2. ul.quiz-options li label { ... } 블록 뒤에 동그라미 CSS 추가
        # ul.quiz-options li label:hover 바로 앞에 삽입
        if "ul.quiz-options li label:hover" in content and "content: '①'" not in content:
            content = content.replace(
                '    ul.quiz-options li label:hover {',
                circle_css + '\n    ul.quiz-options li label:hover {'
            )
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            updated += 1

print(f"완료! 수정된 파일: {updated}개, 스킵: {skipped}개")
