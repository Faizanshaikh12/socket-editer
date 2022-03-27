import React, {useEffect, useRef, useState} from 'react';
import Client from "../components/Client";
import Editor from "../components/Editor";
import {initSocket} from "../socket";
import {ActionType} from "react-hot-toast/dist/core/store";
import ACTIONS from "../Actions";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {toast} from "react-hot-toast";

function EditorPage(props) {
    const socketRef = useRef(null);
    const [clients, setClients] = useState([
        {socketId: 1, username: 'Faizan S'},
        {socketId: 2, username: 'Sahana F'},
    ]);
    const loaction = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            const handleErrors = (e) => {
                console.log('socket error', e);
                toast.error('Socket connection failed,  try again later.');
                navigate('/');
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId: params.roomId,
                username: loaction.state?.username
            });
        }
        init();
    }, []);


    return (
        <div className="mainWrap">
            <div className="aside">
                <div className="asideInner">
                    <div className="logo">
                        <img className="logoImage" src="/code-sync.png" alt='code-sync'/>
                    </div>
                    <h3>Connected</h3>
                    <div className="clientsList">
                        {clients.map((client) => (
                            <Client key={client.socketId} username={client.username}/>
                        ))}
                    </div>
                </div>
                <button className="btn copyBtn">Copy ROOM ID</button>
                <button className="btn leaveBtn">Leave</button>
            </div>
            <div className="editorWrap">
                <Editor/>
            </div>
        </div>
    );
}

export default EditorPage;
