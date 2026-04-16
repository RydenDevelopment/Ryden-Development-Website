// Configuration & Data
const tiers = {
    AZURE_STATIC: { name: 'AZURE STATIC', price: 399, type: 'fixed' },
    START: { name: 'START', price: 399, type: 'fixed' },
    GROWTH: { name: 'GROWTH', price: 699, type: 'stepped', batchSize: 10 },
    PROFESSIONAL: { name: 'PROFESSIONAL', price: 1199, type: 'fixed' }
};

let chart;

function formatSEK(val) {
    return new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK', maximumFractionDigits: 0 }).format(val);
}

function calculate() {
    const counts = {
        AZURE_STATIC: parseInt(document.getElementById('input-azure').value),
        START: parseInt(document.getElementById('input-start').value),
        GROWTH: parseInt(document.getElementById('input-growth').value),
        PROFESSIONAL: parseInt(document.getElementById('input-prof').value)
    };

    const costs = {
        AZURE_STATIC: parseFloat(document.getElementById('cost-azure').value) || 0,
        START: parseFloat(document.getElementById('cost-start').value) || 0,
        GROWTH_BATCH: parseFloat(document.getElementById('cost-growth').value) || 0,
        PROFESSIONAL: parseFloat(document.getElementById('cost-prof').value) || 0
    };

    const taxRate = parseInt(document.getElementById('input-tax').value);

    // Update UI displays
    document.getElementById('val-azure').innerText = counts.AZURE_STATIC;
    document.getElementById('val-start').innerText = counts.START;
    document.getElementById('val-growth').innerText = counts.GROWTH;
    document.getElementById('val-prof').innerText = counts.PROFESSIONAL;
    document.getElementById('val-tax').innerText = taxRate + '%';

    let totalTurnover = 0;
    let totalCost = 0;
    let totalCustomers = 0;
    let tableHtml = '';

    const chartData = {
        labels: [],
        turnover: [],
        profit: []
    };

    Object.keys(tiers).forEach(key => {
        const tier = tiers[key];
        const count = counts[key];
        const turnover = tier.price * count;

        let cost = 0;
        if (tier.type === 'stepped') {
            cost = count === 0 ? 0 : Math.ceil(count / tier.batchSize) * costs.GROWTH_BATCH;
        } else {
            const unitCost = costs[key];
            cost = unitCost * count;
        }

        const profit = turnover - cost;

        totalTurnover += turnover;
        totalCost += cost;
        totalCustomers += count;

        chartData.labels.push(tier.name);
        chartData.turnover.push(turnover);
        chartData.profit.push(profit);

        tableHtml += `
                <tr>
                    <td class="ps-4 py-3">
                        <div class="fw-bold">${tier.name}</div>
                        <div style="font-size: 0.65rem; color: #94a3b8">${tier.type === 'stepped' ? 'Stepped' : 'Unit Cost'}</div>
                    </td>
                    <td class="text-end py-3">${count}</td>
                    <td class="text-end py-3 text-danger">-${formatSEK(cost)}</td>
                    <td class="text-end pe-4 py-3 fw-bold text-success">${formatSEK(profit)}</td>
                </tr>
            `;
    });

    const totalProfit = totalTurnover - totalCost;
    const taxAmount = totalProfit * (taxRate / 100);
    const payout = Math.max(0, totalProfit - taxAmount);

    document.getElementById('total-turnover').innerText = formatSEK(totalTurnover);
    document.getElementById('total-cost').innerText = `-${formatSEK(totalCost)}`;
    document.getElementById('total-profit').innerText = formatSEK(totalProfit);
    document.getElementById('total-tax').innerText = `-${formatSEK(taxAmount)}`;
    document.getElementById('total-payout-display').innerText = formatSEK(payout);

    document.getElementById('table-body').innerHTML = tableHtml;
    document.getElementById('table-footer').innerHTML = `
            <td class="ps-4 py-3">Net Totals</td>
            <td class="text-end py-3">${totalCustomers}</td>
            <td class="text-end py-3 text-danger">-${formatSEK(totalCost)}</td>
            <td class="text-end pe-4 py-3 text-success">${formatSEK(totalProfit)}</td>
        `;

    updateChart(chartData);
}

function updateChart(data) {
    if (chart) {
        chart.data.labels = data.labels;
        chart.data.datasets[0].data = data.turnover;
        chart.data.datasets[1].data = data.profit;
        chart.update();
    } else {
        const ctx = document.getElementById('marginChart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Income',
                        data: data.turnover,
                        backgroundColor: '#e2e8f0',
                        borderRadius: 6
                    },
                    {
                        label: 'Net Profit',
                        data: data.profit,
                        backgroundColor: '#0d6efd',
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top', labels: { boxWidth: 12, usePointStyle: true, font: { weight: 'bold', size: 10 } } },
                    tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${formatSEK(ctx.raw)}` } }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { display: false },
                        ticks: { font: { size: 10 }, callback: (v) => v >= 1000 ? (v/1000) + 'k' : v }
                    },
                    x: { grid: { display: false }, ticks: { font: { size: 9, weight: 'bold' } } }
                }
            }
        });
    }
}

// Event Listeners
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', calculate);
});

window.onload = calculate;