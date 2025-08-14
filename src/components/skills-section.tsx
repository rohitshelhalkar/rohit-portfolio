import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Code, Server, Users, UserCheck, Heart, Shield, TrendingUp } from "lucide-react";

const skillCategories = [
  {
    title: "Frontend Development",
    icon: Code,
    color: "medical-blue",
    skills: [
      { name: "React.js", level: 95 },
      { name: "TypeScript", level: 92 },
      { name: "Angular", level: 88 },
      { name: "Vue.js", level: 85 },
      { name: "jQuery", level: 80 }
    ]
  },
  {
    title: "Backend & Infrastructure",
    icon: Server,
    color: "healthcare-green",
    skills: [
      { name: "Node.js", level: 95 },
      { name: "NestJS", level: 92 },
      { name: "Java", level: 90 },
      { name: "GraphQL", level: 88 },
      { name: "PostgreSQL", level: 85 },
      { name: "Redis", level: 80 }
    ]
  },
  {
    title: "Leadership & Architecture",
    icon: Users,
    color: "warm-orange",
    skills: [
      { name: "Team Leadership", level: 95 },
      { name: "System Architecture", level: 92 },
      { name: "Agile/Scrum", level: 90 },
      { name: "Mentoring", level: 88 }
    ]
  }
];

const domainExpertise = [
  { title: "EHR Systems", subtitle: "Electronic Health Records", icon: UserCheck, color: "medical-blue" },
  { title: "Patient Management", subtitle: "CRM & Scheduling", icon: Heart, color: "healthcare-green" },
  { title: "HIPAA Compliance", subtitle: "Healthcare Regulations", icon: Shield, color: "warm-orange" },
  { title: "Health Analytics", subtitle: "Data & Insights", icon: TrendingUp, color: "deep-rose" }
];

export default function SkillsSection() {
  const [animatedSkills, setAnimatedSkills] = useState<string[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const skillId = entry.target.getAttribute("data-skill-id");
            if (skillId) {
              setTimeout(() => {
                setAnimatedSkills((prev) => Array.from(new Set([...prev, skillId])));
              }, 100);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    const skillElements = document.querySelectorAll("[data-skill-id]");
    skillElements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <section id="skills" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-charcoal mb-4">Technical Expertise</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A decade of continuous learning and growth in healthcare technology
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              className={`bg-gradient-to-br from-${category.color}/5 to-${category.color}/10 p-8 rounded-xl`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: categoryIndex * 0.2 }}
              viewport={{ once: true }}
              data-testid={`skill-category-${categoryIndex}`}
            >
              <div className="text-center mb-8">
                <div className={`w-16 h-16 bg-${category.color}/20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <category.icon className={`text-${category.color} text-2xl h-8 w-8`} />
                </div>
                <h3 className="text-xl font-bold text-charcoal">{category.title}</h3>
              </div>
              
              <div className="space-y-4">
                {category.skills.map((skill) => {
                  const skillId = `${category.title}-${skill.name}`.replace(/\s+/g, '-').toLowerCase();
                  const isAnimated = animatedSkills.includes(skillId);
                  
                  return (
                    <div key={skill.name} className="skill-item" data-skill-id={skillId}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-charcoal">{skill.name}</span>
                        <span className="text-sm text-gray-600">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className={`bg-${category.color} h-2 rounded-full`}
                          initial={{ width: "0%" }}
                          animate={{ width: isAnimated ? `${skill.level}%` : "0%" }}
                          transition={{ duration: 1, ease: "easeInOut" }}
                          data-testid={`skill-bar-${skillId}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Healthcare Domain Expertise */}
        <motion.div
          className="mt-16 bg-gradient-to-r from-medical-blue/10 to-healthcare-green/10 p-8 rounded-xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-charcoal text-center mb-8">Healthcare Domain Expertise</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {domainExpertise.map((domain, index) => (
              <motion.div
                key={domain.title}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                data-testid={`domain-${index}`}
              >
                <div className={`w-12 h-12 bg-${domain.color}/20 rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <domain.icon className={`text-${domain.color} h-6 w-6`} />
                </div>
                <h4 className="font-medium text-charcoal mb-1">{domain.title}</h4>
                <p className="text-sm text-gray-600">{domain.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
