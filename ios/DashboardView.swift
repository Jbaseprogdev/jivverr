import SwiftUI
import FirebaseAuth

struct DashboardView: View {
    @EnvironmentObject var authState: AuthStateManager
    @State private var analyses: [MedicalAnalysis] = []
    @State private var selectedTab = 0
    
    var body: some View {
        TabView(selection: $selectedTab) {
            // Dashboard Tab
            NavigationView {
                ScrollView {
                    VStack(spacing: 24) {
                        // Welcome Header
                        VStack(spacing: 8) {
                            Text("Welcome to Medalyzer")
                                .font(.title)
                                .fontWeight(.bold)
                            
                            Text("Your medical analysis dashboard")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                        }
                        .padding(.top, 20)
                        
                        // Stats Cards
                        LazyVGrid(columns: [
                            GridItem(.flexible()),
                            GridItem(.flexible())
                        ], spacing: 16) {
                            StatCard(
                                title: "Total Analyses",
                                value: "\(analyses.count)",
                                icon: "chart.bar",
                                color: .blue
                            )
                            
                            StatCard(
                                title: "This Week",
                                value: "\(recentAnalyses)",
                                icon: "clock",
                                color: .green
                            )
                            
                            StatCard(
                                title: "Moderate",
                                value: "\(moderateAnalyses)",
                                icon: "exclamationmark.triangle",
                                color: .orange
                            )
                            
                            StatCard(
                                title: "Mild",
                                value: "\(mildAnalyses)",
                                icon: "checkmark.circle",
                                color: .green
                            )
                        }
                        .padding(.horizontal, 20)
                        
                        // Recent Analyses
                        VStack(alignment: .leading, spacing: 16) {
                            HStack {
                                Text("Recent Analyses")
                                    .font(.title2)
                                    .fontWeight(.bold)
                                
                                Spacer()
                                
                                if !analyses.isEmpty {
                                    Button("View All") {
                                        selectedTab = 1
                                    }
                                    .font(.subheadline)
                                    .foregroundColor(.blue)
                                }
                            }
                            .padding(.horizontal, 20)
                            
                            if analyses.isEmpty {
                                EmptyStateView()
                            } else {
                                LazyVStack(spacing: 12) {
                                    ForEach(Array(analyses.prefix(3))) { analysis in
                                        AnalysisCard(analysis: analysis)
                                    }
                                }
                                .padding(.horizontal, 20)
                            }
                        }
                        
                        Spacer()
                    }
                }
                .navigationTitle("Dashboard")
                .navigationBarTitleDisplayMode(.large)
                .navigationBarItems(trailing: signOutButton)
            }
            .tabItem {
                Image(systemName: "house")
                Text("Dashboard")
            }
            .tag(0)
            
            // History Tab
            NavigationView {
                VStack {
                    if analyses.isEmpty {
                        EmptyStateView()
                    } else {
                        List(analyses) { analysis in
                            AnalysisCard(analysis: analysis)
                                .listRowSeparator(.hidden)
                                .listRowBackground(Color.clear)
                        }
                        .listStyle(PlainListStyle())
                    }
                }
                .navigationTitle("History")
                .navigationBarTitleDisplayMode(.large)
                .navigationBarItems(trailing: signOutButton)
            }
            .tabItem {
                Image(systemName: "clock")
                Text("History")
            }
            .tag(1)
            
            // New Analysis Tab
            DiagnosisInputView()
                .tabItem {
                    Image(systemName: "plus.circle")
                    Text("New Analysis")
                }
                .tag(2)
        }
        .onAppear {
            loadAnalyses()
        }
    }
    
    // Sign out button
    private var signOutButton: some View {
        Button(action: signOut) {
            Image(systemName: "rectangle.portrait.and.arrow.right")
                .foregroundColor(.red)
        }
    }
    
    // Computed properties for stats
    private var recentAnalyses: Int {
        let oneWeekAgo = Calendar.current.date(byAdding: .day, value: -7, to: Date()) ?? Date()
        return analyses.filter { $0.timestamp > oneWeekAgo }.count
    }
    
    private var moderateAnalyses: Int {
        analyses.filter { $0.severity == "moderate" }.count
    }
    
    private var mildAnalyses: Int {
        analyses.filter { $0.severity == "mild" }.count
    }
    
    // Load analyses from UserDefaults (simulated)
    private func loadAnalyses() {
        // In a real app, you'd load from Firebase or local storage
        // For now, we'll use sample data
        analyses = [
            MedicalAnalysis(
                symptoms: "Headache and fever",
                diagnosis: "Common cold",
                explanation: "A viral infection affecting the upper respiratory tract...",
                timestamp: Date().addingTimeInterval(-86400), // 1 day ago
                severity: "mild"
            ),
            MedicalAnalysis(
                symptoms: "Chest pain and shortness of breath",
                diagnosis: "Anxiety",
                explanation: "A mental health condition characterized by excessive worry...",
                timestamp: Date().addingTimeInterval(-172800), // 2 days ago
                severity: "moderate"
            )
        ]
    }
    
    // Sign out function
    private func signOut() {
        authState.signOut()
    }
}

// Stat Card Component
struct StatCard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color
    
    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 24))
                .foregroundColor(color)
            
            Text(value)
                .font(.title)
                .fontWeight(.bold)
                .foregroundColor(.primary)
            
            Text(title)
                .font(.caption)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

// Analysis Card Component
struct AnalysisCard: View {
    let analysis: MedicalAnalysis
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            HStack {
                Image(systemName: severityIcon)
                    .foregroundColor(severityColor)
                
                Text(analysis.severity.capitalized)
                    .font(.caption)
                    .fontWeight(.semibold)
                    .foregroundColor(severityColor)
                
                Spacer()
                
                Text(analysis.timestamp, style: .date)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            // Content
            VStack(alignment: .leading, spacing: 8) {
                Text("Symptoms")
                    .font(.caption)
                    .fontWeight(.semibold)
                    .foregroundColor(.secondary)
                
                Text(analysis.symptoms)
                    .font(.body)
                    .lineLimit(2)
                
                Text("Diagnosis")
                    .font(.caption)
                    .fontWeight(.semibold)
                    .foregroundColor(.secondary)
                
                Text(analysis.diagnosis)
                    .font(.body)
                    .lineLimit(1)
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.1), radius: 2, x: 0, y: 1)
    }
    
    private var severityIcon: String {
        analysis.severity == "moderate" ? "exclamationmark.triangle" : "checkmark.circle"
    }
    
    private var severityColor: Color {
        analysis.severity == "moderate" ? .orange : .green
    }
}

// Empty State View
struct EmptyStateView: View {
    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "chart.bar")
                .font(.system(size: 60))
                .foregroundColor(.gray)
            
            Text("No analyses yet")
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundColor(.primary)
            
            Text("Start by adding your first medical analysis to see your dashboard fill up with insights.")
                .font(.body)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 40)
        }
        .padding(.vertical, 60)
    }
}

// Preview
struct DashboardView_Previews: PreviewProvider {
    static var previews: some View {
        DashboardView()
            .environmentObject(AuthStateManager())
    }
} 