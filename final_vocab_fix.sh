#!/bin/bash

FILE="/Users/dandan/Desktop/dan-dan-app_1212/public/BRAINUP/worldlit/deep_world2_content.js"

echo "딥세계문학(2) Unit 21~25 vocab/vocabFill 최종 확장 작업 시작..."
echo "주의: passage는 이미 확장되어 있으며, vocab과 vocabFill만 15개로 확장합니다."
echo ""

# 파일 존재 확인
if [ ! -f "$FILE" ]; then
    echo "에러: 파일을 찾을 수 없습니다: $FILE"
    exit 1
fi

# 백업 생성
cp "$FILE" "${FILE}.final_backup_$(date +%Y%m%d_%H%M%S)"
echo "백업 파일 생성 완료"

# Python으로 정교한 수정 작업 수행
python3 << 'PYTHON_EOF'
import re

file_path = '/Users/dandan/Desktop/dan-dan-app_1212/public/BRAINUP/worldlit/deep_world2_content.js'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 라인별로 처리하면서 Unit 21의 vocab 섹션을 찾아 확장
in_unit21_vocab = False
in_unit21_vocabFill = False
output_lines = []
i = 0

while i < len(lines):
    line = lines[i]
    
    # Unit 21 vocab 시작 감지 (deep_world2_21 다음에 나오는 vocab)
    if 'deep_world2_21:' in line:
        # Unit 21 블록 시작
        unit21_start = i
        # vocab 라인 찾기
        for j in range(i, min(i+50, len(lines))):
            if '    vocab: [' in lines[j]:
                # vocab 끝 찾기 (다음 ],로 끝나는 라인)
                vocab_end = j + 1
                for k in range(j+1, min(j+20, len(lines))):
                    if '    ],' in lines[k] and '      [' not in lines[k]:
                        vocab_end = k
                        break
                
                # 현재 vocab 개수 확인
                vocab_count = 0
                for k in range(j+1, vocab_end):
                    if "      ['" in lines[k]:
                        vocab_count += 1
                
                print(f"Unit 21 vocab 현재 개수: {vocab_count}")
                
                if vocab_count == 10:
                    # 15개로 확장
                    print("Unit 21 vocab을 15개로 확장합니다...")
                    # 기존 vocab 유지하고 새로운 항목 추가
                    output_lines.extend(lines[i:vocab_end])
                    # 새로운 vocab 5개 추가
                    output_lines.append("      ['고독','외롭고 쓸쓸함.'],\n")
                    output_lines.append("      ['집중','한 곳에 마음이나 힘을 모음.'],\n")
                    output_lines.append("      ['확보','필요한 것을 확실히 가짐.'],\n")
                    output_lines.append("      ['자급자족','스스로 필요한 것을 만들어 씀.'],\n")
                    output_lines.append("      ['동료','함께 일하거나 생활하는 사람.']\n")
                    output_lines.append(lines[vocab_end])  # 닫는 ],
                    i = vocab_end + 1
                    
                    # vocabFill도 확장
                    # vocabFill items 끝 찾기
                    for m in range(i, min(i+50, len(lines))):
                        if '        { no: 10,' in lines[m]:
                            # 10번 항목 다음 라인이 닫는 ]인지 확인
                            for n in range(m+1, min(m+5, len(lines))):
                                if '      ]' in lines[n]:
                                    # 10번 항목 끝
                                    output_lines.extend(lines[i:m+1])
                                    # 새로운 항목 5개 추가
                                    output_lines.append("        { no: 11, text: '외롭고 쓸쓸한 것을 (      )이라고 해요.', answer: '고독', initials: 'ㄱㄷ', aliases: ['고독'] },\n")
                                    output_lines.append("        { no: 12, text: '한 곳에 마음이나 힘을 모으는 것을 (      )이라고 해요.', answer: '집중', initials: 'ㅈㅈ', aliases: ['집중'] },\n")
                                    output_lines.append("        { no: 13, text: '필요한 것을 확실히 가지는 것을 (      )라고 해요.', answer: '확보', initials: 'ㅎㅂ', aliases: ['확보'] },\n")
                                    output_lines.append("        { no: 14, text: '스스로 필요한 것을 만들어 쓰는 것을 (          )이라고 해요.', answer: '자급자족', initials: 'ㅈㄱㅈㅈ', aliases: ['자급자족'] },\n")
                                    output_lines.append("        { no: 15, text: '함께 일하거나 생활하는 사람을 (      )라고 해요.', answer: '동료', initials: 'ㄷㄹ', aliases: ['동료'] }\n")
                                    output_lines.extend(lines[n:])
                                    i = len(lines)  # 루프 종료
                                    break
                            break
                    continue
                break
        
    output_lines.append(line)
    i += 1

# 파일 저장
with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(output_lines)

print("Unit 21 vocab/vocabFill 확장 완료!")

PYTHON_EOF

echo ""
echo "최종 확장 작업 완료!"
echo "Unit 21의 vocab과 vocabFill이 15개로 확장되었습니다."
