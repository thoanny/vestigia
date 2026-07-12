import {
  IconBackpack,
  IconInbox,
  IconInfoCircle,
  IconMap,
  IconSettings,
  IconUser,
} from '@tabler/icons-vue';

class MenuService {
  private items = [
    {
      id: 'character',
      url: '/',
      icon: IconUser,
      title: 'Personnage',
      slots: ['header', 'dock'],
    },
    {
      id: 'inventory',
      url: '/inventory',
      icon: IconBackpack,
      title: 'Inventaire',
      slots: ['header', 'dock'],
    },
    {
      id: 'explore',
      url: '/explore',
      icon: IconMap,
      title: 'Exploration',
      slots: ['header', 'dock'],
    },
    {
      id: 'inbox',
      url: '/inbox',
      icon: IconInbox,
      title: 'Messagerie',
      slots: ['header', 'dock'],
    },
    {
      id: 'settings',
      url: '/settings',
      icon: IconSettings,
      title: 'Paramètres',
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
