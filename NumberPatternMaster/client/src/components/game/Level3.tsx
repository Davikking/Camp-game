import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { GameSession } from "@shared/schema";
import { BarChart3, RotateCcw, Trophy } from "lucide-react";

interface Level3Props {
  sessionId: string;
  gameSession: GameSession;
  onComplete: () => void;
  onReset: () => void;
  onUpdateOutliers: (remaining: number) => void;
}

interface DataPoint {
  id: string;
  x: number;
  y: number;
  isOutlier: boolean;
  removed: boolean;
}

export default function Level3({ gameSession, onComplete, onReset, onUpdateOutliers }: Level3Props) {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    initializeDataPoints();
  }, []);

  const initializeDataPoints = () => {
    const points: DataPoint[] = [];
    
    // Generate clustered normal data points with more spread
    for (let i = 0; i < 20; i++) {
      points.push({
        id: `normal-${i}`,
        x: 40 + Math.random() * 20, // 40-60 range (wider spread)
        y: 40 + Math.random() * 20, // 40-60 range (wider spread)
        isOutlier: false,
        removed: false,
      });
    }

    // Generate outlier points that are more subtle
    const outliers = [
      { x: 20 + Math.random() * 5, y: 20 + Math.random() * 5 }, // Bottom-left area
      { x: 75 + Math.random() * 5, y: 25 + Math.random() * 5 }, // Top-right area
      { x: 25 + Math.random() * 5, y: 75 + Math.random() * 5 }, // Bottom-right area
      { x: 15 + Math.random() * 5, y: 50 + Math.random() * 5 }, // Left side
      { x: 80 + Math.random() * 5, y: 80 + Math.random() * 5 }, // Far top-right
    ];

    outliers.forEach((outlier, index) => {
      points.push({
        id: `outlier-${index}`,
        x: outlier.x,
        y: outlier.y,
        isOutlier: true,
        removed: false,
      });
    });

    setDataPoints(points);
  };

  const handlePointClick = (pointId: string) => {
    const point = dataPoints.find(p => p.id === pointId);
    if (!point || point.removed) return;

    if (point.isOutlier) {
      // Remove the outlier
      setDataPoints(prev => 
        prev.map(p => p.id === pointId ? { ...p, removed: true } : p)
      );

      const remainingOutliers = dataPoints.filter(p => p.isOutlier && !p.removed).length - 1;
      onUpdateOutliers(remainingOutliers);

      if (remainingOutliers === 0) {
        toast({
          title: "Excellent!",
          description: "You've successfully removed all outliers!",
        });
        setTimeout(onComplete, 1500);
      } else {
        toast({
          title: "Good!",
          description: `Outlier removed! ${remainingOutliers} more to go.`,
        });
      }
    } else {
      // Clicked on normal data point
      toast({
        title: "Not an outlier",
        description: "This point belongs to the main cluster. Look for points far from the group!",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    initializeDataPoints();
    onReset();
  };

  const remainingOutliers = dataPoints.filter(p => p.isOutlier && !p.removed).length;
  const allOutliersRemoved = remainingOutliers === 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <BarChart3 className="text-2xl text-red-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Level 3: Outlier Detection</h2>
        <p className="text-slate-600">Click on the outliers to remove them from the dataset</p>
      </div>

      <div className="bg-slate-50 rounded-xl p-6 mb-8">
        <h3 className="font-semibold text-slate-800 mb-3">Instructions:</h3>
        <p className="text-slate-700 leading-relaxed">
          The scatter plot below shows a dataset with some outliers. Your task is to identify and remove all the outlier points 
          by clicking on them. Outliers are data points that are significantly different from the main cluster of data. 
          Once you've removed all outliers, the game will be complete!
        </p>
      </div>

      <div className="mb-6 text-center">
        <Badge variant={remainingOutliers > 0 ? "destructive" : "default"} className="text-base px-4 py-2">
          {remainingOutliers > 0 ? `${remainingOutliers} outliers remaining` : "All outliers removed!"}
        </Badge>
      </div>

      <div className="bg-slate-50 rounded-xl p-6 mb-8">
        <div className="relative bg-white rounded-lg border-2 border-slate-200" style={{ height: "400px" }}>
          {/* Y-axis labels */}
          <div className="absolute left-2 top-0 h-full flex flex-col justify-between text-xs text-slate-500 py-4">
            <span>100</span>
            <span>80</span>
            <span>60</span>
            <span>40</span>
            <span>20</span>
            <span>0</span>
          </div>
          
          {/* X-axis labels */}
          <div className="absolute bottom-2 left-0 w-full flex justify-between text-xs text-slate-500 px-8">
            <span>0</span>
            <span>20</span>
            <span>40</span>
            <span>60</span>
            <span>80</span>
            <span>100</span>
          </div>

          {/* Data Points Container */}
          <div className="absolute inset-8">
            {dataPoints.map((point) => {
              if (point.removed) return null;
              
              return (
                <div
                  key={point.id}
                  className="absolute w-3 h-3 bg-blue-500 hover:bg-blue-600 rounded-full cursor-pointer transition-all duration-200 transform hover:scale-110"
                  style={{
                    left: `${point.x}%`,
                    top: `${100 - point.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  title="Click to remove if outlier"
                  onClick={() => handlePointClick(point.id)}
                />
              );
            })}
          </div>

          {/* Axis labels */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8 text-sm font-medium text-slate-700">
            X-axis
          </div>
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-8 -rotate-90 text-sm font-medium text-slate-700">
            Y-axis
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex justify-center">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-slate-600">Data Points (Click outliers to remove them)</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="mr-2" size={16} />
          Reset
        </Button>
        <Button 
          disabled={!allOutliersRemoved} 
          onClick={onComplete}
          className={allOutliersRemoved ? "bg-green-600 hover:bg-green-700" : ""}
        >
          <Trophy className="mr-2" size={16} />
          Complete Game
        </Button>
      </div>
    </div>
  );
}
