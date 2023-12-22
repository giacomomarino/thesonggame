/* @refresh reload */
import { render } from 'solid-js/web'
import { Router, Route, Routes } from "@solidjs/router";
import './index.css'
import App from "./App";
import User from './user';
import Callback from './callback';

const root = document.getElementById('root')

render(
    () => (
        <Router>
            <Routes>
                <Route path="/" component={<App></App>} /> {/* 👈 Define the home page route */}
                <Route path="/user" component={<User></User>} />
                <Route path="/callback" component={<Callback></Callback>} />
            </Routes>
        </Router>
    ),
    root
);
