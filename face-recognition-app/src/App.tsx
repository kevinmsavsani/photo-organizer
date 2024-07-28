import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom'
import Home from './containers/home'
import MainLayout from './layouts/MainLayout'
import Training from './containers/training'
import Results from './containers/recognition'
import RecognitionResults from './containers/results'

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/training" element={<Training />} />
        <Route path="/recognition" element={<Results />} />
        <Route path="/results" element={<RecognitionResults />} />
        </Route>,
    ),
  )

  return <RouterProvider router={router} />
}

export default App
