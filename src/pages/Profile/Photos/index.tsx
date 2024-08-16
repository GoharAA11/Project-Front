import { useEffect, useRef, useState } from "react"
import { addPost, getAllPosts, deletePost } from "../../../helpers/api"
import { IPost } from "../../../helpers/types"
import { Base } from "../../../helpers/default"
import { MDBInput } from "mdb-react-ui-kit"
import Modal from "@mui/material/Modal"
import Box from "@mui/material/Box"

export const Photos = () => {
    const photo = useRef<HTMLInputElement | null>(null)
    const [posts, setPosts] = useState<IPost[]>([])
    const [text, setText] = useState<string>("")
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    useEffect(() => {
        getAllPosts()
            .then(response => {
                setPosts(response.payload as IPost[])
            })

    }, [])

    const handlePostAdd = () => {
        const file = photo.current?.files?.[0]
        if (file) {
            const form = new FormData()
            form.append("photo", file)
            form.append("content", text)
            addPost(form)
                .then(response => {
                    setPosts([...posts, response.payload as IPost])
                    setText("")
                })
        }
    }

    const handlePostDelete = (id: number) => {
        setPosts(posts.filter(post => post.id !== id))
        deletePost(id)
            .then(response => {
                if (response.status !== "success") {

                    getAllPosts().then(response => setPosts(response.payload as IPost[]))
                    setModalOpen(false);
                }
            })
    }

    return (
        <>
            <h2>Photos</h2>
            <MDBInput
                type="file"
                ref={photo}
                label="Choose a photo"
            />

            <MDBInput
                type="text"
                value={text}
                onChange={e => setText(e.target.value)}
                label="Add a description"
            />


            <button className='btn btn-outline-success' onClick={handlePostAdd}>Upload</button>

            {
                posts.map(elm => (
                    <div key={elm.id}>
                        <img src={Base + elm.picture} alt={elm.title} className="image" />


                        <button

                            onClick={() => setModalOpen(true)}

                            className="btn btn-outline-danger"
                            id="inputGroupFileAddon04"
                        >
                            delete
                        </button>
                        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                            <Box sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 400,
                                bgcolor: 'background.paper',
                                border: '2px solid #000',
                                boxShadow: 24,
                                p: 4,
                            }}>
                                <p>Are you sure you want to delete this post?</p>
                                <button
                                    onClick={() => handlePostDelete(elm.id)}
                                    className='btn btn-outline-warning' >
                                    Delete
                                </button>
                            </Box>
                        </Modal>
                    </div>
                ))
            }
        </>
    )
}
