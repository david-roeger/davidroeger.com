import React from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';

import { Landing } from './pages';
import { Music } from './pages';

const Router = () => (
    <BrowserRouter>
        <div className="font-neue-haas text-mauve-12">
            <nav className="bg-white drop-shadow-mauve">
                <ul>
                    <li>
                        <Link to="/">Index</Link>
                    </li>
                    <li>
                        <Link to="/music">music</Link>
                    </li>
                </ul>
            </nav>

            <Switch>
                <Route exact path="/" component={Landing} />
                <Route path="/music" component={Music} />
            </Switch>
        </div>
    </BrowserRouter>
);
export default Router;
