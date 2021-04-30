import React from 'react';
import { VictoryPie, VictoryLabel } from 'victory';
import './Donut.css'
import Vinyl from "./vinyl.svg"

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
          externalEventMutations={this.state.externalMutations}
          data={this.props.topCategories.slice(0, numberOfItems)}
          colorScale={["#4A6A9B", "#8280A1", "#887A89", "#A9C1C1"]}
          padAngle={({ datum }) => datum.y / 3}
          innerRadius={120}
          labelRadius={({ innerRadius }) => innerRadius + 35}
          labels={({ datum }) => datum.x.length > 10 ? `${datum.x.slice(0, 10)}..` : datum.x}
          labelPlacement={() => "parallel"}
          style={{
            labels: {
              fontSize: 11,
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
                      mutation: () => { return { style: { fontSize: 12, fill: "#AF7C40" } } }
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
                      }
                    },
                    {
                      target: "labels",
                      mutation: () => {
                        return {
                          style: {
                            fontSize: 11,
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