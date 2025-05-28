import './index.css'

import { RouterProvider } from '@tanstack/react-router';
import ReactDOM from 'react-dom/client';

import { router } from '@/app/routes/router';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router} />
);