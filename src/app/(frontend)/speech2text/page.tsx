'use client';
import { useRef, useState } from 'react';
import { startTranscription, useTranscription } from '@/lib/whishper';

export default function UploadPage() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [jobId, setJobId] = useState<string>();

  const { data } = useTranscription(jobId);

  async function handleSubmit() {
    const file = fileInput.current?.files?.[0];
    if (!file) return alert('pick a file');
    const id = await startTranscription(file);
    setJobId(id);
  }

  return (
    <main className="p-6 space-y-4">
      <input ref={fileInput} type="file" accept="audio/*,video/*" />
      <button onClick={handleSubmit} className="btn-primary">Transcribe</button>

      {data && (
        <pre className="bg-gray-100 p-4 rounded">
          {data.status === 'done' ? data.text : `Status: ${data.status}`}
        </pre>
      )}
    </main>
  );
}
