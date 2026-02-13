import Link from 'next/link';
import { Check, X, ArrowRight, ArrowUp } from 'lucide-react';
import { adminDb } from '@/lib/firebase-admin';

export const metadata = {
  title: 'Blueprxnt — The World\'s First Performance Health Operating System',
  description: 'Built in elite sport. Engineered for real life. Transform your health into lasting performance.',
};

// Revalidate on every request to show latest content
export const revalidate = 0;

const nflTeams = ['KC Chiefs', 'New York Giants', 'New York Jets'];
const ncaaSchools = [
  'Air Force', 'App State', 'Arizona', 'Cincinnati', 'Florida', 'Iowa',
  'Kansas State', 'Maryland', 'Miami', 'Mizzou', 'Northwestern', 'Ole Miss',
  'Oregon', 'Rutgers', 'Tennessee', 'UCF', 'UNC', 'Wake Forest',
];
const results = [
  'More muscle', 'Less body fat', 'Higher strength and fitness',
  'Faster recovery', 'Sharper focus', 'Long-term durability',
];
const problems = [
  "You're overwhelmed by conflicting advice",
  "You're doing pieces but nothing is coordinated",
  "You don't know your real health status",
  'Progress starts then disappears when life gets busy',
  'You cycle between effort and burnout',
];
const steps = [
  { num: '01', title: 'Assess', desc: 'Testing and evaluation of health, habits, and stress load' },
  { num: '02', title: 'Design', desc: 'Personalized system built for your body and life' },
  { num: '03', title: 'Execute', desc: 'Clear priorities, coaching, accountability' },
  { num: '04', title: 'Evolve', desc: 'Continuous refinement as life changes' },
  { num: '05', title: 'Thrive', desc: 'Sustained energy, performance, and resilience without burnout' },
];
const forItems = ['South Asians & Indians', 'Executives & professionals', 'Athletes & high performers'];
const notForItems = ['Quick fixes', 'Hacks', 'Generic plans'];

// Fetch dynamic content from Firestore
async function getContent() {
  try {
    if (!adminDb) {
      console.warn('Firebase Admin DB is not initialized');
      return [];
    }

    const contentRef = adminDb.collection('siteContent').doc('homepage');
    const doc = await contentRef.get();

    if (doc.exists) {
      const data = doc.data();
      return data?.fields || [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching content:', error);
    return [];
  }
}

// Helper to get content value by ID
function getContentValue(fields: any[], id: string, fallback: string) {
  const field = fields.find((f: any) => f.id === id);
  return field?.value || fallback;
}

export default async function HomePage() {
  const content = await getContent();
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <p className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-6">
            {getContentValue(content, 'hero_eyebrow', 'Blueprxnt Performance Health')}
          </p>
          <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-white leading-none tracking-tight mb-6">
            {getContentValue(content, 'hero_title_1', "The World's First")}<br />
            <span className="bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent">
              {getContentValue(content, 'hero_title_2', 'Performance Health')}
            </span>
            <br />{getContentValue(content, 'hero_title_3', 'Operating System')}
          </h1>
          <p className="text-xl text-secondary mb-3">{getContentValue(content, 'hero_subtitle', 'Built in elite sport. Engineered for real life. Transform your health into lasting performance.')}</p>
          <p className="text-lg font-semibold text-white mb-10">Transform your health into lasting performance.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/apply"
              className="px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-accent to-accent-secondary hover:opacity-90 transition-opacity"
            >
              Apply for Coaching
            </Link>
            <Link
              href="/system"
              className="px-8 py-4 rounded-xl text-base font-semibold text-white border border-border hover:border-accent transition-colors"
            >
              Explore the System
            </Link>
          </div>
          <p className="text-secondary text-sm mt-8">No quick fixes. No generic plans. Just a system you can run.</p>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-16 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-secondary text-xs font-semibold tracking-[0.2em] uppercase mb-10">
            Trusted By Elite Performance Environments
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {nflTeams.map((team) => (
              <span key={team} className="text-white font-display font-bold text-lg tracking-wide">{team}</span>
            ))}
          </div>
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-secondary text-xs font-semibold tracking-widest uppercase">NCAA</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {ncaaSchools.map((school) => (
              <span key={school} className="text-secondary text-sm font-medium">{school}</span>
            ))}
          </div>
        </div>
      </section>

      {/* What Blueprxnt Is */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            {getContentValue(content, 'what_title', 'What Blueprxnt Is')}
          </p>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-white mb-16">
            {getContentValue(content, 'what_subtitle', 'A complete performance health system built on proven methods from elite sport — not another wellness program.')}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p className="text-secondary text-lg mb-8">
                In the NFL, athletes don&apos;t rely on random workouts or generic plans. They&apos;re supported by an integrated system:
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {['Training', 'Nutrition', 'Recovery', 'Diagnostics', 'Behavior Design'].map((tag) => (
                  <span key={tag} className="px-4 py-2 rounded-full border border-border text-secondary text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-secondary text-lg">
                Blueprxnt brings that same model to high performers outside of sport — tailored to your physiology, schedule, and real life.
              </p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-8">
              <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-6">The Result</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.map((r) => (
                  <div key={r} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-accent" />
                    </div>
                    <span className="text-white text-sm">{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="text-2xl font-display font-bold text-white mt-16">
            Build capacity. <span className="underline decoration-accent">Reduce fatigue.</span> Execute consistently.
          </p>
        </div>
      </section>

      {/* Problem */}
      <section className="py-24 bg-card/30">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            {getContentValue(content, 'problem_title', 'The Problem')}
          </p>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-white mb-4">
            {getContentValue(content, 'problem_subtitle', "You know health is important, but you're stuck in the middle.")}
          </h2>
          <p className="text-secondary text-lg mb-10">If this sounds familiar:</p>
          <div className="space-y-4 mb-12">
            {problems.map((p) => (
              <div key={p} className="flex items-start gap-4 p-5 bg-card border border-border rounded-xl">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                <p className="text-white text-base">{p}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <h3 className="font-display font-bold text-2xl text-white">The cost isn&apos;t just physical.</h3>
            <p className="text-secondary text-lg mt-2">It&apos;s time, energy, and focus.</p>
          </div>
        </div>
      </section>

      {/* Why Different */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            {getContentValue(content, 'why_title', 'Why Blueprxnt Is Different')}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display font-bold text-4xl lg:text-5xl text-white mb-8">
                {getContentValue(content, 'why_subtitle', 'Most programs focus on one thing. Blueprxnt coordinates everything.')}
              </h2>
              <p className="text-secondary text-lg mb-5">Longevity medicine and precision health optimize markers.</p>
              <p className="text-secondary text-lg mb-8">
                Blueprxnt applies the integrated performance systems used in elite sport to help you adapt, recover, and perform in real life.
              </p>
              <div className="border-l-4 border-accent pl-6">
                <p className="text-white font-semibold text-lg italic">It&apos;s not healthcare. It&apos;s performance health.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-5 p-6 bg-card border border-border rounded-xl">
                <div className="w-12 h-12 rounded-full bg-border flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-secondary text-sm font-semibold uppercase tracking-wide mb-1">Traditional Health</p>
                  <p className="text-white">Manage risk, treat symptoms</p>
                </div>
              </div>
              <div className="flex items-center gap-5 p-6 bg-accent/5 border border-accent/30 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center flex-shrink-0">
                  <ArrowUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-accent text-sm font-semibold uppercase tracking-wide mb-1">Blueprxnt</p>
                  <p className="text-white">Build capacity, optimize performance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-card/30">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            {getContentValue(content, 'how_title', 'How It Works')}
          </p>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-white mb-16 text-center">
            {getContentValue(content, 'how_subtitle', 'The 5-step Blueprxnt methodology')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            {steps.map((step) => (
              <div key={step.num} className="bg-card border border-border rounded-2xl p-6 text-center">
                <span className="text-accent text-sm font-bold tracking-widest">{step.num}</span>
                <h3 className="font-display font-bold text-xl text-white my-3">{step.title}</h3>
                <p className="text-secondary text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/coaching"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-accent to-accent-secondary hover:opacity-90 transition-opacity"
            >
              View Coaching Options <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* The System */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            {getContentValue(content, 'system_title', 'The System')}
          </p>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-white mb-4 text-center">
            {getContentValue(content, 'system_subtitle', 'Blueprxnt Performance Health System: Health training, strength & nutrition planning, recovery protocols, mindset coaching, data tracking.')}
          </h2>
          <p className="text-secondary text-lg text-center mb-16">Not separate pieces. One connected operating system.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
            {[
              { title: 'Inner Self', desc: 'Mindset, identity, behavior', active: true },
              { title: 'Intake', desc: 'Nutrition, hydration, supplementation' },
              { title: 'Physical Activity', desc: 'Training, movement, mobility' },
              { title: 'Recovery', desc: 'Sleep, stress, nervous system control' },
              { title: 'Environment', desc: 'Routines, exposures, home, work, social' },
            ].map((node) => (
              <div
                key={node.title}
                className={`p-5 rounded-2xl border text-center ${
                  node.active
                    ? 'bg-gradient-to-br from-accent/20 to-accent-secondary/20 border-accent/40'
                    : 'bg-card border-border'
                }`}
              >
                <h4 className={`font-display font-bold text-base mb-2 ${node.active ? 'text-accent' : 'text-white'}`}>
                  {node.title}
                </h4>
                <p className="text-secondary text-xs">{node.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mb-12">
            <p className="text-secondary text-lg">Not everything at once.</p>
            <p className="font-display font-bold text-2xl text-white mt-2">The right things in the right order.</p>
          </div>
          <div className="text-center">
            <Link
              href="/system"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white border border-border hover:border-accent transition-colors"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-24 bg-card/30">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-4 text-center">
            {getContentValue(content, 'who_title', 'Who This Is For')}
          </p>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-white mb-16 text-center">
            Built for those who take<br />
            <span className="bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent">
              Performance Seriously
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-card border border-accent/30 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Check className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-display font-bold text-xl text-white">This is for you</h3>
              </div>
              <ul className="space-y-3">
                {forItems.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-accent flex-shrink-0" />
                    <span className="text-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <X className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="font-display font-bold text-xl text-white">Not for</h3>
              </div>
              <ul className="space-y-3">
                {notForItems.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span className="text-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display font-black text-5xl lg:text-6xl text-white mb-6">
            {getContentValue(content, 'cta_title', 'Ready to Build Your Performance Health System?')}
          </h2>
          <p className="text-secondary text-xl mb-10">
            {getContentValue(content, 'cta_subtitle', "Apply now. We'll review your information and reach out within 48 hours.")}
          </p>
          <Link
            href="/apply"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-xl text-lg font-bold text-white bg-gradient-to-r from-accent to-accent-secondary hover:opacity-90 transition-opacity"
          >
            Apply for Coaching <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
