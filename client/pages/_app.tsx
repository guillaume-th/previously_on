import '../styles/globals.css'
import "../styles/styles.css"
import type { AppProps } from 'next/app'
import { Provider } from "react-redux";
import { store } from "../store";
import { useEffect } from "react";
import { updateToken, updateUserData } from '../slices/userSlice';
import { useAppDispatch } from '../hooks';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

function MyApp({ Component, pageProps }: AppProps) {
 
  return (
    <Provider store={store}>
      <Wrapper Component={Component} pageProps={pageProps}>
        {/* <Component {...pageProps} /> */}
      </Wrapper>
    </Provider>
  )
}


function Wrapper({Component, pageProps}: AppProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const tmpToken = localStorage.getItem("token");
    if (tmpToken) {
      dispatch(updateToken(tmpToken));
      getUserData(tmpToken);
    }
  }, [])

  function getUserData(token: string) {
    fetch(`https://api.betaseries.com/members/infos?client_id=${API_KEY}&token=${token}`)
      .then(res => res.json())
      .then(res => {
        dispatch(updateUserData(res.member));
      })
      .catch(err => console.log(err));
  }

  return <Component {...pageProps}/>
}
export default MyApp
