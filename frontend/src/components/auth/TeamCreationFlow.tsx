import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { teams } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Position } from "@/types/database";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface PlayerSetup {
  id: string;
  name: string;
  position: Position;
  base_price: number;
}

const generateRandomPrice = () => {
  return Math.floor(Math.random() * 400000) + 100000;
};

const generateInitialPlayers = (): PlayerSetup[] => {
  const positions = {
    Goalkeeper: 3,
    Defender: 6,
    Midfielder: 6,
    Forward: 5,
  };

  const players: PlayerSetup[] = [];
  Object.entries(positions).forEach(([position, count]) => {
    for (let i = 1; i <= count; i++) {
      players.push({
        id: `${position}-${i}`,
        name: `${position} ${i}`,
        position: position as Position,
        base_price: generateRandomPrice(),
      });
    }
  });

  return players;
};

export default function TeamCreationFlow() {
  const navigate = useNavigate();
  const { user, updateUser  } = useAuth();
  const [step, setStep] = useState(1);
  const [teamName, setTeamName] = useState("");
  const [players, setPlayers] = useState(generateInitialPlayers());
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTeamNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) {
      setError("Team name is required");
      return;
    }
    setError("");
    setStep(2);
  };

  const handlePlayerNameChange = (id: string, name: string) => {
    setPlayers((current) =>
      current.map((p) => (p.id === id ? { ...p, name } : p))
    );
  };

  const handlePriceChange = (id: string, price: string) => {
    const numPrice = parseInt(price);
    if (isNaN(numPrice) || numPrice < 0) return;

    setPlayers((current) =>
      current.map((p) => (p.id === id ? { ...p, base_price: numPrice } : p))
    );
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError("");

      const { user }  = await teams.createTeam({
        name: teamName,
        players: players.map((p) => ({
          name: p.name,
          position: p.position,
          base_price: p.base_price,
        })),
      });

      updateUser(user);
      navigate("/");
    } catch (err) {
      toast.error(
        err instanceof AxiosError && err.response?.data?.message
          ? err.response.data.message
          : 'An unexpected error occurred'
      );

      setError("Failed to create team");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Please sign in to continue.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Create Your Team</h1>
          <p className="text-muted-foreground">
            Step {step} of 2: {step === 1 ? "Team Details" : "Squad Setup"}
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === 1 ? (
          <form onSubmit={handleTeamNameSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="teamName">Team Name</Label>
              <Input
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter your team name"
                required
              />
            </div>
            <Button type="submit">Continue</Button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {players.map((player) => (
                <Card key={player.id} className="p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium text-muted-foreground">
                      {player.position}
                    </Label>
                  </div>
                  <div className="space-y-2">
                    <Input
                      placeholder="Player name"
                      value={player.name}
                      onChange={(e) =>
                        handlePlayerNameChange(player.id, e.target.value)
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Base price"
                      value={player.base_price}
                      onChange={(e) =>
                        handlePriceChange(player.id, e.target.value)
                      }
                    />
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Creating Team..." : "Create Team"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
