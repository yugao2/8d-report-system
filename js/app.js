// 8D Report System - Main Application

let allReports = [];
let filteredReports = [];
let currentFilter = 'all';
let currentSort = 'id-asc';

// Load reports data
async function loadReports() {
    try {
        const response = await fetch('data/reports.json');
        const data = await response.json();
        allReports = data.reports;
        filteredReports = [...allReports];
        renderReports();
    } catch (error) {
        console.error('Failed to load reports:', error);
        document.getElementById('reportList').innerHTML = '<p class="loading">加载失败，请刷新页面重试</p>';
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

// Render reports list
function renderReports() {
    const list = document.getElementById('reportList');
    const noResults = document.getElementById('noResults');
    const resultsCount = document.getElementById('resultsCount');

    // Sort reports
    filteredReports.sort((a, b) => {
        switch(currentSort) {
            case 'id-asc': return a.id - b.id;
            case 'id-desc': return b.id - a.id;
            case 'score-desc': return b.score - a.score;
            case 'score-asc': return a.score - b.score;
            default: return a.id - b.id;
        }
    });

    resultsCount.textContent = `共 ${filteredReports.length} 份报告`;

    if (filteredReports.length === 0) {
        list.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }

    list.style.display = 'grid';
    noResults.style.display = 'none';

    list.innerHTML = filteredReports.map(report => `
        <div class="report-card ${getGradeClass(report.grade)}" onclick="window.location.href='report.html?id=${report.id}'">
            <div class="report-id-badge">#${report.id}</div>
            <div class="report-main">
                <div class="report-main-item">
                    <span class="report-main-label">供应商</span>
                    <span class="report-main-value">${report.supplier}</span>
                </div>
                <div class="report-main-item">
                    <span class="report-main-label">产品</span>
                    <span class="report-main-value">${report.product}</span>
                </div>
                <div class="report-main-item">
                    <span class="report-main-label">问题</span>
                    <span class="report-main-value">${report.issue}</span>
                </div>
                <div class="report-main-item">
                    <span class="report-main-label">等级</span>
                    <span class="report-main-value"><span class="tag ${getGradeClass(report.grade)}">${report.grade}</span></span>
                </div>
            </div>
            <div class="report-score-badge">
                <div class="report-score ${getScoreClass(report.score)}">${report.score}</div>
                <div class="report-grade">/100</div>
            </div>
        </div>
    `).join('');
}

// Filter reports
function filterReports(filter) {
    currentFilter = filter;
    if (filter === 'all') {
        filteredReports = [...allReports];
    } else {
        filteredReports = allReports.filter(r => r.grade === filter);
    }
    applySearch();
}

// Search reports
function searchReports(query) {
    const q = query.toLowerCase().trim();
    if (!q) {
        filteredReports = currentFilter === 'all' ? [...allReports] : allReports.filter(r => r.grade === currentFilter);
    } else {
        filteredReports = allReports.filter(r => 
            r.supplier.toLowerCase().includes(q) ||
            r.product.toLowerCase().includes(q) ||
            r.issue.toLowerCase().includes(q) ||
            r.grade.toLowerCase().includes(q) ||
            (r.highlights && r.highlights.some(h => h.toLowerCase().includes(q))) ||
            (r.shortcomings && r.shortcomings.some(s => s.toLowerCase().includes(q)))
        );
    }
    renderReports();
}

// Apply search and filter
function applySearch() {
    const query = document.getElementById('searchInput').value;
    searchReports(query);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadReports();

    // Search input
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    searchBtn.addEventListener('click', () => searchReports(searchInput.value));
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchReports(searchInput.value);
    });

    // Filter tags
    document.querySelectorAll('.filter-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            filterReports(tag.dataset.filter);
        });
    });

    // Sort select
    document.getElementById('sortSelect').addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderReports();
    });
});