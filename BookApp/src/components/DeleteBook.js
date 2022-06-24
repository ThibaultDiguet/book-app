import { useState } from 'react'
import axios from 'axios';
import axiosConfig from '../axiosConfig.js';
import { ToastContainer, toast } from 'react-toastify';

function DeleteBook({ bookstate, IDBook, setIDBook }) {
    function deleteABook() {
        if (IDBook.target.value) {
            axiosConfig.delete('http://localhost:8080/api/books/' + IDBook.target.value, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(function (response) {
                    console.log(response);
                    IDBook.target.value = '';
                    setIDBook('');
                    toast.success('Livre supprimé !', {
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

    return (bookstate === 'delete' ? <button onClick={(e) => deleteABook()} className="col-12 btn btn-dark">Supprimer</button> : null)
}

    export default DeleteBook;