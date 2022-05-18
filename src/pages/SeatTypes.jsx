import axios from 'axios'
import { useEffect, useState } from 'react'
import swal from 'sweetalert2'

export default function SeatTypes() {
  const [data, setData] = useState([])
  const [seatTypeDesc, setseatTypeDesc] = useState()
  const [fare, setfare] = useState()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (seatTypeDesc == undefined) {
      swal.fire({
        title: 'Error',
        icon: 'error',
        text: 'Please fill all details',
      })
      return
    }
    axios
      .post('http://localhost:8080/api/seattypes', {
        seatTypeDesc: seatTypeDesc,
        fare: fare,
      })
      .then((resp) => {
        console.log(resp)
        swal.fire({
          title: 'Success',
          text: resp.data,
        })
        setseatTypeDesc('')
        setfare('')
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
  const handleDelete = (id) => {
    axios
      .delete('http://localhost:8080/api/seattypes/' + id)
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
    axios.get('http://localhost:8080/api/seattypes').then((resp) => {
      setData(resp.data)
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
            <h5 className='p-2'>SeatTypes List</h5>
            <table className='table table-bordered'>
              <thead>
                <th>Id</th>
                <th>Description</th>
                <th>Fare</th>
                <th>Action</th>
              </thead>
              <tbody>
                {data?.map((x) => (
                  <tr key={x?.seatTypeId}>
                    <td>{x?.seatTypeId}</td>
                    <td>{x?.seatTypeDesc}</td>
                    <td>{x?.fare}</td>
                    <td>
                      <button
                        onClick={(e) => handleDelete(x.movieId)}
                        className='btn btn-danger btn-sm'
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='col-sm-4'>
            <h5>Add Seat Type</h5>
            <form>
              <div className='mb-2'>
                <label>Description</label>
                <input
                  type='text'
                  className='form-control form-control-sm'
                  value={seatTypeDesc}
                  onChange={(e) => setseatTypeDesc(e.target.value)}
                />
              </div>
              <div className='mb-2'>
                <label>Fare</label>
                <input
                  type='number'
                  className='form-control form-control-sm'
                  value={fare}
                  onChange={(e) => setfare(e.target.value)}
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
      </div>
    </>
  )
}
