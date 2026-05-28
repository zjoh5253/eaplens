"use client";

import { useState, useRef } from "react";
import { Navbar } from "@/components/dashboard/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, CheckCircle, AlertCircle, Download, X } from "lucide-react";

type UploadStatus = "idle" | "uploading" | "success" | "error";

const SAMPLE_CSV = `department,benefit_category,utilization_count,month
Engineering,Mental Health,23,2024-01-01
Engineering,Financial Counseling,8,2024-01-01
Sales,Mental Health,17,2024-01-01
Sales,Work-Life Balance,12,2024-01-01
Marketing,Mental Health,14,2024-01-01
People Ops,Mental Health,19,2024-01-01
Engineering,Mental Health,26,2024-02-01
Sales,Mental Health,20,2024-02-01
`;

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [recordCount, setRecordCount] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleFile(f: File) {
    if (!f.name.endsWith(".csv")) {
      setMessage("Only CSV files are accepted.");
      setStatus("error");
      return;
    }
    setFile(f);
    setStatus("idle");
    setMessage(null);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  async function handleUpload() {
    if (!file) return;
    setStatus("uploading");
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json() as { message?: string; count?: number; error?: string };

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Upload failed.");
      } else {
        setStatus("success");
        setRecordCount(data.count ?? null);
        setMessage(data.message ?? "Data imported successfully.");
        setFile(null);
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  function downloadTemplate() {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "eaplens-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Upload Utilization Data</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Import your EAP provider&apos;s CSV export to update your dashboard
          </p>
        </div>

        {/* Format info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              Required CSV format
            </CardTitle>
            <CardDescription>
              Your file must include these four columns (in any order):
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs text-gray-600 overflow-x-auto">
              <p className="text-gray-400 mb-1"># Column names (header row required)</p>
              <p>department, benefit_category, utilization_count, month</p>
              <p className="text-gray-400 mt-3 mb-1"># Example rows</p>
              <p>Engineering, Mental Health, 23, 2024-01-01</p>
              <p>Sales, Financial Counseling, 8, 2024-01-01</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={downloadTemplate}
            >
              <Download className="h-3.5 w-3.5 mr-2" />
              Download sample CSV
            </Button>
          </CardContent>
        </Card>

        {/* Drop zone */}
        <Card>
          <CardContent className="pt-6">
            {status === "success" ? (
              <div className="text-center py-10">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-900">Import complete!</p>
                {recordCount !== null && (
                  <p className="text-sm text-gray-500 mt-1">
                    {recordCount} records imported successfully.
                  </p>
                )}
                <div className="flex items-center justify-center gap-3 mt-6">
                  <Button variant="outline" onClick={() => setStatus("idle")}>
                    Upload another file
                  </Button>
                  <Button onClick={() => (window.location.href = "/dashboard")}>
                    View dashboard
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div
                  className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                    dragging
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => inputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                >
                  <Upload className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                  {file ? (
                    <div>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900">{file.name}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); setFile(null); setStatus("idle"); setMessage(null); }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-400">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Drop your CSV here or{" "}
                        <span className="text-blue-600">click to browse</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">CSV files only</p>
                    </div>
                  )}
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                  />
                </div>

                {status === "error" && message && (
                  <div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{message}</span>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-end">
                  <Button
                    onClick={handleUpload}
                    disabled={!file || status === "uploading"}
                    className="min-w-28"
                  >
                    {status === "uploading" ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Importing…
                      </span>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Import data
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
