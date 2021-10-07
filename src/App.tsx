import React, { useState } from 'react';

import Index from '@/pages/index';

const App = (): JSX.Element => {
    const [count, setCount] = useState<number>(0);

    return (
        <div>
            <header>
                <p className="text-red-500">Hello Vite + React!</p>
                <p>
                    <button
                        type="button"
                        onClick={() => setCount((count) => count + 1)}>
                        count is: {count}
                    </button>
                </p>
                <p>
                    Edit <code>App.tsx</code> and save to test HMR updates.
                </p>
                <p>
                    <a
                        className=""
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer">
                        Learn React
                    </a>
                    {' | '}
                    <a
                        className=""
                        href="https://vitejs.dev/guide/features.html"
                        target="_blank"
                        rel="noopener noreferrer">
                        Vite Docs
                    </a>
                </p>
            </header>
            <Index />
        </div>
    );
};

export default App;
