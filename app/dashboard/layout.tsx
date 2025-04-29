import { MouseTrackingProvider } from "@/contexts/mouse-tracking-provider";
import { cookies } from "next/headers";
import { Toaster } from "sonner";

export default async function Layout({
  children
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("id")?.value;

  return (
    <section>
      <MouseTrackingProvider userId={userId ?? ""}>
        <Toaster richColors position="top-right" />
        {children}
      </MouseTrackingProvider>
    </section>
  );
}
