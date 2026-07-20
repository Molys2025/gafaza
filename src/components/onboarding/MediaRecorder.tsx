import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, Square, RotateCcw, Play, Pause } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MediaRecorderComponentProps {
  /** Callback fired once the audio clip is ready. mediaType is always 'audio'. */
  onMediaRecorded: (mediaBlob: Blob, mediaType: 'audio') => void;
  maxDuration?: number; // in seconds
}

const MediaRecorderComponent = ({ onMediaRecorded, maxDuration = 30 }: MediaRecorderComponentProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedMediaUrl, setRecordedMediaUrl] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(maxDuration);
  const [isPlaying, setIsPlaying] = useState(false);
  const [starting, setStarting] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { toast } = useToast();

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    clearTimer();
  }, []);

  const startRecording = useCallback(async () => {
    if (starting || isRecording) return;
    setStarting(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = mediaStream;

      const mediaRecorder = new (window as unknown as { MediaRecorder: typeof MediaRecorder }).MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedMediaUrl(url);
        onMediaRecorded(blob, 'audio');
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };

      mediaRecorder.start();
      setIsRecording(true);
      setTimeRemaining(maxDuration);

      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: 'Micro inaccessible',
        description: "Impossible d'accéder au microphone. Vérifiez les autorisations.",
        variant: 'destructive',
      });
    } finally {
      setStarting(false);
    }
  }, [isRecording, maxDuration, onMediaRecorded, starting, stopRecording, toast]);

  const resetRecording = useCallback(() => {
    if (recordedMediaUrl) {
      URL.revokeObjectURL(recordedMediaUrl);
      setRecordedMediaUrl(null);
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    chunksRef.current = [];
    setIsPlaying(false);
    setTimeRemaining(maxDuration);
  }, [recordedMediaUrl, maxDuration]);

  // Auto-start recording as soon as the component mounts – no mode selection.
  useEffect(() => {
    startRecording();
    return () => {
      clearTimer();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-olive-dark">
          <Mic className="h-5 w-5" />
          Enregistrement audio
        </CardTitle>
        <CardDescription>
          Présentez-vous en {maxDuration} secondes. Parlez librement (français, arabe ou derja).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Audio Visual */}
        <div className="relative bg-sand-light rounded-lg overflow-hidden py-10">
          <div className="flex flex-col items-center justify-center gap-4">
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                isRecording ? 'bg-red-500 animate-pulse' : 'bg-olive'
              }`}
            >
              <Mic className="h-12 w-12 text-white" />
            </div>
            {isRecording && (
              <div className="text-lg font-semibold text-red-600">🔴 {timeRemaining}s</div>
            )}
            {!isRecording && !recordedMediaUrl && (
              <p className="text-sm text-muted-foreground">Préparation du micro…</p>
            )}
            {recordedMediaUrl && (
              <>
                <audio
                  ref={audioRef}
                  src={recordedMediaUrl}
                  onEnded={() => setIsPlaying(false)}
                  className="hidden"
                />
                <Button onClick={togglePlayback} variant="outline" size="sm">
                  {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isPlaying ? 'Pause' : 'Écouter'}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {isRecording && (
            <Button onClick={stopRecording} variant="outline" size="lg">
              <Square className="h-4 w-4 mr-2" />
              Arrêter
            </Button>
          )}
          {recordedMediaUrl && !isRecording && (
            <Button
              onClick={() => {
                resetRecording();
                startRecording();
              }}
              variant="outline"
              size="lg"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Recommencer
            </Button>
          )}
        </div>

        {/* Instructions */}
        <div className="text-sm text-muted-foreground space-y-2">
          <p className="font-semibold text-olive-dark">Conseils :</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Dites votre nom et votre région</li>
            <li>Décrivez ce que vous cherchez ou proposez</li>
            <li>Mentionnez votre expérience et vos tarifs</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaRecorderComponent;
