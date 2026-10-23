import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
import AdminSettings from './AdminSettings';
createRoot(document.getElementById('root')!).render(<StrictMode><AdminSettings /></StrictMode>);
