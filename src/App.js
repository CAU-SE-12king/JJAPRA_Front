import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>LOGO</div>
      </header>
      <body>
        <div className="dashboard">
          <div className="board" id="new">
            <ul>
              <li></li>
            </ul>
            <button>이슈 만들기</button>
          </div>
          <div className="board" id="assigned">
            <button>이슈 만들기</button>
          </div>
          <div className="board" id="resolved">
            <button>이슈 만들기</button>
          </div>
          <div className="board" id="fixed">
            <button>이슈 만들기</button>
          </div>
          <div className="board" id="closed">
            <button>이슈 만들기</button>
          </div>
        </div>
      </body>
    </div>
  );
}

export default App;
