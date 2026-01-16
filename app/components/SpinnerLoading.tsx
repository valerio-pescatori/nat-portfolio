export default function SpinnerLoading() {
  return (
    <div className="flex items-center justify-center min-h-dvh bg-radial-[circle_at_0_0] from-primary to-dark-secondary">
      <div className="w-16 h-16 border-4 border-foreground border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
