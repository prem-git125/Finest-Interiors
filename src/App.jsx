import { Suspense } from 'react'
import { matchPath, useParams, useRoutes } from 'react-router-dom'
import router from './router'
import DefaultLayout from './layouts/default'
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const navBarOmitPath = [
    '/auth/login',
    '/auth/register',
    '/auth/forgotpassword',
    '/blocked-user',
    '/messages/:id',
  ]

  const shouldOmitNavbar = navBarOmitPath.some((path) => 
    matchPath(path,location.pathname)
  )

  console.log(location)
   return (
    <div className="left-2/4 z-10 mx-auto -translate-x-2/4 p-4">
      {shouldOmitNavbar ? (
        <Suspense fallback={<p>Loading...</p>}>
          {useRoutes(router)}
        </Suspense>
      ) : (
        <DefaultLayout>
          <Suspense fallback={<p>Loading...</p>}>
            {useRoutes(router)}
          </Suspense>
        </DefaultLayout>
      )}
    </div>
  );
}

export default App
