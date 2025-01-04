import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Profile from '../views/Profile.vue';
import ReactionGame from '../views/games/ReactionGame.vue';
import BubblePop from '../views/games/BubblePop.vue';
import MemoryCards from '../views/games/MemoryCards.vue';
import ColorMatch from '../views/games/ColorMatch.vue';

const router = createRouter({
  history: createWebHistory('/funny_games/'),
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/profile',
      component: Profile
    },
    {
      path: '/games/reaction',
      component: ReactionGame
    },
    {
      path: '/games/bubble-pop',
      component: BubblePop
    },
    {
      path: '/games/memory-cards',
      component: MemoryCards
    },
    {
      path: '/games/color-match',
      component: ColorMatch
    }
  ]
});

export default router;