import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const timelineItems = [
  {
    id: 1,
    period: "Jul 2025 - Dec 2025",
    position: "Full Stack Developer (Contract)",
    company: "Pixel Health",
    description: "Led end-to-end development of a healthcare Care Companion platform enabling secure patient–provider messaging, personalized guidance, educational content, and emergency assistance.",
    technologies: ["React", "NestJS", "TypeScript", "Node.js"],
    color: "deep-rose",
    side: "right",
    achievements: [
      "Built Care Companion platform with secure patient-provider messaging",
      "Designed and delivered Patient Bridge solution for care continuity",
      "Implemented real-time communication and proactive engagement workflows",
      "Architected scalable, high-performance modules enhancing UX and reliability"
    ]
  },
  {
    id: 2,
    period: "Nov 2021 - Mar 2025",
    position: "Lead Software Engineer",
    company: "FoldHealth",
    description: "As one of the earliest employees, helped define the technology stack and built core product modules from the ground up. Built Healthcare CRM platform, omnichannel communication engine, and complete authentication system.",
    technologies: ["React", "Node.js", "NestJS", "PostgreSQL", "Hasura", "GraphQL", "TypeScript", "JWT"],
    color: "medical-blue",
    side: "left",
    achievements: [
      "Built Healthcare CRM with Stripe payment integration",
      "Developed omnichannel communication engine (in-app, email, SMS)",
      "Created dynamic reporting engine with Power BI and BigQuery integration",
      "Implemented complete authentication & authorization with JWT rotational keys"
    ]
  },
  {
    id: 3,
    period: "Jun 2017 - Oct 2021",
    position: "Senior Member of Technical Staff",
    company: "AthenaHealth",
    description: "After AthenaHealth acquired Praxify, moved into senior engineering role contributing to multiple healthcare technology solutions including medical imaging and secure communication platforms.",
    technologies: ["Java", "Angular", "Vue.js", "React", "Vert.x", "Redis", "Spring Boot"],
    color: "healthcare-green",
    side: "right",
    achievements: [
      "Developed medical imaging viewer for real-time diagnostic scans",
      "Built internal configuration management system for microservices",
      "Created secure provider communication platform with real-time messaging",
      "Designed unified health record views with data reconciliation workflows"
    ]
  },
  {
    id: 4,
    period: "Jun 2014 - Oct 2017",
    position: "Web Developer",
    company: "Praxify",
    description: "Began career after completing MCA through campus placement. Worked on multi-tenant healthcare applications building modules for patient records and encounter workflows.",
    technologies: ["Java (Servlets, JSF)", "jQuery", "Maven"],
    color: "warm-orange",
    side: "left",
    achievements: [
      "Improved frontend performance with modular jQuery approach",
      "Introduced feature rollout toggles for controlled deployment",
      "Contributed to multi-tenant healthcare applications",
      "Participated in internal hackathon for deployment strategies"
    ]
  }
];

export default function TimelineSection() {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const itemId = parseInt(entry.target.getAttribute("data-item-id") || "0");
            setVisibleItems((prev) => Array.from(new Set([...prev, itemId])));
          }
        });
      },
      { threshold: 0.3 }
    );

    const timelineElements = document.querySelectorAll("[data-item-id]");
    timelineElements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <section id="timeline" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-charcoal mb-4">Career Journey</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From Junior Developer to Team Lead: A decade of growth in healthcare technology
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line - hidden on mobile, visible on lg */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-0.5 w-1 h-full bg-gradient-to-b from-medical-blue to-healthcare-green"></div>

          {/* Mobile timeline line */}
          <div className="lg:hidden absolute left-4 top-0 w-1 h-full bg-gradient-to-b from-medical-blue to-healthcare-green"></div>

          {timelineItems.map((item, index) => (
            <motion.div
              key={item.id}
              data-item-id={item.id}
              className={`relative mb-8 lg:mb-16 lg:flex lg:items-center lg:justify-between ${
                item.side === "right" ? "lg:flex-row-reverse" : ""
              }`}
              initial={{ opacity: 0, x: item.side === "left" ? -30 : 30 }}
              animate={{
                opacity: visibleItems.includes(item.id) ? 1 : 0,
                x: visibleItems.includes(item.id) ? 0 : item.side === "left" ? -30 : 30,
              }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              data-testid={`timeline-item-${item.id}`}
            >
              {/* Mobile layout */}
              <div className="lg:hidden pl-12 pr-4">
                <div
                  className={`absolute left-2 top-0 w-5 h-5 bg-${item.color} rounded-full border-4 border-white shadow-lg`}
                ></div>
                <div
                  className={`bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-${item.color}`}
                >
                  <div className={`text-sm font-medium mb-2 text-${item.color}`}>
                    {item.period}
                  </div>
                  <h3 className="text-lg font-bold text-charcoal mb-1">{item.position}</h3>
                  <h4 className="text-base text-deep-rose font-medium mb-2">{item.company}</h4>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>

                  <div className="mb-3">
                    <h5 className="text-sm font-medium text-charcoal mb-2">Key Achievements:</h5>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {item.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-healthcare-green rounded-full mr-2 mt-1.5 flex-shrink-0"></div>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {item.technologies.map((tech) => (
                      <span
                        key={tech}
                        className={`px-2 py-1 bg-${item.color}/10 text-${item.color} text-xs rounded`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Desktop layout - Left side card */}
              {item.side === "left" && (
                <>
                  <div className="hidden lg:block w-5/12 pr-8 text-right">
                    <div
                      className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-r-4 border-${item.color}`}
                    >
                      <div className={`text-sm font-medium mb-2 text-${item.color}`}>
                        {item.period}
                      </div>
                      <h3 className="text-xl font-bold text-charcoal mb-2">{item.position}</h3>
                      <h4 className="text-lg text-deep-rose font-medium mb-3">{item.company}</h4>
                      <p className="text-gray-600 text-sm mb-4">{item.description}</p>

                      <div className="mb-4 text-left">
                        <h5 className="text-sm font-medium text-charcoal mb-2">Key Achievements:</h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {item.achievements.map((achievement, idx) => (
                            <li key={idx} className="flex items-start">
                              <div className="w-1.5 h-1.5 bg-healthcare-green rounded-full mr-2 mt-1.5 flex-shrink-0"></div>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-wrap gap-2 justify-end">
                        {item.technologies.map((tech) => (
                          <span
                            key={tech}
                            className={`px-2 py-1 bg-${item.color}/10 text-${item.color} text-xs rounded`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-${item.color} rounded-full border-4 border-white shadow-lg`}
                  ></div>
                  <div className="hidden lg:block w-5/12"></div>
                </>
              )}

              {/* Desktop layout - Right side card */}
              {item.side === "right" && (
                <>
                  <div className="hidden lg:block w-5/12"></div>
                  <div
                    className={`hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-${item.color} rounded-full border-4 border-white shadow-lg`}
                  ></div>
                  <div className="hidden lg:block w-5/12 pl-8">
                    <div
                      className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-${item.color}`}
                    >
                      <div className={`text-sm font-medium mb-2 text-${item.color}`}>
                        {item.period}
                      </div>
                      <h3 className="text-xl font-bold text-charcoal mb-2">{item.position}</h3>
                      <h4 className="text-lg text-deep-rose font-medium mb-3">{item.company}</h4>
                      <p className="text-gray-600 text-sm mb-4">{item.description}</p>

                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-charcoal mb-2">Key Achievements:</h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {item.achievements.map((achievement, idx) => (
                            <li key={idx} className="flex items-start">
                              <div className="w-1.5 h-1.5 bg-healthcare-green rounded-full mr-2 mt-1.5 flex-shrink-0"></div>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {item.technologies.map((tech) => (
                          <span
                            key={tech}
                            className={`px-2 py-1 bg-${item.color}/10 text-${item.color} text-xs rounded`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
