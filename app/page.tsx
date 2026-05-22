import Image from "next/image";
import { Gift, Heart, QrCode } from "lucide-react";
import logo from "./logo.png";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFF7F3] text-[#3A1F1A]">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-5 py-10 text-center sm:px-6 md:py-16">
        <div className="mb-6 overflow-hidden rounded-full shadow-lg md:mb-8">
          <Image
            src={logo}
            alt="Logo Fatias Do Coração"
            width={190}
            height={190}
            priority
            className="h-36 w-36 object-cover sm:h-40 sm:w-40 md:h-48 md:w-48"
          />
        </div>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Fatias Do Coração
        </h1>

        <p className="mt-5 max-w-xl text-base leading-relaxed text-[#6B4A43] sm:text-lg md:mt-6 md:max-w-2xl md:text-xl">
          Transforme seu presente em uma lembrança inesquecível com mensagens em
          texto, foto, áudio ou vídeo acessadas por QR Code.
        </p>

        <div className="mt-8 w-full sm:w-auto md:mt-10">
          <a
            href="/criar"
            className="block w-full rounded-full bg-[#E85D75] px-8 py-4 font-semibold text-white shadow-lg transition hover:bg-[#d94d66] sm:inline-block sm:w-auto"
          >
            Criar mensagem
          </a>
        </div>

        <div className="mt-12 grid w-full gap-4 sm:gap-5 md:mt-16 md:grid-cols-3 md:gap-6">
          <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
            <Gift className="mx-auto mb-4 text-[#E85D75]" size={32} />
            <h2 className="font-bold">1. Compre o presente</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6B4A43]">
              O cliente escolhe os doces e recebe um link para criar a surpresa.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
            <Heart className="mx-auto mb-4 text-[#E85D75]" size={32} />
            <h2 className="font-bold">2. Grave a mensagem</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6B4A43]">
              Envie texto, foto, áudio ou vídeo para tornar o presente ainda
              mais especial.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
            <QrCode className="mx-auto mb-4 text-[#E85D75]" size={32} />
            <h2 className="font-bold">3. Compartilhe o QR Code</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6B4A43]">
              O QR Code abre uma página exclusiva com a mensagem personalizada.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}