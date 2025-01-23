import { FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { PuffLoader } from 'react-spinners';

interface ProcessingStatusProps {
  status: {
    total: number;
    processed: number;
    success: number;
    failed: number;
  };
}

const ProcessingStatus = ({ status }: ProcessingStatusProps) => {
  return (
    <div className="mt-8 space-y-4">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <PuffLoader
            color="#000000"
            size={80}
            className="opacity-20"
          />
        </div>
        <p className="text-sm text-muted-foreground after:content-['.'] after:animate-[ellipsis_1.5s_steps(3,end)_infinite] after:w-4 after:inline-block">
          Rédaction en cours
        </p>
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
  );
};

export default ProcessingStatus;