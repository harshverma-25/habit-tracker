import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getInitialAnalyticsData } from "@/lib/data-fetchers";
import { AnalyticsContent } from "@/components/analytics/AnalyticsContent";

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const initialData = await getInitialAnalyticsData(session);

  return <AnalyticsContent initialData={initialData} />;
}
