// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../service/supabase';

const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  admin: false,
  loanRequests: null,
  allUsers: null,
  refreshData: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loanRequests, setLoanRequests] = useState(null);
  const [allUsers, setAllUsers] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(false);

  const fetchLoanRequests = async () => {
    const { data, error } = await supabase
      .from('loan_requests')
      .select('*');

    if (!error) setLoanRequests(data);
  };

  const fetchAllUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setAllUsers(data);
  };

  const refreshData = () => {
    fetchLoanRequests();
    if (admin) fetchAllUsers();
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        refreshData();
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        refreshData();
      } else {
        setLoanRequests(null);
        setAllUsers(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user && admin) {
      fetchAllUsers();
    }
  }, [admin]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      admin, 
      setAdmin,
      loanRequests,
      allUsers,
      refreshData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// // src/contexts/AuthContext.js
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { supabase } from '../service/supabase';
// import LoanRequests from '../views/loan-requests';
// const AuthContext = createContext({
//   user: null,
//   session: null,
//   loading: true,
//   admin: false,
//   LoanRequests: null,
//   allUser: null
// });

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loanRequests, setLoanRequests] = useState(null);
//   const [allUser, setAllUser] = useState(null);
//   const [session, setSession] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [admin, setAdmin] = useState(false);

//   useEffect(() => {
//     // Check initial session
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session);
//       setUser(session?.user ?? null);
//       setLoading(false);
//     });

//     // Listen for auth state changes
//     const {
//       data: { subscription }
//     } = supabase.auth.onAuthStateChange((event, session) => {
//       setSession(session);
//       setUser(session?.user ?? null);
//       setLoading(false);
//     });

//     // Cleanup subscription on unmount
//     return () => subscription.unsubscribe();
//   }, []);

//   return <AuthContext.Provider value={{ user, session, loading, admin, setAdmin }}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => useContext(AuthContext);
