import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Form from "./pages/Form";
import Profile from "./pages/Profile";

function App() {
   return (
      <>
         <BrowserRouter>
            <Routes>
               <Route path="/" element={<Form />} />
               <Route path="/profile/:id" element={<Profile />} />
            </Routes>
         </BrowserRouter>
      </>
   );
}

export default App;
