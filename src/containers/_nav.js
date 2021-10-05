export default [
  {
    _name: 'CSidebarNav',
    _children: [
      {
        _name: 'CSidebarNavItem',
        name: 'Dashboard',
        to: '/dashboard',
        icon: 'cil-speedometer',
        badge: {
          color: 'primary',
          text: 'NEW'
        }
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['master']
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Users',
        to: '/users',
        icon: 'cil-drop'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Transactions',
        to: '/transactions',
        icon: 'cil-drop'
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['Transactions']
      },
      // {
      //   _name: 'CSidebarNavDropdown',
      //   name: 'Buttons',
      //   route: '/buttons',
      //   icon: 'cil-cursor',
      //   items: [
      //     {
      //       name: 'Buttons',
      //       to: '/buttons/standard-buttons'
      //     },
      //     {
      //       name: 'Button Dropdowns',
      //       to: '/buttons/dropdowns'
      //     },
      //     {
      //       name: 'Button Groups',
      //       to: '/buttons/button-groups'
      //     },
      //     {
      //       name: 'Brand Buttons',
      //       to: '/buttons/brand-buttons'
      //     }
      //   ]
      // },
      {
        _name: 'CSidebarNavItem',
        name: 'New Transaction',
        to: '/transactions/new-transaction',
        icon: 'cil-cursor'
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['Report']
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Transaction Report',
        to: '/report/transaction',
        icon: 'cil-pencil'
      }
    ]
  }
]