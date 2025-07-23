import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Puzzle, RotateCcw, CheckCircle } from "lucide-react";

interface Level2Props {
  sessionId: string;
  onComplete: () => void;
  onReset: () => void;
}

interface ShapeData {
  color: string;
  count: number | "";
}

export default function Level2({ sessionId, onComplete, onReset }: Level2Props) {
  const [solution, setSolution] = useState<Record<string, ShapeData>>({
    triangle: { color: "", count: "" },
    circle: { color: "", count: "" },
    square: { color: "", count: "" },
    hexagon: { color: "", count: "" },
    octagon: { color: "", count: "" },
  });
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const shapes = [
    { key: "triangle", name: "Triangle" },
    { key: "circle", name: "Circle" },
    { key: "square", name: "Square" },
    { key: "hexagon", name: "Hexagon" },
    { key: "octagon", name: "Octagon" },
  ];

  const colors = ["purple", "green", "red", "yellow", "brown"];

  const clues = [
    { text: "The triangles are the purple shapes. There are less than 6 triangles.", color: "border-blue-400 bg-blue-50" },
    { text: "Neither the squares nor the hexagons are green.", color: "border-green-400 bg-green-50" },
    { text: "The number of circles is not 4. The circles are not red or yellow.", color: "border-yellow-400 bg-yellow-50" },
    { text: "There are less octagons than there are yellow shapes.", color: "border-red-400 bg-red-50" },
    { text: "There are either 6 or 7 of the brown shapes.", color: "border-purple-400 bg-purple-50" },
    { text: "The number of yellow shapes is greater than 4.", color: "border-indigo-400 bg-indigo-50" },
    { text: "The smallest number of shapes hidden in the classroom applies to the red shapes.", color: "border-pink-400 bg-pink-50" },
    { text: "The hexagons are not the yellow shapes.", color: "border-orange-400 bg-orange-50" },
    { text: "There are less brown shapes than green shapes.", color: "border-cyan-400 bg-cyan-50" },
  ];

  const updateShape = (shape: string, field: 'color' | 'count', value: string | number) => {
    setSolution(prev => ({
      ...prev,
      [shape]: {
        ...prev[shape],
        [field]: value
      }
    }));
  };

  const checkSolution = async () => {
    // Validate all fields are filled
    for (const shape of shapes) {
      if (!solution[shape.key].color || !solution[shape.key].count) {
        toast({
          title: "Incomplete Solution",
          description: "Please fill in all colors and counts before checking.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsChecking(true);

    try {
      const formattedSolution = Object.fromEntries(
        Object.entries(solution).map(([key, value]) => [
          key,
          { color: value.color, count: Number(value.count) }
        ])
      );

      const response = await apiRequest("POST", `/api/game/${sessionId}/validate-level2`, formattedSolution);
      const result = await response.json();

      if (result.correct) {
        toast({
          title: "Congratulations!",
          description: "You solved the logic puzzle correctly!",
        });
        setTimeout(onComplete, 1500);
      } else {
        toast({
          title: "Not Quite Right",
          description: "Some of your answers are incorrect. Review the clues and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check solution. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const resetSolution = () => {
    setSolution({
      triangle: { color: "", count: "" },
      circle: { color: "", count: "" },
      square: { color: "", count: "" },
      hexagon: { color: "", count: "" },
      octagon: { color: "", count: "" },
    });
    onReset();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
          <Puzzle className="text-2xl text-purple-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Level 2: Logic Grid Puzzle</h2>
        <p className="text-slate-600">Solve the classroom shapes mystery</p>
      </div>

      <div className="bg-slate-50 rounded-xl p-6 mb-8">
        <h3 className="font-semibold text-slate-800 mb-3">The Mystery:</h3>
        <p className="text-slate-700 leading-relaxed mb-4">
          Nina is a kindergarten teacher, and today the children are learning about colors and shapes. 
          She has hidden around the classroom a unique number of each of five shapes her class are to find and count. 
          Each type of shape is in a particular color.
        </p>
        <p className="font-medium text-slate-800">Can you identify which color each shape is and how many of them are hidden?</p>
      </div>

      <div className="mb-8">
        <h3 className="font-semibold text-slate-800 mb-4">Clues:</h3>
        <div className="grid gap-3">
          {clues.map((clue, index) => (
            <div key={index} className={`border-l-4 p-4 rounded-r-lg ${clue.color}`}>
              <p className="text-slate-700">
                <span className="font-medium">{index + 1})</span> {clue.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-semibold text-slate-800 mb-4">Your Solution:</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-slate-300 bg-slate-100 p-3 text-left font-medium">Shape</th>
                <th className="border border-slate-300 bg-slate-100 p-3 text-center font-medium">Color</th>
                <th className="border border-slate-300 bg-slate-100 p-3 text-center font-medium">Count</th>
              </tr>
            </thead>
            <tbody>
              {shapes.map((shape) => (
                <tr key={shape.key}>
                  <td className="border border-slate-300 p-3 font-medium">{shape.name}</td>
                  <td className="border border-slate-300 p-3 text-center">
                    <Select 
                      value={solution[shape.key].color} 
                      onValueChange={(value) => updateShape(shape.key, 'color', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Color" />
                      </SelectTrigger>
                      <SelectContent>
                        {colors.map((color) => (
                          <SelectItem key={color} value={color}>
                            {color.charAt(0).toUpperCase() + color.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-slate-300 p-3 text-center">
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      className="text-center"
                      placeholder="?"
                      value={solution[shape.key].count}
                      onChange={(e) => updateShape(shape.key, 'count', e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={resetSolution}>
          <RotateCcw className="mr-2" size={16} />
          Reset
        </Button>
        <Button onClick={checkSolution} disabled={isChecking}>
          {isChecking ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
          ) : (
            <CheckCircle className="mr-2" size={16} />
          )}
          Check Solution
        </Button>
      </div>
    </div>
  );
}
