// app/dashboard/layout.jsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/getSession"; // Adjust this import based on how you fetch the logged-in user server-side

export default async function DashboardLayout({ children }) {
  const user = await getSession();

  // If not logged in, redirect to login
  if (!user) {
    redirect("/login");
  }

  // If the user is a volunteer, restrict them from viewing general dashboard pages
  // and send them straight to the donation entry form
  if (user.role === "volunteer") {
    redirect("/donations/new");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Dashboard Navigation / Wrapper */}
      {children}
    </div>
  );
}