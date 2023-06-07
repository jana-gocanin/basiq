import "./App.css";
import DataDisplay from "./components/DataDisplay";

import ProgressIndicator from "./components/ProgressIndicator";
import CreateUserForm from "./components/CreateUserForm";

function App() {
  return (
    <div className="App">
      <CreateUserForm />
      <ProgressIndicator /> 
      <DataDisplay />
    </div>
  );
}

export default App;
