import React from 'react'
import { VictoryChart, VictoryPolarAxis, VictoryArea, VictoryTheme } from 'victory';

export default function Radar({ audioFeatures }) {
  return (
    <div>
      <VictoryChart polar
        theme={VictoryTheme.material}
      >
        <VictoryArea
          data={audioFeatures}
        />
        <VictoryPolarAxis />
      </VictoryChart>
    </div>
  )
}
