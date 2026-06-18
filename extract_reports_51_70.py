#!/usr/bin/env python3
"""Extract original批改 content for reports 51-70 and update reports.json"""

import json

# Load existing reports
with open('data/reports.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Original content extracted from 6月14日 conversation history
original_content = {
    # Report 51: 江苏雅高-床单-破损
    51: {
        "D1": {"highlights": "5W1H有表格框架，有缺陷件照片", "shortcomings": "无量化数据、无对客影响说明", "original": "5W1H有表格框架（时间、地点、发现人、问题、数量），有缺陷件照片位置。"},
        "D2": {"highlights": "团队覆盖组长和组员", "shortcomings": "电话邮箱大部分空白", "original": "团队包含组长和组员，但联系方式填写不完整。"},
        "D3": {"highlights": "有临时措施", "shortcomings": "无断点日期、围堵作业表空白", "original": "有临时措施，但无断点日期。"},
        "D4": {"highlights": "鱼骨图12个分析点，5WHY产生原因完成3层", "shortcomings": "流出原因/系统原因5WHY仅1层", "original": "鱼骨图12个分析点，5WHY产生原因完成3层推演。"},
        "D5": {"highlights": "按防产生/防流出/系统改善分类", "shortcomings": "无跟踪人/完成日期、措施空泛", "original": "按防产生/防流出/系统改善分类，但无跟踪人/完成日期。"},
        "D6": {"highlights": "无", "shortcomings": "完全空白", "original": "D6页面完全空白——无任何措施验证内容。"},
        "D7": {"highlights": "文件更新清单有2项标记'是'", "shortcomings": "无完成日期、无横向排查", "original": "文件更新清单有2项标记'是'，但无完成日期。"},
        "D8": {"highlights": "有横向展开表", "shortcomings": "仅1行、无知识共享", "original": "有横向展开表，但仅1行内容。"}
    },
    # Report 52: 上海金斗-巾类-勾丝
    52: {
        "D1": {"highlights": "5W1H有表格框架", "shortcomings": "无量化数据、无照片", "original": "5W1H有表格框架，但无量化数据。"},
        "D2": {"highlights": "团队覆盖组长和组员", "shortcomings": "电话邮箱大部分空白", "original": "团队包含组长和组员，但联系方式填写不完整。"},
        "D3": {"highlights": "有临时措施", "shortcomings": "无断点日期、围堵作业表空白", "original": "有临时措施，但无断点日期。"},
        "D4": {"highlights": "鱼骨图15个分析点，5WHY三个方面全部完成5层推演", "shortcomings": "5WHY简略", "original": "鱼骨图15个分析点，5WHY三个方面全部完成5层推演。"},
        "D5": {"highlights": "按防产生/防流出/系统改善分类", "shortcomings": "无跟踪人/完成日期、措施笼统", "original": "按防产生/防流出/系统改善分类，但无跟踪人/完成日期。"},
        "D6": {"highlights": "无", "shortcomings": "完全空白", "original": "D6页面完全空白——无任何措施验证内容。"},
        "D7": {"highlights": "无", "shortcomings": "完全空白", "original": "D7页面完全空白——无文件更新清单。"},
        "D8": {"highlights": "无", "shortcomings": "完全空白", "original": "D8页面完全空白——无横向展开表。"}
    },
    # Report 53: 扬州杰飞澳-洗沐瓶-按头脱落
    53: {
        "D1": {"highlights": "5W1H完整、有缺陷分析结论", "shortcomings": "无照片对比、无对客影响量化", "original": "5W1H要素完整（时间、地点、发现人、问题、数量全部清晰），有缺陷件照片位置，有缺陷分析结论（个别单品泵头组装偏松，物流运输途中颠簸震动、分拣抛摔导致装配偏松单品按头脱落）。"},
        "D2": {"highlights": "7人团队满编、电话全部填写完整", "shortcomings": "缺职责分工", "original": "7人团队满编，覆盖总经理、质量安全负责人、技术、生产主任、采购、质检（2人），电话全部填写完整，邮箱大部分填写完整。"},
        "D3": {"highlights": "有断点日期、围堵数据完整", "shortcomings": "无照片", "original": "有明确的遏制断点日期（2026.3.23-3.24），围堵作业表数据完整——酒店6000瓶/2缺陷，成品仓库12624瓶/1缺陷，合计18624瓶/3缺陷。"},
        "D4": {"highlights": "鱼骨图9个分析点、5WHY三个方面全部完成5层推演", "shortcomings": "5WHY部分内容简略", "original": "鱼骨图完整（人、机、料、法、环、测六维度），有9个分析点，5WHY三个方面全部完成5层推演。"},
        "D5": {"highlights": "措施具体、有跟踪人/完成日期", "shortcomings": "无验收标准", "original": "按防产生/防流出/系统改善分类，有跟踪人、完成日期。措施具体。"},
        "D6": {"highlights": "有验证描述", "shortcomings": "无实际验证数据", "original": "有验证描述（来料开箱照片、泵头密封性测试检验等7项测试），但无实际验证数据。"},
        "D7": {"highlights": "文件更新清单5项标记'是'", "shortcomings": "无横向排查", "original": "有文件更新清单，涉及设计FMEA、过程流程图、过程FMEA、控制计划、作业指导书。"},
        "D8": {"highlights": "横向展开5个项目", "shortcomings": "无知识共享", "original": "有横向展开表，覆盖外购泵头、来料检验、罐装生产、仓储运输、系统管理5个项目。"}
    },
    # Report 54: 扬州杰飞澳-拖鞋-异物
    54: {
        "D1": {"highlights": "5W1H完整、有缺陷分析结论", "shortcomings": "无照片对比、无对客影响量化", "original": "5W1H要素完整（时间、地点、发现人、问题、数量全部清晰），有缺陷件照片位置，有缺陷分析结论（车缝工在缝制过程中将缝纫机绕线梭芯缝进了拖鞋盖面内）。"},
        "D2": {"highlights": "6人团队、电话邮箱全部填写完整", "shortcomings": "缺职责分工", "original": "6人团队，覆盖拖鞋厂负责人、质量负责人、品控负责人、业务对接人、客服负责人、仓管部主管，电话、邮箱全部填写完整。"},
        "D3": {"highlights": "有断点日期、围堵数据极其完整", "shortcomings": "无照片", "original": "有明确的遏制断点日期（2026.1.12-1.13），围堵数据极其完整——河南新乡市政府全季酒店6000双/1缺陷，外协加工方10000双/0缺陷，本公司成品库64000双/0缺陷，合计80000双/1缺陷。"},
        "D4": {"highlights": "鱼骨图12个分析点、5WHY三个方面全部完成5层推演", "shortcomings": "5WHY部分内容简略", "original": "鱼骨图完整（人、机、料、法、环、测六维度），有12个分析点，5WHY三个方面全部完成5层推演。"},
        "D5": {"highlights": "措施非常具体（定额管控）", "shortcomings": "无验收标准", "original": "按防产生/防流出/系统改善分类，有跟踪人、完成日期。措施非常具体（定额管控：每台缝纫机固定标配两枚梭芯）。"},
        "D6": {"highlights": "无", "shortcomings": "完全空白", "original": "D6页面完全空白——无任何措施验证内容。"},
        "D7": {"highlights": "文件更新清单6项标记'是'", "shortcomings": "无横向排查", "original": "有文件更新清单，涉及设计FMEA、过程流程图、过程FMEA、控制计划、作业指导书、分层审核。"},
        "D8": {"highlights": "横向展开5个项目", "shortcomings": "无知识共享", "original": "有横向展开表，覆盖辅料闭环管理、内部异物检测、员工行为与道德风险管理、过程监控与审核强化、文件体系更新5个项目。"}
    },
    # Report 55: 江苏雅高-被套-起球
    55: {
        "D1": {"highlights": "5W1H有表格框架，有缺陷分析结论", "shortcomings": "无照片对比、无对客影响量化", "original": "5W1H有表格框架，有缺陷件照片位置，有缺陷分析结论（洗涤时与巾类产品混洗有关）。"},
        "D2": {"highlights": "4人团队、电话邮箱填写完整", "shortcomings": "团队人数不足", "original": "4人团队，覆盖质量代表、质量QC、采购经理、华住质量对接人、生产总检，电话、邮箱填写完整。"},
        "D3": {"highlights": "有断点日期、围堵数据完整", "shortcomings": "无照片", "original": "有明确的遏制断点日期（2026.5.10-5.11），围堵作业表数据完整——客户端2072条排查0缺陷。"},
        "D4": {"highlights": "鱼骨图20+个分析点、5WHY三个方面全部完成5层推演", "shortcomings": "根因停留操作层，OK/NG有3个待定", "original": "鱼骨图极其详细（人、机、料、法、环、测六维度），有20+个分析点，5WHY三个方面全部完成5层推演。"},
        "D5": {"highlights": "措施有跟踪人/完成日期", "shortcomings": "措施笼统，无验收标准", "original": "按防产生/防流出/系统改善分类，有跟踪人、完成日期。措施较笼统。"},
        "D6": {"highlights": "有验证描述", "shortcomings": "无量化数据", "original": "有验证描述（门店重新安排此订单未洗涤的产品单独洗涤，经洗涤未发现被套有起球的现象）。"},
        "D7": {"highlights": "文件更新清单3项标记'是'", "shortcomings": "无横向排查", "original": "有文件更新清单，涉及过程FMEA、控制计划、作业指导书。"},
        "D8": {"highlights": "横向展开3个产品", "shortcomings": "内容简单", "original": "有横向展开表，覆盖床单、被套、枕套3个产品。"}
    }
}

# Update reports with original content
updated_count = 0
for report_id, dims in original_content.items():
    for dim, content in dims.items():
        # Find the report in data
        for report in data['reports']:
            if report['id'] == report_id:
                if dim in report['details']:
                    report['details'][dim]['original'] = content['original']
                    report['details'][dim]['highlights'] = content['highlights']
                    report['details'][dim]['shortcomings'] = content['shortcomings']
                    updated_count += 1
                break

# Save updated data
with open('data/reports.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"✅ 已更新 {updated_count} 个维度的原文内容")
print(f"📊 总报告数：{len(data['reports'])}")
print(f"📝 已更新报告：{list(original_content.keys())}")
