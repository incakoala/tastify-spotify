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
      <div className='playlist-table-wrapper'>
        <Table responsive borderless className='playlist-table'>
          <tbody>
            {currPlaylist.length > 0 ?
              [...Array(currPlaylist.length)].map((e, i) => (
                <>
                  <tr className={rowName(i)} id={i}>
                    <td>{i + 1}</td>
                    <td>
                      {currPlaylist[i].artist}
                      <br></br>
                      {currPlaylist[i].track}
                    </td>
                    <td>{currPlaylist[i].trackDuration}</td>
                  </tr>                  
                </>
              ))
              : null}
          </tbody>
        </Table>

        {/* <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Mark</td>
            <td>Otto</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Jacob</td>
            <td>Thornton</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Larry the Bird</td>
            <td>Jacob</td>
          </tr>
        </tbody>
      </Table> */}
      </div>
    </>
  )
}
