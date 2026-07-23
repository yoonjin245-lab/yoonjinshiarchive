export default function ContactPage() {
  return (
    <section className="max-w-[540px] pt-[220px] text-sm leading-snug">
      <h1 className="font-normal">Yoonjin Shi</h1>
      <div>
        <p>Architecture Student</p>
        <p>Sungkyunkwan University</p>
      </div>
      <div className="mt-8 grid gap-6">
        <div className="grid gap-1">
          <p>Email</p>
          <a href="mailto:yoonjin245@gmail.com" className="underline underline-offset-4">
            yoonjin245@gmail.com
          </a>
        </div>
        <div className="grid gap-1">
          <p>Instagram</p>
          <a href="https://www.instagram.com/tldbswls" target="_blank" rel="noreferrer" className="underline underline-offset-4">
            @tldbswls
          </a>
        </div>
      </div>
    </section>
  );
}