import React from "react";
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";

import StaticDashboardPage from "./Pages/static-dashboard.page";
import DynamicDashboardPage from "./Pages/dynamic-dashboard.page";

const router = createBrowserRouter([
  {
    path: "/dashboard/static",
    element: (
      <StaticDashboardPage/>
    ),
  },
  {
    path: "/",
    element: <div>Index Page</div>
  },
  {
    path: "/dashboard/dynamic",
    element: <DynamicDashboardPage/>,
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router}/>
    </div>
  )
}

export default App;
