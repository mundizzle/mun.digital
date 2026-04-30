export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 font-sans text-zinc-900 dark:bg-black dark:text-zinc-100">
      <main className="flex w-full max-w-xl flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          mundigital
        </h1>
        <p className="text-base text-zinc-600 dark:text-zinc-400">
          Site purpose TBD — initial deployment pipeline active.
        </p>
      </main>
      <footer className="mt-16 text-sm text-zinc-500 dark:text-zinc-500">
        <a
          href="https://github.com/mundizzle/mundigital"
          className="underline-offset-4 hover:underline"
          rel="noopener noreferrer"
        >
          github.com/mundizzle/mundigital
        </a>
      </footer>
    </div>
  );
}
