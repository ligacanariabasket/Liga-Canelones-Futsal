'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { castVote } from '@/actions/poll-actions';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { PollWithOptions, PollOptionWithVotes } from '@/types/poll-types';

interface MatchPollProps {
  poll: PollWithOptions | null;
}

export function MatchPoll({ poll }: MatchPollProps) {
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const { toast } = useToast();

  const getUserId = () => {
    let userId = localStorage.getItem('poll-user-id');
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('poll-user-id', userId);
    }
    return userId;
  };

  useEffect(() => {
    if (poll) {
      const votedPolls = JSON.parse(localStorage.getItem('voted-polls') || '[]');
      if (votedPolls.includes(poll.id)) {
        setHasVoted(true);
      }
    }
  }, [poll]);

  if (!poll) {
    return null;
  }

  const handleVote = async () => {
    if (!selectedOption || !poll) return;

    const userId = getUserId();
    const pollId = poll.id;
    const pollOptionId = parseInt(selectedOption, 10);

    const result = await castVote({ pollId, pollOptionId, userId });

    if (result.message.startsWith('Error')) {
      toast({
        title: 'Error',
        description: result.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: '¡Voto registrado!',
        description: result.message,
      });
      const votedPolls = JSON.parse(localStorage.getItem('voted-polls') || '[]');
      votedPolls.push(poll.id);
      localStorage.setItem('voted-polls', JSON.stringify(votedPolls));
      setHasVoted(true);
    }
  };

  const totalVotes = poll.options.reduce((acc: number, option: PollOptionWithVotes) => acc + (option._count?.votes || 0), 0);

  return (
    <Card className="w-full max-w-4xl mt-8">
      <CardHeader>
        <CardTitle>{poll.question}</CardTitle>
      </CardHeader>
      <CardContent>
        {hasVoted ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Ya has votado en esta encuesta. Estos son los resultados actuales:</p>
            {poll.options.map((option: PollOptionWithVotes) => {
              const percentage = totalVotes > 0 ? (option._count.votes / totalVotes) * 100 : 0;
              return (
                <div key={option.id} className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span>{option.text}</span>
                    <span className="font-medium">{percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={percentage} />
                </div>
              );
            })}
          </div>
        ) : (
          <form action={handleVote} className="space-y-6">
            <RadioGroup onValueChange={setSelectedOption} className="space-y-2">
              {poll.options.map((option: PollOptionWithVotes) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={String(option.id)} id={`option-${option.id}`} />
                  <Label htmlFor={`option-${option.id}`}>{option.text}</Label>
                </div>
              ))}
            </RadioGroup>
            <Button type="submit" disabled={!selectedOption}>
              Votar
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
