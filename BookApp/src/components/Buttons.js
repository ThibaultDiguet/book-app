import AddBook from "./AddBook.js";
import ShowBooks from "./ShowBooks.js";
import EditBook from "./EditBook.js";
import DeleteBook from "./DeleteBook.js";
import { useState} from 'react';
import axios from 'axios';
import '../styles/Buttons.css';
import { ToastContainer, toast } from 'react-toastify';

function Button({ bookstate, setBookState }) {
    const [IDBook, setIDBook] = useState('');
    const [images, setImages] = useState('');
    const [selectedImage, setSelectedImage] = useState();
    const [img, setIMG] = useState([
        {
            name: "",
            data: "",
        }
    ]);
    // const [addBook, setAddBook] = useState({
    //     isbn: '2092524534',
    //     title: 'Joue a la montagne avec tchoupi',
    //     description: 'Découvre avec T\'choupi le monde de la montagne, apprends des mots nouveaux et observe les grandes illustrations.',
    //     author: 'Thierry Courtin',
    //     publication: '2009-05-01',
    // });

    const [addBook, setAddBook] = useState({
        isbn: '',
        title: '',
        description: '',
        author: '',
        publication: '',
    });

    function show(value) {
        setBookState(value)
        setIDBook('');
        resetaddBook();
        setImages('');
        if (IDBook && IDBook.target.value) {
            IDBook.target.value = ''
        }
    }
    function resetIDBook() {
        if (IDBook && IDBook.target.value) {
            IDBook.target.value = ''
        }
        setIDBook('')
    }

    function resetIDAndBook() {
        resetIDBook();
        resetaddBook();
        setImages('');
        setSelectedImage()
    }

    function checkValue(e) {
        if (e.target.name === 'isbn' && e.target.value.length > 13) {
            return false;
        }
        else if (e.target.name === 'publication' && e.target.value.length !== 10) {
            return false;
        } else {
            return true;
        }
    }

    function setValueBook(e) {
        if (checkValue(e)) {
            setAddBook(prevState => ({
                ...prevState,
                [e.target.name]: e.target.value
            }));
        }
    }

    function resetaddBook() {
        setAddBook(prevState => ({
            ...prevState,
            isbn: '',
            title: '',
            description: '',
            author: '',
            publication: '',
        }));
        setIMG([
            {
                name: "",
                data: "",
            }
        ])
        setSelectedImage()
    }

    function inputBookUpdate(e) {
        if (e.target.value && e.target.value.length > 0 && IDBook && IDBook.target.value.length > 0) {
            let object = '{"' + e.target.name + '":"' + e.target.value + '"}';
            let json = JSON.parse(object);
            axios.patch('http://localhost:8080/api/books/' + IDBook.target.value, json, {
                headers: {
                    'Content-Type': 'application/merge-patch+json',
                }
            })
                .then(function (response) {
                    toast.success('Livre modifié.', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        });
                })
                .catch(function (error) {
                    toast.error('Erreur :'+ error, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        });
                });

        }
    }

    const handleSubmit = event => {
        event.preventDefault();
        let images = img.filter(i => i.name && i.data);
        let data = {
            author : addBook.author,
            description : addBook.description,
            isbn : addBook.isbn,
            publication: addBook.publication,
            title : addBook.title,
            images,
        }
        console.log(data)
        // if (bookstate === 'add') {
        axios.post('http://localhost:8080/api/books', JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
            }})
            .then(function (response) {
                resetaddBook();
                toast.success('Livre ajouté !', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
                
            })
            .catch(function (error) {
                toast.error('Erreur :'+ error, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
            });

        // } else if (bookstate === 'edit') {
        //     axios.patch('/books/' + IDBook.target.value, JSON.stringify(addBook), {
        //         headers: {
        //             'Content-Type': 'application/vnd.api+json',
        //         }
        //     })
        //         .then(function (response) {
        //             resetaddBook();
        //             resetIDBook();
        //         })
        //         .catch(function (error) {
        //             console.log(error);
        //         });
        // }
    };
    return (
        <div>
            <div className="main-button">
                <button className="btn btn-primary me-2 my-2" onClick={() => show('show')}><i className="bi bi-eye-fill"></i> Afficher un livre</button>
                <button className="btn btn-success me-2 my-2" onClick={() => show('add')}><i className="bi bi-plus-circle"></i> Ajouter un livre</button>
                <button className="btn btn-warning me-2 my-2" onClick={() => show('edit')}><i className="bi bi-pencil-square"></i> Modifier un livre</button>
                <button className="btn btn-danger me-2 my-2" onClick={() => show('delete')}><i className="bi bi-archive-fill"></i> Supprimer un livre</button>
            </div>
            <div className="second-button mt-2">
                {bookstate === 'show' || bookstate === 'edit' || bookstate === 'delete' ?
                    <div className="row mb-4">
                        <div className="col">
                            <h5>Rechercher un livre par ID : <small onClick={() => bookstate === 'add' || bookstate === 'delete' ? resetIDBook() : resetIDAndBook()}>Reinitialiser</small></h5>
                            <input type="number" placeholder="ID" className="form-control" value={IDBook.value} onBlur={setIDBook} />
                        </div>

                    </div>
                    : null}
                {bookstate === 'add' || bookstate === 'edit' ?
                    <form method="post" onSubmit={handleSubmit}>
                        {bookstate === 'add' ? <h5 className="mb-2">Ajouter un livre : <small onClick={resetaddBook}>Réinitialiser</small></h5> : null}
                        <div className="row">
                            <div className="col-md-6 mb-4">
                                <input type="number" name="isbn" className="form-control" value={addBook['isbn']} onBlur={(e) => inputBookUpdate(e)} onChange={(e) => setValueBook(e)} placeholder="ISBN" required />
                            </div>
                            <div className="col-md-6 mb-4">
                                <input type="text" name="title" className="form-control" value={addBook['title']} onBlur={(e) => inputBookUpdate(e)} onChange={(e) => setValueBook(e)} placeholder="Title" required />
                            </div>
                            <div className="col-md-12 mb-4">
                                <textarea type="text" name="description" className="form-control" value={addBook['description']} onBlur={(e) => inputBookUpdate(e)} onChange={(e) => setValueBook(e)} placeholder="Description" required />
                            </div>
                            <div className="col-md-6 mb-4">
                                <input type="text" name="author" className="form-control" value={addBook['author']} onBlur={(e) => inputBookUpdate(e)} onChange={(e) => setValueBook(e)} placeholder="Author" required />
                            </div>
                            <div className="col-md-6 mb-4">
                                <input type="date" name="publication" className="form-control" value={addBook['publication']} onBlur={(e) => inputBookUpdate(e)} onChange={(e) => setValueBook(e)} placeholder="Publication date" required />
                            </div>
                            <AddBook bookstate={bookstate} setBookState={setBookState} selectedImage={selectedImage} setSelectedImage={setSelectedImage} img={img} setIMG={setIMG}/>
                            {bookstate !== 'edit' ? <button className="col btn btn-dark my-4">{bookstate === 'add' ? "Créer" : "Modifier"}</button> : null}
                        </div>

                    </form> : null}


            </div>
            <ShowBooks bookstate={bookstate} IDBook={IDBook} />
            <EditBook bookstate={bookstate} setBookState={setBookState} IDBook={IDBook} addBook={addBook} setAddBook={setAddBook} images={images} setImages={setImages} selectedImage={selectedImage} setSelectedImage={setSelectedImage}/>
            <DeleteBook bookstate={bookstate} IDBook={IDBook} setIDBook={setIDBook} />
        </div>
    )
}

export default Button
