import React, {useEffect, useRef, useState} from 'react';
import Client from "../components/Client";
import Editor from "../components/Editor";
import {initSocket} from "../socket";
import ACTIONS from "../Actions";
import {useLocation, useNavigate, useParams, Navigate} from "react-router-dom";
import {toast} from "react-hot-toast";

function EditorPage(props) {
    const socketRef = useRef(null);
    const [clients, setClients] = useState([]);
    const location = useLocation();
    const navigator = useNavigate();
    const params = useParams();

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            const handleErrors = (e) => {
                console.log('socket error', e);
                toast.error('Socket connection failed,  try again later.');
                navigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId: params.roomId,
                username: location.state?.username
            });

            //Listing for joined event
            socketRef.current.on(ACTIONS.JOINED, ({clients, username, socketId}) => {
                if (username !== location.state?.username) {
                    toast.success(`${username} joined the room`);
                }
                setClients(clients);
            });

            //Listing for disconnected
            socketRef.current.on(ACTIONS.DISCONNECTED, ({socketId, username}) => {
                toast.success(`${username} left the room`);
                setClients((prev) => {
                    return prev.filter((client) => client.socketId !== socketId);
                })
            })
        }
        init();
        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        }
    }, []);

    if (!location.state) {
        return <Navigate to="/"/>
    }

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
