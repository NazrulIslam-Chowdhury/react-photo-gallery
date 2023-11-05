import { Toaster } from "react-hot-toast";
import { Gallery } from "./components";

function App() {
  return (
    <div className="overflow-hidden dark:bg-violet-950 min-h-screen transition-all duration-500">
      <Gallery />
      <Toaster />
    </div>
  );
}

export default App;
