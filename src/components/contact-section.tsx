import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactSection() {
  const { toast } = useToast();
  
  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactForm) => {
    // For now, just show a success message since this is a client-side only app
    toast({
      title: "Message received!",
      description: "Thank you for your interest. You can reach me directly at rohitshelhalkar17@gmail.com",
    });
    form.reset();
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-medical-blue/5 to-healthcare-green/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-charcoal mb-4">
            Let's Build the Future of Healthcare
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to transform healthcare technology together? I'm always open to discussing new opportunities and innovative projects.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <motion.div
            className="bg-white p-8 rounded-xl shadow-lg"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-charcoal mb-6">Send a Message</h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="contact-form">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John"
                            {...field}
                            data-testid="input-first-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Doe"
                            {...field}
                            data-testid="input-last-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-subject">
                            <SelectValue placeholder="Select a topic" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="collaboration">Collaboration Opportunity</SelectItem>
                          <SelectItem value="consultation">Technical Consultation</SelectItem>
                          <SelectItem value="hiring">Hiring Inquiry</SelectItem>
                          <SelectItem value="general">General Question</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell me about your project or opportunity..."
                          className="min-h-[120px]"
                          {...field}
                          data-testid="textarea-message"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-medical-blue hover:bg-medical-blue/90"
                  data-testid="button-send-message"
                >
                  Send Message
                </Button>
              </form>
            </Form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-charcoal mb-4">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center" data-testid="contact-email">
                  <div className="w-10 h-10 bg-medical-blue/20 rounded-full flex items-center justify-center mr-4">
                    <Mail className="text-medical-blue h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium text-charcoal">Email</div>
                    <div className="text-gray-600">rohitshelhalkar17@gmail.com</div>
                  </div>
                </div>

                <div className="flex items-center" data-testid="contact-phone">
                  <div className="w-10 h-10 bg-healthcare-green/20 rounded-full flex items-center justify-center mr-4">
                    <Phone className="text-healthcare-green h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium text-charcoal">Phone</div>
                    <div className="text-gray-600">+91-9657066980</div>
                  </div>
                </div>

                <div className="flex items-center" data-testid="contact-location">
                  <div className="w-10 h-10 bg-warm-orange/20 rounded-full flex items-center justify-center mr-4">
                    <MapPin className="text-warm-orange h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium text-charcoal">Location</div>
                    <div className="text-gray-600">Pune, India</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-charcoal mb-4">Professional Links</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-12 h-12 bg-medical-blue/20 rounded-full flex items-center justify-center hover:bg-medical-blue/30 transition-colors"
                  data-testid="link-linkedin"
                >
                  <Linkedin className="text-medical-blue h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-charcoal/20 rounded-full flex items-center justify-center hover:bg-charcoal/30 transition-colors"
                  data-testid="link-github"
                >
                  <Github className="text-charcoal h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-healthcare-green/20 rounded-full flex items-center justify-center hover:bg-healthcare-green/30 transition-colors"
                  data-testid="link-portfolio"
                >
                  <Globe className="text-healthcare-green h-6 w-6" />
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-r from-medical-blue/10 to-healthcare-green/10 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-charcoal mb-3">Currently Available</h3>
              <p className="text-gray-600 text-sm mb-4">
                Open to new opportunities in healthcare technology leadership roles and consulting projects.
              </p>
              <div className="flex items-center text-sm text-healthcare-green">
                <div className="w-2 h-2 bg-healthcare-green rounded-full mr-2 animate-pulse"></div>
                <span>Actively seeking new challenges</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
