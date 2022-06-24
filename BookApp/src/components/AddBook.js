import { useState, useEffect } from 'react'

function AddBook({ bookstate, setBookState, selectedImage, setSelectedImage, img, setIMG}) {
    useEffect(() => {
        if (bookstate === 'edit') {
            removeSelectedImage()
            setIMG([
                {
                    name: "",
                    data: "",
                }
            ])
        }
    }, [bookstate])

    const [showform, setshowform] = useState(false);
    function showForm() {
        showform ? setshowform(false) : setshowform(true)
        console.log(showForm)
    }

    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedImage(e.target.files[0]);
        }
    };

    // This function will be triggered when the "Remove This Image" button is clicked
    const removeSelectedImage = () => {
        setSelectedImage();
    };

    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    function addImage(name) {
        if (name && selectedImage) {
            getBase64(selectedImage).then(
                data => {
                    removeSelectedImage();
                    let newData = {
                        name: name,
                        data: data.substring(data.indexOf(",") + 1),
                    }

                    setIMG(previousData => [...previousData, newData])
                })
        }
    }

    function removeImage(id, name, data) {
        console.log(id)
        document.getElementById(id).classList.add('disappear');
        const datas = img.filter(i => i.name !== name && i.data !== data);
        setIMG(datas);
    }

    const items = []
    if (img) {
        let id = 0;
        for (const element of img.entries()) {
            if (element[1].name && element[1].data) {
                id = id + 1;
                items.push(
                    <div className="col-md-3 book-img" id={id} key={id}>
                        <div className="book-img-img">
                            <img src={`data:image/jpeg;base64,${element[1].data}`} />
                        </div>
                        <div className="book-description">
                            <div className="book-img-area">
                                <h6>Nom :</h6>
                                <p>{element[1].name}</p>
                            </div>
                            <div className="book-edition">
                                <h6>Image :</h6>

                                <p onClick={() => removeImage(id, element[1].name, element[1].data)}><i className="bi bi-archive"></i>Supprimer l'image</p>
                            </div>
                        </div>
                    </div>
                )
               
                
            }
            
        }
    }

    return (
        bookstate === "add" ?
            <div>
                <div className="row">
                    <hr />
                    <h5 className="book-img-title">Images ({img.length - 1}) : </h5>
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
                                    <p className="check" onClick={() => addImage(document.getElementById('upload-file-text').value)}><i className="bi bi-check-lg"></i>Valider</p>
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
                </div></div> : null
    )
}

export default AddBook;