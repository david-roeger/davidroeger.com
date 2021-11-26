import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

import { BreakpointProvider } from './providers';
import { Landing } from './pages';
import { Music } from './pages';

const Router = () => (
    <BrowserRouter>
        <BreakpointProvider>
            <div className="noise font-neue-haas text-mauve-12 selection:bg-purple-5 selection:text-mauve-12">
                <nav className="mx-auto bg-white drop-shadow-mauve xl:container">
                    <ul>
                        <li>
                            <Link to="/">Index</Link>
                        </li>
                        <li>
                            <Link to="/music">music</Link>
                        </li>
                    </ul>
                </nav>

                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/music" element={<Music />} />
                </Routes>
            </div>
        </BreakpointProvider>
    </BrowserRouter>
);
export default Router;
