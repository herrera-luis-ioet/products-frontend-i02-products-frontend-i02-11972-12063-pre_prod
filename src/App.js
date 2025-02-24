import React from 'react';
import './App.css';
import ProductList from './components/ProductList/ProductList';

// PUBLIC_INTERFACE
function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Products Frontend</h1>
      </header>
      <main>
        <ProductList />
      </main>
    </div>
  );
}

export default App;
