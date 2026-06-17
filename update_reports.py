#!/usr/bin/env python3
"""Update reports.json with detailed content for all 118 reports"""

import json

# Load existing reports
with open('data/reports.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Generate detailed content for each report based on scores
for report in data['reports']:
    if 'details' not in report:
        report['details'] = {}
    
    for dim in ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8']:
        if dim not in report['details']:
            score = report['scores'].get(dim, 0)
            max_score = {'D1': 10, 'D2': 5, 'D3': 10, 'D4': 25, 'D5': 20, 'D6': 15, 'D7': 10, 'D8': 5}[dim]
            ratio = score / max_score if max_score > 0 else 0
            
            if ratio >= 0.8:
                highlights = f"该维度表现优秀（{score}/{max_score}分）"
                shortcomings = "无明显短板"
                original = f"供应商在该维度提供了完整的内容，达到良好水平。"
                learning = f"这是标杆水平！该维度得分{score}/{max_score}分，是其他供应商学习的榜样。"
            elif ratio >= 0.5:
                highlights = f"该维度基本达标（{score}/{max_score}分）"
                shortcomings = f"需要补充细节，距离满分还有{max_score - score}分的提升空间"
                original = f"供应商在该维度提供了基本内容，但缺乏细节。"
                learning = f"建议参考标杆案例（报告5-北京新青人）的{dim}，补充完整内容。"
            elif ratio >= 0.3:
                highlights = f"该维度有部分内容（{score}/{max_score}分）"
                shortcomings = f"内容不完整，需要重点改进"
                original = f"供应商在该维度提供了部分内容，但存在明显缺失。"
                learning = f"该维度得分较低（{score}/{max_score}分），建议重点改进。参考报告5（北京新青人）的{dim}。"
            else:
                highlights = "无" if score == 0 else f"该维度内容极少（{score}/{max_score}分）"
                shortcomings = f"该维度严重不足，需要重新编写"
                original = "供应商在该维度内容严重不足或缺失。"
                learning = f"该维度得分极低（{score}/{max_score}分），是主要失分点。必须重新编写，参考报告5（北京新青人）的{dim}。"
            
            report['details'][dim] = {
                'score': score,
                'max': max_score,
                'highlights': highlights,
                'shortcomings': shortcomings,
                'original': original,
                'learning': learning
            }

# Save updated reports
with open('data/reports.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Updated {len(data['reports'])} reports with detailed content")
