import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Calendar, Users, Code } from "lucide-react";
import { Link } from "wouter";

const allProjects = [
  {
    id: 1,
    title: "Healthcare CRM & Communication Platform",
    company: "FoldHealth",
    period: "Nov 2021 - Present",
    description: "Built comprehensive CRM platform with membership management, Stripe payment integration, and omnichannel communication engine supporting secure messaging, email (Gmail/Outlook), and SMS (Twilio) with real-time delivery.",
    longDescription: "As one of the earliest employees at FoldHealth, I helped define the technology stack and built core product modules from the ground up. The platform includes a complete healthcare CRM system, membership management with automated billing through Stripe, and an advanced omnichannel communication engine. The communication system supports secure in-app messaging, email integration with Gmail and Outlook APIs, and SMS notifications via Twilio, all with real-time delivery tracking and role-based access control.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
    technologies: ["React", "Node.js", "NestJS", "PostgreSQL", "Hasura", "GraphQL", "Stripe", "Twilio", "TypeScript", "WebSockets"],
    achievements: [
      "Built from ground up as earliest employee",
      "Integrated Power BI and BigQuery for advanced analytics",
      "Created dynamic reporting engine without code changes",
      "Implemented JWT authentication with rotational keys",
      "Real-time communication with 99.9% uptime"
    ],
    teamSize: "5+ engineers",
    impact: "Streamlined healthcare operations for 50+ clinics"
  },
  {
    id: 2,
    title: "Medical Imaging & Unified Health Records",
    company: "AthenaHealth",
    period: "Jun 2017 - Oct 2021",
    description: "Developed medical imaging viewer for real-time diagnostic scan access and designed unified health record views aggregating data from multiple systems with reconciliation workflows.",
    longDescription: "After AthenaHealth acquired Praxify, I contributed to multiple healthcare technology solutions. Developed a sophisticated medical imaging viewer that enables healthcare providers to access and review diagnostic scans in real-time. Built an internal configuration management system for microservices and frontend applications. Designed unified health record views that aggregate patient data from multiple healthcare systems with advanced reconciliation workflows to ensure data consistency and accuracy.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
    technologies: ["Java", "Angular", "Vue.js", "React", "Vert.x", "Redis", "Spring Boot", "DICOM"],
    achievements: [
      "Real-time diagnostic scan viewing with sub-second load times",
      "Data reconciliation across 10+ healthcare systems",
      "Secure provider communication platform with end-to-end encryption",
      "Configuration management for 50+ microservices",
      "HIPAA-compliant data handling and storage"
    ],
    teamSize: "8+ engineers",
    impact: "Used by 1000+ healthcare providers daily"
  },
  {
    id: 3,
    title: "Multi-Tenant Healthcare Platform",
    company: "Praxify",
    period: "Jun 2014 - Oct 2017",
    description: "Built patient records and encounter workflow modules for multi-tenant healthcare applications with improved performance through modular architecture and feature rollout controls.",
    longDescription: "Started my career at Praxify working on multi-tenant healthcare applications. Built comprehensive modules for patient records management and encounter workflows that served multiple healthcare organizations. Implemented a modular jQuery architecture that significantly improved frontend rendering performance. Introduced feature rollout toggles that enabled controlled deployment of new features across different customers, reducing deployment risks and enabling gradual feature adoption.",
    image: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
    technologies: ["Java (Servlets, JSF)", "jQuery", "Maven", "Multi-tenant Architecture", "MySQL"],
    achievements: [
      "Modular jQuery approach reduced page load times by 40%",
      "Feature rollout toggle implementation for safe deployments",
      "Multi-tenant architecture supporting 20+ healthcare organizations",
      "Built patient encounter workflows handling 10,000+ daily transactions",
      "Participated in innovation hackathons for deployment strategies"
    ],
    teamSize: "6+ engineers",
    impact: "Served 20+ healthcare organizations with 50,000+ patient records"
  },
  {
    id: 4,
    title: "Secure Provider Communication Platform",
    company: "AthenaHealth",
    period: "Jun 2018 - Dec 2020",
    description: "Built secure real-time messaging system enabling seamless provider-to-provider communication with end-to-end encryption and compliance features.",
    longDescription: "Developed a comprehensive secure communication platform for healthcare providers featuring real-time messaging, file sharing, and video conferencing capabilities. The system includes end-to-end encryption, audit trails for compliance, and integration with existing EHR systems. Implemented advanced features like message threading, read receipts, and priority messaging for urgent communications.",
    image: "https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
    technologies: ["React", "Node.js", "WebSockets", "Redis", "JWT", "WebRTC"],
    achievements: [
      "End-to-end encryption for all communications",
      "Real-time messaging with 99.99% uptime",
      "HIPAA-compliant audit trails and logging",
      "Integration with 5+ major EHR systems",
      "Support for 10,000+ concurrent users"
    ],
    teamSize: "4+ engineers",
    impact: "Facilitated secure communication for 2000+ healthcare providers"
  },
  {
    id: 5,
    title: "Dynamic Reporting Engine",
    company: "FoldHealth",
    period: "Jan 2022 - Present",
    description: "Created a flexible reporting engine allowing users to generate dynamic reports without code changes, integrated with Power BI and BigQuery for advanced analytics.",
    longDescription: "Designed and implemented a sophisticated reporting engine that empowers non-technical users to create complex healthcare analytics reports without requiring code changes. The system integrates seamlessly with Power BI for visualization and BigQuery for data processing. Features include drag-and-drop report building, real-time data updates, automated report scheduling, and role-based access control for sensitive healthcare data.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
    technologies: ["React", "NestJS", "BigQuery", "Power BI", "Cube.js", "PostgreSQL"],
    achievements: [
      "Reduced report generation time from days to minutes",
      "Self-service analytics for non-technical users",
      "Real-time data processing with BigQuery",
      "Automated report scheduling and distribution",
      "Integration with Power BI for advanced visualizations"
    ],
    teamSize: "3+ engineers",
    impact: "Enabled data-driven decisions for 30+ healthcare organizations"
  },
  {
    id: 6,
    title: "JWT Authentication System",
    company: "FoldHealth & AthenaHealth",
    period: "2018 - Present",
    description: "Implemented scalable JWT authentication systems with rotational keys for enhanced security across web and mobile applications.",
    longDescription: "Designed and implemented robust JWT-based authentication systems for both AthenaHealth and FoldHealth platforms. The system features automatic key rotation, multi-factor authentication, session management, and comprehensive audit logging. Built to handle high-volume healthcare applications while maintaining strict security standards and compliance requirements.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
    technologies: ["JWT", "Node.js", "Redis", "PostgreSQL", "OAuth2", "Multi-factor Authentication"],
    achievements: [
      "Automatic key rotation for enhanced security",
      "Multi-factor authentication implementation",
      "Session management for 10,000+ concurrent users",
      "Comprehensive audit logging for compliance",
      "Zero security incidents since implementation"
    ],
    teamSize: "2+ engineers",
    impact: "Secured authentication for 50,000+ healthcare professionals"
  }
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-clinical-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-medical-blue/10 to-healthcare-green/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link href="/" className="inline-flex items-center text-medical-blue hover:text-medical-blue/80 mb-8" data-testid="link-back-home">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-4xl lg:text-5xl font-bold text-charcoal mb-6">
              Healthcare Technology Projects
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              A comprehensive showcase of healthcare innovation projects spanning over 10 years, 
              from multi-tenant platforms to advanced CRM systems and secure communication tools.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12">
            {allProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                data-testid={`project-detail-${project.id}`}
              >
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="relative h-64 lg:h-auto">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 text-medical-blue text-sm font-medium rounded-full">
                        {project.company}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        {project.period}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        {project.teamSize}
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-charcoal mb-4">{project.title}</h2>
                    <p className="text-gray-600 mb-6">{project.longDescription}</p>

                    <div className="mb-6">
                      <h4 className="font-medium text-charcoal mb-3">Key Achievements:</h4>
                      <ul className="space-y-2">
                        {project.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-start text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-healthcare-green rounded-full mr-3 mt-2 flex-shrink-0"></div>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-medium text-charcoal mb-3">Technologies Used:</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-medical-blue/10 text-medical-blue text-sm rounded-full flex items-center"
                          >
                            <Code className="h-3 w-3 mr-1" />
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-healthcare-green/10 to-medical-blue/10 p-4 rounded-lg">
                      <h4 className="font-medium text-charcoal mb-2">Impact:</h4>
                      <p className="text-sm text-gray-600">{project.impact}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}