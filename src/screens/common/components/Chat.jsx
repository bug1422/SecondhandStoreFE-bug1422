// import { io } from 'socket.io-client'
// import { Server } from "socket.io"

import FooterFE from '../../../components/FooterFE'
import HeaderFE from '../../../components/HeaderFE'

import axios from "axios"
import '../styles/search.css'
import '../styles/chat.css'
export const Chat = () => {
    // const joinRoomButton = document.getElementById("room-button")
    // const messageInput = document.getElementById("message-input")
    // const roomInput = document.getElementById('room-input')
    // const form = document.getElementById('form')
    // const io = require('socket.io')(3000)

    // io.on('connection', socket => {
    //     console.log(socket.id)
    // })


    // const socket = io('http://localhost:3000')
    // form.addEventListener("submit", e => {
    //     e.preventDefault()
    //     const message = messageInput.ariaValueMax
    //     const room = roomInput.value
    // })
    // const io = new Server(3000)

    // io.on("connection", (socket) =>{
    //     socket.emit("hello", "world")
    //     socket.on("howdy", (arg) => {
    //         console.log(arg)
    //     })
    // })
    return (
        <>
            <ul id="messages"></ul>
            <form id="form" action="">
                <input id="input" autocomplete="off" /><button>Send</button>
            </form>
        </>
    )
}
