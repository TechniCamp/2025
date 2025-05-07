'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const [note, setNote] = useState('');
  const [extendedNote, setExtendedNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExtendNote = async () => {
    if (!note.trim()) {
      setError('Please enter a note first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ note }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to extend note');
      }

      setExtendedNote(data.extended);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>AI Note Extender</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="note">
            Your Note
          </label>
          <Textarea
            id="note"
            placeholder="Enter your note here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            className="w-full"
          />
        </div>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        {extendedNote && (
          <div>
            <h3 className="text-sm font-medium mb-1">AI Extended Content:</h3>
            <div className="p-4 bg-secondary rounded-md">
              {/* Use dangerouslySetInnerHTML to render the HTML content */}
              <div dangerouslySetInnerHTML={{ __html: extendedNote }} />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleExtendNote} 
          disabled={loading || !note.trim()}
        >
          {loading ? 'Extending...' : 'Extend with AI'}
        </Button>
      </CardFooter>
    </Card>
  );
}