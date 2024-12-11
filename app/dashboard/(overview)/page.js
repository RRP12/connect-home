import { Suspense } from "react"
import { lusitana } from "../../ui/fonts"
import RevenueChart from "../../ui/dashboard/propertyList"
import RevenueChartSkeleton from "../../skeletons"

export default async function Page() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  let user = await supabase.auth.getUser()

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div>
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart userId={user?.data?.user?.id} />
        </Suspense>
      </div>
    </main>
  )
}
