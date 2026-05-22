"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CriarMensagem() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [nomePresenteado, setNomePresenteado] = useState("");
  const [texto, setTexto] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [carregando, setCarregando] = useState(false);

  const formatarTelefone = (value: string) => {
    let telefoneFormatado = value.replace(/\D/g, "");

    telefoneFormatado = telefoneFormatado.replace(/^(\d{2})(\d)/g, "($1) $2");
    telefoneFormatado = telefoneFormatado.replace(/(\d{5})(\d)/, "$1-$2");

    return telefoneFormatado;
  };

  const gerarSlug = () => crypto.randomUUID();

  const handleSubmit = async () => {
    if (!nome || !sobrenome || !telefone || !nomePresenteado) {
      alert("Preencha nome, sobrenome, telefone e nome do presenteado.");
      return;
    }

    if (!texto && !arquivo) {
      alert("Escreva uma mensagem ou envie um arquivo.");
      return;
    }

    setCarregando(true);

    try {
      const slug = gerarSlug();
      let arquivoUrl = "";
      let arquivoTipo = "";

      if (arquivo) {
        const extensao = arquivo.name.split(".").pop() || "file";
        const nomeArquivo = `${Date.now()}.${extensao}`;
        const caminhoArquivo = `${slug}/${nomeArquivo}`;

        const { error: uploadError } = await supabase.storage
          .from("messages")
          .upload(caminhoArquivo, arquivo, {
            contentType: arquivo.type,
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("messages")
          .getPublicUrl(caminhoArquivo);

        arquivoUrl = data.publicUrl;
        arquivoTipo = arquivo.type;
      }

      const { error } = await supabase.from("messages").insert({
        slug,
        nome,
        sobrenome,
        telefone,
        nome_presenteado: nomePresenteado,
        texto,
        arquivo_url: arquivoUrl,
        arquivo_tipo: arquivoTipo,
      });

      if (error) throw error;

      router.push(`/confirmar/${slug}`);
    } catch (error) {
      console.error(error);
      alert("Erro ao criar mensagem. Verifique o Supabase.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFF7F3] px-6 py-10 text-[#3A1F1A]">
      <section className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-sm md:p-10">
        <h1 className="text-3xl font-bold">Criar mensagem especial</h1>

        <p className="mt-3 text-[#6B4A43]">
          Preencha os dados e envie uma mensagem em texto, foto, áudio ou vídeo
          para acompanhar o presente.
        </p>

        <form className="mt-8 space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold">Nome</label>
              <input
                type="text"
                placeholder="Ex: Ana"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-[#F0D4CC] px-4 py-3 outline-none focus:border-[#E85D75]"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Sobrenome</label>
              <input
                type="text"
                placeholder="Ex: Souza"
                value={sobrenome}
                onChange={(e) => setSobrenome(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-[#F0D4CC] px-4 py-3 outline-none focus:border-[#E85D75]"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">Telefone</label>
            <input
              type="tel"
              placeholder="(__) _____-____"
              maxLength={15}
              value={telefone}
              onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
              className="mt-2 w-full rounded-2xl border border-[#F0D4CC] px-4 py-3 outline-none focus:border-[#E85D75]"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Nome do presenteado</label>
            <input
              type="text"
              placeholder="Ex: Maria"
              value={nomePresenteado}
              onChange={(e) => setNomePresenteado(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-[#F0D4CC] px-4 py-3 outline-none focus:border-[#E85D75]"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Mensagem em texto</label>
            <textarea
              rows={5}
              placeholder="Escreva sua mensagem especial..."
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              className="mt-2 w-full resize-none rounded-2xl border border-[#F0D4CC] px-4 py-3 outline-none focus:border-[#E85D75]"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">
              Foto, áudio ou vídeo
            </label>

            <label
              htmlFor="fileUpload"
              className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#E85D75] bg-[#FFF7F3] px-6 py-10 text-center transition hover:bg-[#ffecef]"
            >
              <div className="rounded-full bg-[#E85D75] px-5 py-3 text-xl font-bold text-white shadow-md">
                +
              </div>

              <p className="mt-4 text-lg font-semibold text-[#3A1F1A]">
                {arquivo ? arquivo.name : "Clique para enviar um arquivo"}
              </p>

              <p className="mt-1 text-sm text-[#6B4A43]">
                Foto, áudio ou vídeo
              </p>

              <input
                id="fileUpload"
                type="file"
                accept="image/*,audio/*,video/*"
                className="hidden"
                onChange={(e) => setArquivo(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={carregando}
            className="w-full rounded-full bg-[#E85D75] px-8 py-4 font-semibold text-white shadow-lg transition hover:bg-[#d94d66] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {carregando ? "Criando mensagem..." : "Finalizar e gerar QR Code"}
          </button>
        </form>
      </section>
    </main>
  );
}