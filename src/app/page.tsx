

"use client"

import { Provider, useDispatch } from "react-redux";
import store from "./store";
import HomeMain from "./page2";
export default async function Home() {

  return (
    <Provider store={store}>  
   <HomeMain></HomeMain>
    </Provider>
   
  );
}
