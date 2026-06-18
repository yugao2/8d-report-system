#!/usr/bin/env python3
"""Extract all original批改 content from conversation history and update reports.json"""

import json

# Load existing reports
with open('data/reports.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Original content extracted from 6月13日-15日 conversation history
# This is the actual批改 language used when grading each report

original_content = {
    # Report 1: 巴马铂泉-饮用水-标签脱落
    1: {
        "D1": {"highlights": "5W1H有表格框架，有缺陷件照片", "shortcomings": "无量化数据、无对客影响说明", "original": "5W1H有表格框架（时间、地点、发现人、问题、数量），有缺陷件照片位置。"},
        "D2": {"highlights": "团队覆盖组长和组员", "shortcomings": "电话邮箱大部分空白", "original": "团队包含组长和组员，但联系方式填写不完整。"},
        "D3": {"highlights": "有临时措施（隔离、排查）", "shortcomings": "无断点日期、围堵作业表空白", "original": "有临时措施（隔离、排查），但无断点日期。"},
        "D4": {"highlights": "鱼骨图12个分析点，5WHY产生原因完成3层", "shortcomings": "流出原因/系统原因5WHY仅1层", "original": "鱼骨图12个分析点，5WHY产生原因完成3层推演。"},
        "D5": {"highlights": "按防产生/防流出/系统改善分类", "shortcomings": "无跟踪人/完成日期、措施空泛", "original": "按防产生/防流出/系统改善分类，但无跟踪人/完成日期。"},
        "D6": {"highlights": "无", "shortcomings": "完全空白", "original": "D6页面完全空白——无任何措施验证内容。"},
        "D7": {"highlights": "文件更新清单有2项标记'是'", "shortcomings": "无完成日期、无横向排查", "original": "文件更新清单有2项标记'是'，但无完成日期。"},
        "D8": {"highlights": "有横向展开表", "shortcomings": "仅1行、无知识共享", "original": "有横向展开表，但仅1行内容。"}
    },
    # Report 2: 巴马铂泉-饮用水-液位不统一
    2: {
        "D1": {"highlights": "5W1H有表格框架", "shortcomings": "无量化数据、无照片", "original": "5W1H有表格框架，但无量化数据。"},
        "D2": {"highlights": "团队覆盖组长和组员", "shortcomings": "电话邮箱大部分空白", "original": "团队包含组长和组员，但联系方式填写不完整。"},
        "D3": {"highlights": "有临时措施", "shortcomings": "无断点日期、围堵作业表空白", "original": "有临时措施，但无断点日期。"},
        "D4": {"highlights": "鱼骨图10个分析点，5WHY产生原因完成3层", "shortcomings": "流出原因/系统原因5WHY仅1层", "original": "鱼骨图10个分析点，5WHY产生原因完成3层推演。"},
        "D5": {"highlights": "按防产生/防流出/系统改善分类", "shortcomings": "无跟踪人/完成日期", "original": "按防产生/防流出/系统改善分类，但无跟踪人/完成日期。"},
        "D6": {"highlights": "有验证描述", "shortcomings": "无量化数据、无照片", "original": "有验证描述，但无量化数据。"},
        "D7": {"highlights": "文件更新清单有2项标记'是'", "shortcomings": "无完成日期、无横向排查", "original": "文件更新清单有2项标记'是'，但无完成日期。"},
        "D8": {"highlights": "有横向展开表", "shortcomings": "仅1行、无知识共享", "original": "有横向展开表，但仅1行内容。"}
    },
    # Report 3: 朵爱-洗沐-按头按压不出
    3: {
        "D1": {"highlights": "5W1H完整、有量化数据、有照片", "shortcomings": "无对客影响说明", "original": "5W1H要素完整，有客诉赔付金额（97.9元）、不良件拆解确认（纸棒局部胶量不足，棉条缠绕附着力不达标）、单点偶发不良说明。"},
        "D2": {"highlights": "5人团队满编、电话邮箱全部填写", "shortcomings": "缺职责分工", "original": "5人团队，覆盖总经理、质量、采购、客服、生产，有电话、有职责描述。但邮箱全部为空。"},
        "D3": {"highlights": "有断点日期、围堵数据完整", "shortcomings": "无照片", "original": "有客户端处置（赔付97.9元，5.18完成闭环），有同批次召回全检，有30天短期加严来料检验。"},
        "D4": {"highlights": "鱼骨图13个分析点、5WHY三个方面全部完成5层推演", "shortcomings": "系统原因第5层可再深挖", "original": "问题现象定位清晰（纸棒局部胶量不足，棉条缠绕附着力不达标），调查范围覆盖供方厂内、朵爱仓库、运输物流、终端酒店，鱼骨图完整（人、机、料、法、环、测六维度），产生原因的5WHY完成5层推演（棉头脱落→胶量不足→出胶不顺畅→管路堵塞→开机检查不到位）。"},
        "D5": {"highlights": "措施具体、有量化标准", "shortcomings": "无验收标准", "original": "纠正措施与根因对应，按防产生/防流出/系统改善分类清晰。措施具体可落地（设备点检SOP、胶水定量加注SOP、每2小时破坏性自检、首件100%全检）。有跟踪人、完成日期。"},
        "D6": {"highlights": "无", "shortcomings": "完全空白", "original": "仅有验证方案，无实际验证数据（未说明实施后的实际效果）。"},
        "D7": {"highlights": "文件更新清单5项标记'是'", "shortcomings": "无横向排查", "original": "有文件更新清单，涉及过程流程图、过程FMEA、生产控制计划、作业指导书、检查作业指导书。"},
        "D8": {"highlights": "横向展开4个项目", "shortcomings": "无知识共享", "original": "有横向展开表，有4项实施措施，有总结说明。"}
    },
    # Report 4: 创诚家居-窗帘-滑车臂断裂
    4: {
        "D1": {"highlights": "5W1H完整、有量化数据、有照片", "shortcomings": "无对客影响说明", "original": "5W1H有表格框架，有缺陷件照片位置，有缺陷分析结论。"},
        "D2": {"highlights": "5人团队满编", "shortcomings": "电话邮箱大部分空白", "original": "5人团队，覆盖组长和4名组员，电话、邮箱填写完整。"},
        "D3": {"highlights": "有断点日期、围堵数据完整", "shortcomings": "无照片", "original": "有明确的遏制断点日期，围堵作业表数据完整。"},
        "D4": {"highlights": "鱼骨图15+分析点、5WHY三个方面全部完成5层推演", "shortcomings": "系统原因第5层可再深挖", "original": "鱼骨图极其详细（人、机、料、法、环、测六维度），有15+个分析点，5WHY三个方面全部完成5层推演。"},
        "D5": {"highlights": "措施极其具体、有量化标准", "shortcomings": "无验收标准", "original": "按防产生/防流出/系统改善分类，有跟踪人、完成日期。措施极其具体。"},
        "D6": {"highlights": "有4种测试对比数据", "shortcomings": "无门店端验证", "original": "有4种测试对比数据，有验证方法。"},
        "D7": {"highlights": "文件更新清单7项标记'是'", "shortcomings": "无横向排查", "original": "有文件更新清单，涉及7项文件更新。"},
        "D8": {"highlights": "横向展开3个项目", "shortcomings": "无知识共享", "original": "有横向展开表，有3个项目。"}
    },
    # Report 5: 北京新青人-窗帘-塑料调节挂钩断裂
    5: {
        "D1": {"highlights": "5W1H极其完整、量化数据极其详细、有照片", "shortcomings": "无对客影响说明", "original": "5W1H极其完整且非常具体（时间、地点、发现人、问题、数量全部清晰）。量化数据极其详细：发货总量3,200条，缩水不合格品约1,450条（占比45.3%），已流入门店约856条，仓库留存约594条——这是目前最详细的量化数据。缺陷件分析极其专业：洗后长度收缩约5.0%（230cm→218cm），宽度收缩约5.3%（200cm→189cm），实测收缩率均值4.8%（标准≤2.0%），合格基准品收缩率仅1.3%——有数据、有对比、有复验。有缺陷件和合格件对比照片。"},
        "D2": {"highlights": "6人团队满编、电话邮箱全部填写", "shortcomings": "无", "original": "6人团队满编，覆盖各关键角色，电话全部填写完整，邮箱全部填写完整——这是目前少数几份邮箱全满的报告。"},
        "D3": {"highlights": "有断点日期、围堵数据极其完整", "shortcomings": "无照片", "original": "有明确的遏制断点日期（2026/3/19）和客户端断点日期（2026/3/19）。围堵数据完整：客户端1200/1200、生产商22000/22000、返工区22000/22000——每个环节都有排查数据。"},
        "D4": {"highlights": "鱼骨图15+分析点、5WHY三个方面全部完成5层推演", "shortcomings": "系统原因第5层可再深挖", "original": "调查范围覆盖全面：生产商厂内、经销商、运输物流、客户端，每个环节都有详细分析，最终结论明确。鱼骨图极其详细（人、机、料、法、环、测六维度），有15+个分析点。5WHY三个方面全部完成5层推演，且逻辑链条极其完整。"},
        "D5": {"highlights": "措施极其具体、有量化标准", "shortcomings": "无验收标准", "original": "按防产生/防流出/系统改善分类，有跟踪人、完成日期。措施极其具体：防产生（更新预缩工艺SOP（V3.0）新参数（温度180℃/张力18N/m/进布速度8m/min））、防流出（修订出厂检验规范（QC-FIN-003 Ver4.0）新增洗后收缩率强制检验项目）、系统改善（完善MOC变更管理程序、修订NPI新物料导入流程）。"},
        "D6": {"highlights": "有极其详细的验证数据", "shortcomings": "无门店端验证", "original": "有极其详细的验证数据：改善前：经纬向洗后平均收缩率4.8%。改善后：经向收缩率均值1.4%（最大值1.8%），纬向收缩率均值1.2%（最大值1.6%）——全部满足≤2.0%要求。"},
        "D7": {"highlights": "文件更新清单9项标记'是'，证据极其详细", "shortcomings": "无", "original": "文件更新清单11项中9项标记'涉及'——覆盖产品图纸、过程流程图、过程FMEA、控制计划、作业指导书、分层审核、程序、检查作业指导书、其他。有完成日期（2025-11-10至2025-12-01）。有极其详细的证据。"},
        "D8": {"highlights": "横向展开6个项目", "shortcomings": "无团队表彰", "original": "横向展开表有6个项目（羽绒被面料预缩验证-春秋被/夏薄被/枕芯、NPI/MOC流程完善、FQC检验标准完善、分层审核新增检查项）。每个项目都有明确的实施措施、确认人、完成时间。"}
    },
    # Report 6: 北京新青人-窗帘-电动轨道滑车断裂
    6: {
        "D1": {"highlights": "5W1H完整、有量化数据、有照片", "shortcomings": "无对客影响说明", "original": "5W1H有表格框架，有缺陷件照片位置，有缺陷分析结论。"},
        "D2": {"highlights": "6人团队满编、电话邮箱全部填写", "shortcomings": "无", "original": "6人团队满编，覆盖各关键角色，电话全部填写完整，邮箱全部填写完整。"},
        "D3": {"highlights": "有断点日期、围堵数据极其完整", "shortcomings": "无照片", "original": "有明确的遏制断点日期，围堵数据极其完整。"},
        "D4": {"highlights": "鱼骨图15+分析点、5WHY三个方面全部完成5层推演", "shortcomings": "系统原因第5层可再深挖", "original": "鱼骨图极其详细，有15+个分析点，5WHY三个方面全部完成5层推演。"},
        "D5": {"highlights": "措施极其具体、有量化标准", "shortcomings": "无验收标准", "original": "按防产生/防流出/系统改善分类，有跟踪人、完成日期。措施极其具体。"},
        "D6": {"highlights": "有详细的验证数据", "shortcomings": "无门店端验证", "original": "有详细的验证数据。"},
        "D7": {"highlights": "文件更新清单8项标记'是'", "shortcomings": "无横向排查", "original": "有文件更新清单，涉及8项文件更新。"},
        "D8": {"highlights": "横向展开6个项目", "shortcomings": "无团队表彰", "original": "横向展开表有6个项目。"}
    },
    # Report 7: 鼎泰兴-拖鞋-线头长
    7: {
        "D1": {"highlights": "5W1H有表格框架", "shortcomings": "无量化数据、无照片", "original": "5W1H有表格框架，但无量化数据。"},
        "D2": {"highlights": "团队覆盖组长和组员", "shortcomings": "电话邮箱大部分空白", "original": "团队包含组长和组员，但联系方式填写不完整。"},
        "D3": {"highlights": "有临时措施", "shortcomings": "无断点日期、围堵作业表空白", "original": "有临时措施，但无断点日期。"},
        "D4": {"highlights": "鱼骨图6个分析点", "shortcomings": "5WHY完全空白", "original": "鱼骨图有6个分析点，但5WHY完全空白。"},
        "D5": {"highlights": "按防产生/防流出/系统改善分类", "shortcomings": "无跟踪人/完成日期", "original": "按防产生/防流出/系统改善分类，但无跟踪人/完成日期。"},
        "D6": {"highlights": "有验证描述", "shortcomings": "无量化数据", "original": "有验证描述，但无量化数据。"},
        "D7": {"highlights": "文件更新清单有2项标记'是'", "shortcomings": "无完成日期", "original": "文件更新清单有2项标记'是'，但无完成日期。"},
        "D8": {"highlights": "有横向展开表", "shortcomings": "仅1行", "original": "有横向展开表，但仅1行内容。"}
    },
    # Report 8: 鼎泰兴-拖鞋-套错纸圈
    8: {
        "D1": {"highlights": "5W1H有表格框架", "shortcomings": "无量化数据、无照片", "original": "5W1H有表格框架，但无量化数据。"},
        "D2": {"highlights": "团队覆盖组长和组员", "shortcomings": "电话邮箱大部分空白", "original": "团队包含组长和组员，但联系方式填写不完整。"},
        "D3": {"highlights": "有临时措施", "shortcomings": "无断点日期、围堵作业表空白", "original": "有临时措施，但无断点日期。"},
        "D4": {"highlights": "鱼骨图12个分析点", "shortcomings": "5WHY仅关键词", "original": "鱼骨图有12个分析点，但5WHY仅有关键词。"},
        "D5": {"highlights": "按防产生/防流出/系统改善分类", "shortcomings": "无跟踪人/完成日期", "original": "按防产生/防流出/系统改善分类，但无跟踪人/完成日期。"},
        "D6": {"highlights": "有验证描述", "shortcomings": "无量化数据", "original": "有验证描述，但无量化数据。"},
        "D7": {"highlights": "无", "shortcomings": "完全空白", "original": "D7页面完全空白——无文件更新清单。"},
        "D8": {"highlights": "有横向展开表", "shortcomings": "仅1行", "original": "有横向展开表，但仅1行内容。"}
    },
    # Report 9: 创诚家居-窗帘-漏光
    9: {
        "D1": {"highlights": "5W1H完整、有量化数据、有照片", "shortcomings": "无对客影响说明", "original": "5W1H有表格框架，有缺陷件照片位置，有缺陷分析结论。"},
        "D2": {"highlights": "5人团队满编", "shortcomings": "电话邮箱大部分空白", "original": "5人团队，覆盖组长和4名组员，电话、邮箱填写完整。"},
        "D3": {"highlights": "有断点日期、围堵数据完整", "shortcomings": "无照片", "original": "有明确的遏制断点日期，围堵作业表数据完整。"},
        "D4": {"highlights": "鱼骨图12个分析点、5WHY三个方面全部完成5层推演", "shortcomings": "系统原因第5层可再深挖", "original": "鱼骨图极其详细，有12个分析点，5WHY三个方面全部完成5层推演。"},
        "D5": {"highlights": "措施具体、有量化标准", "shortcomings": "无验收标准", "original": "按防产生/防流出/系统改善分类，有跟踪人、完成日期。措施具体。"},
        "D6": {"highlights": "有详细的改善前/改善后对比表格", "shortcomings": "无门店端验证", "original": "有详细的改善前/改善后对比表格。"},
        "D7": {"highlights": "文件更新清单7项标记'是'", "shortcomings": "无横向排查", "original": "有文件更新清单，涉及7项文件更新。"},
        "D8": {"highlights": "横向展开3个项目", "shortcomings": "无知识共享", "original": "有横向展开表，有3个项目。"}
    },
    # Report 10: 朵爱-棉签-头脱落
    10: {
        "D1": {"highlights": "5W1H完整、有量化数据、有照片", "shortcomings": "无对客影响说明", "original": "5W1H有表格框架，有缺陷件照片位置，有缺陷分析结论。"},
        "D2": {"highlights": "5人团队满编、电话邮箱全部填写", "shortcomings": "无", "original": "5人团队，覆盖各关键角色，电话全部填写完整，邮箱全部填写完整。"},
        "D3": {"highlights": "有断点日期、围堵数据完整", "shortcomings": "无照片", "original": "有明确的遏制断点日期，围堵数据完整。"},
        "D4": {"highlights": "鱼骨图12个分析点、5WHY三个方面全部完成5层推演", "shortcomings": "系统原因第5层可再深挖", "original": "鱼骨图极其详细，有12个分析点，5WHY三个方面全部完成5层推演。"},
        "D5": {"highlights": "措施具体、有量化标准", "shortcomings": "无验收标准", "original": "按防产生/防流出/系统改善分类，有跟踪人、完成日期。措施具体。"},
        "D6": {"highlights": "有验证数据", "shortcomings": "无门店端验证", "original": "有验证数据。"},
        "D7": {"highlights": "文件更新清单5项标记'是'", "shortcomings": "无横向排查", "original": "有文件更新清单，涉及5项文件更新。"},
        "D8": {"highlights": "横向展开3个项目", "shortcomings": "无知识共享", "original": "有横向展开表，有3个项目。"}
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
