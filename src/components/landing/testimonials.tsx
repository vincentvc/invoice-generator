const TESTIMONIALS = [
  {
    quote: "The best invoice generator I've used. The live preview is a game-changer.",
    author: 'Sarah K.',
    role: 'Freelance Designer',
  },
  {
    quote: 'I switched from invoice-generator.com and never looked back. So much better.',
    author: 'Michael R.',
    role: 'Web Developer',
  },
  {
    quote: "Finally an invoice tool that's actually beautiful. My clients love the PDFs.",
    author: 'Emily T.',
    role: 'Marketing Consultant',
  },
];

export function Testimonials() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Loved by freelancers and businesses
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of professionals who trust InvoiceForge.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.author}
              className="rounded-xl border bg-card p-6"
            >
              <p className="text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-4 border-t pt-4">
                <p className="font-heading text-sm font-semibold text-foreground">
                  {t.author}
                </p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
