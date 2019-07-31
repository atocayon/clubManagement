import React from "react";
import {Provider} from "react-redux";
import thunk from 'redux-thunk';
import {createStore, applyMiddleware} from 'redux';
import Routes from "./src/routes";
import reducers from "./src/components/redux/reducers";
import Reactotron from './ReactotronConfig';

const storeW = applyMiddleware(thunk)(createStore);

const store = storeW(reducers, Reactotron.createEnhancer());

class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                    <Routes />
            </Provider>
        );
    }
}

export default App;
