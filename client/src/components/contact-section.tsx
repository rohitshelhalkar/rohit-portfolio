import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertContactSchema, type InsertContact } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Shield } from "lucide-react";

// Turnstile Site Key (get from Cloudflare dashboard)
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

export default function ContactSection() {
  const { toast } = useToast();
  const [formLoadTime] = useState(() => Date.now());
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [remainingMessages, setRemainingMessages] = useState<number | null>(null);
  const [showTurnstile, setShowTurnstile] = useState(false);
  const [turnstileLoaded, setTurnstileLoaded] = useState(false);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string | null>(null);

  // Load Turnstile script only once
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;

    // Check if script already exists
    if (document.querySelector('script[src*="turnstile"]')) {
      setTurnstileLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      setTurnstileLoaded(true);
    };
  }, []);

  // Render Turnstile widget when form is ready and showTurnstile is true
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !showTurnstile || !turnstileLoaded) return;
    if (!turnstileRef.current || turnstileWidgetId.current) return;

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (turnstileRef.current && (window as any).turnstile) {
        turnstileWidgetId.current = (window as any).turnstile.render(turnstileRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token: string) => setTurnstileToken(token),
          'expired-callback': () => setTurnstileToken(null),
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [showTurnstile, turnstileLoaded]);

  const form = useForm<InsertContact>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      const payload = {
        ...data,
        honeypot,
        timestamp: formLoadTime.toString(),
        turnstileToken,
      };
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to send message");
      }
      return result;
    },
    onSuccess: (data) => {
      toast({
        title: "Message sent successfully!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      form.reset();
      if (data.remaining !== undefined) {
        setRemainingMessages(data.remaining);
      }
      // Reset Turnstile state
      setTurnstileToken(null);
      setShowTurnstile(false);
      turnstileWidgetId.current = null;
      if ((window as any).turnstile && turnstileRef.current) {
        (window as any).turnstile.remove(turnstileRef.current);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error sending message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContact) => {
    contactMutation.mutate(data);
  };

  // Watch form values to determine when form is complete
  const watchedFields = form.watch();
  const isFormComplete =
    watchedFields.firstName?.trim() !== "" &&
    watchedFields.lastName?.trim() !== "" &&
    watchedFields.email?.trim() !== "" &&
    watchedFields.subject !== "" &&
    watchedFields.message?.trim() !== "";

  // Show Turnstile when form is complete
  useEffect(() => {
    if (isFormComplete && !showTurnstile && TURNSTILE_SITE_KEY) {
      setShowTurnstile(true);
    }
  }, [isFormComplete, showTurnstile]);

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
            className="bg-white p-6 sm:p-8 rounded-xl shadow-lg"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-charcoal mb-4">Send a Message</h3>
            <p className="text-sm text-gray-500 mb-6">
              I'll respond to your message within 24-48 hours.
            </p>

            {remainingMessages !== null && remainingMessages <= 2 && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                <Shield className="inline h-4 w-4 mr-1" />
                {remainingMessages === 0
                  ? "You've reached the message limit. Please try again later."
                  : `${remainingMessages} message${remainingMessages === 1 ? '' : 's'} remaining this hour.`}
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" data-testid="contact-form">
                {/* Honeypot field - hidden from users, visible to bots */}
                <div className="absolute left-[-9999px]" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
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
                          <SelectItem value="job-opportunity">Job Opportunity</SelectItem>
                          <SelectItem value="freelance-project">Freelance / Contract Project</SelectItem>
                          <SelectItem value="technical-consultation">Technical Consultation</SelectItem>
                          <SelectItem value="partnership">Partnership / Collaboration</SelectItem>
                          <SelectItem value="general-inquiry">General Inquiry</SelectItem>
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

                {/* Cloudflare Turnstile Widget - Shows after form is filled */}
                {TURNSTILE_SITE_KEY && (
                  <div className="space-y-3">
                    {!isFormComplete && (
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                        <Shield className="h-5 w-5 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500">
                          Complete the form above to verify you're human
                        </p>
                      </div>
                    )}
                    {isFormComplete && !turnstileToken && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-700 text-center mb-3">
                          Please verify you're human to send your message
                        </p>
                        <div className="flex justify-center">
                          <div ref={turnstileRef}></div>
                        </div>
                      </div>
                    )}
                    {isFormComplete && turnstileToken && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center gap-2">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm text-green-700 font-medium">Verified - Ready to send</span>
                      </div>
                    )}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-medical-blue hover:bg-medical-blue/90 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={contactMutation.isPending || (TURNSTILE_SITE_KEY && !turnstileToken)}
                  data-testid="button-send-message"
                >
                  {contactMutation.isPending
                    ? "Sending..."
                    : !isFormComplete
                      ? "Complete the form"
                      : TURNSTILE_SITE_KEY && !turnstileToken
                        ? "Please verify first"
                        : "Send Message"}
                </Button>

                <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
                  <Shield className="h-3 w-3" />
                  Protected by rate limiting & spam detection
                </p>
              </form>
            </Form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="space-y-6 sm:space-y-8"
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
                    <div className="text-gray-600 text-sm sm:text-base">rohitshelhalkar17@gmail.com</div>
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
