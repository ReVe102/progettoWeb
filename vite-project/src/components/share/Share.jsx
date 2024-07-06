import axios from "axios";
import "./share.css";
import PermMediaIcon from '@mui/icons-material/AttachFileSharp';
import SendIcon from '@mui/icons-material/Send';
import { useRef, useState, useEffect } from "react";

export default function Share() {
    const PF = import.meta.env.VITE_PUBLIC_FOLDER;
    const desc = useRef();
    const [file, setFile] = useState(null);
    const [image, setImage] = useState("");
    const [allImage, setAllImage] = useState([]);
    const [userData, setUserData] = useState({});
    const [currentUser, setCurrentUser] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.post("http://localhost:3000/userData", {
                    token: window.localStorage.getItem("token")
                });
                const data = response.data;
                if (data.data === "token expired") {
                    alert("Token scaduto. Fai Log in");
                    window.localStorage.clear();
                    window.location.href = "./Login";
                } else {
                    setUserData(data.data);
                }
            } catch (err) {
                console.error("Errore durante il recupero dei dati dell'utente:", err);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await axios.post("http://localhost:3000/userData", {
                    token: window.localStorage.getItem("token")
                });
                const data = response.data;
                setCurrentUser(data.data);
                if (data.data === "token expired") {
                    alert("Token scaduto. Fai login.");
                    window.localStorage.clear();
                    window.location.href = "./Login";
                }
            } catch (err) {
                console.error("Errore nel recuperare i dati dell'utente", err);
            }
        };

        fetchCurrentUser();
    }, []);

    useEffect(() => {
        if (currentUser && currentUser.image) {
            setProfileImageUrl(currentUser.image);
        }
    }, [currentUser]);

    const convertToBase64 = (e) => {
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.onerror = error => {
            console.log("Error: ", error);
        };
    };

    const uploadImage = async () => {
        try {
            const response = await axios.post("http://localhost:3000/posts/uploadImage", {
                base64: image
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*",
                }
            });
            const data = response.data;
            if (data.Status === "ok") {
                alert("Image uploaded successfully!");
                return data;
            } else {
                alert("Image upload failed!");
                throw new Error("Image upload failed");
            }
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    };

    const getImage = async () => {
        try {
            const response = await axios.get("http://localhost:3000/posts/images");
            setAllImage(response.data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        getImage();
    }, []);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            let imageUrl = null;
            if (image) {
                const uploadResponse = await uploadImage();
                imageUrl = uploadResponse.imageUrl;
            }
    
            const newPost = {
                desc: desc.current.value,
                img: imageUrl || '',
                postType: userData.status === 'privato' ? 'privato' : 'azienda',
            };
    
            if (userData.status === 'privato') {
                newPost.userId = userData._id;
            } else if (userData.status === 'azienda') {
                newPost.aziendaId = userData._id;
            }
    
            const response = await axios.post("http://localhost:3000/posts/create", newPost, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
    
            if (response.status === 200) {
                setImage("");
                setFile(null);
                desc.current.value = "";
                window.location.reload();
            } else {
                throw new Error("Failed to create post");
            }
        } catch (err) {
            console.error("Errore durante la creazione del post:", err);
        }
    };

    return (
        <div className="share">
            <div className="shareWrapper">
                <div className="shareTop">
                    <img
                        className="shareProfileImg"
                        src={profileImageUrl || `${PF}defaultpfp.jpg`}
                        alt=""
                    />
                    <input
                        placeholder={`Share post as ${userData.username || userData.name}`}
                        className="shareInput"
                        ref={desc}
                    />
                </div>
                <hr className="shareHr" />
                <form className="shareBottom" onSubmit={submitHandler}>
                    <div className="shareOptions">
                        <label htmlFor="file" className="shareOption">
                            <PermMediaIcon className="ShareIcon" />
                            <span className="shareOptionText">Attach photo</span>
                            <input
                                style={{ display: "none" }}
                                type="file"
                                id="file"
                                accept=".png,.jpeg,.jpg"
                                onChange={(e) => {
                                    setFile(e.target.files[0]);
                                    convertToBase64(e);
                                }}
                            />
                        </label>
                    </div>
                    {image && <img width={100} height={100} src={image} alt="Uploaded" />}
                    <button className="shareButton" type="submit">
                        Share <SendIcon className="sendIcon" />
                    </button>
                </form>
                <br />
                {allImage.map(data => (
                    data.img && data.img.includes(".postImg") ? (
                        <img key={data._id} width={100} height={100} src={data.img} alt={data.desc} />
                    ) : null
                ))}
            </div>
        </div>
    );
}
