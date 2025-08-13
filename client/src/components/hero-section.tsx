import { motion } from "framer-motion";
import { Download, ArrowRight } from "lucide-react";

export default function HeroSection() {
  const scrollToProjects = () => {
    const element = document.getElementById("projects");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const downloadResume = () => {
    // Create a downloadable link for the resume
    const link = document.createElement("a");
    link.href = "/api/download-resume"; // This would be implemented in the backend
    link.download = "Rohit_Shelhalkar_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="hero" className="pt-20 pb-12 bg-gradient-to-br from-medical-blue/5 to-healthcare-green/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-4">
              <motion.h1
                className="text-4xl lg:text-6xl font-bold text-charcoal leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Healthcare{" "}
                <span className="text-medical-blue">Technology</span> Leader
              </motion.h1>
              <motion.p
                className="text-xl text-gray-600 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Transforming healthcare through innovative technology solutions with over 10 years of experience from Junior Developer to Team Lead
              </motion.p>
            </div>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <span className="px-4 py-2 bg-medical-blue/10 text-medical-blue rounded-full text-sm font-medium">
                Full-Stack Development
              </span>
              <span className="px-4 py-2 bg-healthcare-green/10 text-healthcare-green rounded-full text-sm font-medium">
                Healthcare Domain
              </span>
              <span className="px-4 py-2 bg-warm-orange/10 text-warm-orange rounded-full text-sm font-medium">
                Team Leadership
              </span>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <button
                onClick={scrollToProjects}
                className="bg-medical-blue text-white px-8 py-3 rounded-lg hover:bg-medical-blue/90 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
                data-testid="button-view-work"
              >
                View My Work
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={downloadResume}
                className="border border-medical-blue text-medical-blue px-8 py-3 rounded-lg hover:bg-medical-blue hover:text-white transition-colors duration-200 font-medium flex items-center justify-center gap-2"
                data-testid="button-download-resume"
              >
                <Download className="h-4 w-4" />
                Download Resume
              </button>
            </motion.div>

            <motion.div
              className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <div className="text-center" data-testid="stat-experience">
                <div className="text-2xl font-bold text-medical-blue">10+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
              <div className="text-center" data-testid="stat-projects">
                <div className="text-2xl font-bold text-healthcare-green">50+</div>
                <div className="text-sm text-gray-600">Projects Delivered</div>
              </div>
              <div className="text-center" data-testid="stat-team">
                <div className="text-2xl font-bold text-warm-orange">5+</div>
                <div className="text-sm text-gray-600">Team Members Led</div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <img
              src="/attached_assets/image_1755118941108.jpeg"
              alt="Rohit Shelhalkar - Healthcare Technology Leader"
              className="rounded-2xl shadow-2xl w-full max-w-md mx-auto"
              data-testid="img-hero-profile"
            />
            <motion.div
              className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-healthcare-green rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-charcoal">Available for new opportunities</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
