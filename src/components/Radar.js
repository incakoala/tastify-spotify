import React from 'react'
import { VictoryChart, VictoryPolarAxis, VictoryArea, VictoryTheme } from 'victory';

export default function Radar({ audioFeatures, topTracks }) {
  const len = topTracks.length
  return (
    <div className="radar">
      <VictoryChart polar
        domain={{ y: [0, len] }}
        padding={{ left: 60, right: 60 }}
        theme={VictoryTheme.material}
      >
        <VictoryArea
          data={audioFeatures}
          style={{
            data: {
              fill: "#AF7C40",
            }
          }}
        />
        <VictoryPolarAxis
          style={{
            tickLabels: {
              fontSize: 10,
              fill: 'white'
            }
          }}
        />
      </VictoryChart>
    </div >
  )
}
