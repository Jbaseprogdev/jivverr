import SwiftUI

struct DiagnosisInputView: View {
    @State private var symptoms = ""
    @State private var diagnosis = ""
    @State private var isLoading = false
    @State private var showExplanation = false
    @State private var analysis: MedicalAnalysis?
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 24) {
                    // Header
                    VStack(spacing: 8) {
                        Image(systemName: "stethoscope")
                            .font(.system(size: 40))
                            .foregroundColor(.blue)
                        
                        Text("Medical Analysis")
                            .font(.title2)
                            .fontWeight(.bold)
                    }
                    .padding(.top, 20)
                    
                    // Form
                    VStack(spacing: 20) {
                        // Symptoms Input
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Describe your symptoms")
                                .font(.headline)
                                .foregroundColor(.primary)
                            
                            TextEditor(text: $symptoms)
                                .frame(minHeight: 120)
                                .padding(12)
                                .background(Color(.systemGray6))
                                .cornerRadius(12)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 12)
                                        .stroke(Color(.systemGray4), lineWidth: 1)
                                )
                        }
                        
                        // Diagnosis Input
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Medical diagnosis (if known)")
                                .font(.headline)
                                .foregroundColor(.primary)
                            
                            TextField("Enter the medical diagnosis", text: $diagnosis)
                                .textFieldStyle(RoundedBorderTextFieldStyle())
                        }
                    }
                    .padding(.horizontal, 20)
                    
                    // Action Button
                    Button(action: analyzeDiagnosis) {
                        HStack {
                            if isLoading {
                                ProgressView()
                                    .progressViewStyle(CircularProgressViewStyle(tint: .white))
                                    .scaleEffect(0.8)
                            } else {
                                Image(systemName: "brain.head.profile")
                                    .font(.system(size: 16))
                            }
                            
                            Text(isLoading ? "Analyzing..." : "Get AI Explanation")
                                .font(.headline)
                                .fontWeight(.semibold)
                        }
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(isFormValid ? Color.blue : Color.gray)
                        .foregroundColor(.white)
                        .cornerRadius(12)
                    }
                    .disabled(isLoading || !isFormValid)
                    .padding(.horizontal, 20)
                    
                    // Disclaimer
                    VStack(spacing: 8) {
                        HStack {
                            Image(systemName: "exclamationmark.triangle")
                                .foregroundColor(.orange)
                            Text("Important Note")
                                .font(.subheadline)
                                .fontWeight(.semibold)
                        }
                        
                        Text("This tool provides simplified explanations and is not a substitute for professional medical advice. Always consult with healthcare professionals for proper diagnosis and treatment.")
                            .font(.caption)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                    }
                    .padding(.horizontal, 20)
                    .padding(.vertical, 16)
                    .background(Color(.systemGray6))
                    .cornerRadius(12)
                    .padding(.horizontal, 20)
                    
                    Spacer()
                }
            }
            .navigationTitle("New Analysis")
            .navigationBarTitleDisplayMode(.inline)
            .sheet(isPresented: $showExplanation) {
                if let analysis = analysis {
                    ExplanationView(analysis: analysis)
                }
            }
        }
    }
    
    // Form validation
    private var isFormValid: Bool {
        !symptoms.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty &&
        !diagnosis.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }
    
    // Analyze diagnosis
    private func analyzeDiagnosis() {
        isLoading = true
        
        // Simulate AI analysis (replace with actual AI service)
        DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
            let analysis = MedicalAnalysis(
                symptoms: symptoms,
                diagnosis: diagnosis,
                explanation: generateExplanation(symptoms: symptoms, diagnosis: diagnosis),
                timestamp: Date(),
                severity: Bool.random() ? "moderate" : "mild"
            )
            
            self.analysis = analysis
            self.isLoading = false
            self.showExplanation = true
            
            // Clear form
            self.symptoms = ""
            self.diagnosis = ""
        }
    }
    
    // Generate explanation (simulated)
    private func generateExplanation(symptoms: String, diagnosis: String) -> String {
        return """
        Based on the symptoms "\(symptoms)" and diagnosis "\(diagnosis)", here's a simple explanation:
        
        This condition typically involves a disruption in normal bodily functions. Common symptoms may include discomfort, changes in normal patterns, or other health-related indicators.
        
        Treatment options often include:
        • Rest and proper nutrition
        • Following medical professional recommendations
        • Monitoring symptoms for changes
        • Regular follow-up appointments
        
        Remember: This is a simplified explanation for educational purposes only. Always consult with qualified healthcare professionals for proper medical advice, diagnosis, and treatment plans.
        """
    }
}

// Medical Analysis Model
struct MedicalAnalysis: Identifiable {
    let id = UUID()
    let symptoms: String
    let diagnosis: String
    let explanation: String
    let timestamp: Date
    let severity: String
}

// Explanation View
struct ExplanationView: View {
    let analysis: MedicalAnalysis
    @Environment(\.presentationMode) var presentationMode
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    // Header
                    VStack(alignment: .leading, spacing: 8) {
                        HStack {
                            Image(systemName: severityIcon)
                                .foregroundColor(severityColor)
                            Text("Analysis Complete")
                                .font(.title2)
                                .fontWeight(.bold)
                        }
                        
                        Text(analysis.timestamp, style: .date)
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    .padding(.horizontal, 20)
                    
                    // Content
                    VStack(alignment: .leading, spacing: 16) {
                        // Symptoms
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Symptoms")
                                .font(.headline)
                                .foregroundColor(.primary)
                            
                            Text(analysis.symptoms)
                                .font(.body)
                                .foregroundColor(.secondary)
                                .padding()
                                .background(Color(.systemGray6))
                                .cornerRadius(8)
                        }
                        
                        // Diagnosis
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Diagnosis")
                                .font(.headline)
                                .foregroundColor(.primary)
                            
                            Text(analysis.diagnosis)
                                .font(.body)
                                .foregroundColor(.secondary)
                                .padding()
                                .background(Color(.systemGray6))
                                .cornerRadius(8)
                        }
                        
                        // Explanation
                        VStack(alignment: .leading, spacing: 8) {
                            Text("AI Explanation")
                                .font(.headline)
                                .foregroundColor(.primary)
                            
                            Text(analysis.explanation)
                                .font(.body)
                                .foregroundColor(.secondary)
                                .padding()
                                .background(Color(.systemGray6))
                                .cornerRadius(8)
                        }
                    }
                    .padding(.horizontal, 20)
                    
                    Spacer()
                }
                .padding(.top, 20)
            }
            .navigationTitle("Analysis Result")
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarItems(trailing: Button("Done") {
                presentationMode.wrappedValue.dismiss()
            })
        }
    }
    
    private var severityIcon: String {
        analysis.severity == "moderate" ? "exclamationmark.triangle" : "checkmark.circle"
    }
    
    private var severityColor: Color {
        analysis.severity == "moderate" ? .orange : .green
    }
}

// Preview
struct DiagnosisInputView_Previews: PreviewProvider {
    static var previews: some View {
        DiagnosisInputView()
    }
} 