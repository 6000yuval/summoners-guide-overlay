
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, Play, TrendingDown, Target, Clock, AlertTriangle } from 'lucide-react';

const ReplayAnalysis = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = () => {
    setAnalyzing(true);
    setProgress(0);
    
    // Simulate analysis progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setAnalyzing(false);
          setAnalysisComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const analysisResults = {
    gameInfo: {
      duration: "24:32",
      role: "Mid Lane",
      champion: "Yasuo",
      result: "Victory",
      kda: "7/3/12"
    },
    topMistakes: [
      {
        time: "3:45",
        type: "Death to Gank",
        description: "Died to jungle gank without vision",
        severity: "critical",
        improvement: "Ward river brush at 3:00 when enemy jungler completes first clear"
      },
      {
        time: "8:12",
        type: "CS Deficit",
        description: "30 CS behind expected benchmark",
        severity: "high",
        improvement: "Focus on last-hitting under tower, use abilities more efficiently"
      },
      {
        time: "15:30",
        type: "Missed Objective",
        description: "Didn't rotate for Dragon fight",
        severity: "medium",
        improvement: "Push wave before Dragon spawns, then rotate with team"
      }
    ],
    metrics: {
      csPerMin: 6.2,
      benchmarkCs: 7.8,
      visionScore: 18,
      benchmarkVision: 25,
      earlyDeaths: 2,
      objectiveParticipation: 65
    },
    drill: {
      title: "Early Game Warding Drill",
      description: "Practice placing defensive wards at 2:45-3:00 game time",
      steps: [
        "Load into Practice Tool",
        "Set timer for 2:45",
        "Practice ward placements in river/tri-brush",
        "Repeat 10 times for muscle memory"
      ]
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Play className="h-5 w-5" />
            Replay Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!analysisComplete ? (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Upload Replay File</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Upload your .rofl replay file from League of Legends
                </p>
                <Button 
                  onClick={handleFileUpload}
                  disabled={analyzing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {analyzing ? 'Analyzing...' : 'Select Replay File'}
                </Button>
              </div>
              
              {analyzing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Analyzing replay...</span>
                    <span className="text-white">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Game Summary */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">Game Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400">Duration</p>
                    <p className="text-white font-medium">{analysisResults.gameInfo.duration}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Role</p>
                    <p className="text-white font-medium">{analysisResults.gameInfo.role}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Champion</p>
                    <p className="text-white font-medium">{analysisResults.gameInfo.champion}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Result</p>
                    <Badge className="bg-green-600">{analysisResults.gameInfo.result}</Badge>
                  </div>
                  <div>
                    <p className="text-slate-400">KDA</p>
                    <p className="text-white font-medium">{analysisResults.gameInfo.kda}</p>
                  </div>
                </div>
              </div>

              {/* Top 3 Mistakes */}
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Top 3 Mistakes
                </h3>
                <div className="space-y-3">
                  {analysisResults.topMistakes.map((mistake, index) => (
                    <div key={index} className="bg-slate-700/50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {mistake.time}
                          </Badge>
                          <span className="text-white font-medium">{mistake.type}</span>
                        </div>
                        <Badge className={
                          mistake.severity === 'critical' ? 'bg-red-600' :
                          mistake.severity === 'high' ? 'bg-orange-600' :
                          'bg-yellow-600'
                        }>
                          {mistake.severity}
                        </Badge>
                      </div>
                      <p className="text-slate-300 text-sm mb-2">{mistake.description}</p>
                      <p className="text-blue-300 text-sm">
                        <strong>Improvement:</strong> {mistake.improvement}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Metrics */}
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <TrendingDown className="h-5 w-5" />
                  Performance Metrics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-400">CS/Min</span>
                      <span className="text-white">{analysisResults.metrics.csPerMin}</span>
                    </div>
                    <Progress value={(analysisResults.metrics.csPerMin / analysisResults.metrics.benchmarkCs) * 100} className="h-2" />
                    <p className="text-xs text-slate-400 mt-1">Benchmark: {analysisResults.metrics.benchmarkCs}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-400">Vision Score</span>
                      <span className="text-white">{analysisResults.metrics.visionScore}</span>
                    </div>
                    <Progress value={(analysisResults.metrics.visionScore / analysisResults.metrics.benchmarkVision) * 100} className="h-2" />
                    <p className="text-xs text-slate-400 mt-1">Benchmark: {analysisResults.metrics.benchmarkVision}</p>
                  </div>
                </div>
              </div>

              {/* Recommended Drill */}
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Recommended Practice Drill
                </h3>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">{analysisResults.drill.title}</h4>
                  <p className="text-slate-300 text-sm mb-3">{analysisResults.drill.description}</p>
                  <div className="space-y-2">
                    {analysisResults.drill.steps.map((step, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                          {index + 1}
                        </div>
                        <span className="text-slate-300">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setAnalysisComplete(false)}
                variant="outline"
                className="w-full"
              >
                Analyze Another Replay
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReplayAnalysis;
