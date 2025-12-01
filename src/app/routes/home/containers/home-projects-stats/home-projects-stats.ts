import {Component, computed, inject, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {httpResource} from '@angular/common/http';
import {Router} from '@angular/router';
import {BaseChartDirective} from 'ng2-charts';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  ChartConfiguration,
  Legend,
  LinearScale,
  PieController,
  PolarAreaController,
  RadialLinearScale,
  Tooltip
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {environment} from '../../../../../../environments/environments';
import {SKILL_CATEGORY_META, SkillCategory} from '../../../skills/state/skill/skill.model';

Chart.register(
  ArcElement,
  BarElement,
  RadialLinearScale,
  LinearScale,
  CategoryScale,
  PieController,
  BarController,
  PolarAreaController,
  Legend,
  Tooltip,
  ChartDataLabels
);

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

interface ProjectTypeDistribution {
  projectType: string;
  count: number;
  percentage: number;
}

interface TopSkill {
  id: string;
  name: string;
  category: SkillCategory;
  projectCount: number;
  usageRate: number;
}

interface StackDistribution {
  fullStackPercentage: number;
  backendOnlyPercentage: number;
  frontendOnlyPercentage: number;
}

interface ProjectStatsResponse {
  projectTypeDistribution: ProjectTypeDistribution[];
  topSkills: TopSkill[];
  stackDistribution: StackDistribution;
}

@Component({
  selector: 'app-home-projects-stats',
  imports: [BaseChartDirective, MatButtonModule, MatIconModule],
  templateUrl: './home-projects-stats.html',
  styleUrl: './home-projects-stats.scss'
})
export class HomeProjectsStats {
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly projectStatsResource = httpResource<ProjectStatsResponse>(() => ({
    url: `${environment.baseUrl}/projects/stats`,
    method: 'GET'
  }));

  readonly isDataLoaded = computed(() => this.isBrowser && !!this.projectStatsResource.value());

  readonly polarAreaChartType = 'polarArea' as const;

  readonly polarAreaChartData = computed<ChartConfiguration<'polarArea'>['data']>(() => {
    const distribution = this.projectStatsResource.value()?.projectTypeDistribution ?? [];
    return {
      labels: distribution.map(d => d.projectType),
      datasets: [{
        data: distribution.map(d => d.percentage),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)'
        ],
        borderWidth: 0
      }]
    };
  });

  readonly polarAreaChartOptions: ChartConfiguration<'polarArea'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      },
      datalabels: {
        color: '#ffffff',
        font: {
          weight: 'normal',
          size: 11
        },
        formatter: (value, context) => {
          if (value === 0) return '';
          const label = context.chart.data.labels?.[context.dataIndex] || '';
          return label;
        },
        textAlign: 'center'
      }
    },
    scales: {
      r: {
        display: true,
        min: 0,
        max: 100,
        ticks: {
          display: false,
          stepSize: 100
        },
        grid: {
          display: true,
          color: ['rgba(209, 213, 219, 0.6)'],
          circular: true,
          lineWidth: 1.5
        },
        angleLines: {
          display: false
        },
        pointLabels: {
          display: false
        },
        beginAtZero: true
      }
    }
  };

  readonly barChartType = 'bar' as const;

  readonly barChartData = computed<ChartConfiguration<'bar'>['data']>(() => {
    const skills = this.projectStatsResource.value()?.topSkills ?? [];
    const top5 = skills.slice(0, 5);

    return {
      labels: top5.map(s => s.name),
      datasets: [{
        data: top5.map(s => s.projectCount),
        backgroundColor: top5.map(s => hexToRgba(SKILL_CATEGORY_META[s.category].color, 0.8)),
        borderWidth: 0,
        borderRadius: 8,
        barPercentage: 0.6
      }]
    };
  });

  readonly barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      },
      datalabels: {
        anchor: 'center',
        align: 'center',
        rotation: -90,
        color: '#ffffff',
        font: {
          weight: 'normal',
          size: 11
        },
        formatter: (value, context) => {
          if (value === 0) return '';
          return context.chart.data.labels?.[context.dataIndex] || '';
        }
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        display: false,
        beginAtZero: true
      }
    }
  };

  readonly pieChartType = 'pie' as const;

  readonly pieChartData = computed<ChartConfiguration<'pie'>['data']>(() => {
    const distribution = this.projectStatsResource.value()?.stackDistribution;
    if (!distribution) {
      return {
        labels: [],
        datasets: [{
          data: []
        }]
      };
    }

    const frontendColor = SKILL_CATEGORY_META[SkillCategory.FRONTEND].color;
    const backendColor = SKILL_CATEGORY_META[SkillCategory.BACKEND].color;

    return {
      labels: ['Fullstack', 'Frontend uniquement', 'Backend uniquement'],
      datasets: [{
        data: [distribution.fullStackPercentage, distribution.frontendOnlyPercentage, distribution.backendOnlyPercentage],
        backgroundColor: [
          'rgba(167, 139, 250, 0.6)',
          hexToRgba(frontendColor, 0.8),
          hexToRgba(backendColor, 0.8)
        ],
        borderWidth: 0
      }]
    };
  });

  readonly pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      },
      datalabels: {
        color: '#ffffff',
        font: {
          weight: 'normal',
          size: 12
        },
        formatter: (value, context) => {
          if (value === 0) return '';
          const label = context.chart.data.labels?.[context.dataIndex] || '';
          const text = label.toString();
          if (text === 'Fullstack') return 'Full\nstack';
          if (text === 'Frontend uniquement') return 'Frontend\nuniquement';
          if (text === 'Backend uniquement') return 'Backend\nuniquement';
          return text.split(' ');
        },
        textAlign: 'center'
      }
    }
  };

  navigateToProjects(): void {
    this.router.navigate(['/projets']);
  }
}
