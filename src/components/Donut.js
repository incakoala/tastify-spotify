import React from 'react';
import ReactDOM from 'react-dom';
import { VictoryPie, VictoryChart } from 'victory';

// const data = [
//   { x: "Cats", y: 35 },
//   { x: "Dogs", y: 40 },
//   { x: "Birds", y: 55 }
// ];

const data = ((topGenres) => {
  return Object.keys(topGenres).slice(0, 10)
    .reduce((result, g) => {
      result.push({
        x: g,
        y: topGenres[g]
      })
      return result
    }, [])
    // .sort((a, b) => {
    //   return (a.y > b.y) ? 1 : (a.y === b.y) ? ((a.y > b.y) ? 1 : -1) : -1
    // })
})

// const sort = ((data) => {
//   return data.sort((a, b) => {
//     return (a.y > b.y) ? 1 : (a.y === b.y) ? ((a.y > b.y) ? 1 : -1) : -1
//   })
// })

export default class Donut extends React.Component {
  render() {
    return (
      <>
        {/* {console.log(data(this.props.topGenres))} */}

        <VictoryPie
          data={data(this.props.topGenres)}
          // events={[
          //   {
          //     target: 'data',
          //     eventHandlers: {
          //       onPressIn: () => {
          //         return [
          //           {
          //             target: 'data',
          //             mutation: dataProps => {
          //               console.log('item selected is', dataProps.index)
          //               return {}
          //             }
          //           }
          //         ]
          //       },
          //       onPressOut: () => {
          //       }
          //     }
          //   }
          // ]}
          events={[
            {
              target: "data",
              eventHandlers: {
                onClick: () => {
                  return [{
                    target: "labels",
                    mutation: (props) => {
                      console.log('item selected is',
                        Object.keys(this.props.topGenres)[props.index], Object.values(this.props.topGenres)[props.index])
                      this.props.setClickedGenre({
                        genre: Object.keys(this.props.topGenres)[props.index],
                        numSongs: Object.values(this.props.topGenres)[props.index]
                      })
                      return {}
                    }
                  }];
                }
              }
            }
          ]}
        />
      </>
    )
  }
}



// import React, { Component, useState, useRef } from 'react'
// import { Doughnut } from 'react-chartjs-2';

// export default class Donut extends Component {
//   genreLabelsTemp = Object.keys(this.props.topGenres)
//   genreLabels = this.genreLabelsTemp.slice(0, this.genreLabelsTemp.length / 3)
//   genreDataTemp = Object.values(this.props.topGenres)
//   genreData = this.genreDataTemp.slice(0, this.genreDataTemp.length / 3)

//   state = {
//     labels: this.genreLabels,
//     datasets: [
//       {
//         data: this.genreData,
//         label: "Genres",
//         backgroundColor: [
//           '#A9C1C1',
//           '#4A6A9B',
//           '#8280A1',
//           '#887A89',
//           '#4A6A9B',
//           '#4A6A9B',
//         ],
//       }
//     ]
//   }

//   render() {
//     return (
//       <div>
//         <Doughnut
//           data={this.state}
//           options={{
//             onClick: (event, elements) => {
//               if (elements.length > 0) {
//                 var e = elements[0];
//                 // console.log(e)

//                 var i = e.index
//                 var d = this.genreData[i]
//                 var l = this.genreLabels[i]
//                 console.log(l, d)
//                 this.props.setClickedGenre({ genre: l, numSongs: d })

//               }
//             }
//           }}
//         />
//       </div>
//     );
//   }

// }

// import React, { Component, useState, useEffect } from 'react'
// import { Doughnut } from 'react-chartjs-2';

// export default function Donut({ topGenres, setClickedGenre }) {
//   const genreLabelsTemp = Object.keys(topGenres)
//   const genreLabels = genreLabelsTemp.slice(0, genreLabelsTemp.length / 3)
//   const genreDataTemp = Object.values(topGenres)
//   const genreData = genreDataTemp.slice(0, genreDataTemp.length / 3)

//   // const state = {
//   //   labels: genreLabels,
//   //   datasets: [
//   //     {
//   //       data: genreData,
//   //       label: "Genres",
//   //       backgroundColor: [
//   //         '#A9C1C1',
//   //         '#4A6A9B',
//   //         '#8280A1',
//   //         '#887A89',
//   //         '#4A6A9B',
//   //         '#4A6A9B',
//   //       ],
//   //     }
//   //   ]
//   // }

//   return (
//     <div>
//       <Doughnut
//         data={{
//           labels: genreLabels,
//           datasets: [
//             {
//               data: genreData,
//               label: "Genres",
//               backgroundColor: [
//                 '#A9C1C1',
//                 '#4A6A9B',
//                 '#8280A1',
//                 '#887A89',
//                 '#4A6A9B',
//                 '#4A6A9B',
//               ],
//             }
//           ]
//         }}
//         options={{
//           onClick: (event, elements) => {
//             if (elements.length > 0) {
//               var e = elements[0];
//               // console.log(e)

//               var i = e.index
//               var d = genreData[i]
//               var l = genreLabels[i]
//               console.log(l, d)
//               setClickedGenre({ genre: l, numSongs: d })

//             }
//           }
//         }}
//       />
//     </div>
//   );
// }

// import React, { Component, useState, useRef } from 'react'
// var Chart = require('chart.js/dist/chart');

// //--Chart Style Options--//
// Chart.defaults.font.family = "'PT Sans', sans-serif"
// Chart.defaults.plugins.legend.display = false;
// Chart.defaults.elements.line.tension = 0;
// //--Chart Style Options--//

// export default function Donut({ topGenres, setClickedGenre }) {
//   const chartRef = React.createRef();
//   const genreLabelsTemp = Object.keys(topGenres)
//   const genreLabels = genreLabelsTemp.slice(0, genreLabelsTemp.length / 3)
//   const genreDataTemp = Object.values(topGenres)
//   const genreData = genreDataTemp.slice(0, genreDataTemp.length / 3)

//   useRef(() => {
//     const myChartRef = chartRef.current.getContext("2d");

//     new Chart(myChartRef, {
//       type: "doughnut",
//       data: {
//         //Bring in data
//         labels: genreLabels,
//         datasets: [
//           {
//             data: genreData,
//             label: "Sales",
//             backgroundColor: [
//               '#A9C1C1',
//               '#4A6A9B',
//               '#8280A1',
//               '#887A89',
//               '#4A6A9B',
//               '#4A6A9B',
//             ],
//             hoverOffset: 2,

//           }
//         ]
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         layout: {
//           // padding: {
//           //   top: 5,
//           //   left: 15,
//           //   right: 15,
//           //   bottom: 15
//           // }
//         },
//         onClick: (event, elements) => {
//           if (elements.length > 0) {
//             var e = elements[0];
//             // console.log(e)

//             var i = e.index
//             var d = genreData[i]
//             var l = genreLabels[i]
//             console.log(l, d)
//             // setClickedGenre({ genre: l, numSongs: d })

//           }
//         },
//       }
//     });
//   }
//   )

//   return (
//     <div>
//       <canvas
//         id="myChart"
//         ref={chartRef}
//       />
//     </div>
//   )

// }


// import React, { Component } from 'react'
// var Chart = require('chart.js/dist/chart');

// //--Chart Style Options--//
// Chart.defaults.font.family = "'PT Sans', sans-serif"
// Chart.defaults.plugins.legend.display = false;
// Chart.defaults.elements.line.tension = 0;
// //--Chart Style Options--//

// export default class Donut extends Component {
//   chartRef = React.createRef();
//   genreLabelsTemp = Object.keys(this.props.topGenres)
//   genreLabels = this.genreLabelsTemp.slice(0, this.genreLabelsTemp.length / 3)
//   genreDataTemp = Object.values(this.props.topGenres)
//   genreData = this.genreDataTemp.slice(0, this.genreDataTemp.length / 3)

//   componentDidMount() {
//     const myChartRef = this.chartRef.current.getContext("2d");

//     new Chart(myChartRef, {
//       type: "doughnut",
//       data: {
//         //Bring in data
//         labels: this.genreLabels,
//         datasets: [
//           {
//             data: this.genreData,
//             label: "Sales",
//             backgroundColor: [
//               '#A9C1C1',
//               '#4A6A9B',
//               '#8280A1',
//               '#887A89',
//               '#4A6A9B',
//               '#4A6A9B',
//             ],
//             hoverOffset: 2,

//           }
//         ]
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         layout: {
//           // padding: {
//           //   top: 5,
//           //   left: 15,
//           //   right: 15,
//           //   bottom: 15
//           // }
//         },
//         onClick: (event, elements) => {
//           if (elements.length > 0) {
//             var e = elements[0];
//             // console.log(e)


//             var i = e.index
//             var d = this.genreData[i]
//             var l = this.genreLabels[i]
//             console.log(l, d)
//             this.props.setClickedGenre({ genre: l, numSongs: d })

//           }
//         },
//       }
//     });
//   }
//   render() {
//     return (
//       <div>
//         <canvas
//           id="myChart"
//           ref={this.chartRef}
//         />
//       </div>
//     )
//   }
// }
