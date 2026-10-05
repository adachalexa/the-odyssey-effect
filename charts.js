/* Shared chart helpers for The Odyssey Effect.
   Requires Chart.js (loaded from cdnjs before this file). */
(function () {
  var C = {
    gold: '#D4AF6A',
    bronze: '#B08D57',
    terracotta: '#A4502E',
    parchment: '#EDE4D3',
    olive: '#6B6A4E',
    storm: '#1F3A4D'
  };
  window.OdysseyColors = C;

  if (!window.Chart) return;

  Chart.defaults.font.family = "'IBM Plex Sans', -apple-system, sans-serif";
  Chart.defaults.font.size = 13;
  Chart.defaults.color = 'rgba(237, 228, 211, 0.75)';
  Chart.defaults.borderColor = 'rgba(107, 106, 78, 0.28)';

  /* lineChart(canvasId, labels, series, opts)
     series: [{ label, data, color, width }] */
  window.lineChart = function (id, labels, series, opts) {
    opts = opts || {};
    var el = document.getElementById(id);
    if (!el) return;
    new Chart(el, {
      type: 'line',
      data: {
        labels: labels,
        datasets: series.map(function (s) {
          return {
            label: s.label,
            data: s.data,
            borderColor: s.color,
            backgroundColor: s.color,
            borderWidth: s.width || 2.5,
            pointRadius: opts.points ? 3.5 : 0,
            pointHoverRadius: 5,
            tension: 0.25,
            spanGaps: false
          };
        })
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'bottom',
            labels: { usePointStyle: true, boxWidth: 8, boxHeight: 8, padding: 18 }
          },
          tooltip: {
            backgroundColor: '#1F3A4D',
            titleColor: '#EDE4D3',
            bodyColor: '#EDE4D3',
            borderColor: 'rgba(107,106,78,0.5)',
            borderWidth: 1,
            padding: 10
          }
        },
        scales: {
          x: {
            grid: { display: false },
            title: opts.xTitle ? { display: true, text: opts.xTitle } : undefined,
            ticks: { maxTicksLimit: opts.maxXTicks || 10, maxRotation: 0 }
          },
          y: {
            beginAtZero: true,
            title: opts.yTitle ? { display: true, text: opts.yTitle } : undefined
          }
        }
      }
    });
  };
  /* barChart(canvasId, labels, data, opts)
     opts: { colors (string or array), xTitle, yTitle, valueSuffix } */
  window.barChart = function (id, labels, data, opts) {
    opts = opts || {};
    var el = document.getElementById(id);
    if (!el) return;
    new Chart(el, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: opts.colors || C.bronze,
          borderWidth: 0,
          maxBarThickness: 48
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1F3A4D',
            titleColor: '#EDE4D3',
            bodyColor: '#EDE4D3',
            borderColor: 'rgba(107,106,78,0.5)',
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: function (ctx) { return ' ' + ctx.parsed.y + (opts.valueSuffix || ''); }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            title: opts.xTitle ? { display: true, text: opts.xTitle } : undefined,
            ticks: { maxRotation: 0 }
          },
          y: {
            beginAtZero: true,
            title: opts.yTitle ? { display: true, text: opts.yTitle } : undefined
          }
        }
      }
    });
  };
})();
