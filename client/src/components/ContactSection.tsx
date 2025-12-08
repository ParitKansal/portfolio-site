import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertMessageSchema, type InsertMessage } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, Send, Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export function ContactSection() {
    const { toast } = useToast();

    const form = useForm<InsertMessage>({
        resolver: zodResolver(insertMessageSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
        },
    });

    const mutation = useMutation({
        mutationFn: async (data: InsertMessage) => {
            await apiRequest("POST", "/api/contact", data);
        },
        onSuccess: () => {
            toast({
                title: "Message sent!",
                description: "Thanks for reaching out. I'll get back to you soon.",
            });
            form.reset();
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to send message. Please try again.",
                variant: "destructive",
            });
        },
    });

    function onSubmit(data: InsertMessage) {
        mutation.mutate(data);
    }

    return (
        <section id="contact" className="py-16 md:py-24 px-4 sm:px-6">
            <div className="max-w-xl mx-auto">
                <div className="flex items-center gap-3 mb-8 justify-center">
                    <Mail className="h-8 w-8 text-primary" />
                    <h2 className="text-3xl md:text-4xl font-semibold">Get in Touch</h2>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Send me a message</CardTitle>
                        <CardDescription>
                            Have a project in mind or want to discuss AI? Fill out the form below.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Your name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="your.email@example.com" {...field} />
                                            </FormControl>
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
                                                    placeholder="What would you like to discuss?"
                                                    className="min-h-[120px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full gap-2"
                                    disabled={mutation.isPending}
                                >
                                    {mutation.isPending ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                    Send Message
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
