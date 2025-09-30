
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { castVote } from '@/actions/poll-actions';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import type { PollWithOptions, PollOptionWithVotes } from '@/types/poll-types';
import { BarChart2, FileText, Vote } from 'lucide-react';
import { Separator } from '../ui/separator';

interface PollCardProps {
  poll: PollWithOptions;
}

export function PollCard({ poll: initialPoll }: PollCardProps) {
  const [poll, setPoll] = useState(initialPoll);
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
    const votedPolls = JSON.parse(localStorage.getItem('voted-polls') || '[]');
    if (votedPolls.includes(poll.id)) {
      setHasVoted(true);
    }
  }, [poll.id]);
  
  const totalVotes = poll.options.reduce((acc, option) => acc + (option._count?.votes || 0), 0);

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

      // Optimistically update the UI
      const newOptions = poll.options.map(opt => {
        if (opt.id === pollOptionId) {
          return {
            ...opt,
            _count: { votes: (opt._count.votes || 0) + 1 },
          };
        }
        return opt;
      });
      setPoll(prev => ({...prev!, options: newOptions}));
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">{poll.question}</CardTitle>
        {poll.match && (
             <CardDescription>
                Partido: {poll.match.teamA.name} vs {poll.match.teamB.name}
            </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        {hasVoted ? (
          <div className="space-y-4">
            {poll.options.map((option: PollOptionWithVotes) => {
              const percentage = totalVotes > 0 ? ((option._count?.votes || 0) / totalVotes) * 100 : 0;
              return (
                <div key={option.id} className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-medium">
                     <div className="flex items-center gap-2">
                       {option.player?.team?.logoUrl && (
                        <Image src={option.player.team.logoUrl} alt={option.player.team.name || ''} width={20} height={20} className="rounded-full" />
                       )}
                       <span>{option.text}</span>
                     </div>
                     <span className="font-bold text-primary">{percentage.toFixed(0)}%</span>
                  </div>
                  <Progress value={percentage} />
                </div>
              );
            })}
          </div>
        ) : (
          <RadioGroup onValueChange={setSelectedOption} className="space-y-2">
            {poll.options.map((option: PollOptionWithVotes) => (
              <div key={option.id} className="flex items-center space-x-2 rounded-md p-3 hover:bg-muted/50 transition-colors border">
                <RadioGroupItem value={String(option.id)} id={`option-${option.id}-${poll.id}`} />
                <Label htmlFor={`option-${option.id}-${poll.id}`} className="flex-grow cursor-pointer flex items-center gap-2 text-sm md:text-base">
                    {option.player?.team?.logoUrl && (
                        <Image src={option.player.team.logoUrl} alt={option.player.team.name || ''} width={24} height={24} className="rounded-full" />
                    )}
                    {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </CardContent>
       <CardFooter className="flex-col items-start gap-4 mt-auto">
        {!hasVoted && (
             <Button onClick={handleVote} disabled={!selectedOption} className="w-full">
                Votar
            </Button>
        )}
        <Separator />
        <div className="w-full flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground gap-4">
            <div className="flex items-center gap-2">
                <Vote className="h-4 w-4" />
                <span>{totalVotes} votos totales</span>
            </div>
            {poll.matchId && (
                <div className="flex items-center flex-wrap justify-center sm:justify-end gap-2">
                    <Button asChild size="sm" variant="ghost" className="text-muted-foreground h-8 px-2">
                        <Link href={`/resumen/${poll.matchId}`}>
                           <BarChart2 className="mr-2 h-4 w-4" /> Resumen
                        </Link>
                    </Button>
                     <Button asChild size="sm" variant="ghost" className="text-muted-foreground h-8 px-2">
                        <Link href={`/gestion/cronicas/${poll.matchId}/ver`}>
                           <FileText className="mr-2 h-4 w-4" /> Crónica
                        </Link>
                    </Button>
                </div>
            )}
        </div>
       </CardFooter>
    </Card>
  );
}
