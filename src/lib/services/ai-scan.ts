// Minimal AI scan service (mocked). Replace with real API integration as needed.
export type ScanResult = {
  detected: Array<{ disease: string; confidence: number }>;
  metadata: { processedAt: string };
};

export async function analyzeImage(file: Blob): Promise<ScanResult> {
  // Mock processing delay
  await new Promise((r) => setTimeout(r, 600));

  // In a real implementation this would upload the file to an inference API
  // and return the parsed results. For now return a deterministic mock.
  return {
    detected: [
      { disease: 'Late blight', confidence: 0.87 },
      { disease: 'Healthy leaf', confidence: 0.13 },
    ],
    metadata: { processedAt: new Date().toISOString() },
  };
}
