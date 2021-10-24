import React, { createContext, useEffect, useState } from 'react';

import { cloneObject, debounce } from 'src/utils/utils';

import {
    breakpointBaseObject,
    breakpointValue,
    keyNumber,
    keyBoolean,
} from 'src/types';

const BreakpointContext = createContext<Partial<breakpointValue>>({});

interface BreakpointProviderProps {
    custom?: keyNumber;
    children: React.ReactNode;
}

const BreakpointProvider: React.FC<BreakpointProviderProps> = ({
    custom = {},
    children,
}) => {
    /**
     * Default Values
     */
    const baseBreakpoints: keyNumber = {
        DEFAULT: 0,
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        '2xl': 1536,
    };
    const baseBreakpointsObject: breakpointBaseObject = {
        DEFAULT: false,
        sm: false,
        md: false,
        lg: false,
        xl: false,
        '2xl': false,
    };
    const baseCustomBreakpoints: keyNumber = { ...custom };
    const baseCustomBreakpointsObject: keyBoolean = {};
    for (const key in baseCustomBreakpoints) {
        baseCustomBreakpointsObject[key] = false;
    }
    /*** *** *** *** *** *** *** *** *** *** *** *** ***/

    /**
     * Get Breakpoint helper functions
     */
    const getBreakpointObject = (): breakpointValue => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        const { name, index } = getCurrentBreakpoint(baseBreakpoints, width);

        const { name: customName, index: customIndex } = getCurrentBreakpoint(
            custom,
            width,
        );

        const breakpointObject = {
            width: width,
            height: height,
            breakpoint: getBreakpoint(index),
            exact: getExactBreakpoint(name),
            custom: {
                breakpoint: getCustomBreakpoint(customIndex),
                exact: getCustomExactBreakpoint(customName),
            },
        };

        return breakpointObject;
    };

    function getCurrentBreakpoint(object: keyNumber, width: number) {
        let index = getCurrentBreakpointIndex(Object.values(object), width);
        let name = 'DEFAULT';
        if (index) {
            let keys = Object.keys(object);
            name = keys[index];
        }
        return { name: name, index: index };
    }
    function getCurrentBreakpointIndex(array: number[], width: number) {
        let index = 0;
        for (let i = 1; i < array.length; i++) {
            const breakpoint = array[i];
            if (width >= breakpoint) {
                index = i;
                continue;
            }
            break;
        }
        return index;
    }
    const getBreakpoint = (index: number) => {
        const value = cloneObject(baseBreakpointsObject);
        const keys = Object.keys(value);
        for (let i = 0; i <= index; i++) {
            if (keys[i] && keys[i] in value) value[keys[i]] = true;
        }
        return value;
    };
    const getExactBreakpoint = (key: string) => {
        const value = cloneObject(baseBreakpointsObject);
        if (key in value) {
            value[key] = true;
        }
        return value;
    };

    const getCustomBreakpoint = (index: number) => {
        const value = cloneObject(baseCustomBreakpointsObject);
        const keys = Object.keys(value);
        for (let i = 0; i <= index; i++) {
            if (keys[i] && keys[i] in value) value[keys[i]] = true;
        }
        return value;
    };
    const getCustomExactBreakpoint = (key: string) => {
        const value = cloneObject(baseCustomBreakpoints);
        if (key in value) {
            value[key] = true;
        }
        return value;
    };
    /*** *** *** *** *** *** *** *** *** *** *** *** ***/

    const [breakpointObject, setBreakpointObject] = useState<breakpointValue>(
        getBreakpointObject(),
    );

    useEffect(() => {
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

    const resize = debounce(() => {
        const bpo = getBreakpointObject();
        setBreakpointObject(bpo);
    }, 100);

    return (
        <BreakpointContext.Provider value={breakpointObject}>
            {children}
        </BreakpointContext.Provider>
    );
};

export { BreakpointProvider, BreakpointContext };
