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
    <main className="min-h-screen bg-[#FFF7F3] px-6 py-10 text-[#3A1F1A]">
      <section className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-sm md:p-10">
        <h1 className="text-center text-3xl font-bold">
          Mensagem criada com sucesso ❤️
        </h1>

        <p className="mt-3 text-center text-[#6B4A43]">
          Agora você pode baixar o QR Code, compartilhar o link ou visualizar a
          página do presente.
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl bg-[#FFF7F3] p-6 text-center">
            <h2 className="text-xl font-bold">QR Code do presente</h2>

            {qrCodeUrl && (
              <img
                src={qrCodeUrl}
                alt="QR Code da mensagem"
                className="mx-auto mt-6 w-full max-w-xs rounded-2xl bg-white p-4"
              />
            )}

            <a
              href={qrCodeUrl}
              download={`qrcode-${slug}.png`}
              className="mt-6 inline-block rounded-full bg-[#E85D75] px-6 py-3 font-semibold text-white shadow-md transition hover:bg-[#d94d66]"
            >
              Baixar QR Code
            </a>
          </div>

          <div className="flex flex-col justify-center rounded-3xl border border-[#F0D4CC] p-6">
            <h2 className="text-xl font-bold">Opções</h2>

            <p className="mt-3 break-all text-sm text-[#6B4A43]">
              {linkMensagem}
            </p>

            <button
              type="button"
              onClick={compartilhar}
              className="mt-6 rounded-full bg-[#E85D75] px-6 py-3 font-semibold text-white shadow-md transition hover:bg-[#d94d66]"
            >
              Compartilhar link
            </button>

            <Link
              href={`/mensagem/${slug}`}
              className="mt-4 rounded-full border border-[#E85D75] px-6 py-3 text-center font-semibold text-[#E85D75] transition hover:bg-[#FFF7F3]"
            >
              Visualizar página
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}