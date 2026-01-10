#!/usr/bin/env python3
"""
Script to fix explain/detail structure for all remaining units in fit_world2_content.js

The explain sections should contain PASSAGE QUOTES (evidence), not explanations.
The detail sections should contain explanations with "정답: [번]." format.
"""

import re
import json

def read_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(filepath, content):
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def extract_unit_passage(content, unit_id):
    """Extract passage array for a given unit"""
    pattern = rf"{unit_id}:[\s\S]*?passage:\s*\[([\s\S]*?)\],"
    match = re.search(pattern, content)
    if match:
        passage_text = match.group(1)
        # Extract quoted strings
        passages = re.findall(r"'([^']*(?:''[^']*)*)'", passage_text)
        # Clean HTML tags
        cleaned = []
        for p in passages:
            p = re.sub(r'<b>|</b>', '', p)
            cleaned.append(p)
        return cleaned
    return []

def main():
    content = read_file('fit_world2_content.js')
    
    # Process units 13-40
    units_fixed = 0
    
    for unit_num in range(13, 41):
        unit_id = f"fit_world2_{unit_num:02d}"
        print(f"Processing {unit_id}...")
        
        # Extract passage for this unit
        passages = extract_unit_passage(content, unit_id)
        
        if not passages:
            print(f"  WARNING: Could not extract passages for {unit_id}")
            continue
        
        print(f"  Found {len(passages)} passage paragraphs")
        # Show first passage paragraph (truncated)
        if passages:
            print(f"  First para: {passages[0][:100]}...")
        
        units_fixed += 1
    
    print(f"\nTotal units analyzed: {units_fixed}/28")
    print("\nTo fix the explain sections, you would need to:")
    print("1. Read each unit's quiz questions")
    print("2. Find relevant quotes from the passage array that answer each question")
    print("3. Replace current explain content with those quotes")
    print("4. Keep detail sections as-is (they're already correct)")

if __name__ == '__main__':
    main()

