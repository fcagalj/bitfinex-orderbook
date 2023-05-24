import React from 'react';
import './App.css';
import OrderBook from './components/OrderBook';
import GlobalStyle from './styles/GlobalStyle';

function App() {
  return (
    <div className="App">
      <GlobalStyle />
      <OrderBook />
    </div>
  );
}

export default App;
