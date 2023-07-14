import './App.css';
import {BrowserRouter, Routes, Route, RouterProvider} from 'react-router-dom'
import Home from '../src/screens/Home.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { appRouter } from './routes';

function App() {
  return (
    <RouterProvider router={appRouter}/>
  );
}

export default App;
