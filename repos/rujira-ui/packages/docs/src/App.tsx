import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GlobalModal, RujiraLogo } from "rujira.ui";
import { Nav } from "./layout/Nav";
import {
  Breakpoints,
  Buttons,
  CardComponent,
  Cards,
  Colors,
  Default,
  DenomIcons,
  Display,
  Filters,
  Flexbox,
  HeaderPage,
  Home,
  IconsPage,
  Inputs,
  Installation,
  LoaderPage,
  Messages,
  ModalPage,
  NumberClip,
  Numbers,
  ProgressPage,
  Selects,
  Sliders,
  Spacing,
  Styledcomponents,
  Tabs,
  Toggles,
  TxButtons,
  Typography,
  Usage,
  UseLocalStorage,
  UseQueryParam,
  UseWindowSize,
} from "./pages";

function App() {
  return (
    <BrowserRouter>
      <GlobalModal>
        <div className="docs rujira">
          <div className="docs__header">
            <RujiraLogo textColor="#22242f" />
            <p className="fs-20 fw-500 color-grey ml-q1">.ui Documentation</p>
          </div>
          <div className="docs__container">
            <Nav />
            <div className="docs__page">
              <div className="docs__inner">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/breakpoints" element={<Breakpoints />} />
                  <Route path="/button" element={<Buttons />} />
                  <Route path="/tx-button" element={<TxButtons />} />
                  <Route path="/cards" element={<Cards />} />
                  <Route path="/card" element={<CardComponent />} />
                  <Route path="/colors" element={<Colors />} />
                  <Route path="/denomicons" element={<DenomIcons />} />
                  <Route path="/display" element={<Display />} />
                  <Route path="/filters" element={<Filters />} />
                  <Route path="/flexbox" element={<Flexbox />} />
                  <Route path="/header" element={<HeaderPage />} />
                  <Route path="/icons" element={<IconsPage />} />
                  <Route path="/inputs" element={<Inputs />} />
                  <Route path="/install" element={<Installation />} />
                  <Route path="/loader" element={<LoaderPage />} />
                  <Route path="/numbers" element={<Numbers />} />
                  <Route path="/number-clip" element={<NumberClip />} />
                  <Route path="/progress" element={<ProgressPage />} />
                  <Route path="/select" element={<Selects />} />
                  <Route path="/slider" element={<Sliders />} />
                  <Route path="/spacing" element={<Spacing />} />
                  <Route
                    path="/styledcomponents"
                    element={<Styledcomponents />}
                  />
                  <Route path="/tabs" element={<Tabs />} />
                  <Route path="/toggle" element={<Toggles />} />
                  <Route path="/typography" element={<Typography />} />
                  <Route path="/usage" element={<Usage />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/modal" element={<ModalPage />} />
                  <Route
                    path="/uselocalstorage"
                    element={<UseLocalStorage />}
                  />
                  <Route path="/usequeryparam" element={<UseQueryParam />} />
                  <Route path="/usewindowsize" element={<UseWindowSize />} />
                  <Route path="*" element={<Default />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      </GlobalModal>
      <Toaster
        toastOptions={{
          style: {
            background: "#22242f",
            color: "#fff",
            fontSize: 14,
            fontWeight: 500,
          },
          success: {
            style: {
              background: "#34aa89",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#34aa89",
            },
          },
          error: {
            style: {
              background: "#B71C1C",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#B71C1C",
            },
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
