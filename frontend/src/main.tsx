import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import CustomToaster from './components/CustomToaster.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <>
      <App />
      <CustomToaster />
    </>
  </StrictMode>
);
