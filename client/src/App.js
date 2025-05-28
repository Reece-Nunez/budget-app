// client/src/App.js
import { useEffect, useState } from "react";

function App() {
  const [apiMessage, setApiMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/")
      .then((res) => res.json())
      .then((data) => setApiMessage(data.message))
      .catch((err) => console.error("API error:", err));
  }, []);

  return (
    <div className="App">
      <h1>Monthly Budget App</h1>
      <p>API says: {apiMessage}</p>
    </div>
  );
}

export default App;
