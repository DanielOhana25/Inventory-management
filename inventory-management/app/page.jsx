export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 text-white py-4 px-8">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <nav className="mt-2">
          <ul className="flex gap-4">
            <li>
              <a href="/" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="/products" className="hover:underline">
                Products
              </a>
            </li>
            <li>
              <a href="/about" className="hover:underline">
                About
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main */}
      <main className="flex-grow p-8">
        <h2 className="text-4xl font-bold mb-4">Welcome to Inventory Management</h2>
        <p className="text-lg mb-6">
          This is a simple inventory management system built with Next.js, Tailwind CSS, and JavaScript.
        </p>
        <a
          href="/products"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Get Started
        </a>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-4 px-8 text-center">
        <p>© 2025 Inventory Management. All rights reserved.</p>
      </footer>
    </div>
  );
}
