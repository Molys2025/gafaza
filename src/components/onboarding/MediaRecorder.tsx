import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Mic, Square, RotateCcw, Play, Pause } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MediaRecorderComponentProps {
  onMediaRecorded: (mediaBlob: Blob, mediaType: 'video' | 'audio') => void;
  maxDuration?: number; // in seconds
}

const MediaRecorderComponent = ({ onMediaRecorded, maxDuration = 30 }: MediaRecorderComponentProps) => {
  const [recordingType, setRecordingType] = useState<'video' | 'audio' | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedMediaUrl, setRecordedMediaUrl] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(maxDuration);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();

  const startRecording = useCallback(async (type: 'video' | 'audio') => {
    try {
      const constraints = type === 'video' 
        ? { video: { width: 1280, height: 720 }, audio: true }
        : { audio: true };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setRecordingType(type);
      
      if (type === 'video' && videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      const mediaRecorder = new (window as any).MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = type === 'video' ? 'video/webm' : 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setRecordedMediaUrl(url);
        onMediaRecorded(blob, type);
        
        mediaStream.getTracks().forEach(track => track.stop());
        setStream(null);
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
      console.error('Error accessing camera/microphone:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'accéder à la caméra/microphone. Vérifiez les autorisations.',
        variant: 'destructive',
      });
    }
  }, [maxDuration, onMediaRecorded, toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRecording]);

  const resetRecording = useCallback(() => {
    if (recordedMediaUrl) {
      URL.revokeObjectURL(recordedMediaUrl);
      setRecordedMediaUrl(null);
    }
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    setRecordingType(null);
    setTimeRemaining(maxDuration);
    setIsPlaying(false);
    chunksRef.current = [];
  }, [recordedMediaUrl, stream, maxDuration]);

  const togglePlayback = () => {
    if (recordingType === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else if (recordingType === 'audio' && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!recordingType) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Choisissez votre mode d'enregistrement</CardTitle>
          <CardDescription>
            Sélectionnez si vous préférez enregistrer une vidéo ou seulement un audio pour nous parler de vos besoins.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => startRecording('video')}
              className="h-32 flex flex-col items-center justify-center space-y-2"
            >
              <Video className="h-8 w-8" />
              <span>Enregistrer une vidéo</span>
              <span className="text-xs opacity-75">Recommandé pour une présentation complète</span>
            </Button>
            
            <Button
              onClick={() => startRecording('audio')}
              variant="outline"
              className="h-32 flex flex-col items-center justify-center space-y-2"
            >
              <Mic className="h-8 w-8" />
              <span>Enregistrer un audio</span>
              <span className="text-xs opacity-75">Plus simple et plus rapide</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {recordingType === 'video' ? <Video className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          Enregistrement {recordingType === 'video' ? 'vidéo' : 'audio'}
        </CardTitle>
        <CardDescription>
          Présentez-vous en {maxDuration} secondes. Parlez de ce que vous recherchez ou proposez.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Media Preview */}
        <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video">
          {recordingType === 'video' && (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted={isRecording}
              controls={!isRecording && recordedMediaUrl !== null}
              src={recordedMediaUrl || undefined}
            />
          )}
          
          {recordingType === 'audio' && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <Mic className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                {recordedMediaUrl && (
                  <audio
                    ref={audioRef}
                    src={recordedMediaUrl}
                    onEnded={() => setIsPlaying(false)}
                    className="hidden"
                  />
                )}
                {recordedMediaUrl && (
                  <Button onClick={togglePlayback} variant="outline">
                    {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isPlaying ? 'Pause' : 'Écouter'}
                  </Button>
                )}
              </div>
            </div>
          )}
          
          {/* Recording Timer */}
          {isRecording && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              🔴 {timeRemaining}s
            </div>
          )}
          
          {/* Placeholder when no media */}
          {!isRecording && !recordedMediaUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-500">
                {recordingType === 'video' ? (
                  <>
                    <Video className="h-12 w-12 mx-auto mb-2" />
                    <p>Cliquez pour commencer l'enregistrement vidéo</p>
                  </>
                ) : (
                  <>
                    <Mic className="h-12 w-12 mx-auto mb-2" />
                    <p>Cliquez pour commencer l'enregistrement audio</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {!isRecording && !recordedMediaUrl && (
            <Button onClick={() => startRecording(recordingType)} className="bg-red-500 hover:bg-red-600">
              {recordingType === 'video' ? <Video className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
              Commencer l'enregistrement
            </Button>
          )}
          
          {isRecording && (
            <Button onClick={stopRecording} variant="outline">
              <Square className="h-4 w-4 mr-2" />
              Arrêter l'enregistrement
            </Button>
          )}
          
          {recordedMediaUrl && (
            <Button onClick={resetRecording} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Recommencer
            </Button>
          )}
        </div>

        {/* Instructions */}
        <div className="text-sm text-gray-600 space-y-2">
          <p><strong>Conseils pour un bon enregistrement :</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Présentez-vous clairement</li>
            <li>Mentionnez votre localisation</li>
            <li>Décrivez ce que vous cherchez ou proposez</li>
            <li>Parlez de votre expérience si pertinent</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaRecorderComponent;
