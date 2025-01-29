import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';
import UploadZone from './upload/UploadZone';
import ProcessingStatus from './upload/ProcessingStatus';
import CompletionStatus from './upload/CompletionStatus';

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
    const duration = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}m ${seconds}s`;
  };

  const getAgentId = (query: string) => {
    if (query.includes('GOLD')) return 'cm6ie78ct01fgd8l478h9fqxv';
    if (query.includes('SILVER')) return 'cm6idqfls01f1d8l45plb9ond';
    if (query.includes('BRONZE')) return 'cm6ibrs8d01emd8l4dni57r2t';
    return 'cm6ie78ct01fgd8l478h9fqxv'; // Default to GOLD if no match
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

        const queries = rows
          .slice(1)
          .filter(row => {
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
            const agentId = getAgentId(query);
            const response = await fetch(`https://factory.wearegenial.com/api/external/agents/${agentId}/query`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ query }),
            });

            if (!response.ok) {
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
        setProcessingTime(formatDuration(startTime));

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

  return (
    <div className="max-w-2xl mx-auto p-6">
      {isComplete ? (
        <CompletionStatus
          status={status}
          processingTime={processingTime}
          onReset={resetUploader}
        />
      ) : !isProcessing ? (
        <UploadZone
          getInputProps={getInputProps}
          getRootProps={getRootProps}
          isDragActive={isDragActive}
          isProcessing={isProcessing}
        />
      ) : (
        <ProcessingStatus status={status} />
      )}
    </div>
  );
};

export default FileUpload;