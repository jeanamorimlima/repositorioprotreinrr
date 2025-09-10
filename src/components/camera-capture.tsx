
"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Camera, RefreshCcw } from "lucide-react";
import jsQR from "jsqr";

interface CameraCaptureProps {
  onCapture: (dataUrl: string) => void;
  onClose: () => void;
  isQrScanner?: boolean;
}

export function CameraCapture({ onCapture, onClose, isQrScanner = false }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const { toast } = useToast();
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('Camera not supported by this browser.');
        }
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCameraPermission(false);
        toast({
          variant: "destructive",
          title: "Camera Access Denied",
          description: "Please enable camera permissions in your browser settings.",
        });
      }
    };

    getCameraPermission();

    return () => {
        // Cleanup: stop video stream and animation frame when component unmounts
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast]);
  
  useEffect(() => {
    if (isQrScanner && hasCameraPermission && videoRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        const tick = () => {
            if (video.readyState === video.HAVE_ENOUGH_DATA && canvas) {
                const canvasContext = canvas.getContext("2d");
                if (canvasContext) {
                    canvas.height = video.videoHeight;
                    canvas.width = video.videoWidth;
                    canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height, {
                        inversionAttempts: "dontInvert",
                    });

                    if (code) {
                        onCapture(code.data);
                        return; // Stop scanning once a code is found
                    }
                }
            }
            animationFrameId.current = requestAnimationFrame(tick);
        };

        animationFrameId.current = requestAnimationFrame(tick);
    }
  }, [isQrScanner, hasCameraPermission, onCapture]);


  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        onCapture(dataUrl);
      }
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="relative w-full aspect-video bg-black rounded-md overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
          muted
        />
        <canvas ref={canvasRef} className="hidden" />
        {hasCameraPermission === false && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Alert variant="destructive" className="m-4">
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                    Please allow camera access to use this feature. You might need to refresh the page and grant permission.
                </AlertDescription>
            </Alert>
          </div>
        )}
         {hasCameraPermission === null && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white">Requesting camera access...</p>
          </div>
        )}
      </div>
      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        {!isQrScanner && (
            <Button onClick={handleCapture} disabled={!hasCameraPermission}>
              <Camera className="mr-2 h-4 w-4"/>
              Capturar Foto
            </Button>
        )}
      </div>
    </div>
  );
}
