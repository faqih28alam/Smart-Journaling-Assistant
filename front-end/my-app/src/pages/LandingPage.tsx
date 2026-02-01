// LandingPage.tsx
// src/pages/LandingPage.tsx

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Sparkles,
    BookOpen,
    Brain,
    Lock,
    TrendingUp,
    Mic,
    ArrowRight,
    Check
} from "lucide-react";

export default function LandingPage() {
    const features = [
        {
            icon: BookOpen,
            title: "Write Freely",
            description: "Express yourself naturally without worrying about grammar or structure. Just let your thoughts flow."
        },
        {
            icon: Brain,
            title: "AI-Powered Tidying",
            description: "Our AI organizes your raw thoughts into polished entries while preserving your authentic voice."
        },
        {
            icon: Mic,
            title: "Voice Input",
            description: "Speak your mind with voice-to-text technology. Perfect for capturing thoughts on the go."
        },
        {
            icon: TrendingUp,
            title: "Mood & Category Tracking",
            description: "Automatically detect emotions and categorize entries to track patterns over time."
        },
        {
            icon: Lock,
            title: "Private & Secure",
            description: "Your thoughts are encrypted and protected. Only you have access to your personal journal."
        },
        {
            icon: Sparkles,
            title: "Smart Suggestions",
            description: "Get thoughtful prompts and insights to deepen your self-reflection journey."
        }
    ];

    const benefits = [
        "No judgment zone - write however you feel",
        "AI enhances but never replaces your voice",
        "Track your emotional journey over time",
        "Access from anywhere, anytime",
        "Simple, distraction-free interface"
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 text-foreground transition-colors duration-300">
            {/* Navigation */}
            <nav className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo Section */}
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-6 h-6 text-primary" />
                            <span className="text-xl font-bold">Journal App</span>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="ghost" asChild>
                                <Link to="/login">Login</Link>
                            </Button>
                            <Button asChild className="shadow-sm">
                                <Link to="/register">Get Started</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-32 md:pb-24">
                <div className="text-center space-y-8 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                        <Sparkles className="w-4 h-4" />
                        AI-Powered Personal Journaling
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                        Write Messy.
                        <br />
                        <span className="text-primary">Think Clearly.</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Your personal journaling companion that understands raw thoughts and transforms them into organized insights. No pressure, just progress.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                        <Button size="lg" asChild className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-shadow">
                            <Link to="/register">
                                Start Journaling Free
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
                            <Link to="/login">
                                Sign In
                            </Link>
                        </Button>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        No credit card required • Free forever • 2 minute setup
                    </p>
                </div>
            </section>

            {/* Features Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                        Everything You Need to Journal Better
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Powerful features designed to make journaling effortless and meaningful
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group"
                        >
                            <CardHeader>
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                    <feature.icon className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle className="text-xl">{feature.title}</CardTitle>
                                <CardDescription className="text-base leading-relaxed">
                                    {feature.description}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-muted/30 rounded-3xl">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                        Simple. Powerful. Yours.
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Three steps to better self-reflection
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {[
                        {
                            step: "1",
                            title: "Write or Speak",
                            description: "Type freely or use voice input. Don't worry about mistakes - just express yourself."
                        },
                        {
                            step: "2",
                            title: "AI Tidies Up",
                            description: "Our AI organizes your thoughts, detects mood, and categorizes your entry automatically."
                        },
                        {
                            step: "3",
                            title: "Review & Grow",
                            description: "Choose to keep the AI version or your raw text. Track patterns and insights over time."
                        }
                    ].map((step, index) => (
                        <div key={index} className="text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto shadow-lg">
                                {step.step}
                            </div>
                            <h3 className="text-xl font-semibold">{step.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Benefits Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl sm:text-4xl font-bold">
                            Why Choose Our Journal?
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            We believe journaling should be easy, not intimidating. Our AI helps you capture authentic thoughts while maintaining your unique voice.
                        </p>
                        <ul className="space-y-4">
                            {benefits.map((benefit, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Check className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="text-base">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Card className="border-2 border-primary/20 shadow-xl">
                        <CardHeader className="space-y-4">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <BookOpen className="w-4 h-4" />
                                Sample Entry
                            </div>
                            <CardTitle className="text-lg">Raw → Refined</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                    Your Raw Thought:
                                </p>
                                <p className="text-sm text-muted-foreground italic p-4 bg-muted/50 rounded-lg border">
                                    "today was ok i guess, work was stressful but managed to finish that project finally, feeling relieved but also tired"
                                </p>
                            </div>

                            <div className="flex justify-center">
                                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                                    AI Enhanced:
                                </p>
                                <p className="text-sm p-4 bg-primary/5 rounded-lg border border-primary/20">
                                    "Today brought mixed emotions. Work was stressful, but I successfully completed the project I've been working on. I'm feeling relieved about the accomplishment, though physically exhausted from the effort."
                                </p>
                                <div className="flex gap-2 text-xs">
                                    <span className="px-2 py-1 rounded bg-primary/10 text-primary font-medium">
                                        RELIEVED
                                    </span>
                                    <span className="px-2 py-1 rounded bg-muted text-muted-foreground font-medium">
                                        WORK
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 shadow-2xl">
                    <CardContent className="py-16 text-center space-y-8">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                            Ready to Start Your Journey?
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Join others who are discovering clarity through journaling. Start writing today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button size="lg" asChild className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-shadow">
                                <Link to="/register">
                                    Create Free Account
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
                                <Link to="/login">
                                    I Have an Account
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Footer */}
            <footer className="border-t border-border/40 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary" />
                            <span className="font-semibold">Journal App</span>
                        </div>
                        <p className="text-sm text-muted-foreground text-center">
                            Your thoughts, your voice, enhanced by AI.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            © 2026 Journal App. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
