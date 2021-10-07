import React from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';

import Index from '@/pages/Index';
import { Music } from '@/pages/Music';

const Router = () => (
    <BrowserRouter>
        <ul>
            <li>
                <Link to="/">Index</Link>
            </li>
            <li>
                <Link to="/music">music</Link>
            </li>
        </ul>

        <Switch>
            <Route exact path="/" component={Index} />
            <Route path="/music" component={Music} />
        </Switch>
    </BrowserRouter>
);
export default Router;
