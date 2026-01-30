// // Home.tsx
// // src/pages/Home.tsx

// import { useEffect, useState } from "react";
// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

// interface User {
//   id: string;
//   name: string | null;
//   email: string;
// }

// export default function Home(){

//     const [users, setUsers] = useState<User[]>([]);

//     useEffect(() => {
//         getUsers();
//     }, []);

//     async function getUsers() {
//         const { data, error } = await supabase.from("User").select();
//         if (error) console.error(error);
        
//         // Use optional chaining or a fallback to ensure you never set state to null
//         setUsers(data ?? []);    
//     }

//     return (
//         <ul>
//             <h1>List of users</h1>
//             {users.length === 0 ? (
//                 <p>No users found in the database.</p>
//             ) : (
//                 users.map((user) => (
//                     <li key={user.id}>{user.name ?? "No name provided"}</li>
//                 ))
//             )}
//         </ul>
//     )
// }