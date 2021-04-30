import React from 'react'
import { Table } from 'react-bootstrap'
import './Playlist.css'

export default function Playlist({ currPlaylist, currPlayingTrack }) {
  const rowName = (i) => {
    if (currPlaylist[i].trackUri === currPlayingTrack) return "row-selected"
  }

  return (
    <>
      {currPlaylist.length > 0 ?
        <div className='playlist-table-wrapper'>
          <Table responsive borderless className='playlist-table'>
            <tbody className='table-body'>
              {[...Array(currPlaylist.length)].map((e, i) => (
                <>
                  <tr className={rowName(i)} id={i}>
                    <td>{i + 1}</td>
                    <td>
                      <b>{currPlaylist[i].track}</b>
                      <br></br>
                      {currPlaylist[i].artist}
                    </td>
                    <td>{currPlaylist[i].trackDuration}</td>
                  </tr>
                </>
              ))}
            </tbody>
          </Table>
        </div>
        :
        <div className='playlist-table-wrapper'>
          <span style={{ color: 'black', fontSize: '18px', paddingTop: "50%", letterSpacing: '0.1em' }}> Select a category to listen!</span>
        </div>
      }
    </>
  )
}
