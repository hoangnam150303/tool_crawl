import { Route, Routes } from "react-router-dom";
import { ListPost } from "../Page/ListPost";
import DetailPost from "../Page/DetailPost";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ListPost />} />
      <Route path="/post/:id" element={<DetailPost />} />
    </Routes>
  );
}

export default AppRoutes;
