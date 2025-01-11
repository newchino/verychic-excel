import FileUpload from "@/components/FileUpload";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Excel Processor</h1>
          <p className="text-lg text-muted-foreground">
            Upload your Excel file to process each row through our API
          </p>
        </div>
        <FileUpload />
      </div>
    </div>
  );
};

export default Index;