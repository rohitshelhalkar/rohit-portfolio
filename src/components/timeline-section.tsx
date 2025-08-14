import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const timelineItems = [
  {
    id: 1,
    period: "Nov 2021 - Present",
    position: "Lead Software Engineer",
    company: "FoldHealth",
    description: "As one of the earliest employees, helped define the technology stack and built core product modules from the ground up. Built Healthcare CRM platform and omnichannel communication engine.",
    technologies: ["React", "Node.js", "NestJS", "PostgreSQL", "Hasura", "GraphQL", "TypeScript"],
    color: "medical-blue",
    side: "right",
    achievements: [
      "Built Healthcare CRM with Stripe payment integration",
      "Developed omnichannel communication engine (in-app, email, SMS)",
      "Created dynamic reporting engine with Power BI and BigQuery integration",
      "Implemented scalable JWT authentication with rotational keys"
    ]
  },
  {
    id: 2,
    period: "Jun 2017 - Oct 2021",
    position: "Senior Member of Technical Staff",
    company: "AthenaHealth",
    description: "After AthenaHealth acquired Praxify, moved into senior engineering role contributing to multiple healthcare technology solutions including medical imaging and secure communication platforms.",
    technologies: ["Java", "Angular", "Vue.js", "React", "Vert.x", "Redis", "Spring Boot"],
    color: "healthcare-green",
    side: "left",
    achievements: [
      "Developed medical imaging viewer for real-time diagnostic scans",
      "Built internal configuration management system for microservices",
      "Created secure provider communication platform with real-time messaging",
      "Designed unified health record views with data reconciliation workflows"
    ]
  },
  {
    id: 3,
    period: "Jun 2014 - Oct 2017",
    position: "Web Developer",
    company: "Praxify",
    description: "Began career after completing MCA through campus placement. Worked on multi-tenant healthcare applications building modules for patient records and encounter workflows.",
    technologies: ["Java (Servlets, JSF)", "jQuery", "Maven"],
    color: "warm-orange",
    side: "right",
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
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-0.5 w-1 h-full bg-gradient-to-b from-medical-blue to-healthcare-green"></div>

          {timelineItems.map((item, index) => (
            <motion.div
              key={item.id}
              data-item-id={item.id}
              className={`relative flex items-center justify-between mb-16 ${
                item.side === "left" ? "flex-row-reverse" : ""
              }`}
              initial={{ opacity: 0, x: item.side === "left" ? 50 : -50 }}
              animate={{
                opacity: visibleItems.includes(item.id) ? 1 : 0,
                x: visibleItems.includes(item.id) ? 0 : item.side === "left" ? 50 : -50,
              }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              data-testid={`timeline-item-${item.id}`}
            >
              <div className={`w-5/12 ${item.side === "left" ? "pl-8" : "text-right pr-8"}`}>
                <div
                  className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                    item.side === "left" ? `border-r-4 border-${item.color}` : `border-l-4 border-${item.color}`
                  }`}
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
                        <li key={idx} className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-healthcare-green rounded-full mr-2"></div>
                          {achievement}
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
              
              <div
                className={`absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-${item.color} rounded-full border-4 border-white shadow-lg`}
              ></div>
              
              <div className="w-5/12"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
