import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import swal from 'sweetalert2'

export default function Passenger() {
  const [data, setData] = useState([])
  const userid = sessionStorage.getItem('id')
  const loadData = () => {
    axios
      .get('http://localhost:8080/api/passengers?userid=' + userid)
      .then((resp) => {
        setData(resp.data)
      })
  }
  const handleDelete = (id) => {
    axios.delete('http://localhost:8080/api/passengers/' + id).then((resp) => {
      swal.fire({
        icon: 'error',
        title: 'Deleted',
        text: resp.data,
      })
      loadData()
    })
  }
  useEffect(() => {
    loadData()
  }, [])
  return (
    <>
      <div className='container mt-5'>
        <Link to='/addpassenger' className='btn btn-primary btn-sm float-end'>
          Add Passenger
        </Link>
        <h5 className='p-2'>Passengers List</h5>
        <table className='table table-bordered'>
          <thead>
            <tr>
              <th>Id</th>
              <th>First name</th>
              <th>Last name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Passport No</th>
              <th>Meal Preference</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((x) => (
              <tr key={x?.id}>
                <td>{x?.id}</td>
                <td>{x?.firstName}</td>
                <td>{x?.lastName}</td>
                <td>{x?.age} years</td>
                <td>{x?.gender}</td>
                <td>{x?.passportNo}</td>
                <td>{x?.mealPref}</td>
                <td>
                  <button
                    onClick={(e) => handleDelete(x.id)}
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
    </>
  )
}
