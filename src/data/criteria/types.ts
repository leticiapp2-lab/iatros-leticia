export interface CriteriaItem {
  id: string;
  label: string;
  points?: number;
}

export interface CriteriaGroup {
  id: string;
  title: string;
  note?: string;
  items: CriteriaItem[];
  minRequired?: number;
  allRequired?: boolean;
}

export interface EvaluationResult {
  met: boolean;
  summary: string;
  detail?: string;
  score?: number;
  maxScore?: number;
}

export interface DiseaseImage {
  src: string;
  alt: string;
  legend?: string[];
}

export interface InteractiveDisease {
  id: string;
  name: string;
  shortName: string;
  criteriaSetName: string;
  groups: CriteriaGroup[];
  image?: DiseaseImage;
  evaluate: (checked: Set<string>) => EvaluationResult;
}

export function countInGroup(checked: Set<string>, group: CriteriaGroup): number {
  return group.items.filter((item) => checked.has(item.id)).length;
}

export function sumPointsInGroup(checked: Set<string>, group: CriteriaGroup): number {
  return group.items
    .filter((item) => checked.has(item.id))
    .reduce((sum, item) => sum + (item.points ?? 0), 0);
}
