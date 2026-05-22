import { supabase } from "@/lib/supabase";
import Image from "next/image";

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
      <main className="flex min-h-screen items-center justify-center bg-[#FFF7F3] px-6">
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-[#3A1F1A]">
            Mensagem não encontrada
          </h1>

          <p className="mt-3 text-[#6B4A43]">
            Esse link pode ter expirado ou não existe.
          </p>
        </div>
      </main>
    );
  }

  const isImage = data.arquivo_tipo?.startsWith("image/");
  const isVideo = data.arquivo_tipo?.startsWith("video/");
  const isAudio = data.arquivo_tipo?.startsWith("audio/");

  return (
    <main className="min-h-screen bg-[#FFF7F3] px-6 py-10 text-[#3A1F1A]">
      <section className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-sm md:p-10">
        <h1 className="text-center text-4xl font-bold">Fatias Do Coração</h1>

        <p className="mt-4 text-center text-[#6B4A43]">
          {data.nome_presenteado
            ? `${data.nome_presenteado}, você recebeu uma mensagem especial ❤️`
            : "Você recebeu uma mensagem especial ❤️"}
        </p>

        {data.texto && (
          <div className="mt-8 rounded-3xl bg-[#FFF7F3] p-6">
            <p className="whitespace-pre-line text-lg leading-relaxed">
              {data.texto}
            </p>
          </div>
        )}

        {isImage && (
          <div className="mt-8 overflow-hidden rounded-3xl">
            <Image
              src={data.arquivo_url}
              alt="Imagem enviada"
              width={1000}
              height={1000}
              className="h-auto w-full object-cover"
            />
          </div>
        )}

        {isVideo && (
          <video controls className="mt-8 w-full rounded-3xl">
            <source src={data.arquivo_url} />
          </video>
        )}

        {isAudio && (
          <div className="mt-8">
            <audio controls className="w-full">
              <source src={data.arquivo_url} />
            </audio>
          </div>
        )}

        <div className="mt-10 border-t border-[#F0D4CC] pt-6 text-center">
          <p className="text-sm text-[#6B4A43]">
            Criado com carinho por Fatias Do Coração ❤️
          </p>
        </div>
      </section>
    </main>
  );
}