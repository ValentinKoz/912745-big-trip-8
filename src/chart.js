import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export const buildChartMoney = (dataSecondChart) => {

  const moneyCtx = document.querySelector(`.statistic__money`);
  const BAR_HEIGHT = 55;

  moneyCtx.height = BAR_HEIGHT * dataSecondChart.labels.length;
  const moneyChart = new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: dataSecondChart.labels,
      datasets: [{
        data: dataSecondChart.data,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
  return moneyChart;
};


export const buildChartTransport = (dataFirstChart) => {

  const transportCtx = document.querySelector(`.statistic__transport`);
  const BAR_HEIGHT = 55;

  transportCtx.height = BAR_HEIGHT * dataFirstChart.labels.length;
  const transportChart = new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: dataFirstChart.labels,
      datasets: [{
        data: dataFirstChart.data,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TRANSPORT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
  return transportChart;
};
