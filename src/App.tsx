import { BrowserRouter, Redirect, Route, Switch, useLocation, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";

import "./App.css";
import SemesterView from "./SemesterView";
import Sidebar from "./Sidebar";
import { marks } from "./store";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { NavBar } from "./NavBar";

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
      <Switch>
        <Route path="/:year/:semester">
          {/* Mobile */}
          <HideSidebar setSidebarActive={setSidebarActive} />
          <Sidebar
            marks={marks}
            className={`!block lg:!hidden top-12 z-10 transition-all duration-[350ms] -translate-x-full ${
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

      <NavBar marks={marks} sidebarActive={sidebarActive} setSidebarActive={setSidebarActive} />
      <div className="h-screen pt-12 lg:pt-0">
        <div className="flex flex-col items-center w-full h-full overflow-y-auto lg:pl-80">
          <div className="w-full h-full px-6 py-4 md:px-10 md:py-8 max-w-7xl">
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
      </div>
    </BrowserRouter>
  );
});

export default App;
