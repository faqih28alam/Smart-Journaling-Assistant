// LandingPage.tsx
// src/pages/LandingPage.tsx

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 selection:bg-indigo-100 selection:text-indigo-900">
            {/* Navigation */}
            <nav className="border-b border-zinc-200 dark:border-zinc-800 backdrop-blur-md bg-white/70 dark:bg-zinc-950/70 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-6 h-6 text-primary" />
                                <span className="text-xl font-bold tracking-tight">Journal<span className="text-indigo-600">AI</span></span>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Button variant="ghost" asChild className="hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                <Link to="/login">Login</Link>
                            </Button>
                            <Button asChild className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-900 shadow-md">
                                <Link to="/register">Get Started</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-32 md:pb-24">
                {/* Decorative AI Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.08),transparent_70%)] -z-10" />

                <div className="text-center space-y-8 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-semibold border border-indigo-100 dark:border-indigo-800 shadow-sm">
                        <Sparkles className="w-4 h-4" />
                        Intelligence for your inner world
                    </div>

                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter leading-[1.1]">
                        Write Messy. <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400">Think Clearly.</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                        The "ink and paper" experience you love, supercharged by AI that understands your raw thoughts and builds meaningful insights.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                        <Button size="lg" asChild className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-900 text-lg px-10 py-7 rounded-xl shadow-xl transition-all hover:scale-105">
                            <Link to="/register">
                                Start Writing Free
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild className="text-lg px-10 py-7 rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900">
                            <Link to="/login">Sign In</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-zinc-100 dark:border-zinc-900">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 group overflow-hidden">
                            <CardHeader className="relative">
                                <div className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors duration-300">
                                    <feature.icon className="w-6 h-6 text-zinc-900 dark:text-zinc-50 group-hover:text-white" />
                                </div>
                                <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                                <CardDescription className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed">
                                    {feature.description}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Interactive Preview Section (Raw -> Refined) */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="bg-zinc-900 dark:bg-black rounded-[2.5rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px]" />

                    <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                                Your voice, <br />
                                <span className="text-indigo-400 font-serif italic">elevated.</span>
                            </h2>
                            <p className="text-zinc-400 text-lg">
                                Don't worry about the structure. Just pour your mind out. Our Indigo engine handles the organization.
                            </p>
                            <ul className="space-y-3">
                                {benefits.map((b, i) => (
                                    <li key={i} className="flex items-center gap-3 text-zinc-300 text-sm">
                                        <Check className="w-4 h-4 text-indigo-400" /> {b}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <div className="p-5 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm">
                                <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">Ink (Raw Input)</p>
                                <p className="text-sm text-zinc-300 italic">"today was so heavy... work never ends but i finally finished that deck. feels good but im exhausted."</p>
                            </div>

                            <div className="flex justify-center -my-2 relative z-20">
                                <div className="bg-indigo-600 p-2 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.5)]">
                                    <Sparkles className="w-5 h-5 text-white animate-pulse" />
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-white text-zinc-900 shadow-xl border-l-4 border-indigo-500">
                                <p className="text-[10px] uppercase tracking-widest text-indigo-600 mb-2 font-bold">Indigo (AI Refined)</p>
                                <p className="text-sm leading-relaxed font-medium">
                                    "Today was mentally taxing. Despite the heavy workload, I successfully completed the presentation deck. I feel a strong sense of accomplishment, though it is coupled with significant physical fatigue."
                                </p>
                                <div className="mt-4 flex gap-2">
                                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 text-[10px] font-bold">ACCOMPLISHMENT</span>
                                    <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 text-[10px] font-bold">FATIGUE</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-zinc-200 dark:border-zinc-800 py-12">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-indigo-600" />
                        <span className="font-bold tracking-tighter">JournalAI</span>
                    </div>
                    <p className="text-zinc-500 text-sm">© 2026 Crafted for clarity. Encrypted and private.</p>
                </div>
            </footer>
        </div>
    );
}