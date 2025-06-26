export interface SkillDto {
  id: string;
  name: string;
  level: number;
  category: SkillCategory;
}

export type SkillCreateDto = Omit<SkillDto, 'id'>;

export enum SkillCategory {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  DEVOPS = 'devops',
  DATABASE = 'database',
  DESIGN = 'design',
  ARCHITECTURE = 'architecture',
  METHODOLOGY = 'methodology',
}

export interface SkillCategoryMeta {
  key: SkillCategory;
  label: string;
  color: string;
  icon?: string;
}

export const SKILL_CATEGORY_META: Record<SkillCategory, SkillCategoryMeta> = {
  [SkillCategory.FRONTEND]: {
    key: SkillCategory.FRONTEND,
    label: 'Frontend',
    color: '#1976D2',
    icon: 'web',
  },
  [SkillCategory.BACKEND]: {
    key: SkillCategory.BACKEND,
    label: 'Backend',
    color: '#388E3C',
    icon: 'storage',
  },
  [SkillCategory.DEVOPS]: {
    key: SkillCategory.DEVOPS,
    label: 'DevOps',
    color: '#FFA000',
    icon: 'build',
  },
  [SkillCategory.DATABASE]: {
    key: SkillCategory.DATABASE,
    label: 'Base de données',
    color: '#512DA8',
    icon: 'dns',
  },
  [SkillCategory.DESIGN]: {
    key: SkillCategory.DESIGN,
    label: 'Design',
    color: '#D81B60',
    icon: 'brush',
  },
  [SkillCategory.ARCHITECTURE]: {
    key: SkillCategory.ARCHITECTURE,
    label: 'Architecture',
    color: '#607D8B',
    icon: 'account_tree',
  },
  [SkillCategory.METHODOLOGY]: {
    key: SkillCategory.METHODOLOGY,
    label: 'Méthodologie',
    color: '#0097A7',
    icon: 'psychology',
  },
};

