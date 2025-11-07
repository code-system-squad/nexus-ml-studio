// LocalStorage management for voting system

export interface Candidate {
  id: string;
  name: string;
  party: string;
  category: 'presidential' | 'congress' | 'district';
  votes: number;
}

export interface Vote {
  dni: string;
  category: string;
  candidateId: string;
  timestamp: string;
}

export interface VoterRecord {
  dni: string;
  votedCategories: string[];
  timestamp: string;
}

// Initialize default candidates
const DEFAULT_CANDIDATES: Candidate[] = [
  // Presidential
  { id: 'pres-1', name: 'María González', party: 'Partido Progreso', category: 'presidential', votes: 0 },
  { id: 'pres-2', name: 'Carlos Ramírez', party: 'Alianza Nacional', category: 'presidential', votes: 0 },
  { id: 'pres-3', name: 'Ana Torres', party: 'Frente Unido', category: 'presidential', votes: 0 },
  
  // Congress
  { id: 'cong-1', name: 'Luis Martínez', party: 'Partido Progreso', category: 'congress', votes: 0 },
  { id: 'cong-2', name: 'Patricia Silva', party: 'Alianza Nacional', category: 'congress', votes: 0 },
  { id: 'cong-3', name: 'Roberto Díaz', party: 'Frente Unido', category: 'congress', votes: 0 },
  
  // District
  { id: 'dist-1', name: 'Carmen Vega', party: 'Partido Progreso', category: 'district', votes: 0 },
  { id: 'dist-2', name: 'Jorge Mendoza', party: 'Alianza Nacional', category: 'district', votes: 0 },
  { id: 'dist-3', name: 'Sandra López', party: 'Frente Unido', category: 'district', votes: 0 },
];

// Initialize storage if empty
export const initializeStorage = () => {
  if (!localStorage.getItem('candidates')) {
    localStorage.setItem('candidates', JSON.stringify(DEFAULT_CANDIDATES));
  }
  if (!localStorage.getItem('votes')) {
    localStorage.setItem('votes', JSON.stringify([]));
  }
  if (!localStorage.getItem('voters')) {
    localStorage.setItem('voters', JSON.stringify([]));
  }
};

// Candidates
export const getCandidates = (): Candidate[] => {
  const data = localStorage.getItem('candidates');
  return data ? JSON.parse(data) : DEFAULT_CANDIDATES;
};

export const getCandidatesByCategory = (category: string): Candidate[] => {
  return getCandidates().filter(c => c.category === category);
};

export const addCandidate = (candidate: Omit<Candidate, 'id' | 'votes'>): Candidate => {
  const candidates = getCandidates();
  const newCandidate: Candidate = {
    ...candidate,
    id: `${candidate.category}-${Date.now()}`,
    votes: 0,
  };
  candidates.push(newCandidate);
  localStorage.setItem('candidates', JSON.stringify(candidates));
  return newCandidate;
};

export const updateCandidate = (id: string, updates: Partial<Candidate>) => {
  const candidates = getCandidates();
  const index = candidates.findIndex(c => c.id === id);
  if (index !== -1) {
    candidates[index] = { ...candidates[index], ...updates };
    localStorage.setItem('candidates', JSON.stringify(candidates));
  }
};

export const deleteCandidate = (id: string) => {
  const candidates = getCandidates().filter(c => c.id !== id);
  localStorage.setItem('candidates', JSON.stringify(candidates));
};

// Voters
export const getVoter = (dni: string): VoterRecord | null => {
  const voters: VoterRecord[] = JSON.parse(localStorage.getItem('voters') || '[]');
  return voters.find(v => v.dni === dni) || null;
};

export const hasVoted = (dni: string, category: string): boolean => {
  const voter = getVoter(dni);
  return voter ? voter.votedCategories.includes(category) : false;
};

export const registerVote = (dni: string, category: string, candidateId: string) => {
  // Update voter record
  const voters: VoterRecord[] = JSON.parse(localStorage.getItem('voters') || '[]');
  const voterIndex = voters.findIndex(v => v.dni === dni);
  
  if (voterIndex !== -1) {
    voters[voterIndex].votedCategories.push(category);
  } else {
    voters.push({
      dni,
      votedCategories: [category],
      timestamp: new Date().toISOString(),
    });
  }
  localStorage.setItem('voters', JSON.stringify(voters));

  // Register vote
  const votes: Vote[] = JSON.parse(localStorage.getItem('votes') || '[]');
  votes.push({
    dni,
    category,
    candidateId,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem('votes', JSON.stringify(votes));

  // Update candidate vote count
  const candidates = getCandidates();
  const candidate = candidates.find(c => c.id === candidateId);
  if (candidate) {
    candidate.votes += 1;
    localStorage.setItem('candidates', JSON.stringify(candidates));
  }
};

// Statistics
export const getVoteStats = () => {
  const votes: Vote[] = JSON.parse(localStorage.getItem('votes') || '[]');
  const voters: VoterRecord[] = JSON.parse(localStorage.getItem('voters') || '[]');
  
  return {
    totalVotes: votes.length,
    totalVoters: voters.length,
    votesByCategory: {
      presidential: votes.filter(v => v.category === 'presidential').length,
      congress: votes.filter(v => v.category === 'congress').length,
      district: votes.filter(v => v.category === 'district').length,
    },
  };
};

export const getTopCandidates = (category: string, limit: number = 3): Candidate[] => {
  return getCandidatesByCategory(category)
    .sort((a, b) => b.votes - a.votes)
    .slice(0, limit);
};

// Reset system (for testing)
export const resetSystem = () => {
  localStorage.removeItem('candidates');
  localStorage.removeItem('votes');
  localStorage.removeItem('voters');
  initializeStorage();
};
