import axios from 'axios';
import moment from 'moment';
import fr from 'moment/locale/fr'
import '../styles/ShowBooks.css';
import { useState, useEffect } from 'react';

function ShowBooks({ bookstate, IDBook }) {
    const [books, setBooks] = useState('');
    const [book, setBook] = useState('');

    useEffect(() => {
        if (bookstate === 'show') {
            if (IDBook && IDBook.target.value !== '') {
                ShowABook()
            } else {
                setBook('');
                ShowAllBooks();
            }
        }
    }, [bookstate, IDBook])

    function ShowAllBooks() {
        axios.get(`http://localhost:8080/api/books/`)
            .then(res => {
                setBook('')
                setBooks(res.data);
            })
            .catch(err => {
                console.log('Erreur : ' + err.message)
            })
    }

    function ShowABook() {
        if (IDBook.target.value) {
            axios.get(`http://localhost:8080/api/books/` + IDBook.target.value)
                .then(res => {
                    //setBooks('')
                    setBook(res.data)
                })
                .catch(err => {
                    setBook('');
                    setBooks('');
                    console.log('Erreur : ' + err.message)
                })
        }
    }

    function displayBooks(books) {
        if (books && bookstate === "show") {
            return books?.map((book) => {
                return (rowBook(book))
            })
        }
    }

    function rowBook(book) {
        if (book && bookstate === "show") {
            let did = "#modal-" + book.id;
            if (book.images) {
                makeModal(book)
            }
            return (
                <tr key={book.id}>
                    <td>{book.id}</td>
                    <td>{book.isbn}</td>
                    <td>{book.title}</td>
                    <td>{book.description}</td>
                    <td>{book.author}</td>
                    <td>{moment(book.publication).locale('fr').format("LL")}</td>
                    {book.images.length > 0 ? <td className="text-center eye" data-bs-toggle="modal" data-bs-target={did}><i className="bi bi-eye-fill"></i></td> : <td className="text-center noeye"><i className="bi bi-eye-slash-fill"></i></td>}

                </tr>
            )
        }
    }
    let items = []

    function makeModal(book) {
        let modalID = "modal-" + book.id;
        let bodyID = "body-" + book.id;
        let bodyIDd = "#body-" + book.id;

        const imgList = []
        let i = 0;
        for (const element of book.images.entries()) {
            let key = "img-key-" + book.id + "-"+i
            let elementClass = (i === 0) ?"carousel-item text-center active": "carousel-item text-center"
            imgList.push(<div className={elementClass} key={key}>
                <img src={`data:image/jpeg;base64,${element[1].data}`} className="book-carousel-image" alt="Livre"/>
                <p>{element[1].name}</p>
            </div>)
            i = i+1
        }

        items.push
            (<div className="modal fade" tabIndex="-1" id={modalID} key={book.id}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title"><b>Livre n°{book.id} :</b> <small>{book.images.length} image{(book.images.length > 1) ? "s" : null}</small></h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div id={bodyID} className="carousel slide" data-bs-ride="carousel">
                                <div className="carousel-inner">
                                    {imgList}
                                </div>
                                <button className="carousel-control-prev" type="button" data-bs-target={bodyIDd} data-bs-slide="prev">
                                    <i className="bi bi-chevron-left text-dark book-carousel"></i>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target={bodyIDd} data-bs-slide="next">
                                    <i className="bi bi-chevron-right text-dark book-carousel"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)
    }

    return (
        <div>
            {items}
            {(book || books) && bookstate === 'show' ?

                <table className="table mt-4">
                    <thead className="table-dark">
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">ISBN</th>
                            <th scope="col">Title</th>
                            <th scope="col">Description</th>
                            <th scope="col">Author</th>
                            <th scope="col">Publication</th>
                            <th scope="col">Images</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(book && IDBook) ? rowBook(book) : displayBooks(books)}
                    </tbody>
                </table> : null}
            {(!book && bookstate === "show" && IDBook && IDBook.target.value !== '') ? <div className="mt-2 alert alert-danger" role="alert">
                Le livre que vous avez recherché n'existe pas.
            </div> : null}
        </div>

    )
}

export default ShowBooks