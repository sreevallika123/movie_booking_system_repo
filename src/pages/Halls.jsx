import axios from 'axios'
import { useEffect, useState } from 'react'
import swal from 'sweetalert2'

export default function Halls() {
  const [data, setData] = useState([])
  const [hallDesc, sethallDesc] = useState()
  const [capacity, setcapacity] = useState()
  const [showadd, setshowadd] = useState(true)
  const [showseat, setshowseat] = useState(false)
  const [hall, sethall] = useState()
  const [seattypes, setseattypes] = useState([])
  const [seattypeid, setseattypeid] = useState()
  const [seatcount, setseatcount] = useState()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (hallDesc == undefined) {
      swal.fire({
        title: 'Error',
        icon: 'error',
        text: 'Please fill all details',
      })
      return
    }
    axios
      .post('http://localhost:8080/api/halls', {
        hallDesc: hallDesc,
        capacity: capacity,
      })
      .then((resp) => {
        console.log(resp)
        swal.fire({
          title: 'Success',
          text: resp.data,
        })
        sethallDesc('')
        setcapacity('')
        loadData()
      })
      .catch((err) => {
        swal.fire({
          title: 'error',
          icon: 'error',
          text: 'Cannot save Hall',
        })
      })
  }

  const handleUpdateSeat = (e) => {
    e.preventDefault()
    if (seattypeid == undefined || seatcount == undefined) {
      swal.fire({
        title: 'Error',
        icon: 'error',
        text: 'Please fill all details',
      })
      return
    }
    axios
      .post('http://localhost:8080/api/halls/seats', {
        hallId: hall.hallId,
        seatCount: seatcount,
        seatTypeId: parseInt(seattypeid),
      })
      .then((resp) => {
        console.log(resp)
        swal.fire({
          title: 'Success',
          text: resp.data,
        })
        sethallDesc('')
        setseatcount('')
        loadData()
      })
      .catch((err) => {
        swal.fire({
          title: 'error',
          icon: 'error',
          text: 'Cannot save',
        })
      })
  }
  const handleSelect = (h) => {
    sethall(h)
    setshowadd(false)
    setshowseat(true)
  }

  const deleteSeat = (id) => {
    axios
      .delete('http://localhost:8080/api/halls/seats/' + id)
      .then((resp) => {
        swal.fire({
          icon: 'error',
          title: 'Deleted',
          text: resp.data,
        })
        loadData()
      })
      .catch((err) => {
        swal.fire({
          title: 'Error',
          icon: 'error',
          text: 'Cannot delete Seat',
        })
      })
  }
  const handleDelete = (id) => {
    axios
      .delete('http://localhost:8080/api/halls/' + id)
      .then((resp) => {
        swal.fire({
          icon: 'error',
          title: 'Deleted',
          text: resp.data,
        })
        loadData()
      })
      .catch((err) => {
        swal.fire({
          title: 'Error',
          icon: 'error',
          text: 'Cannot delete Hall',
        })
      })
  }
  const loadData = () => {
    axios.get('http://localhost:8080/api/halls').then((resp) => {
      setData(resp.data)
    })
    axios.get('http://localhost:8080/api/seattypes').then((resp) => {
      setseattypes(resp.data)
    })
  }
  useEffect(() => {
    loadData()
  }, [])
  return (
    <>
      <div className='container mt-5'>
        <div className='row'>
          <div className='col-sm-8'>
            <h5 className='p-2'>Halls List</h5>
            <table className='table table-bordered'>
              <thead>
                <th>Id</th>
                <th>Hall Name</th>
                <th>Capacity</th>
                <th>Seat Details</th>
                <th>Action</th>
              </thead>
              <tbody>
                {data?.map((x) => (
                  <tr key={x?.hallId}>
                    <td>{x?.hallId}</td>
                    <td>{x?.hallDesc}</td>
                    <td>{x?.capacity}</td>
                    <td>
                      {x?.hallcapacity?.map((hc) => (
                        <>
                          {hc.seatType.seatTypeDesc} : {hc.seatCount} Seats
                          (Fare :&#8377;
                          {hc.seatType.fare})
                          <button
                            onClick={(e) => deleteSeat(hc.id)}
                            className='btn btn-danger btn-sm ms-2'
                          >
                            &times;
                          </button>
                          <br />
                        </>
                      ))}
                    </td>
                    <td>
                      <button
                        onClick={(e) => handleDelete(x.hallId)}
                        className='btn btn-danger btn-sm me-2'
                      >
                        Delete
                      </button>
                      <button
                        onClick={(e) => handleSelect(x)}
                        className='btn btn-primary btn-sm'
                      >
                        Seat Types
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='col-sm-4'>
            {showadd && (
              <div className='card'>
                <div className='card-header text-center'>
                  <h5>Add Hall</h5>
                </div>
                <div className='card-body'>
                  <form>
                    <div className='mb-2'>
                      <label>Description</label>
                      <input
                        type='text'
                        className='form-control form-control-sm'
                        value={hallDesc}
                        onChange={(e) => sethallDesc(e.target.value)}
                      />
                    </div>
                    <div className='mb-2'>
                      <label>Capacity</label>
                      <input
                        type='number'
                        className='form-control form-control-sm'
                        value={capacity}
                        onChange={(e) => setcapacity(e.target.value)}
                      />
                    </div>
                    <button
                      onClick={handleSubmit}
                      className='btn btn-primary btn-sm float-end'
                    >
                      Save Details
                    </button>
                  </form>
                </div>
              </div>
            )}

            {showseat && (
              <div className='card'>
                <div className='card-header text-center'>
                  <h5>Define Seats</h5>
                </div>
                <div className='card-body'>
                  <form>
                    <div className='mb-2'>
                      <label>Hall</label>
                      <input
                        type='text'
                        readOnly={true}
                        className='form-control form-control-sm'
                        value={hall?.hallDesc}
                      />
                    </div>
                    <div className='mb-2'>
                      <label>Seat Type</label>
                      <select
                        className='form-control form-control-sm'
                        value={seattypeid}
                        onChange={(e) => setseattypeid(e.target.value)}
                      >
                        <option value=''>Select Type</option>
                        {seattypes.map((x) => (
                          <option value={x.seatTypeId}>{x.seatTypeDesc}</option>
                        ))}
                      </select>
                    </div>
                    <div className='mb-2'>
                      <label>Seat Count</label>
                      <input
                        type='number'
                        className='form-control form-control-sm'
                        value={seatcount}
                        onChange={(e) => setseatcount(e.target.value)}
                      />
                    </div>
                    <button
                      onClick={handleUpdateSeat}
                      className='btn btn-primary btn-sm float-end'
                    >
                      Save Details
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
