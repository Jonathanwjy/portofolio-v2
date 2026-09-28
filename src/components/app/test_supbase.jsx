import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function SupabaseTest() {
  const [users, setUsers] = useState([]);
  console.log(users);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const { data } = await supabase.from("test").select("*");
    setUsers(data);
  }
  return <div></div>;
}
