// 8D Report System - Report Detail Page

let allReports = [];
let currentReport = null;

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
    const names = {
        D1: '问题描述',
        D2: '组织团队',
        D3: '遏制措施',
        D4: '根本原因分析',
        D5: '长期永久措施',
        D6: '改善措施验证',
        D7: '预防再发生/标准化',
        D8: '经验教训与横向展开'
    };
    return names[dim] || dim;
}

// Render report detail
function renderReport() {
    const r = currentReport;
    
    document.getElementById('reportTitle').textContent = `#${r.id} ${r.supplier} - ${r.product} - ${r.issue}`;
    
    const content = document.getElementById('reportContent');
    content.innerHTML = `
        <div class="detail-header">
            <div class="detail-title">
                <span class="report-score ${getScoreClass(r.score)}" style="font-size: 2.5em;">${r.score}分</span>
                <span style="font-size: 1.2em; color: #6b7280; margin-left: 15px;">${r.grade}</span>
            </div>
            
            <div class="report-info" style="margin-bottom: 20px;">
                <div class="report-info-item">
                    <span class="report-info-label">供应商</span>
                    <span class="report-info-value">${r.supplier}</span>
                </div>
                <div class="report-info-item">
                    <span class="report-info-label">产品</span>
                    <span class="report-info-value">${r.product}</span>
                </div>
                <div class="report-info-item">
                    <span class="report-info-label">问题</span>
                    <span class="report-info-value">${r.issue}</span>
                </div>
                <div class="report-info-item">
                    <span class="report-info-label">编号</span>
                    <span class="report-info-value">#${r.id}</span>
                </div>
            </div>
            
            <div class="detail-scores">
                ${Object.entries(r.scores).map(([key, value]) => `
                    <div class="detail-score-item">
                        <div class="detail-score-label">${key} - ${getDimensionName(key)}</div>
                        <div class="detail-score-value ${getScoreBadgeClass(value, getMaxScore(key))}">${value}</div>
                        <div class="detail-score-max">/ ${getMaxScore(key)}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        ${Object.entries(r.details || {}).map(([key, detail]) => `
            <div class="detail-section">
                <div class="detail-dimension">
                    <div class="detail-dimension-header">
                        <span class="detail-dimension-title">${key} - ${getDimensionName(key)}</span>
                        <span class="detail-score-value ${getScoreBadgeClass(detail.score, getMaxScore(key))}">${detail.score} / ${getMaxScore(key)}</span>
                    </div>
                    <div class="detail-dimension-content">
                        <div class="detail-highlights">
                            <h4>✅ 核心亮点</h4>
                            <p>${detail.highlights}</p>
                        </div>
                        <div class="detail-shortcomings">
                            <h4>❌ 核心短板</h4>
                            <p>${detail.shortcomings}</p>
                        </div>
                    </div>
                </div>
            </div>
        `).join('')}
        
        ${r.highlights && r.highlights.length > 0 ? `
        <div class="detail-section">
            <h2>✅ 整体亮点</h2>
            <ul style="list-style: none; padding: 0;">
                ${r.highlights.map(h => `<li style="padding: 8px 0; padding-left: 20px; position: relative; color: #059669;"><span style="position: absolute; left: 0;">✓</span>${h}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
        
        ${r.shortcomings && r.shortcomings.length > 0 ? `
        <div class="detail-section">
            <h2>❌ 整体短板</h2>
            <ul style="list-style: none; padding: 0;">
                ${r.shortcomings.map(s => `<li style="padding: 8px 0; padding-left: 20px; position: relative; color: #dc2626;"><span style="position: absolute; left: 0;">✗</span>${s}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
    `;
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
            <div class="report-header">
                <span class="report-id">#${rep.id}</span>
                <span class="report-score ${getScoreClass(rep.score)}">${rep.score}</span>
            </div>
            <div class="report-info">
                <div class="report-info-item">
                    <span class="report-info-label">供应商</span>
                    <span class="report-info-value">${rep.supplier}</span>
                </div>
                <div class="report-info-item">
                    <span class="report-info-label">产品</span>
                    <span class="report-info-value">${rep.product}</span>
                </div>
                <div class="report-info-item">
                    <span class="report-info-label">问题</span>
                    <span class="report-info-value">${rep.issue}</span>
                </div>
                <div class="report-info-item">
                    <span class="report-info-label">等级</span>
                    <span class="report-info-value">${rep.grade}</span>
                </div>
            </div>
            <div class="scores-bar">
                ${Object.entries(rep.scores).map(([key, value]) => `
                    <span class="score-badge ${getScoreBadgeClass(value, getMaxScore(key))}">${key}: ${value}/${getMaxScore(key)}</span>
                `).join('')}
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
        suggestionText += `<ul style="margin-left: 20px; margin-bottom: 15px;">`;
        suggestionText += `<li><strong>D6 改善措施验证</strong>：必须补充量化验证数据（如不良率从X%降到Y%）</li>`;
        suggestionText += `<li><strong>D4 5WHY推演</strong>：必须完成5层推演，系统原因必须定位到管理/流程层面</li>`;
        suggestionText += `<li><strong>D2 组织团队</strong>：联系方式必须全部填写，确保可追溯</li>`;
        suggestionText += `</ul>`;
    } else if (r.score < 70) {
        suggestionText += `<p><strong>🟡 改进建议：</strong></p>`;
        suggestionText += `<p>这份报告处于中等水平，建议改进以下方面以达到合格标准：</p>`;
        suggestionText += `<ul style="margin-left: 20px; margin-bottom: 15px;">`;
        
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
        suggestionText += `<ul style="margin-left: 20px; margin-bottom: 15px;">`;
        suggestionText += `<li><strong>D6 改善措施验证</strong>：补充门店端使用验证数据</li>`;
        suggestionText += `<li><strong>D7 预防再发生</strong>：增加横向排查和标准化展开</li>`;
        suggestionText += `<li><strong>D8 经验教训</strong>：增加知识共享和团队表彰</li>`;
        suggestionText += `</ul>`;
    } else {
        suggestionText += `<p><strong>🌟 标杆案例！</strong></p>`;
        suggestionText += `<p>这份报告质量优秀，建议作为标杆案例供其他供应商学习。</p>`;
        suggestionText += `<ul style="margin-left: 20px; margin-bottom: 15px;">`;
        suggestionText += `<li>将本报告纳入3期训战营标杆素材</li>`;
        suggestionText += `<li>邀请该供应商分享经验</li>`;
        suggestionText += `<li>继续优化细节，争取满分</li>`;
        suggestionText += `</ul>`;
    }
    
    // Specific suggestions based on shortcomings
    if (r.shortcomings && r.shortcomings.length > 0) {
        suggestionText += `<p><strong>📋 针对性改进建议：</strong></p>`;
        suggestionText += `<ul style="margin-left: 20px; margin-bottom: 15px;">`;
        r.shortcomings.forEach(s => {
            suggestionText += `<li>${s}</li>`;
        });
        suggestionText += `</ul>`;
    }
    
    suggestions.innerHTML = suggestionText;
}

// Initialize
document.addEventListener('DOMContentLoaded', loadReports);