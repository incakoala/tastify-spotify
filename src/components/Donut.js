import React, { Component } from 'react'
var Chart = require('chart.js/dist/chart');

//--Chart Style Options--//
Chart.defaults.font.family = "'PT Sans', sans-serif"
Chart.defaults.plugins.legend.display = false;
Chart.defaults.elements.line.tension = 0;
//--Chart Style Options--//

export default class Donut extends Component {
  chartRef = React.createRef();
  genreLabelsTemp = Object.keys(this.props.topGenres)
  genreLabels = this.genreLabelsTemp.slice(0, this.genreLabelsTemp.length / 3)
  genreDataTemp = Object.values(this.props.topGenres)
  genreData = this.genreDataTemp.slice(0, this.genreDataTemp.length / 3)

  componentDidMount() {
    const myChartRef = this.chartRef.current.getContext("2d");

    new Chart(myChartRef, {
      type: "doughnut",
      data: {
        //Bring in data
        labels: this.genreLabels,
        datasets: [
          {
            data: this.genreData,
            label: "Sales",
            backgroundColor: [
              '#A9C1C1',
              '#4A6A9B',
              '#8280A1',
              '#887A89',
              '#4A6A9B',
              '#4A6A9B',
            ],
            hoverOffset: 2,

          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          // padding: {
          //   top: 5,
          //   left: 15,
          //   right: 15,
          //   bottom: 15
          // }
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            var e = elements[0];
            // console.log(e)

            var i = e.index
            var d = this.genreData[i]
            var l = this.genreLabels[i]
            console.log(l, d)
            this.props.setClickedGenre({ genre: l, numSongs: d })
            
          }
        },
      }
    });
  }
  render() {
    return (
      <div>
        <canvas
          id="myChart"
          ref={this.chartRef}
        />
      </div>
    )
  }
}


// import React, { useRef } from 'react'
// import * as Chart from 'chart.js';

// export default function Donut({ topGenres }) {
//   const chartRef = React.createRef();

//   useRef(() => {
//     const myChartRef = this.chartRef.current.getContext("2d");

//     new Chart(myChartRef, {
//       type: "doughnut",
//       data: {
//         //Bring in data
//         labels: ["Jan", "Feb", "March"],
//         datasets: [
//           {
//             label: "Sales",
//             data: [86, 67, 91],
//           }
//         ]
//       },
//       options: {
//         //Customize chart options
//       }
//     });
//   })


//   return (
//     <div>
//       <canvas
//         id="myChart"
//         ref={this.chartRef}
//       />
//     </div>
//   )
// }
