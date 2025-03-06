import Login from "@/components/main/Login";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function page() {

  const cookie = await cookies();
  if (!cookie.get("at") && !cookie.get("rt")) {
	return <Login />;
  }
  
  redirect("/dashboard");
}