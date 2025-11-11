// LocalStorage management for voting system

export interface Candidate {
  id: string;
  name: string;
  party: string;
  category: 'presidential' | 'congress' | 'district';
  votes: number;
  enabled?: boolean;
  description?: string;
  image?: string;
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

export interface Category {
  id: string;
  name: string;
  displayName: string;
  enabled: boolean;
  order: number;
  description?: string;
  image?: string; // 👈 Campo para imagen en base64
}

// Initialize default candidates
const DEFAULT_CANDIDATES: Candidate[] = [
  // Presidential
  { 
    id: 'pres-1', 
    name: 'María González', 
    party: 'Partido Progreso', 
    category: 'presidential', 
    votes: 0, 
    enabled: true,
    description: 'Propuesta enfocada en educación y tecnología para el desarrollo nacional'
  },
  { 
    id: 'pres-2', 
    name: 'Carlos Ramírez', 
    party: 'Alianza Nacional', 
    category: 'presidential', 
    votes: 0, 
    enabled: true,
    description: 'Plan de gobierno centrado en economía y generación de empleo'
  },
  { 
    id: 'pres-3', 
    name: 'Ana Torres', 
    party: 'Frente Unido', 
    category: 'presidential', 
    votes: 0, 
    enabled: true,
    description: 'Enfoque en salud pública y bienestar social'
  },
  
  // Congress
  { 
    id: 'cong-1', 
    name: 'Luis Martínez', 
    party: 'Partido Progreso', 
    category: 'congress', 
    votes: 0, 
    enabled: true,
    description: 'Experiencia en políticas de infraestructura y desarrollo urbano'
  },
  { 
    id: 'cong-2', 
    name: 'Patricia Silva', 
    party: 'Alianza Nacional', 
    category: 'congress', 
    votes: 0, 
    enabled: true,
    description: 'Especialista en legislación laboral y derechos sociales'
  },
  { 
    id: 'cong-3', 
    name: 'Roberto Díaz', 
    party: 'Frente Unido', 
    category: 'congress', 
    votes: 0, 
    enabled: true,
    description: 'Defensor de la transparencia y la lucha contra la corrupción'
  },
  
  // District
  { 
    id: 'dist-1', 
    name: 'Carmen Vega', 
    party: 'Partido Progreso', 
    category: 'district', 
    votes: 0, 
    enabled: true,
    description: 'Líder comunitaria con enfoque en seguridad ciudadana'
  },
  { 
    id: 'dist-2', 
    name: 'Jorge Mendoza', 
    party: 'Alianza Nacional', 
    category: 'district', 
    votes: 0, 
    enabled: true,
    description: 'Compromiso con el medio ambiente y espacios públicos'
  },
  { 
    id: 'dist-3', 
    name: 'Sandra López', 
    party: 'Frente Unido', 
    category: 'district', 
    votes: 0, 
    enabled: true,
    description: 'Promotora de cultura, deporte y recreación'
  },
];

// Categorías por defecto (CON DESCRIPCIONES E IMÁGENES)
const DEFAULT_CATEGORIES: Category[] = [
  { 
    id: 'presidential', 
    name: 'presidential', 
    displayName: 'Presidencial', 
    enabled: true, 
    order: 1,
    description: 'Elección para presidente y vicepresidente de la nación',
    image: '' // Por defecto sin imagen
  },
  { 
    id: 'congress', 
    name: 'congress', 
    displayName: 'Congresistas', 
    enabled: true, 
    order: 2,
    description: 'Representantes ante el Congreso Nacional',
    image: ''
  },
  { 
    id: 'district', 
    name: 'district', 
    displayName: 'Distrital', 
    enabled: true, 
    order: 3,
    description: 'Representantes del distrito local y municipal',
    image: ''
  },
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

// Initialize categories
export const initializeCategories = () => {
  if (!localStorage.getItem('categories')) {
    localStorage.setItem('categories', JSON.stringify(DEFAULT_CATEGORIES));
  }
};

// ==================== CANDIDATES ====================

// Candidates
export const getCandidates = (): Candidate[] => {
  const data = localStorage.getItem('candidates');
  return data ? JSON.parse(data) : DEFAULT_CANDIDATES;
};

export const getCandidatesByCategory = (category: string): Candidate[] => {
  return getCandidates().filter(c => c.category === category);
};

// Nueva función: Obtener solo candidatos habilitados (para votación)
export const getActiveCandidates = (category?: string): Candidate[] => {
  const candidates = getCandidates();
  return candidates.filter(c => 
    c.enabled !== false && (!category || c.category === category)
  );
};

// Nueva función: Obtener candidatos habilitados por categoría (para votación)
export const getActiveCandidatesByCategory = (category: string): Candidate[] => {
  return getActiveCandidates(category);
};

export const addCandidate = (candidate: Omit<Candidate, 'id' | 'votes'>): Candidate => {
  const candidates = getCandidates();
  const newCandidate: Candidate = {
    ...candidate,
    id: `${candidate.category}-${Date.now()}`,
    votes: 0,
    enabled: candidate.enabled ?? true,
    description: candidate.description ?? '',
    image: candidate.image ?? '',
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
    return candidates[index];
  }
  return null;
};

export const deleteCandidate = (id: string) => {
  const candidates = getCandidates().filter(c => c.id !== id);
  localStorage.setItem('candidates', JSON.stringify(candidates));
  
  // Opcional: También eliminar los votos asociados a este candidato
  const votes: Vote[] = JSON.parse(localStorage.getItem('votes') || '[]');
  const filteredVotes = votes.filter(v => v.candidateId !== id);
  localStorage.setItem('votes', JSON.stringify(filteredVotes));
};

// ==================== VOTERS ====================

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
  // Verificar que el candidato esté habilitado antes de registrar el voto
  const candidates = getCandidates();
  const candidate = candidates.find(c => c.id === candidateId);
  
  if (!candidate || candidate.enabled === false) {
    throw new Error('Candidato no disponible para votación');
  }

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
  if (candidate) {
    candidate.votes += 1;
    localStorage.setItem('candidates', JSON.stringify(candidates));
  }
};

// ==================== STATISTICS ====================

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

// ==================== CATEGORIES ====================

// Get all categories
export const getCategories = (): Category[] => {
  const data = localStorage.getItem('categories');
  return data ? JSON.parse(data) : DEFAULT_CATEGORIES;
};

// Get active categories (enabled)
export const getActiveCategories = (): Category[] => {
  return getCategories()
    .filter(c => c.enabled)
    .sort((a, b) => a.order - b.order);
};

// Add category
export const addCategory = (category: Omit<Category, 'id'>): Category => {
  const categories = getCategories();
  const newCategory: Category = {
    ...category,
    id: `cat-${Date.now()}`,
  };
  categories.push(newCategory);
  localStorage.setItem('categories', JSON.stringify(categories));
  return newCategory;
};

// Update category
export const updateCategory = (id: string, updates: Partial<Category>) => {
  const categories = getCategories();
  const index = categories.findIndex(c => c.id === id);
  if (index !== -1) {
    categories[index] = { ...categories[index], ...updates };
    localStorage.setItem('categories', JSON.stringify(categories));
    return categories[index];
  }
  return null;
};

// Delete category
export const deleteCategory = (id: string) => {
  // Verificar si hay candidatos usando esta categoría
  const candidates = getCandidates();
  const categoryInUse = candidates.some(c => c.category === id);
  
  if (categoryInUse) {
    throw new Error('No se puede eliminar una categoría con candidatos asociados');
  }
  
  const categories = getCategories().filter(c => c.id !== id);
  localStorage.setItem('categories', JSON.stringify(categories));
  
  // Eliminar votos de esta categoría
  const votes: Vote[] = JSON.parse(localStorage.getItem('votes') || '[]');
  const filteredVotes = votes.filter(v => v.category !== id);
  localStorage.setItem('votes', JSON.stringify(filteredVotes));
};

// Reorder categories
export const reorderCategories = (categoryIds: string[]) => {
  const categories = getCategories();
  categoryIds.forEach((id, index) => {
    const category = categories.find(c => c.id === id);
    if (category) {
      category.order = index + 1;
    }
  });
  localStorage.setItem('categories', JSON.stringify(categories));
};

// ==================== SYSTEM ====================

// Reset system (for testing)
export const resetSystem = () => {
  localStorage.removeItem('candidates');
  localStorage.removeItem('votes');
  localStorage.removeItem('voters');
  localStorage.removeItem('categories');
  initializeStorage();
  initializeCategories();
};
