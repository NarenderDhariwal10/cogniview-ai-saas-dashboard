


export default function FooterNote() {
  return (
    <footer className="bg-gray-100 border-t mt-6">
      <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
        <p className="mb-2">
          <strong>Note:</strong> This project is a{" "}
          <span className="font-semibold text-blue-600">
            portfolio SaaS prototype
          </span>{" "}
          built to demonstrate skills in{" "}
          <span className="font-semibold">full-stack development</span>.
        </p>
        <p className="mb-2">
          Marketing pages (About, Features, Pricing, Blog, Careers, Contact) are{" "}
          <span className="italic">static</span> for demonstration purposes.
        </p>
        <p>
          Dynamic sections (Dashboard, Projects, Tasks, Teams, Billing,
          Organizations, etc.) are powered by{" "}
          <span className="font-semibold">Node.js, MongoDB, and real-time
          sockets</span>.
        </p>
      </div>
    </footer>
  );
}
