"use client";
import React from "react";
import { motion } from "framer-motion";
import { Send, Github, Linkedin, Mail, Instagram } from "lucide-react";
import { useForm, ValidationError } from "@formspree/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";

export default function FooterContact() {
  const { t } = useTranslation();
  const [state, handleSubmit] = useForm("mgolekwv");

  return (
    <footer
      id="contact"
      className="bg-muted-foreground py-20 px-6 border-t border-border overflow-hidden"
    >
      <div className="container max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-foreground mb-4">
                Let's Connect!
              </h2>

              <p className="text-background text-lg max-w-md">
                {t("contact.description")}
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">
                {t("contact.follow")}
              </h4>

              <div className="flex gap-4">
                <SocialLink
                  href="https://github.com/Jonathanwjy"
                  icon={<Github />}
                />
                <SocialLink
                  href="https://www.linkedin.com/in/jonathanwjy/"
                  icon={<Linkedin />}
                />
                <SocialLink
                  href="https://www.instagram.com/jonathanwjy/"
                  icon={<Instagram />}
                />
                <SocialLink
                  href="mailto:jonathanwijaya062004@gmail.com"
                  icon={<Mail />}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="bg-background p-8 rounded-[2rem] shadow-xl border border-border"
          >
            {state.succeeded ? (
              <div className="text-center space-y-4 py-12">
                <h3 className="text-2xl font-bold text-foreground">
                  {t("contact.form.successTitle")}
                </h3>

                <p className="text-muted-foreground">
                  {t("contact.form.successDesc")}
                </p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <input type="text" name="_gotcha" className="hidden" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium ml-1 text-muted-foreground">
                      {t("contact.form.name")}
                    </label>

                    <Input
                      name="name"
                      required
                      placeholder="Jonathan Wijaya"
                      className="rounded-xl border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium ml-1 text-muted-foreground">
                      {t("contact.form.email")}
                    </label>

                    <Input
                      name="email"
                      type="email"
                      required
                      placeholder="jonathan@gmail.com"
                      className="rounded-xl border-border"
                    />

                    <ValidationError
                      prefix="Email"
                      field="email"
                      errors={state.errors}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium ml-1 text-muted-foreground">
                    {t("contact.form.message")}
                  </label>

                  <Textarea
                    name="message"
                    required
                    placeholder="Hello, I'm interested in..."
                    className="min-h-[120px] rounded-xl border-border resize-none"
                  />

                  <ValidationError
                    prefix="Message"
                    field="message"
                    errors={state.errors}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={state.submitting}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-xl text-lg font-semibold gap-2 transition-all group"
                >
                  {state.submitting
                    ? t("contact.form.sending")
                    : t("contact.form.send")}

                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 bg-secondary text-secondary-foreground rounded-full hover:bg-primary hover:text-white transition-all duration-300"
    >
      {React.cloneElement(icon, { size: 20 })}
    </a>
  );
}
