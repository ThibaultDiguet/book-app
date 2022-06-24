import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import '../styles/EditBook.css'
import Buttons from '../components/Buttons.js';
import { ToastContainer, toast } from 'react-toastify';

function EditBook({ bookstate, setBookState, IDBook, setAddBook, addBook, images, setImages, selectedImage, setSelectedImage }) {
    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedImage(e.target.files[0]);
        }
    };

    // This function will be triggered when the "Remove This Image" button is clicked
    const removeSelectedImage = () => {
        setSelectedImage();
    };


    useEffect(() => {
        if (bookstate === 'edit') {
            if (IDBook) {
                if (IDBook.target.value) {
                    listBooks()
                }
            }
        }
    }, [bookstate, IDBook])
    function listBooks() {
        setImages('');
        axios.get(`http://localhost:8080/api/books/` + IDBook.target.value)
            .then(res => {
                setAddBook(prevState => ({
                    ...prevState,
                    isbn: res.data.isbn,
                    title: res.data.title,
                    description: res.data.description,
                    author: res.data.author,
                    publication: moment(res.data.publication).format("YYYY-MM-DD")
                }));

                if (res.data.images.length) {
                    setImages(res.data.images)
                }

            })
            .catch(err => {
                console.log('Erreur : ' + err.message)
                setAddBook(prevState => ({
                    ...prevState,
                    isbn: '',
                    title: '',
                    description: '',
                    author: '',
                    publication: '',
                }));
            })
    }
    function removeImage(id) {
        document.getElementById(id).classList.add('disappear')
        axios.delete('http://localhost:8080/api/images/' + id, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(function (response) {
                const data = images.filter(i => i.id !== id);
                setImages(data)
                toast.success('Image supprimé !', {
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
                console.log(error);
                toast.error('Erreur : '+error, {
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

    function updateName(id) {
        let json = JSON.parse('{"name" : "' + document.getElementById(id + '-name').value + '"}');
        axios.patch('http://localhost:8080/api/images/' + id, json, {
            headers: {
                'Content-Type': 'application/merge-patch+json',
            }

        })
            .then (function (response) {
                toast.success('Nom de l\'image modifié !', {
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
                alert(error);
                toast.error('Erreur : '+error, {
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

    const items = []
    if (images) {
        for (const element of images.entries()) {
            items.push(
                <div className="col-md-3 book-img" id={element[1].id} key={element[1].id}>
                    <div className="book-img-img">
                        <img src={`data:image/jpeg;base64,${element[1].data}`} />
                    </div>
                    <div className="book-description">
                        <div className="book-img-area">
                            <h6>Nom :</h6>
                            <textarea id={element[1].id + '-name'} spellCheck="false" defaultValue={element[1].name} rows="1" onBlur={() => updateName(element[1].id)}></textarea>
                        </div>
                        <div className="book-edition">
                            <h6>Image :</h6>

                            <p onClick={() => removeImage(element[1].id)}><i className="bi bi-archive"></i>Supprimer l'image</p>
                        </div>
                    </div>
                </div>
            )
        }
    }

    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    function sendImage(name) {
        if (name && IDBook.target.value) {
            getBase64(selectedImage).then(
                data => {
                    let jsonAddImage = {
                        name: name,
                        data: data.substring(data.indexOf(",") + 1)
                    }
                    axios.post('http://localhost:8080/api/images/' + IDBook.target.value, JSON.stringify(jsonAddImage), {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }).then(function (response) {
                        listBooks()
                        removeSelectedImage()
                        toast.success('Image ajoutée avec succès !', {
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
                            console.log(error);
                            toast.error('Erreur lors de l\'envoie de l\'image.', {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                });
                        })
                });
        }
    }

    return (
        bookstate === "edit" ?
            <div className="row">
                <hr />
                <h5 className="book-img-title">Images ({images.length}) : </h5>
                {items}
                {selectedImage

                    ?

                    <div className="col-md-3 book-img">

                        <div className="book-img-img">
                            <img src={URL.createObjectURL(selectedImage)} />
                        </div>
                        <div className="book-description">
                            <div className="book-img-area">
                                <h6>Nom :</h6>
                                <textarea spellCheck="false" placeholder="Entrez un nom" id="upload-file-text" rows="1"></textarea>
                            </div>
                            <div className="book-edition">
                                <p className="cancel" onClick={removeSelectedImage} ><i className="bi bi-x"></i>Annuler</p>
                                <p className="check" onClick={() => sendImage(document.getElementById("upload-file-text").value)}><i className="bi bi-check-lg"></i>Valider</p>
                            </div>
                        </div>
                    </div>

                    :

                    <div className="col-md-3 book-img book-upload">
                        <label className="book-upload-label">
                            <input
                                accept="image/*"
                                type="file"
                                onChange={imageChange}
                            />

                            <div className="text-upload"><i className="bi bi-plus-circle-fill icon"></i> <br></br>Ajouter une image</div>
                        </label>
                    </div>}

            </div> : null)
}

export default EditBook;