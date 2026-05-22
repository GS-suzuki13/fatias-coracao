"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CriarMensagem() {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [nomePresenteado, setNomePresenteado] = useState("");
  const [texto, setTexto] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [modalAberta, setModalAberta] = useState(false);
  const [gravando, setGravando] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const formatarTelefone = (value: string) => {
    let telefoneFormatado = value.replace(/\D/g, "");
    telefoneFormatado = telefoneFormatado.replace(/^(\d{2})(\d)/g, "($1) $2");
    telefoneFormatado = telefoneFormatado.replace(/(\d{5})(\d)/, "$1-$2");
    return telefoneFormatado;
  };

  const gerarSlug = () => crypto.randomUUID();

  const selecionarArquivo = (file: File | null) => {
    if (!file) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setArquivo(file);
    setPreviewUrl(URL.createObjectURL(file));
    setModalAberta(false);
  };

  const iniciarGravacao = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => chunks.push(event.data);

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        const audioFile = new File([audioBlob], `audio-${Date.now()}.webm`, {
          type: "audio/webm",
        });

        selecionarArquivo(audioFile);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setGravando(true);
    } catch {
      alert("Não foi possível acessar o microfone.");
    }
  };

  const pararGravacao = () => {
    mediaRecorderRef.current?.stop();
    setGravando(false);
  };

  const removerArquivo = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setArquivo(null);
    setPreviewUrl("");
  };

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
    <main className="min-h-screen bg-[#FFF7F3] px-4 py-6 text-[#3A1F1A] sm:px-6 sm:py-10">
      <section className="mx-auto max-w-3xl rounded-3xl bg-white p-5 shadow-sm sm:p-8 md:p-10">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Criar mensagem especial
        </h1>

        <p className="mt-3 text-sm text-[#6B4A43] sm:text-base">
          Preencha os dados e envie uma mensagem em texto, foto, áudio ou vídeo
          para acompanhar o presente.
        </p>

        <form className="mt-7 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
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
            <label className="text-sm font-semibold">Foto, áudio ou vídeo</label>

            {!arquivo ? (
              <button
                type="button"
                onClick={() => setModalAberta(true)}
                className="mt-3 flex w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#E85D75] bg-[#FFF7F3] px-4 py-8 text-center transition hover:bg-[#ffecef] sm:py-10"
              >
                <div className="rounded-full bg-[#E85D75] px-5 py-3 text-xl font-bold text-white shadow-md">
                  +
                </div>

                <p className="mt-4 text-base font-semibold sm:text-lg">
                  Selecionar mídia
                </p>

                <p className="mt-1 text-sm text-[#6B4A43]">
                  Foto, vídeo ou áudio gravado
                </p>
              </button>
            ) : (
              <div className="mt-3 rounded-3xl border border-[#F0D4CC] bg-[#FFF7F3] p-4">
                <div className="overflow-hidden rounded-2xl bg-white">
                  {arquivo.type.startsWith("image/") && (
                    <img
                      src={previewUrl}
                      alt="Prévia do arquivo"
                      className="h-56 w-full object-cover"
                    />
                  )}

                  {arquivo.type.startsWith("video/") && (
                    <video
                      src={previewUrl}
                      controls
                      className="h-56 w-full object-cover"
                    />
                  )}

                  {arquivo.type.startsWith("audio/") && (
                    <div className="p-4">
                      <p className="mb-3 text-sm font-semibold">
                        Áudio selecionado
                      </p>
                      <audio src={previewUrl} controls className="w-full" />
                    </div>
                  )}
                </div>

                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="truncate text-sm font-medium">{arquivo.name}</p>

                  <button
                    type="button"
                    onClick={removerArquivo}
                    className="rounded-full border border-[#E85D75] px-4 py-2 text-sm font-semibold text-[#E85D75]"
                  >
                    Remover
                  </button>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,audio/*,video/*"
              className="hidden"
              onChange={(e) => selecionarArquivo(e.target.files?.[0] || null)}
            />
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

      {modalAberta && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 sm:items-center">
          <div className="w-full max-w-md rounded-t-3xl bg-white p-5 shadow-xl sm:rounded-3xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">Selecionar mídia</h2>

              <button
                type="button"
                onClick={() => setModalAberta(false)}
                className="rounded-full bg-[#FFF7F3] px-3 py-1 text-lg font-bold"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-2xl bg-[#FFF7F3] px-5 py-4 text-left font-semibold text-[#3A1F1A]"
              >
                Enviar foto, vídeo ou áudio
              </button>

              {!gravando ? (
                <button
                  type="button"
                  onClick={iniciarGravacao}
                  className="w-full rounded-2xl bg-[#E85D75] px-5 py-4 font-semibold text-white"
                >
                  Gravar áudio
                </button>
              ) : (
                <button
                  type="button"
                  onClick={pararGravacao}
                  className="w-full rounded-2xl bg-[#3A1F1A] px-5 py-4 font-semibold text-white"
                >
                  Parar gravação
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}