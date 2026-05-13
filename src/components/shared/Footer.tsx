export default function Footer() {
  return (
    <footer className="border-t bg-muted/40 mt-auto">
      <div className="container mx-auto px-4 py-6 space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <span className="inline-flex items-center justify-center rounded bg-destructive text-destructive-foreground text-xs font-bold px-1.5 py-0.5">
            +18
          </span>
          <span>Jogue com responsabilidade. Apostas são exclusivas para maiores de 18 anos.</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Este site contém links de afiliados. As odds exibidas podem variar. Apostar envolve risco de perda financeira.
          O OddsBR não opera apostas e não recebe dinheiro dos usuários para apostas.
        </p>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} OddsBR. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
