import React from 'react'
import './index.css'
export const SocketIO = () => {
  return (
    <>
      <ul id="messages"></ul>
      <form id="form" action="">
        <input id="input" autocomplete="off" /><button>Send</button>
      </form>
    </>
  )
}
