"use client";

import QRCode from "qrcode";
import Link from "next/link";
import { use, useEffect, useState } from "react";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ConfirmarPage({ params }: PageProps) {
  const { slug } = use(params);

  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [linkMensagem, setLinkMensagem] = useState("");

  useEffect(() => {
    async function gerarQRCode() {
      const url = `${window.location.origin}/mensagem/${slug}`;
      setLinkMensagem(url);

      const qr = await QRCode.toDataURL(url, {
        width: 400,
        margin: 2,
      });

      setQrCodeUrl(qr);
    }

    gerarQRCode();
  }, [slug]);

  const compartilhar = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Mensagem especial",
        text: "Acesse sua mensagem especial ❤️",
        url: linkMensagem,
      });
    } else {
      await navigator.clipboard.writeText(linkMensagem);
      alert("Link copiado!");
    }
  };

  return (
    <main className="min-h-screen bg-[#FFF7F3] px-4 py-6 text-[#3A1F1A] sm:px-6 md:py-10">
      <section className="mx-auto max-w-4xl rounded-3xl bg-white p-5 shadow-sm sm:p-6 md:p-10">
        <h1 className="text-center text-2xl font-bold leading-tight sm:text-3xl">
          Mensagem criada com sucesso ❤️
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-[#6B4A43] sm:text-base">
          Agora você pode baixar o QR Code, compartilhar o link ou visualizar a
          página do presente.
          
          *Lembre-se de fazer o download do QR Code e nos enviar via Whatsapp.
        </p>

        <div className="mt-8 grid gap-5 md:mt-10 md:grid-cols-2 md:gap-8">
          <div className="rounded-3xl bg-[#FFF7F3] p-5 text-center sm:p-6">
            <h2 className="text-lg font-bold sm:text-xl">
              QR Code do presente
            </h2>

            {qrCodeUrl && (
              <img
                src={qrCodeUrl}
                alt="QR Code da mensagem"
                className="mx-auto mt-5 w-full max-w-[260px] rounded-2xl bg-white p-3 sm:max-w-xs sm:p-4"
              />
            )}

            <a
              href={qrCodeUrl}
              download={`qrcode-${slug}.png`}
              className="mt-5 block w-full rounded-full bg-[#E85D75] px-6 py-3 text-center font-semibold text-white shadow-md transition hover:bg-[#d94d66] sm:inline-block sm:w-auto"
            >
              Baixar QR Code
            </a>
          </div>

          <div className="flex flex-col justify-center rounded-3xl border border-[#F0D4CC] p-5 sm:p-6">
            <h2 className="text-lg font-bold sm:text-xl">Opções</h2>

            <div className="mt-3 rounded-2xl bg-[#FFF7F3] p-3">
              <p className="break-all text-xs leading-relaxed text-[#6B4A43] sm:text-sm">
                {linkMensagem}
              </p>
            </div>

            <button
              type="button"
              onClick={compartilhar}
              className="mt-5 w-full rounded-full bg-[#E85D75] px-6 py-3 font-semibold text-white shadow-md transition hover:bg-[#d94d66]"
            >
              Compartilhar link
            </button>

            <Link
              href={`/mensagem/${slug}`}
              className="mt-3 w-full rounded-full border border-[#E85D75] px-6 py-3 text-center font-semibold text-[#E85D75] transition hover:bg-[#FFF7F3]"
            >
              Visualizar página
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}