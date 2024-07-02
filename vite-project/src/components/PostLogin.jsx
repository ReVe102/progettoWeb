import "./post.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import DeleteIcon from '@mui/icons-material/Delete';

export default function PostLogin({ post, handleDelete }) {
    const [like, setLike] = useState(post.likes.length);
    const PF = import.meta.env.VITE_PUBLIC_FOLDER; 
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const token = window.localStorage.getItem("token");
                const res = await axios.post("http://localhost:3000/userData", { token });
                if (res.data.status === "error" && res.data.data === "token expired") {
                    alert("Token scaduto. Fai login.");
                    window.localStorage.clear();
                    window.location.href = "./Login";
                } else {
                    setCurrentUser(res.data.data);
                }
            } catch (err) {
                console.error("Errore nel recuperare i dati dell'utente", err);
            }
        };

        fetchCurrentUser();
    }, []);

    if (!currentUser) {
        return <div>Loading...</div>;
    }

    return (
        <div className="post">
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <img
                            className="postProfileImg"
                            src={currentUser.image || `${PF}/defaultpfp.jpg`}
                            alt="Profile"
                        />
                        <span className="postUsername">
                            {currentUser.name || 'Unknown'}
                        </span>
                        <span className="postDate">{format(post.createdAt)}</span>
                    </div>
                    <div className="postTopRight">
                        <DeleteIcon className="DeleteIcon" />
                        <button onClick={() => handleDelete(post._id)}>Elimina Post</button>
                    </div>
                </div>
                <div className="postCenter">
                    <span className="postText">{post?.desc}</span>
                    {post.img && <img className="postImg" src={post.img} alt="" />}
                </div>
                <div className="postBottom">
                    <div className="postBottomLeft">
                        <ThumbUpIcon className="likeIcon" />
                        <span className="postLikeCounter">{like}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
