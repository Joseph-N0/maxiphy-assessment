import Dashboard from "@/components/main/Dashboard";
import api from "@/lib/api"; // Your Axios instance
import { redirect  } from "next/navigation";
import { headers} from "next/headers";
import { AxiosError } from "axios";


export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const serverHeaders = await headers();
  const cookieHeader = serverHeaders.get("cookie");

  let user;
  try {
    const { data } = await api.get("/user/me", {
      withCredentials: true,
      headers: { Cookie: cookieHeader || "" },
    });

    user = data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      redirect("/login")
    }
  }

  const params = await searchParams;
  const page = params.page ?? "1";
  const limit = params.limit ?? "5";
  const priority = params.priority;
  const completed = params.completed;
  const date = params.date;


  const query = new URLSearchParams({
    ...(page && { page }),
    ...(limit && { limit }),
    ...(priority && { priority }),
    ...(completed && { completed }),
    ...(date && { date }),
  }).toString();

  const filters = {
    priority: priority ? parseInt(priority) : 0,
    completed,
    date: date ? new Date(date) : undefined,
  }


  const { data: todos } = await api.get(`/task/all?${query}`, {
    withCredentials: true,
    headers: { Cookie: cookieHeader || "" },
  });

  return <Dashboard userData={user} todos={todos} filters={filters} />;
}
