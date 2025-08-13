export default function Footer() {
  return (
    <footer className="bg-charcoal text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div>
            <h3 className="text-xl font-bold mb-2">Rohit Shelhalkar</h3>
            <p className="text-gray-400 text-sm">Healthcare Technology Leader</p>
          </div>

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Rohit Shelhalkar. Transforming healthcare through technology.
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-400">Built with passion for healthcare innovation</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
