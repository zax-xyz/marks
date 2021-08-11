import { BrowserRouter, Redirect, Route, Switch, useLocation, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";

import "./App.css";
import SemesterView from "./SemesterView";
import Sidebar from "./Sidebar";
import { marks } from "./store";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MenuIcon } from "@heroicons/react/solid";

export type Params = {
  year: string;
  semester: string;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const HideSidebar = ({
  setSidebarActive,
}: {
  setSidebarActive: Dispatch<SetStateAction<boolean>>;
}) => {
  const { semester } = useParams<Params>();

  useEffect(() => {
    setSidebarActive(false);
  }, [semester, setSidebarActive]);

  return null;
};

const App = observer(() => {
  const [sidebarActive, setSidebarActive] = useState(false);

  return (
    <BrowserRouter>
      <ScrollToTop />

      <div className="flex justify-center min-h-screen App">
        <Switch>
          <Route path="/:year/:semester">
            {/* Mobile */}
            <HideSidebar setSidebarActive={setSidebarActive} />
            <button
              className="fixed z-20 w-12 h-12 p-2 rounded outline-none top-5 right-5 lg:hidden focus-visible:ring ring-sky-300"
              onClick={() => setSidebarActive(!sidebarActive)}
            >
              <MenuIcon />
            </button>
            <Sidebar
              marks={marks}
              className={`!block lg:!hidden z-10 transition-all duration-[350ms] -translate-x-full ${
                sidebarActive ? "translate-x-0 !w-full" : "invisible"
              }`}
            />

            {/* Desktop */}
            <Sidebar marks={marks} />
          </Route>

          <Route path="*">
            <Redirect to="/0/0" />
          </Route>
        </Switch>

        <div className="w-full h-screen px-6 py-4 overflow-y-auto md:px-10 md:py-8 lg:ml-80 max-w-7xl">
          {marks.semester === undefined ? (
            <div className="flex items-center justify-center h-full">
              <h1 className="text-4xl font-semibold text-indigo-500">Nothing is selected!</h1>
            </div>
          ) : (
            <>
              <h1 className="mb-4 text-4xl font-semibold text-blue-600">Marks</h1>
              <Route path="/:year/:semester">
                <SemesterView marks={marks} />
              </Route>
            </>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
});

export default App;
