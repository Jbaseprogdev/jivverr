import { useState } from 'react';
import { FileText, Send, Loader } from 'lucide-react';

export default function DiagnosisInput({ onAnalysisComplete }) {
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim() || !diagnosis.trim()) return;

    setLoading(true);
    
    // Simulate AI analysis (replace with actual AI service)
    setTimeout(() => {
      const analysis = {
        symptoms: symptoms,
        diagnosis: diagnosis,
        explanation: `Based on the symptoms "${symptoms}" and diagnosis "${diagnosis}", here's a simple explanation: This condition typically involves [simplified medical explanation]. Common treatments include [basic treatment options]. Always consult with a healthcare professional for proper medical advice.`,
        timestamp: new Date().toISOString(),
        severity: Math.random() > 0.5 ? 'moderate' : 'mild'
      };
      
      onAnalysisComplete(analysis);
      setSymptoms('');
      setDiagnosis('');
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary-600" />
        Medical Analysis
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Describe your symptoms
          </label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="input-field min-h-[100px] resize-none"
            placeholder="Describe your symptoms in detail..."
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Medical diagnosis (if known)
          </label>
          <input
            type="text"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            className="input-field"
            placeholder="Enter the medical diagnosis..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !symptoms.trim() || !diagnosis.trim()}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Get AI Explanation
            </>
          )}
        </button>
      </form>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> This tool provides simplified explanations and is not a substitute for professional medical advice. Always consult with healthcare professionals for proper diagnosis and treatment.
        </p>
      </div>
    </div>
  );
} 