import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "../../Components/Header/Header";
import { debounce } from "../../utils/debouce";
import { auth } from "../../services/firebase";
import LogIn from "../Login/Login";
import Home from "../Home/Home";
import ProtectedRoute from "../../utils/ProtectedRoute";
import SplashScreen from "../../Components/Loaders/SplashScreen";


export default function Main(){
    const headerRef = useRef(null);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [user,setUser] = useState(undefined)

    useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    const debouncedUpdate = debounce(updateHeight, 100);
    
    // Initial height
    
    

    // Add resize listener
    window.addEventListener("resize", debouncedUpdate);

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser); // could be null if not logged in
      console.log(headerRef.current)
      setTimeout(updateHeight,100)
    });

    // Cleanup
    return () => {
      window.removeEventListener("resize", debouncedUpdate);
      unsubscribe()
    };
  }, []);

    if(user === undefined) return <SplashScreen/>

    return (
        <div>
            <AuditProvider>
              <Router basename= {process.env.REACT_APP_BASENAME}>
              	<RedirectHandler/>
                <Header ref={headerRef}/>
                <main style={{padding:"24px",paddingTop:`${headerHeight + 10}px`}}>
                <Routes>
                    <Route path="/login" element={<LogIn/>}/>
                    <Route element={<ProtectedRoute user={user}/>}>
                        <Route path="/" element={<Home/>}/>
                        <Route path="*" element={<NotFound />} />
                    </Route> 
                </Routes>
                </main>
            </Router>
          </AuditProvider>  
        </div>
    )
}
