import { motion } from "framer-motion";
import { ExternalLink, ChevronRight } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Healthcare CRM Platform",
    company: "Fold Health",
    description: "Led development of comprehensive CRM platform for healthcare providers, enabling seamless patient management, appointment scheduling, and provider communication.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&h=600",
    technologies: ["React.js", "Nest.js", "GraphQL", "TypeScript"],
    achievements: [
      "50% increase in user engagement",
      "70% reduction in production bugs",
      "30% improvement in team efficiency"
    ],
    isFeatured: true
  },
  {
    id: 2,
    title: "OneChart Patient Records",
    company: "Athenahealth",
    description: "Unified patient records system enabling seamless data access across multiple healthcare platforms and providers.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
    technologies: ["Angular", "Redux", "Node.js"],
    achievements: [],
    isFeatured: false
  },
  {
    id: 3,
    title: "DICOM Mobile Viewer",
    company: "Innovation Project",
    description: "Mobile-responsive medical imaging viewer integrated into native iOS app for on-the-go diagnostic capabilities.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
    technologies: ["iOS", "DICOM", "React Native"],
    achievements: [],
    isFeatured: false
  }
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-20 bg-gradient-to-br from-clinical-white to-medical-blue/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-charcoal mb-4">Healthcare Innovation Projects</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transforming healthcare delivery through cutting-edge technology solutions
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${
                project.isFeatured ? "lg:col-span-2" : ""
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              data-testid={`project-card-${project.id}`}
            >
              {project.isFeatured ? (
                <div className="grid lg:grid-cols-2">
                  <div className="p-8 lg:p-12">
                    <div className="flex items-center mb-4">
                      <span className="px-3 py-1 bg-medical-blue/10 text-medical-blue text-sm font-medium rounded-full">
                        Featured Project
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-charcoal mb-4">{project.title}</h3>
                    <p className="text-gray-600 mb-6">{project.description}</p>

                    {project.achievements.length > 0 && (
                      <div className="space-y-4 mb-6">
                        {project.achievements.map((achievement, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-600">
                            <div className="w-2 h-2 bg-healthcare-green rounded-full mr-3"></div>
                            <span>{achievement}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-medical-blue/10 text-medical-blue text-sm rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <button
                      className="bg-medical-blue text-white px-6 py-3 rounded-lg hover:bg-medical-blue/90 transition-colors duration-200 font-medium flex items-center gap-2"
                      data-testid={`button-view-project-${project.id}`}
                    >
                      View Case Study
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-medical-blue/20 to-transparent"></div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative h-48">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-2 py-1 bg-white/90 text-healthcare-green text-xs font-medium rounded">
                        {project.company}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-charcoal mb-3">{project.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-healthcare-green/10 text-healthcare-green text-xs rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <button
                      className="text-healthcare-green hover:text-healthcare-green/80 font-medium text-sm flex items-center gap-1"
                      data-testid={`button-learn-more-${project.id}`}
                    >
                      Learn More
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <button
            className="border border-medical-blue text-medical-blue px-8 py-3 rounded-lg hover:bg-medical-blue hover:text-white transition-colors duration-200 font-medium"
            data-testid="button-view-all-projects"
          >
            View All Projects
          </button>
        </motion.div>
      </div>
    </section>
  );
}
