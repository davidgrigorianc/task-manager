const state = () => ({
  users: [
    { name: 'Armen', lastname: 'Gasparyan', id: 1 },
    { name: 'James', lastname: 'Bond', id: 2 },
    { name: 'David', lastname: 'Beckham', id: 3 },
    { name: 'Ashot', lastname: 'Vardanyan', id: 4 },
    { name: 'Donald', lastname: 'Duck', id: 5 },
    { name: 'Henrikh', lastname: 'Mkhitaryan', id: 6 },
  ],
})

const getters = {
  users: (state) => state.users,
}

export default {
  namespaced: true,
  state,
  getters,
}
