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
  /* groupedBar(canvasId, labels, datasets, opts)
     datasets: [{ label, data, color }]. opts: { horizontal, stacked, yTitle, xTitle, valueSuffix, max, showValues } */
  window.groupedBar = function (id, labels, datasets, opts) {
    opts = opts || {};
    var el = document.getElementById(id);
    if (!el) return;
    var horiz = !!opts.horizontal;
    var valuePlugin = {
      id: 'valueLabels',
      afterDatasetsDraw: function (chart) {
        if (!opts.showValues) return;
        var ctx = chart.ctx;
        ctx.save();
        ctx.font = "600 12px 'IBM Plex Sans', sans-serif";
        ctx.fillStyle = '#EDE4D3';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        chart.data.datasets.forEach(function (ds, i) {
          chart.getDatasetMeta(i).data.forEach(function (bar, j) {
            var v = ds.data[j];
            if (v === null || v === undefined) return;
            var txt = (opts.format ? opts.format(v) : v) + (opts.valueSuffix || '');
            ctx.fillText(txt, bar.x, bar.y - 4);
          });
        });
        ctx.restore();
      }
    };
    new Chart(el, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: datasets.map(function (d) {
          return { label: d.label, data: d.data, backgroundColor: d.color, borderWidth: 0, maxBarThickness: 46 };
        })
      },
      plugins: [valuePlugin],
      options: {
        indexAxis: horiz ? 'y' : 'x',
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: opts.showValues ? 18 : 0 } },
        plugins: {
          legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, boxHeight: 8, padding: 18 } },
          tooltip: {
            backgroundColor: '#1F3A4D', titleColor: '#EDE4D3', bodyColor: '#EDE4D3',
            borderColor: 'rgba(107,106,78,0.5)', borderWidth: 1, padding: 10
          }
        },
        scales: {
          x: { stacked: !!opts.stacked, grid: { display: horiz }, title: opts.xTitle ? { display: true, text: opts.xTitle } : undefined, ticks: { maxRotation: 0 } },
          y: { stacked: !!opts.stacked, beginAtZero: true, max: opts.max, grid: { display: !horiz }, title: opts.yTitle ? { display: true, text: opts.yTitle } : undefined }
        }
      }
    });
  };

  /* slopeChart(canvasId, leftLabel, rightLabel, items)
     items: [{ name, left, right, color }]  (left/right are ranks, 1 = best) */
  window.slopeChart = function (id, leftLabel, rightLabel, items) {
    var el = document.getElementById(id);
    if (!el) return;
    var max = items.length;
    var labelPlugin = {
      id: 'slopeLabels',
      afterDatasetsDraw: function (chart) {
        var ctx = chart.ctx;
        ctx.save();
        ctx.font = "600 13px 'IBM Plex Sans', sans-serif";
        ctx.textBaseline = 'middle';
        chart.data.datasets.forEach(function (ds, i) {
          var pts = chart.getDatasetMeta(i).data;
          ctx.fillStyle = ds.borderColor;
          ctx.textAlign = 'right';
          ctx.fillText(ds.label + '  #' + ds.data[0], pts[0].x - 14, pts[0].y);
          ctx.textAlign = 'left';
          ctx.fillText('#' + ds.data[1] + '  ' + ds.label, pts[1].x + 14, pts[1].y);
        });
        ctx.restore();
      }
    };
    new Chart(el, {
      type: 'line',
      data: {
        labels: [leftLabel, rightLabel],
        datasets: items.map(function (it) {
          return {
            label: it.name, data: [it.left, it.right],
            borderColor: it.color, backgroundColor: it.color,
            borderWidth: 3.5, pointRadius: 6, pointHoverRadius: 8, tension: 0
          };
        })
      },
      plugins: [labelPlugin],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { left: 150, right: 150, top: 8, bottom: 4 } },
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: {
          x: { offset: false, grid: { display: false }, ticks: { font: { size: 14, weight: '600' }, color: '#EDE4D3' }, position: 'top' },
          y: { reverse: true, min: 0.5, max: max + 0.5, grid: { display: false }, ticks: { display: false } }
        }
      }
    });
  };
})();
