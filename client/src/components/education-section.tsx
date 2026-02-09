import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { GraduationCap, Calendar, MapPin } from "lucide-react";

const educationData = [
  {
    id: 1,
    degree: "Master of Computer Applications (MCA)",
    institution: "Pune University",
    year: "2012 - 2014",
    location: "Pune, India",
    description: "Advanced computer applications with focus on software development, database management, and system analysis.",
    color: "medical-blue"
  },
  {
    id: 2,
    degree: "Bachelor of Computer Applications (BCA)",
    institution: "Pune University", 
    year: "2009 - 2012",
    location: "Pune, India",
    description: "Computer applications fundamentals including programming, software engineering, and web technologies.",
    color: "healthcare-green"
  }
];

export default function EducationSection() {
  return (
    <section id="education" className="py-20 bg-gradient-to-br from-clinical-white to-healthcare-green/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-charcoal mb-6">
            Education
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Academic foundation in computer applications and software development
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {educationData.map((education, index) => (
            <motion.div
              key={education.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`p-3 rounded-lg bg-${education.color}/10 group-hover:bg-${education.color}/20 transition-colors duration-300`}>
                      <GraduationCap className={`h-6 w-6 text-${education.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-charcoal mb-2">
                        {education.degree}
                      </h3>
                      <h4 className={`text-lg font-medium text-${education.color} mb-3`}>
                        {education.institution}
                      </h4>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">{education.year}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">{education.location}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {education.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}