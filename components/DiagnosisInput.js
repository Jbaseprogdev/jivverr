import { useState } from 'react';
import { 
  FileText, 
  Send, 
  Loader, 
  AlertCircle,
  CheckCircle,
  Clock,
  Brain,
  Stethoscope,
  Info,
  Plus,
  X
} from 'lucide-react';

export default function DiagnosisInput({ onAnalysisComplete }) {
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [loading, setLoading] = useState(false);
  const [symptomTags, setSymptomTags] = useState([]);
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [severity, setSeverity] = useState('mild');

  const commonSymptoms = [
    'Headache', 'Fever', 'Cough', 'Fatigue', 'Nausea', 
    'Dizziness', 'Chest Pain', 'Shortness of Breath', 
    'Joint Pain', 'Rash', 'Swelling', 'Loss of Appetite'
  ];

  const addSymptomTag = (symptom) => {
    if (symptom.trim() && !symptomTags.includes(symptom.trim())) {
      setSymptomTags([...symptomTags, symptom.trim()]);
      setCurrentSymptom('');
    }
  };

  const removeSymptomTag = (symptomToRemove) => {
    setSymptomTags(symptomTags.filter(symptom => symptom !== symptomToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim() || !diagnosis.trim()) return;

    setLoading(true);
    
    // Simulate AI analysis (replace with actual AI service)
    setTimeout(() => {
      const analysis = {
        symptoms: symptoms,
        diagnosis: diagnosis,
        symptomTags: symptomTags,
        severity: severity,
        explanation: `Based on the symptoms "${symptoms}" and diagnosis "${diagnosis}", here's a comprehensive explanation: This condition typically involves [simplified medical explanation]. Common treatments include [basic treatment options]. The severity level indicates [severity explanation]. Always consult with a healthcare professional for proper medical advice and treatment planning.`,
        timestamp: new Date().toISOString(),
        severity: severity
      };
      
      onAnalysisComplete(analysis);
      setSymptoms('');
      setDiagnosis('');
      setSymptomTags([]);
      setSeverity('mild');
      setLoading(false);
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-blue-600 rounded-2xl mb-4">
          <Stethoscope className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">Medical Analysis</h1>
        <p className="text-gray-600">Get AI-powered explanations of your medical diagnoses</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-elevated">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">Analysis Details</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Symptom Tags */}
              <div className="form-group">
                <label className="form-label">Common Symptoms</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {commonSymptoms.map((symptom) => (
                    <button
                      key={symptom}
                      type="button"
                      onClick={() => addSymptomTag(symptom)}
                      className="symptom-tag hover:bg-primary-100 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      {symptom}
                    </button>
                  ))}
                </div>
                
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={currentSymptom}
                    onChange={(e) => setCurrentSymptom(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSymptomTag(currentSymptom))}
                    className="input-field flex-1"
                    placeholder="Add custom symptom..."
                  />
                  <button
                    type="button"
                    onClick={() => addSymptomTag(currentSymptom)}
                    className="btn-primary px-4"
                  >
                    Add
                  </button>
                </div>
                
                {symptomTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {symptomTags.map((tag) => (
                      <span key={tag} className="symptom-tag">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeSymptomTag(tag)}
                          className="ml-1 hover:text-danger-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Detailed Symptoms */}
              <div className="form-group">
                <label className="form-label">Detailed Symptom Description</label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="input-field min-h-[120px] resize-none"
                  placeholder="Describe your symptoms in detail, including duration, intensity, and any patterns you've noticed..."
                  required
                />
                <p className="form-help">Be as specific as possible to get the most accurate analysis</p>
              </div>
              
              {/* Diagnosis */}
              <div className="form-group">
                <label className="form-label">Medical Diagnosis (if known)</label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="input-field"
                  placeholder="Enter the medical diagnosis or condition..."
                  required
                />
                <p className="form-help">If you don't have a diagnosis yet, describe what you think might be wrong</p>
              </div>

              {/* Severity Level */}
              <div className="form-group">
                <label className="form-label">Severity Level</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSeverity('mild')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      severity === 'mild' 
                        ? 'border-success-300 bg-success-50 text-success-700' 
                        : 'border-gray-200 hover:border-success-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5" />
                      <div className="text-left">
                        <p className="font-medium">Mild</p>
                        <p className="text-sm opacity-75">Manageable symptoms</p>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setSeverity('moderate')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      severity === 'moderate' 
                        ? 'border-warning-300 bg-warning-50 text-warning-700' 
                        : 'border-gray-200 hover:border-warning-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5" />
                      <div className="text-left">
                        <p className="font-medium">Moderate</p>
                        <p className="text-sm opacity-75">Requires attention</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !symptoms.trim() || !diagnosis.trim()}
                className="btn-primary w-full flex items-center justify-center gap-2 py-4"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    Get AI Explanation
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Medical Disclaimer */}
          <div className="card-medical">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-warning-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Important Notice</h3>
                <p className="text-sm text-gray-600 mb-3">
                  This tool provides simplified explanations and is not a substitute for professional medical advice.
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Always consult healthcare professionals</li>
                  <li>• Don't delay seeking medical care</li>
                  <li>• Use for educational purposes only</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">How it works</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-primary-600">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Enter Symptoms</p>
                  <p className="text-xs text-gray-600">Describe what you're experiencing</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-primary-600">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Add Diagnosis</p>
                  <p className="text-xs text-gray-600">Include medical diagnosis if known</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-primary-600">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Get AI Explanation</p>
                  <p className="text-xs text-gray-600">Receive clear, simple explanations</p>
                </div>
              </div>
            </div>
          </div>

          {/* Processing time */}
          <div className="card">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Processing Time</p>
                <p className="text-xs text-gray-600">Usually takes 2-3 seconds</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 