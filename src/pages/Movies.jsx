import axios from 'axios'
import { useEffect, useState } from 'react'
import swal from 'sweetalert2'

export default function Movies() {
  const [data, setData] = useState([])
  const [movieName, setmovieName] = useState()
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (movieName == undefined) {
      swal.fire({
        title: 'Error',
        icon: 'error',
        text: 'Please fill all details',
      })
      return
    }
    const formData = new FormData()
    formData.append('photo', selectedPhoto)
    formData.append('movieName', movieName)
    axios
      .post('http://localhost:8080/api/movies', formData)
      .then((resp) => {
        console.log(resp)
        swal.fire({
          title: 'Success',
          text: resp.data,
        })
        setmovieName('')
        setSelectedPhoto(null)
        loadData()
      })
      .catch((err) => {
        swal.fire({
          title: 'error',
          icon: 'error',
          text: 'Cannot save Movie',
        })
      })
  }
  const handleDelete = (id) => {
    axios
      .delete('http://localhost:8080/api/movies/' + id)
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
          text: 'Cannot delete flight',
        })
      })
  }
  const handleFileInput = (e) => {
    setSelectedPhoto(e.target.files[0])
  }
  const loadData = () => {
    axios.get('http://localhost:8080/api/movies').then((resp) => {
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
            <h5 className='p-2'>Movies List</h5>
            <table className='table table-bordered'>
              <thead>
                <th>Id</th>
                <th>Movie Name</th>
                <th>Action</th>
              </thead>
              <tbody>
                {data?.map((x) => (
                  <tr key={x?.movieId}>
                    <td>{x?.movieId}</td>
                    <td>
                      <img
                        src={'http://localhost:8080/' + x?.poster}
                        style={{
                          width: '100px',
                          height: '130px',
                          marginRight: '10px',
                        }}
                      />
                      {x?.movieName}
                    </td>
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
            <h5>Add Movie</h5>
            <form>
              <div className='mb-2'>
                <label>Movie Name</label>
                <input
                  type='text'
                  className='form-control form-control-sm'
                  value={movieName}
                  onChange={(e) => setmovieName(e.target.value)}
                />
              </div>
              <div className='mb-2'>
                <label>Movie Poster</label>
                <input
                  type='file'
                  onChange={handleFileInput}
                  className='form-control-file form-control'
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
