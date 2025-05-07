import useSWR from 'swr';

export async function startTranscription(file: File, model = 'small') {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('model', model);

  const r = await fetch(
    `${process.env.NEXT_PUBLIC_WHISHPER_API}/api/transcriptions`,
    { method: 'POST', body: fd }
  );

  if (!r.ok) throw new Error(`Upload failed: ${r.statusText}`);
  return (await r.json()).id as string;
}

export async function getTranscription(id: string) {
  const r = await fetch(
    `${process.env.NEXT_PUBLIC_WHISHPER_API}/api/transcriptions/${id}`
  );

  if (!r.ok) throw new Error(`Could not fetch job ${id}`);
  return r.json() as Promise<{
    status: 'queued' | 'processing' | 'done' | 'error';
    text?: string;
    download_urls?: Record<'txt' | 'srt' | 'vtt' | 'json', string>;
  }>;
}

export function useTranscription(id?: string) {
  return useSWR(
    () => (id ? `/api/transcriptions/${id}` : null),
    () => getTranscription(id!),
    { refreshInterval: 2000 }
  );
}
