import "./post.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

export default function Post({ post }) {
    const [like, setLike] = useState(post.likes ? post.likes.length : 0);
    const [isLiked, setIsLiked] = useState(false);
    const [userOrAzienda, setUserOrAzienda] = useState({});
    const PF = import.meta.env.VITE_PUBLIC_FOLDER; 

    useEffect(() => {
        const fetchUserOrAzienda = async () => {
            try {
                let res;
                if (post.privatoId) {
                    res = await axios.get(`http://localhost:3000/privati/${post.privatoId}`);
                } else if (post.aziendaId) {
                    res = await axios.get(`http://localhost:3000/aziende/${post.aziendaId}`);
                }
                setUserOrAzienda(res.data);
            } catch (err) {
                console.error("Errore nel recuperare i dati del profilo", err);
            }
        };

        fetchUserOrAzienda();
    }, [post.privatoId, post.aziendaId]);

    const likeHandler = async () => {
        try {
            const userId = post.privatoId || post.aziendaId;
            if (!userId) {
                console.error("userId is undefined");
                return;
            }
    
            const token = localStorage.getItem('token'); 
    
            await axios.post(`http://localhost:3000/posts/like`, 
            { 
                postId: post._id,
                postType: post.privatoId ? 'user' : 'azienda'
            }, 
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            setLike(isLiked ? like - 1 : like + 1);
            setIsLiked(!isLiked);
        } catch (err) {
            console.error(err);
        }
    };

    if (!userOrAzienda) {
        return <div>Loading...</div>;
    }

    return (
        <div className="post">
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <Link to={post.privatoId ? `/privato/${post.privatoId}` : `/azienda/${post.aziendaId}`}>
                            <img
                                className="postProfileImg"
                                src={userOrAzienda.image || `${PF}/defaultpfp.jpg`}
                                alt=""
                            />
                        </Link>
                        <span className="postUsername">
                            {userOrAzienda.name || 'Unknown'}
                        </span>
                        <span className="postDate">{format(post.createdAt)}</span>
                    </div>
                </div>
                <div className="postCenter">
                    <span className="postText">{post?.desc}</span>
                    {post.img && <img className="postImg" src={post.img} alt="" />}
                </div>
                <div className="postBottom">
                    <div className="postBottomLeft">
                        <ThumbUpIcon className="likeIcon" onClick={likeHandler} />
                        <span className="postLikeCounter">{like}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
