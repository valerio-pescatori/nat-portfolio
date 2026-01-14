export default function Loading() {
  return (
    <section id="portfolio" className="h-screen">
      <h1 className="sr-only">Nat Tattoo Portfolio</h1>

      <div className="lg:hidden">
        <div className="bg-detail animate-pulse rounded-lg size-64 absolute top-1/2 left-1/2 -translate-1/2" />
        <div className="bg-detail animate-pulse rounded-lg size-64 absolute -top-1/24 -left-1/8" />
        <div className="bg-detail animate-pulse rounded-lg size-64 absolute -bottom-1/24 -left-1/8" />
      </div>
      <div className="hidden lg:grid grid-cols-2 gap-4 py-6 px-4 container mx-auto mt-12 h-full">
        <div className="bg-detail animate-pulse rounded-lg size-full" />
        <div className="bg-detail animate-pulse rounded-lg size-full" />
      </div>
    </section>
  );
}
