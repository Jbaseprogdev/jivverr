import { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Brain, 
  Heart, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText,
  Image,
  Sparkles,
  Eye,
  Shield,
  Zap,
  BarChart3,
  Calendar,
  Target,
  Users,
  Award
} from 'lucide-react';

export default function Dashboard({ user }) {
  const [analyses, setAnalyses] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Load analyses from localStorage
  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      const savedAnalyses = localStorage.getItem(`analyses_${user.uid}`);
      if (savedAnalyses) {
        setAnalyses(JSON.parse(savedAnalyses));
      }
    }
  }, [user]);

  // Save analyses to localStorage
  useEffect(() => {
    if (user && analyses.length > 0 && typeof window !== 'undefined') {
      localStorage.setItem(`analyses_${user.uid}`, JSON.stringify(analyses));
    }
  }, [analyses, user]);

  // Mock AI analysis function (replace with real AI service)
  const analyzeImage = async (imageData) => {
    setIsAnalyzing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock analysis result
    const mockResult = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      image: imageData,
      diagnosis: {
        primary: "Benign Skin Lesion",
        confidence: 0.87,
        severity: "low",
        category: "dermatology"
      },
      symptoms: [
        "Small, round, pigmented spot",
        "Even borders",
        "Consistent color",
        "No itching or pain"
      ],
      explanation: {
        simple: "This appears to be a harmless skin spot, likely a mole or freckle. It shows normal characteristics with even edges and consistent coloring.",
        detailed: "The lesion demonstrates benign features including uniform pigmentation, well-defined borders, and symmetrical shape. These characteristics suggest a low-risk skin condition that typically doesn't require immediate medical intervention.",
        recommendations: [
          "Monitor for any changes in size, shape, or color",
          "Protect from sun exposure",
          "Schedule routine skin check with dermatologist",
          "No immediate treatment needed"
        ]
      },
      riskFactors: {
        level: "Low",
        factors: ["Fair skin", "Sun exposure history"],
        recommendations: "Continue regular skin monitoring"
      },
      nextSteps: [
        "Take follow-up photos in 3 months",
        "Schedule annual dermatologist visit",
        "Use sunscreen daily",
        "Monitor for any changes"
      ],
      aiInsights: {
        accuracy: "87%",
        limitations: "This analysis is for educational purposes only",
        disclaimer: "Not a substitute for professional medical advice"
      }
    };
    
    setAnalysisResult(mockResult);
    setAnalyses(prev => [mockResult, ...prev]);
    setIsAnalyzing(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        analyzeImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg');
      setUploadedImage(imageData);
      setIsCameraOpen(false);
      analyzeImage(imageData);
    }
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOpen(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please upload an image instead.');
    }
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-danger-600 bg-danger-50 border-danger-200';
      case 'moderate': return 'text-warning-600 bg-warning-50 border-warning-200';
      case 'low': return 'text-success-600 bg-success-50 border-success-200';
      default: return 'text-neutral-600 bg-neutral-50 border-neutral-200';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'moderate': return <Clock className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 font-display">
            Welcome back, {user?.displayName || 'User'}! 👋
          </h1>
          <p className="text-neutral-600 mt-1">Your AI-powered health companion is ready to help</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-success-600 font-medium">AI Ready</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-elevated">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Total Analyses</p>
              <p className="text-2xl font-bold text-neutral-900">{analyses.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card-elevated">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Low Risk</p>
              <p className="text-2xl font-bold text-neutral-900">
                {analyses.filter(a => a.diagnosis?.severity === 'low').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card-elevated">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Monitor</p>
              <p className="text-2xl font-bold text-neutral-900">
                {analyses.filter(a => a.diagnosis?.severity === 'moderate').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card-elevated">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-danger-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-danger-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">High Risk</p>
              <p className="text-2xl font-bold text-neutral-900">
                {analyses.filter(a => a.diagnosis?.severity === 'high').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Photo Analysis Section */}
      <div className="card-elevated">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">AI Photo Analysis</h2>
            <p className="text-neutral-600">Take a photo or upload an image for instant medical insights</p>
          </div>
        </div>

        {!uploadedImage && !isAnalyzing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Camera Capture */}
            <div className="space-y-4">
              <div className="text-center p-8 border-2 border-dashed border-neutral-300 rounded-xl hover:border-primary-400 transition-colors">
                <Camera className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Take Photo</h3>
                <p className="text-neutral-600 mb-4">Use your camera to capture the area of concern</p>
                <button
                  onClick={openCamera}
                  className="btn-primary flex items-center gap-2 mx-auto"
                >
                  <Camera className="w-4 h-4" />
                  Open Camera
                </button>
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-4">
              <div className="text-center p-8 border-2 border-dashed border-neutral-300 rounded-xl hover:border-primary-400 transition-colors">
                <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Upload Image</h3>
                <p className="text-neutral-600 mb-4">Upload an existing photo from your device</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-secondary flex items-center gap-2 mx-auto"
                >
                  <Upload className="w-4 h-4" />
                  Choose File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* Camera Interface */}
        {isCameraOpen && (
          <div className="space-y-4">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-xl"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="flex gap-4">
              <button
                onClick={capturePhoto}
                className="btn-primary flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Capture Photo
              </button>
              <button
                onClick={closeCamera}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Analysis Loading */}
        {isAnalyzing && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mb-4">
              <Brain className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">AI is analyzing your image...</h3>
            <p className="text-neutral-600">Our advanced AI is examining every detail for accurate insights</p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="loading-dots">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Result */}
        {analysisResult && !isAnalyzing && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Image */}
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Analyzed Image</h3>
                <img
                  src={analysisResult.image}
                  alt="Analyzed"
                  className="w-full rounded-xl border border-neutral-200"
                />
              </div>

              {/* Quick Summary */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-3">AI Diagnosis Summary</h3>
                  <div className={`p-4 rounded-xl border ${getSeverityColor(analysisResult.diagnosis.severity)}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {getSeverityIcon(analysisResult.diagnosis.severity)}
                      <span className="font-semibold">{analysisResult.diagnosis.primary}</span>
                    </div>
                    <p className="text-sm opacity-80">
                      Confidence: {Math.round(analysisResult.diagnosis.confidence * 100)}%
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-neutral-900 mb-2">Key Symptoms Identified</h4>
                  <div className="space-y-2">
                    {analysisResult.symptoms.map((symptom, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                        {symptom}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Simple Explanation */}
              <div className="card-elevated">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="w-5 h-5 text-primary-600" />
                  <h4 className="font-semibold text-neutral-900">Simple Explanation</h4>
                </div>
                <p className="text-neutral-700 leading-relaxed">
                  {analysisResult.explanation.simple}
                </p>
              </div>

              {/* Risk Assessment */}
              <div className="card-elevated">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-warning-600" />
                  <h4 className="font-semibold text-neutral-900">Risk Assessment</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Risk Level:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      analysisResult.riskFactors.level === 'Low' ? 'bg-success-100 text-success-700' :
                      analysisResult.riskFactors.level === 'Moderate' ? 'bg-warning-100 text-warning-700' :
                      'bg-danger-100 text-danger-700'
                    }`}>
                      {analysisResult.riskFactors.level}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Risk Factors:</p>
                    <ul className="text-sm text-neutral-700 space-y-1">
                      {analysisResult.riskFactors.factors.map((factor, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full"></div>
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="card-elevated">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-success-600" />
                  <h4 className="font-semibold text-neutral-900">Recommended Actions</h4>
                </div>
                <div className="space-y-2">
                  {analysisResult.nextSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-success-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-neutral-700">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="card-elevated bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-semibold text-neutral-900">AI Insights</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-neutral-600">Analysis Accuracy</p>
                  <p className="text-lg font-semibold text-neutral-900">{analysisResult.aiInsights.accuracy}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Limitations</p>
                  <p className="text-sm text-neutral-700">{analysisResult.aiInsights.limitations}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Disclaimer</p>
                  <p className="text-sm text-neutral-700">{analysisResult.aiInsights.disclaimer}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Analyses */}
      {analyses.length > 0 && (
        <div className="card-elevated">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-primary-600" />
              </div>
              <h2 className="text-xl font-semibold text-neutral-900">Recent Analyses</h2>
            </div>
            <button className="btn-secondary text-sm">View All</button>
          </div>
          
          <div className="space-y-4">
            {analyses.slice(0, 5).map((analysis, index) => (
              <div key={analysis.id} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
                <img
                  src={analysis.image}
                  alt="Analysis"
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-neutral-900">{analysis.diagnosis.primary}</h4>
                  <p className="text-sm text-neutral-600">
                    {new Date(analysis.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(analysis.diagnosis.severity)}`}>
                  {analysis.diagnosis.severity}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Health Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-elevated">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-success-600" />
            </div>
            <h3 className="font-semibold text-neutral-900">Health Trends</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Analyses this month</span>
              <span className="font-semibold text-neutral-900">
                {analyses.filter(a => {
                  const date = new Date(a.timestamp);
                  const now = new Date();
                  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                }).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Average risk level</span>
              <span className="font-semibold text-success-600">Low</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">AI accuracy</span>
              <span className="font-semibold text-primary-600">87%</span>
            </div>
          </div>
        </div>

        <div className="card-elevated">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-warning-600" />
            </div>
            <h3 className="font-semibold text-neutral-900">Upcoming Actions</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-warning-50 rounded-lg">
              <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-900">Follow-up photo</p>
                <p className="text-xs text-neutral-600">Due in 2 weeks</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-900">Dermatologist visit</p>
                <p className="text-xs text-neutral-600">Schedule annual checkup</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 