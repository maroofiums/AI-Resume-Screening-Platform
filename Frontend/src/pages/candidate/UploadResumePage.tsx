import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, FileUp, Loader2, UploadCloud, X } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { candidateService } from "@/services/profiles";
import { extractApiError } from "@/services/api";
import { cn } from "@/lib/utils";

const ACCEPTED = [".pdf", ".docx"];
const MAX_BYTES = 10 * 1024 * 1024;

export default function UploadResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const { mutate, isPending, isSuccess, reset } = useMutation({
    mutationFn: (f: File) => candidateService.uploadResume(f, setProgress),
    onSuccess: () => toast.success("Resume uploaded successfully"),
    onError: (err) => toast.error(extractApiError(err, "Upload failed")),
  });

  const validate = (f: File) => {
    const ext = f.name.toLowerCase().slice(f.name.lastIndexOf("."));
    if (!ACCEPTED.includes(ext)) {
      toast.error("Only PDF or DOCX files are allowed");
      return false;
    }
    if (f.size > MAX_BYTES) {
      toast.error("File too large (max 10MB)");
      return false;
    }
    return true;
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f && validate(f)) {
      setFile(f);
      setProgress(0);
      reset();
    }
  }, [reset]);

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && validate(f)) {
      setFile(f);
      setProgress(0);
      reset();
    }
  };

  return (
    <>
      <PageHeader title="Upload Resume" subtitle="PDF or DOCX, up to 10MB. We'll parse it and use it for screening." />
      <div className="max-w-2xl">
        <label
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={cn(
            "block cursor-pointer rounded-2xl border-2 border-dashed bg-card p-10 text-center transition-all",
            dragOver ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/40"
          )}
        >
          <input type="file" accept=".pdf,.docx" className="hidden" onChange={onPick} />
          <div className="flex justify-center mb-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <UploadCloud className="h-6 w-6" />
            </div>
          </div>
          <div className="font-medium">Drag & drop your resume here</div>
          <div className="mt-1 text-sm text-muted-foreground">or click to browse - PDF / DOCX, max 10MB</div>
        </label>

        {file && (
          <div className="mt-6 rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <FileUp className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{file.name}</div>
                <div className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</div>
              </div>
              {!isPending && !isSuccess && (
                <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
              {isSuccess && <CheckCircle2 className="h-5 w-5 text-success" />}
            </div>
            {(isPending || progress > 0) && (
              <div className="mt-4 space-y-1.5">
                <Progress value={progress} className="h-2" />
                <div className="text-xs text-muted-foreground">{progress}%</div>
              </div>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <Button
                onClick={() => mutate(file)}
                disabled={isPending || isSuccess}
                className="bg-gradient-primary text-primary-foreground hover:opacity-90"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSuccess ? "Uploaded" : "Upload resume"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
