import axios from 'axios'
import { format, parse } from 'date-fns'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'

export default function Booknow() {
  const { id } = useParams()
  const userid = sessionStorage.getItem('id')
  const [cost, setcost] = useState()
  const [showdate, setshowdate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [seattype, setseattype] = useState()
  const [noofseat, setnoofseats] = useState(1)
  const [show, setshow] = useState()
  const handleSubmit = (e) => {
    e.preventDefault()
    axios
      .post('http://localhost:8080/api/bookings', {
        showId: show.showId,
        userId: parseInt(userid),
        seatTypeId: seattype,
        cost: cost,
        showDate: showdate,
        noOfSeats: noofseat,
      })
      .then((resp) => {
        Swal.fire({ title: 'Success', text: resp.data })
      })
      .catch((err) => {
        Swal.fire({ title: 'Error', text: err.response.data })
      })
  }

  useEffect(() => {
    const seat = show?.hall?.hallcapacity?.filter(
      (x) => x?.seatType?.seatTypeId == seattype
    )[0]
    if (seat) setcost((value) => noofseat * seat.seatType.fare)
  }, [seattype, noofseat])

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/shows/' + id)
      .then((resp) => setshow(resp.data))
      .catch((err) => console.log(err.response.data))
  }, [])
  return (
    <>
      <div className='container mt-5'>
        <h4>Booking Show</h4>
        <div className='row'>
          <div class='col-sm-3'>
            <div className='card'>
              <img
                src={'http://localhost:8080/' + show?.movie.poster}
                className='card-img-top'
              />
              <div className='card-body text-center'>
                <h6>{show?.movie.movieName}</h6>
              </div>
            </div>
          </div>
          <div className='col-sm-4'>
            <form>
              <div className='mb-2'>
                <label>Select Show Date</label>
                <input
                  type='date'
                  min={format(new Date(), 'yyyy-MM-dd')}
                  value={showdate}
                  onChange={(e) => setshowdate(e.target.value)}
                  className='form-control'
                />
              </div>
              <div className='mb-2'>
                <label>Select Seat Type</label>
                <select
                  value={seattype}
                  onChange={(e) => setseattype(e.target.value)}
                  className='form-control'
                >
                  <option value=''>Select Seat</option>
                  {show?.hall?.hallcapacity.map((x) => (
                    <option value={x?.seatType.seatTypeId}>
                      {x?.seatType?.seatTypeDesc} (&#8377; {x?.seatType?.fare})
                    </option>
                  ))}
                </select>
              </div>
              <div className='mb-2'>
                <label>No Of Seats</label>
                <input
                  type='number'
                  min={1}
                  value={noofseat}
                  onChange={(e) => setnoofseats(e.target.value)}
                  className='form-control'
                />
              </div>
              <div className='mb-2'>
                <label>Total Cost</label>
                <input
                  type='text'
                  disabled
                  value={cost}
                  className='form-control'
                />
              </div>
              <button
                onClick={handleSubmit}
                className='btn btn-primary float-end'
              >
                Book Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
