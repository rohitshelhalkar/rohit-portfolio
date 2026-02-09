export default function Footer() {
  return (
    <footer className="bg-charcoal text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold mb-2">Rohit Shelhalkar</h3>
            <p className="text-gray-400 text-sm">Healthcare Technology Leader</p>
          </div>

          <div className="md:text-center">
            <p className="text-gray-400 text-sm">
              © 2026 Rohit Shelhalkar. Transforming healthcare through technology.
            </p>
          </div>

          <div className="md:text-right">
            <p className="text-sm text-gray-400">Built with passion for healthcare innovation</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
