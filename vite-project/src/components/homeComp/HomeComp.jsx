import TopbarComp from "../../components/topbarComp/TopbarComp";
import Sidebar from "../../components/sidebar/Sidebar";
import Post from "../post/Post";
import "./home.css"
import React, { useState, useEffect } from "react"; 
import axios from "axios";

export default function HomeComp(){
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get("http://localhost:3000/posts/aziende");
                setPosts(res.data);
            } catch (err) {
                console.error("Errore nel recuperare i post delle aziende", err);
            }
        };

        fetchPosts();
    }, []);

    return (
        <>
        <TopbarComp />
        <div className="feed">
        <Sidebar />
            <div className="feedWrapper">
                {posts.map((post) => (
                    <Post key={post._id} post={post} />
                ))}
            </div>
        </div>
        </>
    );
}