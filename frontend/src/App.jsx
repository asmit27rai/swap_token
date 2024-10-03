import { SignedIn, SignedOut } from '@clerk/clerk-react'
import SignInPage from './pages/SignInPage'
import Home from './pages/Home'


function App() {

  return (
    <header>
      <SignedOut>
        <SignInPage />
      </SignedOut>
      <SignedIn>
        <Home />
      </SignedIn>
    </header>
  )
}

export default App
