import '../styles/App.css';
import ShowBooks from './ShowBooks.js'
import AddBook from './AddBook.js';
import Buttons from './Buttons.js'
import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [bookstate, setBookState] = useState('');
  return (
    <>
      <div className="bar"></div>
      <ToastContainer />
      <div className="container">

        <div className="col-lg-12">
          <h1 className="text-center"><b>Book App</b></h1>
          <div className="mt-4">
            <Buttons bookstate={bookstate} setBookState={setBookState} />
          </div>
        </div>
      </div>
    </>
  )
}

export default App;
