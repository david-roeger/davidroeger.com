import React from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';

import { Landing } from './pages';
import { Music } from './pages';

const Router = () => (
    <BrowserRouter>
        <nav>
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
    </BrowserRouter>
);
export default Router;
