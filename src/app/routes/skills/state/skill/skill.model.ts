export enum SkillKind {
  LANGUAGE = 'LANGUAGE',
  FRAMEWORK = 'FRAMEWORK',
  LIBRARY = 'LIBRARY',
  TOOL = 'TOOL',
  PLATFORM = 'PLATFORM',
  DATABASE = 'DATABASE',
  CONCEPT = 'CONCEPT',
  PATTERN = 'PATTERN',
  PRACTICE = 'PRACTICE',
}

export interface SkillKindMeta {
  key: SkillKind;
  label: string;
  icon: string;
}

export const SKILL_KIND_META = {
  [SkillKind.LANGUAGE]: {
    key: SkillKind.LANGUAGE,
    label: 'Langage',
    icon: 'code',
  },
  [SkillKind.FRAMEWORK]: {
    key: SkillKind.FRAMEWORK,
    label: 'Framework',
    icon: 'widgets',
  },
  [SkillKind.LIBRARY]: {
    key: SkillKind.LIBRARY,
    label: 'Bibliothèque',
    icon: 'extension',
  },
  [SkillKind.TOOL]: {
    key: SkillKind.TOOL,
    label: 'Outil',
    icon: 'build',
  },
  [SkillKind.PLATFORM]: {
    key: SkillKind.PLATFORM,
    label: 'Plateforme',
    icon: 'cloud',
  },
  [SkillKind.DATABASE]: {
    key: SkillKind.DATABASE,
    label: 'BDD',
    icon: 'storage',
  },
  [SkillKind.CONCEPT]: {
    key: SkillKind.CONCEPT,
    label: 'Concept',
    icon: 'lightbulb',
  },
  [SkillKind.PATTERN]: {
    key: SkillKind.PATTERN,
    label: 'Pattern',
    icon: 'schema',
  },
  [SkillKind.PRACTICE]: {
    key: SkillKind.PRACTICE,
    label: 'Pratique',
    icon: 'checklist',
  },
} as const;

export interface SkillDto {
  id: string;
  name: string;
  level: number;
  kind: SkillKind;
  categories: SkillCategory[];
  sinceYear?: number;
  iconSvg?: string;
  displayPriority: number;
}

export type SkillCreateDto = Omit<SkillDto, 'id'>;

export enum SkillCategory {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  DEVOPS_CLOUD = 'devops_cloud',
  DATABASE = 'database',
  DESIGN = 'design',
  ARCHITECTURE = 'architecture',
  TESTING = 'testing',
  TOOLING = 'tooling',
  METHODOLOGY = 'methodology',
}

export interface SkillCategoryMeta {
  key: SkillCategory;
  label: string;
  shortLabel: string;
  color: string;
  icon?: string;
  subtitle?: string;
}

export const SKILL_CATEGORY_META: Record<SkillCategory, SkillCategoryMeta> = {
  [SkillCategory.FRONTEND]: {
    key: SkillCategory.FRONTEND,
    label: 'Développement Frontend',
    shortLabel: 'Dév Frontend',
    subtitle: 'Technologies côté client',
    color: '#2563EB',
    icon: 'code',
  },
  [SkillCategory.BACKEND]: {
    key: SkillCategory.BACKEND,
    label: 'Développement Backend',
    shortLabel: 'Dév Backend',
    subtitle: 'Technologies côté serveur',
    color: '#16A34A',
    icon: 'terminal',
  },
  [SkillCategory.DEVOPS_CLOUD]: {
    key: SkillCategory.DEVOPS_CLOUD,
    label: 'DevOps & Cloud',
    shortLabel: 'DevOps/Cloud',
    subtitle: 'Déploiement et gestion des environnements serveurs',
    color: '#F59E0B',
    icon: 'cloud',
  },
  [SkillCategory.DATABASE]: {
    key: SkillCategory.DATABASE,
    label: 'Base de données',
    shortLabel: 'BDD',
    subtitle: "Conception et gestion des données d'application",
    color: '#7C3AED',
    icon: 'storage',
  },
  [SkillCategory.DESIGN]: {
    key: SkillCategory.DESIGN,
    label: 'Design & UX',
    shortLabel: 'UX/UI',
    subtitle: 'Interface, expérience et accessibilité',
    color: '#E11D48',
    icon: 'palette',
  },
  [SkillCategory.ARCHITECTURE]: {
    key: SkillCategory.ARCHITECTURE,
    label: 'Architecture & Patterns',
    shortLabel: 'Arch/Patterns',
    subtitle: 'Structure, patterns et bonnes pratiques',
    color: '#94A3B8',
    icon: 'account_tree',
  },
  [SkillCategory.TESTING]: {
    key: SkillCategory.TESTING,
    label: 'Tests & Qualité',
    shortLabel: 'Tests',
    subtitle: 'Tests, couverture et fiabilité',
    color: '#0D9488',
    icon: 'rule',
  },
  [SkillCategory.TOOLING]: {
    key: SkillCategory.TOOLING,
    label: 'Outils & Productivité',
    shortLabel: 'Tooling',
    subtitle: 'Outils du quotidien pour développer efficacement',
    color: '#F97316',
    icon: 'build',
  },
  [SkillCategory.METHODOLOGY]: {
    key: SkillCategory.METHODOLOGY,
    label: 'Méthodologie & Management',
    shortLabel: 'Méthodo',
    subtitle: 'Organisation, agilité et pilotage projet',
    color: '#6366F1',
    icon: 'view_kanban',
  },
} as const;

export interface CategoryStat {
  category: string;
  usageRate: number;
}

export interface CategoryStatsResponse {
  categoryStats: CategoryStat[];
}

export interface CategoryStatDisplay extends CategoryStat {
  label: string;
  color: string;
}
