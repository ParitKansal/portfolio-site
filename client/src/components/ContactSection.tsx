import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { insertMessageSchema, type InsertMessage } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { PaperSection } from "./PaperSection";

const empty: InsertMessage = { name: "", email: "", message: "" };

export function ContactSection() {
  const { toast } = useToast();
  const [values, setValues] = useState<InsertMessage>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof InsertMessage, string>>>({});

  const mutation = useMutation({
    mutationFn: async (data: InsertMessage) => {
      await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "Thanks for reaching out. I'll get back to you soon.",
      });
      setValues(empty);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    if (!values.name.trim()) nextErrors.name = "Please add your name.";
    if (!/^\S+@\S+\.\S+$/.test(values.email)) nextErrors.email = "Please add a valid email.";
    if (!values.message.trim()) nextErrors.message = "Please write a message.";
    const parsed = insertMessageSchema.safeParse(values);
    if (!parsed.success && Object.keys(nextErrors).length === 0) {
      nextErrors.message = parsed.error.issues[0]?.message ?? "Please check the form.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    mutation.mutate(values);
  };

  const set = (k: keyof InsertMessage) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  return (
    <PaperSection id="contact" title="Contact">
      <div className="corr">
        <div className="info">
          <p>Have a role, a project or a question about one of the articles? Send a note.</p>
          <div className="row"><span className="lbl">Email</span><code><a href="mailto:paritkansal121@gmail.com">paritkansal121@gmail.com</a></code></div>
          <div className="row"><span className="lbl">Phone</span><code><a href="tel:+916398950353">+91 639-895-0353</a></code></div>
          <div className="row">
            <span className="lbl">Elsewhere</span>
            <span>
              <a href="https://linkedin.com/in/paritkansal" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              {" · "}
              <a href="https://github.com/ParitKansal" target="_blank" rel="noopener noreferrer">GitHub</a>
            </span>
          </div>
          <p>Based in India. Open to remote opportunities and research collaborations in ML and AI.</p>
        </div>

        <form className="cform" onSubmit={onSubmit} noValidate>
          <label htmlFor="cf-name">Name</label>
          <input id="cf-name" autoComplete="name" placeholder="Your name" value={values.name} onChange={set("name")} />
          {errors.name && <span className="err">{errors.name}</span>}

          <label htmlFor="cf-email">Email</label>
          <input id="cf-email" type="email" autoComplete="email" placeholder="your@email.com" value={values.email} onChange={set("email")} />
          {errors.email && <span className="err">{errors.email}</span>}

          <label htmlFor="cf-msg">Message</label>
          <textarea id="cf-msg" placeholder="What would you like to discuss?" value={values.message} onChange={set("message")} />
          {errors.message && <span className="err">{errors.message}</span>}

          <button className="send" type="submit" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Send message
          </button>
        </form>
      </div>
    </PaperSection>
  );
}
