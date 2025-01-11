import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

interface ProcessingStatus {
  total: number;
  processed: number;
  success: number;
  failed: number;
}

const FileUpload = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [processingTime, setProcessingTime] = useState<string>('');
  const [status, setStatus] = useState<ProcessingStatus>({
    total: 0,
    processed: 0,
    success: 0,
    failed: 0,
  });
  const { toast } = useToast();

  const resetUploader = () => {
    setIsComplete(false);
    setIsProcessing(false);
    setProcessingTime('');
    setStatus({
      total: 0,
      processed: 0,
      success: 0,
      failed: 0,
    });
  };

  const formatDuration = (startTime: number) => {
    const duration = Math.floor((Date.now() - startTime) / 1000); // duration in seconds
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}m ${seconds}s`;
  };

  const processExcelFile = async (file: File) => {
    const startTime = Date.now();
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][];

        // Improved empty row filtering
        const queries = rows
          .filter(row => {
            // Check if row exists and has at least one non-empty cell
            return row && 
                   Array.isArray(row) && 
                   row.some(cell => cell !== null && cell !== undefined && cell.toString().trim() !== '');
          })
          .map(row => row.map(cell => cell?.toString() || '').join(' ').trim())
          .filter(query => query.length > 0);

        setStatus({
          total: queries.length,
          processed: 0,
          success: 0,
          failed: 0,
        });
        setIsProcessing(true);

        let successCount = 0;
        let failedCount = 0;

        for (const query of queries) {
          try {
            const response = await fetch('https://factory.wearegenial.com/api/external/agents/cm3ishkqf01t00pt31jggcwht/query', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ query }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              console.error('API Error:', errorData);
              throw new Error('API request failed');
            }

            successCount++;
            setStatus(prev => ({
              ...prev,
              processed: prev.processed + 1,
              success: successCount,
            }));
          } catch (error) {
            console.error('Error processing query:', query, error);
            failedCount++;
            setStatus(prev => ({
              ...prev,
              processed: prev.processed + 1,
              failed: failedCount,
            }));
          }
        }

        setIsProcessing(false);
        setIsComplete(true);
        const duration = formatDuration(startTime);
        setProcessingTime(duration);

        if (failedCount === 0) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }

        toast({
          title: "Traitement terminé",
          description: `${successCount} requêtes traitées avec succès et ${failedCount} échecs.`,
        });
      } catch (error) {
        console.error('Error reading file:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de lire le fichier Excel. Assurez-vous qu'il s'agit d'un fichier Excel valide.",
        });
        setIsProcessing(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      processExcelFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: false,
  });

  if (isComplete) {
    return (
      <div className="space-y-6 text-center">
        <div className="space-y-2">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
          <h3 className="text-lg font-semibold">Traitement terminé</h3>
          <p className="text-sm text-muted-foreground">
            {status.success} requêtes traitées avec succès et {status.failed} échecs
          </p>
          <p className="text-sm text-muted-foreground">
            Temps de traitement: {processingTime}
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={resetUploader}>
            Uploadez nouveau fichier
          </Button>
          <Button onClick={() => window.open('https://factory.wearegenial.com/logs', '_blank')}>
            Voir les fiches produits
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {!isProcessing && (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-12 transition-all duration-200 ease-in-out",
            "hover:border-primary/50 hover:bg-accent/50",
            isDragActive ? "border-primary bg-accent" : "border-muted",
            isProcessing ? "pointer-events-none opacity-50" : "cursor-pointer"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            {isProcessing ? (
              <FileSpreadsheet className="w-12 h-12 text-muted-foreground animate-pulse" />
            ) : (
              <Upload className="w-12 h-12 text-muted-foreground" />
            )}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">
                {isDragActive ? "Drop the file here" : "Upload Excel File"}
              </h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop your Excel file here, or click to select
              </p>
            </div>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="mt-8 space-y-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <FileSpreadsheet className="w-16 h-16 text-primary animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
            <p className="text-sm text-muted-foreground">Processing your file...</p>
          </div>
          <Progress value={(status.processed / status.total) * 100} />
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center justify-center space-x-2 p-4 bg-accent rounded-lg">
              <FileSpreadsheet className="w-4 h-4" />
              <span className="text-sm font-medium">{status.total} Total</span>
            </div>
            <div className="flex items-center justify-center space-x-2 p-4 bg-accent rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">{status.success} Success</span>
            </div>
            <div className="flex items-center justify-center space-x-2 p-4 bg-accent rounded-lg">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <span className="text-sm font-medium">{status.failed} Failed</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;