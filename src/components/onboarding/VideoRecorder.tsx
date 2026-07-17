
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Square, RotateCcw, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VideoRecorderProps {
  onVideoRecorded: (videoBlob: Blob) => void;
  maxDuration?: number; // in seconds
}

const VideoRecorder = ({ onVideoRecorded, maxDuration = 30 }: VideoRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(maxDuration);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const { toast } = useToast();

  const startRecording = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        onVideoRecorded(blob);
        
        // Stop all tracks
        mediaStream.getTracks().forEach(track => track.stop());
        setStream(null);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setTimeRemaining(maxDuration);

      // Start countdown timer
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
      console.error('Error accessing camera:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'accéder à la caméra. Vérifiez les autorisations.',
        variant: 'destructive',
      });
    }
  }, [maxDuration, onVideoRecorded, toast]);

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
    if (recordedVideoUrl) {
      URL.revokeObjectURL(recordedVideoUrl);
      setRecordedVideoUrl(null);
    }
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    setTimeRemaining(maxDuration);
    chunksRef.current = [];
  }, [recordedVideoUrl, stream, maxDuration]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Présentez-vous en vidéo
        </CardTitle>
        <CardDescription>
          Enregistrez une courte vidéo de {maxDuration} secondes pour nous parler de vos besoins.
          Notre IA analysera votre présentation pour créer automatiquement votre profil.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Video Preview */}
        <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted={isRecording}
            controls={!isRecording && recordedVideoUrl !== null}
            src={recordedVideoUrl || undefined}
          />
          
          {/* Recording Timer */}
          {isRecording && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              🔴 {timeRemaining}s
            </div>
          )}
          
          {/* Placeholder when no video */}
          {!isRecording && !recordedVideoUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Video className="h-12 w-12 mx-auto mb-2" />
                <p>Cliquez pour commencer l'enregistrement</p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {!isRecording && !recordedVideoUrl && (
            <Button onClick={startRecording} className="bg-red-500 hover:bg-red-600">
              <Video className="h-4 w-4 mr-2" />
              Commencer l'enregistrement
            </Button>
          )}
          
          {isRecording && (
            <Button onClick={stopRecording} variant="outline">
              <Square className="h-4 w-4 mr-2" />
              Arrêter l'enregistrement
            </Button>
          )}
          
          {recordedVideoUrl && (
            <>
              <Button onClick={resetRecording} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Recommencer
              </Button>
            </>
          )}
        </div>

        {/* Instructions */}
        <div className="text-sm text-gray-600 space-y-2">
          <p><strong>Conseils pour une bonne vidéo :</strong></p>
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

export default VideoRecorder;
