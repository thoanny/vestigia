import {
  IconBackpack,
  IconBuildingStore,
  IconCertificate,
  IconHelp,
  IconInbox,
  IconInfoCircle,
  IconMap,
  IconSettings,
  IconStar,
  IconTrophy,
  IconUser,
  IconWalk,
} from '@tabler/icons-vue';

class MenuService {
  private items = [
    {
      id: 'character',
      url: '/',
      icon: IconUser,
      title: 'Personnage',
      slots: ['dock'],
    },
    {
      id: 'history',
      url: '/history',
      icon: IconWalk,
      title: 'Historique de pas',
      slots: ['header'],
    },
    {
      id: 'inventory',
      url: '/inventory',
      icon: IconBackpack,
      title: 'Inventaire',
      slots: ['header'],
    },
    {
      id: 'explore',
      url: '/explore',
      icon: IconMap,
      title: 'Exploration',
      slots: ['dock'],
    },
    {
      id: 'battlepass',
      url: '/battlepass',
      icon: IconStar,
      title: 'Battle pass',
      slots: ['header'],
    },
    {
      id: 'achievements',
      url: '/achievements',
      icon: IconCertificate,
      title: 'Accomplissements',
      slots: ['header'],
    },
    {
      id: 'inbox',
      url: '/inbox',
      icon: IconInbox,
      title: 'Messagerie',
      slots: ['dock'],
    },
    {
      id: 'shop',
      url: '/shop',
      icon: IconBuildingStore,
      title: 'Boutique',
      slots: ['dock'],
    },
    {
      id: 'leaderboard',
      url: '/leaderboard',
      icon: IconTrophy,
      title: 'Classement',
      slots: ['header'],
    },
    {
      id: 'settings',
      url: '/settings',
      icon: IconSettings,
      title: 'Paramètres',
      slots: ['header'],
    },
    {
      id: 'help',
      url: '/help',
      icon: IconHelp,
      title: 'Aide',
      slots: ['header'],
    },
    {
      id: 'about',
      url: '/about',
      icon: IconInfoCircle,
      title: 'À propos',
      slots: ['header'],
    },
  ];

  getMenuHeader = () => {
    return this.items.filter((item) => {
      return item.slots.indexOf('header') >= 0;
    });
  };

  getMenuFooter = () => {
    return this.items.filter((item) => {
      return item.slots.indexOf('dock') >= 0;
    });
  };
}

export const menuService = new MenuService();
