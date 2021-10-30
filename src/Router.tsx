import React from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';

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

                <Switch>
                    <Route exact path="/" component={Landing} />
                    <Route path="/music" component={Music} />
                </Switch>
            </div>
        </BreakpointProvider>
    </BrowserRouter>
);
export default Router;
