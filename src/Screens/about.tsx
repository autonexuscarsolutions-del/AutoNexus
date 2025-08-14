import { Wrench, Settings, Truck, ShieldCheck } from "lucide-react";

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Performance Engineers",
      role: "OEM & Aftermarket Parts",
      icon: Wrench,
      description:
        "Expert technicians who source, test and validate premium automotive components from leading manufacturers worldwide."
    },
    {
      name: "Quality Specialists",
      role: "Testing & Certification",
      icon: Settings,
      description:
        "Rigorous quality control professionals ensuring every part meets or exceeds OEM specifications for safety and performance."
    },
    {
      name: "Logistics Team",
      role: "Distribution & Support",
      icon: Truck,
      description:
        "Dedicated professionals managing our supply chain and providing technical support to get you the right parts, fast."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white overflow-hidden relative p-4 sm:p-8 md:p-12">
      {/* Background Effects */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage: `url('./src/assets/modern-car-driving-city.jpg')`
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-700/15 rounded-full blur-3xl"></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1
            className="text-5xl md:text-7xl  text-white drop-shadow-lg"
            style={{ fontFamily: "Magenta, Arial Black, sans-serif" }}
          >
            Welcome to <span className="text-red-600">AutoNexus</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
            Your trusted partner for premium automotive parts, components, and
            performance upgrades since 2010.
          </p>
        </div>

        {/* Our Mission Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center mb-16 md:mb-24">
          <div className="md:col-span-2">
            <div className="p-1 rounded-3xl bg-gradient-to-br from-red-600/50 to-slate-800/50">
              <img
                src="./src/assets/car-brakes-101-how-they-work-and-how-to-repair-them.jpg"
                alt="Quality Car Parts"
                className="w-full h-auto rounded-2xl object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-3">
            <h2 className="text-3xl font-bold text-red-500 mb-4">
              Our Story: Built on Quality & Trust
            </h2>
            <p className="text-slate-300 text-base leading-relaxed mb-4">
              AutoNexus was founded with a simple mission: to provide car
              enthusiasts, mechanics, and everyday drivers with access to
              high-quality automotive parts at competitive prices. We understand
              that your vehicle is more than just transportation—it's your
              freedom, your passion, and often your livelihood.
            </p>
            <p className="text-slate-300 text-base leading-relaxed">
              From brake pads and engine components to performance upgrades and
              maintenance essentials, we've built relationships with top
              manufacturers and suppliers to ensure you get genuine, reliable
              parts that keep you moving forward with confidence.
            </p>
          </div>
        </div>

        {/* The Team Section */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl font-bold mb-2">Our Expert Team</h2>
          <p className="text-slate-400">
            Automotive professionals dedicated to keeping you on the road.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => {
            const Icon = member.icon;
            return (
              <div
                key={index}
                className="bg-slate-800/40 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50 hover:border-red-600/50 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-slate-700/50 p-3 rounded-lg">
                    <Icon className="w-8 h-8 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {member.name}
                    </h3>
                    <p className="text-sm text-red-400 font-mono">
                      {member.role}
                    </p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm">{member.description}</p>
              </div>
            );
          })}
        </div>

        {/* Why Choose Us Section */}
        <div className="mt-16 md:mt-24 text-center">
          <h2 className="text-3xl font-bold mb-8 text-white">
            Why Choose AutoNexus?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700/30">
              <ShieldCheck className="w-10 h-10 text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-slate-400 text-sm">
                All parts backed by manufacturer warranties and our quality
                promise.
              </p>
            </div>
            <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700/30">
              <Truck className="w-10 h-10 text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Fast Shipping</h3>
              <p className="text-slate-400 text-sm">
                Most orders ship same-day with expedited delivery options
                available.
              </p>
            </div>
            <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700/30">
              <Wrench className="w-10 h-10 text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Expert Support</h3>
              <p className="text-slate-400 text-sm">
                Our technical team helps you find the perfect parts for your
                vehicle.
              </p>
            </div>
            <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700/30">
              <Settings className="w-10 h-10 text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Wide Selection</h3>
              <p className="text-slate-400 text-sm">
                Over 100,000 parts in stock for all makes, models, and years.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
