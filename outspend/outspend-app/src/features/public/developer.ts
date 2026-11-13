import type { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

type IconName = ComponentProps<typeof Ionicons>['name'];

export interface DeveloperLink {
  label: string;
  url: string;
  icon: IconName;
}

export const developer = {
  name: 'Koushik Saha',
  title: 'Full-stack developer',
  bio: 'I built OutSpend end to end: a Spring Boot REST API with JWT authentication and this React Native app. Replace this text with a sentence or two about you.',
  links: [
    { label: 'GitHub', url: 'https://github.com/thekoushiksaha', icon: 'logo-github' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/thekoushiksaha', icon: 'logo-linkedin' },
    { label: 'Email', url: 'mailto:thekoushiksaha@zohomail.in', icon: 'mail-outline' },
    { label: 'Portfolio', url: 'https://koushiksaha.netlify.app', icon: 'globe-outline' },
  ] as DeveloperLink[],
  stack: [
    'Java 25',
    'Spring Boot 4',
    'Spring Security + JWT',
    'PostgreSQL',
    'Flyway',
    'React Native',
    'Expo',
    'TypeScript',
  ],
};
