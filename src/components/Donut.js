import React from 'react';
import { VictoryPie, VictoryLabel, VictoryTooltip, VictoryContainer } from 'victory';
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



const showLabels = ((datum, topCategories) => {
  const len = topCategories.length
  const moreThan3 = Object.values(topCategories[len - 1])[0] === datum ||
    Object.values(topCategories[len - 2])[0] === datum ||
    Object.values(topCategories[len - 3])[0] === datum

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
    const numberOfItems = this.props.numberOfItems
    return (
      <div className="player-wrapper">
        <VictoryPie className="donut"
          labelComponent={<VictoryLabel renderInPortal />}
          // padding={{ top: 100 }}
          externalEventMutations={this.state.externalMutations}
          data={this.props.topCategories.slice(0, numberOfItems)}
          colorScale={["#4A6A9B", "#8280A1", "#887A89", "#A9C1C1"]}
          padAngle={({ datum }) => datum.y}
          innerRadius={120}
          labelRadius={({ innerRadius }) => innerRadius + 35}
          // labels={({ datum }) => showLabels(datum.x, this.props.topCategories) === true ? datum.x : null}
          labels={({ datum }) => datum.x.length > 10 ? `${datum.x.slice(0, 10)}..` : datum.x}
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
            // parent: {
            //   overflow: "visible"
            // }, 
            data: {
              // fillOpacity: 0.9, stroke: "#AF7C40", strokeWidth: 2
            },
            labels: {
              fontSize: 14,
              // fontWeight: "bold",
              fill: "white"
            }

          }}
          events={[
            {
              target: "data",
              eventHandlers: {
                onMouseOver: () => {
                  return [
                    {
                      target: "data",
                      mutation: () => { return { style: { fill: "#AF7C40" } } }
                    },
                    {
                      target: "labels",
                      mutation: () => { return { style: { fontSize: 15, fill: "#AF7C40" } } }
                    }
                  ];
                },
                onMouseOut: () => {
                  return [
                    {
                      target: "data",
                      mutation: () => { }
                    },
                    {
                      target: "labels",
                      mutation: () => { }
                    }
                  ];
                },
                onClick: () => {
                  this.clearClicks()
                  return [
                    {
                      target: ["data"],
                      mutation: (props) => {
                        // console.log('item selected is',
                        //   Object.values(this.props.topCategories)[props.index].x, Object.values(this.props.topCategories)[props.index].y)

                        if (this.props.clickedGenre !== "") {
                          this.props.setClickedGenre({
                            genre: Object.values(this.props.topCategories)[props.index].x,
                            numSongs: Object.values(this.props.topCategories)[props.index].y
                          })
                        }

                        this.setState({
                          lastClicked: props.index
                        });

                        return {
                          style: { fill: "#AF7C40" }
                        }

                        // const fill = props.style && props.style.fill;
                        // return fill === "#AF7C40" ? null : { style: { fill: "#AF7C40" } }

                        // console.log(this.props.clickedGenre.genre, Object.values(this.props.topCategories)[props.index].x)

                        // const thisSlice = this.props.clickedGenre.genre === Object.values(this.props.topCategories)[props.index].x ? true : false

                        // return thisSlice ? { style: { fill: "#AF7C40" } } : null
                      }
                    },
                    {
                      target: "labels",
                      mutation: () => {
                        // active: true 
                        return {
                          style: {
                            fontSize: 15,
                            fill: "#AF7C40"
                          }
                        }
                      }
                    },
                  ];
                }
              }
            }
          ]}
        />

        {typeof (this.props.currPlayingTrack) === 'string' && !(this.props.isPaused) ?
          <div className="vinyl-wrapper" id="spinning">
            <div style={{
              backgroundRepeat: 'no-repeat',
              backgroundSize: '45%',
              borderRadius: '50%',
              backgroundPosition: '50% center',
              backgroundImage: `url(${this.props.currPlayingTrackInfo.albumUrl})`
            }}>
              <img src={Vinyl} className="vinyl" />
            </div>
          </div>
          :
          <div className="vinyl-wrapper">
            <div style={{
              backgroundRepeat: 'no-repeat',
              backgroundSize: '45%',
              borderRadius: '50%',
              backgroundPosition: '50% center',
              backgroundImage: `url(${this.props.currPlayingTrackInfo.albumUrl})`
            }}>
              <img src={Vinyl} className="vinyl" />
            </div>
          </div>
        }
      </div>

    )
  }
}