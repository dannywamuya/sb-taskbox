import logo from "./logo.svg";
import "./App.css";
import InboxScreen from "./components/InboxScreen/InboxScreen";
import store from "./lib/store";
import { Provider } from "react-redux";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <InboxScreen />
      </Provider>
    </div>
  );
}

export default App;
