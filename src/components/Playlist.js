import React, { useRef, useState, useEffect } from 'react'
import { Table } from 'react-bootstrap'
import './Playlist.css'

export default function Playlist({ currPlaylist, currPlayingTrack }) {
  const rowName = (i) => {
    if (currPlaylist[i].trackUri === currPlayingTrack) return "row-selected"
  }
  const ref = React.createRef();

  const handleClick = () =>
    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

  return (
    <>
      {currPlaylist.length > 0 ?
        <div className='playlist-table-wrapper'>
          <Table responsive borderless className='playlist-table'>
            <tbody>
              {currPlaylist.length > 0 ?
                [...Array(currPlaylist.length)].map((e, i) => (
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
                ))
                : null}
            </tbody>
          </Table>
        </div>
        :
        <div className='playlist-table-wrapper'>
          <div style={{ color: 'black', fontSize: '20px', paddingTop: "50%" }}> Select a genre to start listening!</div>
        </div>
      }

    </>
  )
}
