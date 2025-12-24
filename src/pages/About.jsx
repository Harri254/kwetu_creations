function About() {
  return (
    <section className="bg-white py-12 md:py-20 px-6">
      {/* Container to keep content centered and readable */}
      <div className="max-w-4xl mx-auto">
        
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4">
            About <span className="text-secondary">KwetuCreations</span>
          </h1>
          <div className="h-1 w-20 bg-secondary mx-auto rounded-full"></div>
        </div>

        {/* Introduction Section */}
        <div className="space-y-8 text-gray-700 leading-relaxed text-lg md:text-xl text-center md:text-left">
          <p>
            Welcome to <span className="font-semibold text-primary">KwetuCreations</span>, where creativity meets innovation! 
            We are a passionate graphic design company dedicated to transforming ideas into visually 
            stunning designs that captivate and engage.
          </p>

          {/* Core Services / Portfolio Highlight */}
          <div className="bg-primary/5 p-8 rounded-2xl border-l-4 border-secondary">
            <p>
              With a diverse portfolio that includes eye-catching <strong>flyers</strong>, 
              memorable <strong>logos</strong>, informative <strong>brochures</strong>, 
              compelling company profiles, and dynamic motion graphics, we cater to a 
              wide range of clients—from startups to established businesses.
            </p>
          </div>

          <p>
            At KwetuCreations, we believe that great design is more than just aesthetics; 
            it’s about effective communication. Our team of talented designers collaborates 
            closely with each client to understand their unique vision and brand identity.
          </p>

          {/* Professional Templates Section */}
          <div className="grid md:grid-cols-2 gap-8 items-center py-6">
            <div className="text-center md:text-left">
               <h3 className="text-2xl font-bold text-primary mb-2">Custom & Ready-to-Use</h3>
               <p>
                In addition to custom designs, we offer a selection of professionally crafted 
                templates. Whether you’re looking for a striking flyer or a sleek logo, 
                our templates provide the perfect starting point.
               </p>
            </div>
            <div className="bg-secondary/10 p-6 rounded-xl text-center italic border border-secondary/20">
              "Our commitment to quality and attention to detail set us apart."
            </div>
          </div>

          <p className="text-center md:text-left">
            Join us on this creative journey as we bring your ideas to life. 
            Explore our portfolio, discover our services, and let us help you 
            make a lasting impression through the power of design.
          </p>

          {/* Mission Conclusion */}
          <div className="text-center pt-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-primary">
              At KwetuCreations, <span className="text-secondary uppercase tracking-wider">Your Vision Is Our Mission!</span>
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;