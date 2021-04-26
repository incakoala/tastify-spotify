import React from 'react';
import ReactDOM from 'react-dom';
import { VictoryPie, VictoryLabel, VictoryTooltip } from 'victory';
import './Donut.css'
import Vinyl from "./vinyl.svg"

// const data = [
//   { x: "Cats", y: 35 },
//   { x: "Dogs", y: 40 },
//   { x: "Birds", y: 55 }
// ];

// const data = ((topGenres) => {
//   return Object.keys(topGenres).slice(0, 10)
//     .reduce((result, g) => {
//       result.push({
//         x: g,
//         y: topGenres[g]
//       })
//       return result
//     }, [])
//     .sort((a, b) => {
//       return (a.y > b.y) ? 1 : (a.y === b.y) ? ((a.y > b.y) ? 1 : -1) : -1
//     })
// })

const showLabels = ((datum, topGenres) => {
  const len = topGenres.length
  const moreThan3 = Object.values(topGenres[len - 1])[0] === datum ||
    Object.values(topGenres[len - 2])[0] === datum ||
    Object.values(topGenres[len - 3])[0] === datum

  if (len > 3) {
    return moreThan3
  } else if (len <= 3) {
    return true
  }
})

class CustomLabel extends React.Component {
  static defaultEvents = VictoryTooltip.defaultEvents;
  render() {
    return (
      <g>
        <VictoryLabel {...this.props} />
        <VictoryTooltip
          {...this.props}
          x={0} y={50}
          text={`# ${this.props.text}`}
          orientation="top"
          pointerLength={0}
          cornerRadius={50}
          width={100}
          height={100}
          flyoutStyle={{ fill: "black" }}
        />
      </g>
    );
  }
}

export default class Donut extends React.Component {
  constructor() {
    super();
    this.state = {
      externalMutations: undefined,
      lastClicked: undefined
    };
  }

  removeMutation() {
    this.setState({
      externalMutations: undefined
    });
  }

  // [this.lastClicked]

  clearClicks() {
    this.setState({
      externalMutations: [
        {
          childName: "Bar-1",
          target: ["data"],
          eventKey: [this.state.lastClicked],
          mutation: () => ({ style: undefined }),
          callback: this.removeMutation.bind(this)
        },
        {
          childName: "Bar-1",
          target: ["labels"],
          eventKey: [this.state.lastClicked],
          mutation: () => ({ style: undefined }),
          callback: this.removeMutation.bind(this)
        }
      ]
    })
  }

  render() {
    const buttonStyle = {
      backgroundColor: "black",
      color: "white",
      padding: "10px",
      marginTop: "10px"
    }
    return (
      <div className="player-wrapper">
        {/* <button
          onClick={this.clearClicks.bind(this)}
          style={buttonStyle}
        >
          Reset
        </button> */}

        {/* {this.clearClicks.bind(this)} */}



        <VictoryPie className="donut"
          externalEventMutations={this.state.externalMutations}
          data={this.props.topGenres}
          colorScale={["#4A6A9B", "#8280A1", "#887A89", "#A9C1C1"]}
          padAngle={({ datum }) => datum.y}
          innerRadius={120}
          // labelRadius={({ innerRadius }) => innerRadius + 20}
          labelRadius={({ innerRadius }) => innerRadius + 52}
          // labels={({ datum }) => showLabels(datum.x, this.props.topGenres) === true ? datum.x : null}
          labels={({ datum }) => datum.x.length > 12 ? `${datum.x.slice(0, 12)}...` : datum.x}
          labelPlacement={() => "parallel"}

          // labelComponent={<CustomLabel/>}

          // labelComponent={
          //   <VictoryTooltip
          //     // cornerRadius={20}
          //     // pointerLength={5}
          //     flyoutStyle={{
          //       fill: "#AF7C40",
          //       stroke: "none"
          //     }}
          //   />
          // }
          style={{
            data: {
              // fillOpacity: 0.9, stroke: "#AF7C40", strokeWidth: 2
            },
            labels: {
              // fontSize: 10,
              // fontWeight: "bold",
              // fill: "black"
            }
          }}
          events={[
            {
              target: "data",
              eventHandlers: {
                // onMouseOver: () => {
                //   return [
                //     {
                //       target: "data",
                //       mutation: () => { return { style: { fill: "#AF7C40" } } }
                //     }
                //   ];
                // },
                // onMouseOut: () => {
                //   return [
                //     {
                //       target: "data",
                //       mutation: () => { }
                //     },
                //   ];
                // },
                onClick: () => {
                  this.clearClicks()


                  console.log(this.props.clickedGenre)


                  return [
                    {
                      target: ["data"],
                      mutation: (props) => {
                        // console.log(props)
                        console.log('item selected is',
                          Object.values(this.props.topGenres)[props.index].x, Object.values(this.props.topGenres)[props.index].y)


                        if (this.props.clickedGenre !== "") {
                          this.props.setClickedGenre({
                            genre: Object.values(this.props.topGenres)[props.index].x,
                            numSongs: Object.values(this.props.topGenres)[props.index].y
                          })
                        }

                        this.setState({
                          lastClicked: props.index
                        });

                        // console.log(this.state.lastClicked)

                        return {
                          style: { fill: "#AF7C40" }
                        }

                        // const fill = props.style && props.style.fill;
                        // return fill === "#AF7C40" ? null : { style: { fill: "#AF7C40" } }

                        // console.log(this.props.clickedGenre.genre, Object.values(this.props.topGenres)[props.index].x)

                        // const thisSlice = this.props.clickedGenre.genre === Object.values(this.props.topGenres)[props.index].x ? true : false

                        // return thisSlice ? { style: { fill: "#AF7C40" } } : null
                      }
                    },
                    {
                      target: "labels",
                      mutation: () => {
                        // active: true 
                        return { style: { fill: "#AF7C40" } }
                      }
                    },
                  ];
                }
              }
            }
          ]}
        />

        <div className="vinyl-wrapper">
          <img src={this.props.currPlayingTrackInfo.albumUrl} className="album-cover" />
          <img src={Vinyl} className="vinyl" />
        </div>
      </div>

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
