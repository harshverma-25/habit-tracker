import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getInitialDashboardData } from "@/lib/data-fetchers";
import { DashboardContent } from "@/components/DashboardContent";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const { initialHabits, initialCompletions } = await getInitialDashboardData(session);

  return (
    <DashboardContent
      initialHabits={initialHabits}
      initialCompletions={initialCompletions}
    />
  );
}
