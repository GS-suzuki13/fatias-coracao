import { Heart, Gift, QrCode } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFF7F3] text-[#3A1F1A]">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#E85D75] text-white shadow-lg">
          <Heart size={32} fill="white" />
        </div>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
          Fatias Do Coração
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-[#6B4A43] md:text-xl">
          Transforme seu presente em uma lembrança inesquecível com mensagens
          em texto, foto, áudio ou vídeo acessadas por QR Code.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="/criar"
            className="rounded-full bg-[#E85D75] px-8 py-4 font-semibold text-white shadow-lg transition hover:bg-[#d94d66]"
          >
            Criar mensagem
          </a>

          <a
            href="#como-funciona"
            className="rounded-full border border-[#E85D75] px-8 py-4 font-semibold text-[#E85D75] transition hover:bg-white"
          >
            Como funciona
          </a>
        </div>

        <div
          id="como-funciona"
          className="mt-16 grid w-full gap-6 md:grid-cols-3"
        >
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <Gift className="mx-auto mb-4 text-[#E85D75]" size={32} />
            <h2 className="font-bold">1. Compre o presente</h2>
            <p className="mt-2 text-sm text-[#6B4A43]">
              O cliente escolhe os doces e recebe um link para criar a surpresa.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <Heart className="mx-auto mb-4 text-[#E85D75]" size={32} />
            <h2 className="font-bold">2. Grave a mensagem</h2>
            <p className="mt-2 text-sm text-[#6B4A43]">
              Ele envia texto, foto, áudio ou vídeo para a pessoa presenteada.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <QrCode className="mx-auto mb-4 text-[#E85D75]" size={32} />
            <h2 className="font-bold">3. Gere o QR Code</h2>
            <p className="mt-2 text-sm text-[#6B4A43]">
              O QR Code vai no adesivo e abre a mensagem especial.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}