import React from 'react';
import {Provider} from "react-redux";
import {store} from "@/src/reduxjs/store";

interface ProvidersInterface {
    children: React.ReactNode;
}

function Providers({children}: ProvidersInterface): React.ReactNode {
    return (
       <Provider store={store}>
           {children}
       </Provider>
    );
}

export default Providers;