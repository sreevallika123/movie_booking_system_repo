import axios from 'axios'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

export default function MyBookings() {
  const [data, setData] = useState([])
  const handleCancel = (id) => {
    axios
      .get('http://localhost:8080/api/bookings/cancel/' + id)
      .then((resp) => {
        Swal.fire({ title: resp.data })
        loadData()
      })
  }
  const loadData = () => {
    axios
      .get(
        'http://localhost:8080/api/bookings?userid=' +
          sessionStorage.getItem('id')
      )
      .then((resp) => {
        setData(resp.data)
      })
  }
  useEffect(() => {
    loadData()
  }, [])
  return (
    <>
      <div className='container mt-5'>
        <h5 className='p-2'>Booking History</h5>
        <table className='table table-bordered'>
          <thead>
            <th>Id</th>
            <th>Booking Date</th>
            <th>Seat Type</th>
            <th>No of Seats</th>
            <th>Cost</th>
            <th>Show Date</th>
            <th>Status</th>
            <th>Action</th>
          </thead>
          <tbody>
            {data.map((x) => (
              <tr key={x?.bookingId}>
                <td>{x?.bookingId}</td>
                <td>{x?.bookDate}</td>
                <td>{x?.seatType.seatTypeDesc}</td>
                <td>{x?.noOfSeats}</td>
                <td>{x?.cost}</td>
                <td>{x?.showDate}</td>
                <td>{x?.status}</td>
                <td>
                  {x?.status === 'Booked' ? (
                    <button
                      onClick={(e) => handleCancel(x?.bookingId)}
                      className='btn btn-danger btn-sm'
                    >
                      Cancel Booking
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
