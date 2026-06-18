// 8D Report System - Report Detail Page

let allReports = [];
let currentReport = null;

// Learning guide content for each dimension
const learningGuide = {
    D1: {
        name: '问题描述',
        max: 10,
        tips: [
            '5W1H要素完整：时间、地点、发现人、问题、数量',
            '必须有缺陷件照片和合格件对比照片',
            '量化数据：批次总量、不良率、涉及门店数',
            '对客影响量化说明（如客人投诉数、安全风险等级）',
            '缺陷件分析结论要专业、具体'
        ],
        benchmark: '报告5（北京新青人-塑料调节挂钩断裂-94分）的D1是标杆：量化数据极其详细（3,200条/1,450条/45.3%），有缺陷件和合格件对比照片。'
    },
    D2: {
        name: '组织团队',
        max: 5,
        tips: [
            '5人团队满编，覆盖关键职能',
            '电话邮箱全部填写，确保可追溯',
            '各成员职责分工明确描述',
            '团队专业覆盖合理（质量/生产/技术/采购等）'
        ],
        benchmark: '报告5（北京新青人）的D2是标杆：6人团队满编，电话邮箱全部填写，专业覆盖合理。'
    },
    D3: {
        name: '遏制措施',
        max: 10,
        tips: [
            '必须有遏制断点日期和客户端断点日期',
            '临时措施要具体（至少3条）',
            '围堵作业表数据完整（客户端/经销商/运输/仓库/生产商各环节）',
            '临时措施照片、产品断点标识照片',
            '合计围堵数量要清晰'
        ],
        benchmark: '报告44（金可儿-包装粘到布料-83分）的D3是标杆：有断点日期，围堵数据极其完整，每个环节都有排查数据。'
    },
    D4: {
        name: '根本原因分析',
        max: 25,
        tips: [
            '调查范围覆盖全面（生产商/经销商/运输/客户端）',
            '工艺流程图分析结论明确',
            '鱼骨图13+分析点（人/机/料/法/环/测六维度）',
            'OK/NG验证结论详细（每个NG都有确认事实）',
            '5WHY三个方面（产生/流出/系统）全部完成5层推演',
            '根因定位到管理/流程/标准层面，不是操作层',
            '避免推卸责任（全部归因于洗涤厂/物流等）'
        ],
        benchmark: '报告5（北京新青人-塑料调节挂钩断裂-94分）的D4是标杆：鱼骨图15+分析点，5WHY三个方面全部完成5层推演，逻辑链条极其完整。'
    },
    D5: {
        name: '长期永久措施',
        max: 20,
        tips: [
            '按防产生/防流出/系统改善分类',
            '每条措施必须有跟踪人、完成日期',
            '措施要具体（避免"加强培训""加强检验"等空泛表述）',
            '有量化标准（如"每批次100%抽检""摩擦系数≥0.4"）',
            '有明确验收标准',
            '明确固化到标准文件的编号与版本',
            '措施与根因对应率要高（≥80%）'
        ],
        benchmark: '报告44（金可儿-包装粘到布料-83分）的D5是标杆：措施极其具体，有量化标准（温度180℃/张力18N/m/进布速度8m/min）。'
    },
    D6: {
        name: '改善措施验证',
        max: 15,
        tips: [
            '必须有改善前数据（如不良率X%）',
            '必须有改善后数据（如不良率降到Y%）',
            '有验证方法（数据统计/现场观察/第三方检测）',
            '有验证照片（改善措施照片、验证数据照片）',
            '有明确结论（措施是否有效）',
            '有酒店门店端使用验证数据',
            '连续跟踪验证（如48小时/3批次）'
        ],
        benchmark: '报告85（四川环龙-卷纸无断线-91分）的D6是标杆：三阶段验证数据，改善前/改善后对比极其详细，有门店端验证。'
    },
    D7: {
        name: '预防再发生/标准化',
        max: 10,
        tips: [
            '文件更新清单完整（11项中至少6项标记"是"）',
            '有完成日期',
            '有证据描述（具体更新了哪些文件）',
            '有横向排查（同类产品/同工艺/同材料）',
            '有横向标准化展开',
            '文件编号与版本要明确'
        ],
        benchmark: '报告5（北京新青人-塑料调节挂钩断裂-94分）的D7是标杆：文件更新清单9项标记"是"，证据极其详细，覆盖极广。'
    },
    D8: {
        name: '经验教训与横向展开',
        max: 5,
        tips: [
            '横向展开表完整（至少4个项目）',
            '每个项目有实施措施、确认人、完成时间',
            '覆盖范围要广（全系列/全品类）',
            '有知识共享（案例库/培训材料）',
            '有团队成员认可与表彰',
            '有后续跟进机制'
        ],
        benchmark: '报告6（北京新青人-电动轨道滑车断裂-88分）的D8是标杆：横向展开6个项目，覆盖全系列窗帘产品。'
    }
};

// Load reports data
async function loadReports() {
    try {
        const response = await fetch('data/reports.json');
        const data = await response.json();
        allReports = data.reports;
        
        // Get report ID from URL
        const params = new URLSearchParams(window.location.search);
        const id = parseInt(params.get('id'));
        
        if (!id) {
            window.location.href = 'index.html';
            return;
        }
        
        currentReport = allReports.find(r => r.id === id);
        if (!currentReport) {
            window.location.href = 'index.html';
            return;
        }
        
        renderReport();
        renderComparison();
        renderSuggestions();
    } catch (error) {
        console.error('Failed to load reports:', error);
        document.getElementById('reportContent').innerHTML = '<p class="loading">加载失败，请刷新页面重试</p>';
    }
}

// Get grade class
function getGradeClass(grade) {
    switch(grade) {
        case '优秀': return 'excellent';
        case '良好': return 'good';
        case '合格': return 'pass';
        default: return 'fail';
    }
}

// Get score class
function getScoreClass(score) {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'pass';
    return 'fail';
}

// Get score badge class
function getScoreBadgeClass(score, max) {
    const ratio = score / max;
    if (ratio >= 0.7) return 'high';
    if (ratio >= 0.5) return 'medium';
    return 'low';
}

// Get max score for dimension
function getMaxScore(dim) {
    const maxScores = { D1: 10, D2: 5, D3: 10, D4: 25, D5: 20, D6: 15, D7: 10, D8: 5 };
    return maxScores[dim] || 10;
}

// Get dimension name
function getDimensionName(dim) {
    return learningGuide[dim]?.name || dim;
}

// Render report detail
function renderReport() {
    const r = currentReport;
    
    document.getElementById('reportTitle').textContent = `#${r.id} ${r.supplier}`;
    document.getElementById('reportSubtitle').textContent = `${r.product} - ${r.issue}`;
    
    // Sidebar
    document.getElementById('sidebarScore').textContent = r.score;
    document.getElementById('sidebarScore').className = `score ${getScoreClass(r.score)}`;
    document.getElementById('sidebarGrade').textContent = r.grade;
    document.getElementById('sidebarSupplier').textContent = r.supplier;
    document.getElementById('sidebarProduct').textContent = r.product;
    document.getElementById('sidebarIssue').textContent = r.issue;
    document.getElementById('sidebarId').textContent = `#${r.id}`;
    
    // Score bars
    const sidebarScores = document.getElementById('sidebarScores');
    sidebarScores.innerHTML = Object.entries(r.scores).map(([key, value]) => {
        const max = getMaxScore(key);
        const ratio = (value / max) * 100;
        const badgeClass = getScoreBadgeClass(value, max);
        return `
            <div class="score-bar">
                <span class="score-bar-label">${key}</span>
                <div class="score-bar-track">
                    <div class="score-bar-fill ${badgeClass}" style="width: ${ratio}%"></div>
                </div>
                <span class="score-bar-value">${value}/${max}</span>
            </div>
        `;
    }).join('');
    
    // Overall evaluation
    const overallEvaluation = document.getElementById('overallEvaluation');
    let overallHtml = '';
    
    if (r.score >= 90) {
        overallHtml = `<div style="padding: 12px; background: #f0fdf4; border-radius: 6px; border-left: 3px solid #10b981;">
            <p style="margin-bottom: 8px; font-weight: 600; color: #059669;">🌟 标杆案例！这份报告质量优秀，是3期训战营的最佳学习素材。</p>
            <p style="color: #065f46; font-size: 0.85em;">核心亮点：${r.highlights.join('；')}</p>
        </div>`;
    } else if (r.score >= 80) {
        overallHtml = `<div style="padding: 12px; background: #fef3c7; border-radius: 6px; border-left: 3px solid #f59e0b;">
            <p style="margin-bottom: 8px; font-weight: 600; color: #d97706;">🌟 良好案例！这份报告质量较好，有学习价值。</p>
            <p style="color: #92400e; font-size: 0.85em;">核心亮点：${r.highlights.join('；')}</p>
        </div>`;
    } else if (r.score >= 70) {
        overallHtml = `<div style="padding: 12px; background: #eff6ff; border-radius: 6px; border-left: 3px solid #3b82f6;">
            <p style="margin-bottom: 8px; font-weight: 600; color: #1e40af;">✅ 合格案例！这份报告达到基本要求，但仍有改进空间。</p>
            <p style="color: #1e3a8a; font-size: 0.85em;">核心亮点：${r.highlights.join('；')}</p>
        </div>`;
    } else {
        overallHtml = `<div style="padding: 12px; background: #fef2f2; border-radius: 6px; border-left: 3px solid #ef4444;">
            <p style="margin-bottom: 8px; font-weight: 600; color: #dc2626;">❌ 不合格！这份报告需要重点改进。</p>
            <p style="color: #991b1b; font-size: 0.85em;">核心短板：${r.shortcomings.join('；')}</p>
        </div>`;
    }
    
    overallEvaluation.innerHTML = overallHtml;
    
    // Dimension details
    const dimensionDetails = document.getElementById('dimensionDetails');
    dimensionDetails.innerHTML = Object.entries(r.details || {}).map(([key, detail]) => {
        const max = getMaxScore(key);
        const ratio = (detail.score / max) * 100;
        const badgeClass = getScoreBadgeClass(detail.score, max);
        const guide = learningGuide[key];
        
        return `
            <div class="dimension-card" id="dimension-${key}">
                <div class="dimension-header">
                    <span class="dimension-title">${key} - ${getDimensionName(key)}</span>
                    <span class="dimension-score ${badgeClass}">${detail.score} / ${max}</span>
                </div>
                <div class="dimension-body">
                    <div class="dimension-grid">
                        <div class="dimension-card-item highlights">
                            <h4>✅ 核心亮点</h4>
                            <p>${detail.highlights}</p>
                        </div>
                        <div class="dimension-card-item shortcomings">
                            <h4>❌ 核心短板</h4>
                            <p>${detail.shortcomings}</p>
                        </div>
                    </div>
                    
                    ${detail.original ? `
                    <div style="margin-bottom: 12px; padding: 10px; background: #f9fafb; border-radius: 6px; font-size: 0.85em;">
                        <p style="color: #6b7280; margin-bottom: 4px; font-weight: 500;">📋 原文</p>
                        <p style="color: #4b5563;">${detail.original}</p>
                    </div>
                    ` : ''}
                    
                    ${guide ? `
                    <div class="learning-card">
                        <h4>📚 学习指导 - ${guide.name}</h4>
                        <p style="margin-bottom: 6px;">满分标准：</p>
                        <ul style="margin-bottom: 8px;">
                            ${guide.tips.map(tip => `<li>${tip}</li>`).join('')}
                        </ul>
                        <p style="margin-bottom: 0;">${guide.benchmark}</p>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Render comparison reports
function renderComparison() {
    const r = currentReport;
    
    // Find similar reports (same product or same grade)
    let similarReports = allReports.filter(rep => 
        rep.id !== r.id && (
            rep.product === r.product || 
            (rep.grade === r.grade && Math.abs(rep.score - r.score) <= 10)
        )
    ).slice(0, 5);
    
    // If not enough similar reports, add reports with similar scores
    if (similarReports.length < 3) {
        const additional = allReports.filter(rep => 
            rep.id !== r.id && 
            !similarReports.find(s => s.id === rep.id) &&
            Math.abs(rep.score - r.score) <= 15
        ).slice(0, 3 - similarReports.length);
        similarReports = [...similarReports, ...additional];
    }
    
    const comparisonList = document.getElementById('comparisonList');
    
    if (similarReports.length === 0) {
        comparisonList.innerHTML = '<p style="color: #6b7280; text-align: center; padding: 20px;">暂无可对比的报告</p>';
        return;
    }
    
    comparisonList.innerHTML = similarReports.map(rep => `
        <div class="report-card ${getGradeClass(rep.grade)}" onclick="window.location.href='report.html?id=${rep.id}'" style="cursor: pointer;">
            <div class="report-id-badge">#${rep.id}</div>
            <div class="report-main">
                <div class="report-main-item">
                    <span class="report-main-label">供应商</span>
                    <span class="report-main-value">${rep.supplier}</span>
                </div>
                <div class="report-main-item">
                    <span class="report-main-label">产品</span>
                    <span class="report-main-value">${rep.product}</span>
                </div>
                <div class="report-main-item">
                    <span class="report-main-label">问题</span>
                    <span class="report-main-value">${rep.issue}</span>
                </div>
                <div class="report-main-item">
                    <span class="report-main-label">等级</span>
                    <span class="report-main-value"><span class="tag ${getGradeClass(rep.grade)}">${rep.grade}</span></span>
                </div>
            </div>
            <div class="report-score-badge">
                <div class="report-score ${getScoreClass(rep.score)}">${rep.score}</div>
                <div class="report-grade">/100</div>
            </div>
        </div>
    `).join('');
}

// Render suggestions
function renderSuggestions() {
    const r = currentReport;
    const suggestions = document.getElementById('suggestionsContent');
    
    let suggestionText = '';
    
    // General suggestions based on score
    if (r.score < 40) {
        suggestionText += `<p><strong>🔴 紧急改进建议：</strong></p>`;
        suggestionText += `<p>这份报告得分较低，建议重点改进以下方面：</p>`;
        suggestionText += `<ul>`;
        suggestionText += `<li><strong>D6 改善措施验证</strong>：必须补充量化验证数据（如不良率从X%降到Y%）</li>`;
        suggestionText += `<li><strong>D4 5WHY推演</strong>：必须完成5层推演，系统原因必须定位到管理/流程层面</li>`;
        suggestionText += `<li><strong>D2 组织团队</strong>：联系方式必须全部填写，确保可追溯</li>`;
        suggestionText += `</ul>`;
    } else if (r.score < 70) {
        suggestionText += `<p><strong>🟡 改进建议：</strong></p>`;
        suggestionText += `<p>这份报告处于中等水平，建议改进以下方面以达到合格标准：</p>`;
        suggestionText += `<ul>`;
        
        // Find lowest scoring dimensions
        const sortedScores = Object.entries(r.scores).sort((a, b) => {
            const maxA = getMaxScore(a[0]);
            const maxB = getMaxScore(b[0]);
            return (a[1] / maxA) - (b[1] / maxB);
        });
        
        sortedScores.slice(0, 3).forEach(([key, value]) => {
            const ratio = value / getMaxScore(key);
            if (ratio < 0.5) {
                suggestionText += `<li><strong>${key} - ${getDimensionName(key)}</strong>（${value}/${getMaxScore(key)}分）：需要重点改进</li>`;
            }
        });
        
        suggestionText += `</ul>`;
    } else if (r.score < 80) {
        suggestionText += `<p><strong>🟢 优化建议：</strong></p>`;
        suggestionText += `<p>这份报告已达到合格标准，建议进一步优化以达到良好水平：</p>`;
        suggestionText += `<ul>`;
        suggestionText += `<li><strong>D6 改善措施验证</strong>：补充门店端使用验证数据</li>`;
        suggestionText += `<li><strong>D7 预防再发生</strong>：增加横向排查和标准化展开</li>`;
        suggestionText += `<li><strong>D8 经验教训</strong>：增加知识共享和团队表彰</li>`;
        suggestionText += `</ul>`;
    } else {
        suggestionText += `<p><strong>🌟 标杆案例！</strong></p>`;
        suggestionText += `<p>这份报告质量优秀，建议作为标杆案例供其他供应商学习。</p>`;
        suggestionText += `<ul>`;
        suggestionText += `<li>将本报告纳入3期训战营标杆素材</li>`;
        suggestionText += `<li>邀请该供应商分享经验</li>`;
        suggestionText += `<li>继续优化细节，争取满分</li>`;
        suggestionText += `</ul>`;
    }
    
    // Specific suggestions based on shortcomings
    if (r.shortcomings && r.shortcomings.length > 0) {
        suggestionText += `<p><strong>📋 针对性改进建议：</strong></p>`;
        suggestionText += `<ul>`;
        r.shortcomings.forEach(s => {
            suggestionText += `<li>${s}</li>`;
        });
        suggestionText += `</ul>`;
    }
    
    suggestions.innerHTML = suggestionText;
}

// Initialize
document.addEventListener('DOMContentLoaded', loadReports);