
import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <main className="container">
      <h1>Hello, Docker! 🐳</h1>
      <p>My first React application running inside a Docker container.</p>

      <div className="card">
        <h2>Counter: {count}</h2>
        <button onClick={() => setCount(count + 1)}>
          Click Me
        </button>
      </div>

      <p className="status">React + Docker + NGINX</p>
    </main>
  );
}

export default App;
