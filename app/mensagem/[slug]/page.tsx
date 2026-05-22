import { supabase } from "@/lib/supabase";
import Image from "next/image";
import logo from "@/app/logo.png";
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function MensagemPage({ params }: PageProps) {
  const { slug } = await params;

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFF7F3] px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-sm sm:p-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF0F3] text-3xl">
            💌
          </div>

          <h1 className="text-2xl font-bold text-[#3A1F1A] sm:text-3xl">
            Mensagem não encontrada
          </h1>

          <p className="mt-3 text-sm text-[#6B4A43] sm:text-base">
            Esse link pode ter expirado ou não existe.
          </p>
        </div>
      </main>
    );
  }

  const isImage = data.arquivo_tipo?.startsWith("image/");
  const isVideo = data.arquivo_tipo?.startsWith("video/");
  const isAudio = data.arquivo_tipo?.startsWith("audio/");
  const hasMedia = data.arquivo_url && (isImage || isVideo || isAudio);

  return (
    <main className="min-h-screen bg-[#FFF7F3] px-4 py-6 text-[#3A1F1A] sm:px-6 sm:py-10">
      <section className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] bg-white shadow-sm">
        <div className="bg-gradient-to-br from-[#FFECEF] via-white to-[#FFF7F3] px-5 py-8 text-center sm:px-10 sm:py-10">
          <div className="mx-auto mb-5 flex flex-col items-center">
            <div className="relative h-24 w-24 overflow-hidden rounded-full bg-white p-2 shadow-md sm:h-28 sm:w-28">
              <Image
                src={logo}
                alt="Logo Fatias Do Coração"
                fill
                priority
                className="object-contain"
              />
            </div>

            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#E85D75]">
              Fatias Do Coração
            </p>
          </div>

          <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-5xl">
            Você recebeu um carinho especial
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#6B4A43] sm:text-base">
            {data.nome_presenteado
              ? `${data.nome_presenteado}, alguém preparou essa mensagem com muito carinho para acompanhar o seu presente.`
              : "Alguém preparou essa mensagem com muito carinho para acompanhar o seu presente."}
          </p>
        </div>

        <div className="space-y-6 px-5 py-6 sm:px-10 sm:py-8">
          {data.texto && (
            <div className="rounded-3xl bg-[#FFF7F3] p-5 sm:p-6">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xl">💬</span>
                <h2 className="font-bold">Mensagem</h2>
              </div>

              <p className="whitespace-pre-line text-base leading-relaxed text-[#3A1F1A] sm:text-lg">
                {data.texto}
              </p>
            </div>
          )}

          {hasMedia && (
            <div className="rounded-3xl border border-[#F0D4CC] bg-white p-3 shadow-sm sm:p-4">
              <div className="mb-3 flex items-center gap-2 px-1">
                <span className="text-xl">
                  {isImage ? "📷" : isVideo ? "🎥" : "🎧"}
                </span>

                <h2 className="font-bold">
                  {isImage
                    ? "Foto enviada"
                    : isVideo
                      ? "Vídeo enviado"
                      : "Áudio enviado"}
                </h2>
              </div>

              {isImage && (
                <div className="overflow-hidden rounded-3xl bg-[#FFF7F3]">
                  <Image
                    src={data.arquivo_url}
                    alt="Imagem enviada"
                    width={1200}
                    height={1200}
                    className="h-auto max-h-[75vh] w-full object-contain"
                  />
                </div>
              )}

              {isVideo && (
                <div className="overflow-hidden rounded-3xl bg-black">
                  <video
                    controls
                    playsInline
                    preload="metadata"
                    className="max-h-[75vh] w-full bg-black"
                  >
                    <source src={data.arquivo_url} type={data.arquivo_tipo} />
                    Seu navegador não suporta vídeo.
                  </video>
                </div>
              )}

              {isAudio && (
                <div className="rounded-3xl bg-[#FFF7F3] p-5 text-center sm:p-6">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#E85D75] text-3xl text-white shadow-md">
                    🎧
                  </div>

                  <p className="mb-4 text-sm font-medium text-[#6B4A43]">
                    Aperte o play para ouvir a mensagem de áudio.
                  </p>

                  <audio controls preload="metadata" className="w-full">
                    <source src={data.arquivo_url} type={data.arquivo_tipo} />
                    Seu navegador não suporta áudio.
                  </audio>
                </div>
              )}
            </div>
          )}

          {!data.texto && !hasMedia && (
            <div className="rounded-3xl bg-[#FFF7F3] p-6 text-center">
              <p className="text-[#6B4A43]">
                Essa mensagem não possui texto ou mídia disponível.
              </p>
            </div>
          )}

          <div className="border-t border-[#F0D4CC] pt-6 text-center">
            <p className="text-sm leading-relaxed text-[#6B4A43]">
              Criado com carinho por{" "}
              <span className="font-bold text-[#E85D75]">
                Fatias Do Coração
              </span>{" "}
              ❤️
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}