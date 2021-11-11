import { useSession, signIn, signOut } from "next-auth/react"
import Link from 'next/link';

const Profile = () => {
  const { data: session, status } = useSession()
  const loading = status === "loading"
  
  if ( session ) {
    return (
      <>
        <Link href="/profile">
          <a className="block mt-4 lg:inline-block lg:mt-0 text-black hover:text-black mr-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="hidden lg:block m-auto" fill="none" viewBox="0 0 24 24" width="18" height="auto" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              {session?.user?.name}
          </a>
        </Link>
      </>
    )
  } else {
    return (
      <>
      <button onClick={() => signIn()}>
          <a className="block mt-4 lg:inline-block lg:mt-0 text-black hover:text-black mr-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="hidden lg:block m-auto" fill="none" viewBox="0 0 24 24" width="18" height="auto" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              Sign in
          </a>
      </button>
        <Link href="/auth/signup">
          <a className="block mt-4 lg:inline-block lg:mt-0 text-black hover:text-black mr-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="hidden lg:block m-auto" fill="none" viewBox="0 0 24 24" width="18" height="auto" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              Sign up
          </a>
        </Link>
      </>
    )
  }
}

export default Profile