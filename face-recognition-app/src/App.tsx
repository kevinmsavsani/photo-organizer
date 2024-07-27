import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom'
import Home from './containers/home'
import MainLayout from './layouts/MainLayout'
import Training from './containers/training'
import Results from './containers/results'

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/training" element={<Training />} />
        <Route path="/results" element={<Results />} />
        </Route>,
    ),
  )

  return <RouterProvider router={router} />
}

export default App
