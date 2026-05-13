import { Header } from "@/components/shared/Header";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header variant="admin" />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 bg-surface min-h-screen">{children}</main>
      </div>
    </>
  );
}
