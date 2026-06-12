export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav>Customer Navbar Placeholder</nav>
      <main className="flex-1">{children}</main>
      <footer>Footer Placeholder</footer>
    </div>
  )
}
