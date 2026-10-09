import { createStore } from 'vuex'

export default createStore({
  state: {
    raw_file: [],    
    system_info: null,
    branch_name: null, 
    pso: null,         
    loan: null,        
    memb: null,         
    age: null,          
    br_svc: null,
    batchRecords: null,  // Store batch records for export
    member_info: null,
    alarm_info: null,
    beneficiaries_info: null,
    savings: [],
    loans: null,
    openedLedgers: {}
  },
  getters: {
    getRawFile(state) {
      return state.raw_file;
    },
    getSystemInfo(state) {
      return state.system_info;
    },
    getPSO(state) {
      return state.pso;
    },
    getLoanTypes(state) {
      return state.loan;
    },
    getMemberTypes(state) {
      return state.memb;
    },
    getAgeOptions(state) {
      return state.age;
    },
    getBranchesOfServices(state) {
      return state.br_svc;
    },
    getBatchRecords(state) {
      return state.batchRecords;
    },
  },
  mutations: {
    // Mutation to set the entire raw file data
    setRawFile(state, data) {
      state.raw_file = data;
    },
    // Mutation to append a chunk of data to the raw_file
    appendToRawFile(state, data) {
      if (Array.isArray(data)) {
        state.raw_file.push(...data); // Append chunk to raw_file
      } else {
        console.error('Data to append is not an array:', data);
      }
    },
    // Additional mutations can be added for other fields if necessary
    setSystemInfo(state, data) {
      state.system_info = data;
    },
    setPSO(state, data) {
      state.pso = data;
    },
    setLoanTypes(state, data) {
      state.loan = data;
    },
    setMemberTypes(state, data) {
      state.memb = data;
    },
    setAgeOptions(state, data) {
      state.age = data;
    },
    setBranchesOfServices(state, data) {
      state.br_svc = data;
    },
    setBatchRecords(state, data) {
      state.batchRecords = data;
    },
    setMemberInfo(state, data) {
      state.member_info = data;
    },
    setAlarmInfo(state, data) {
      state.alarm_info = data;
    },
    setBeneficiariesInfo(state, data) {
      state.beneficiaries_info = data;
    },
    setSavings(state, data) {
      state.savings = Array.isArray(data) ? data : [];
    },
    setLoans(state, data) {
      state.loans = data;
    },
  },
  actions: {
    // If you want to handle any async logic, use actions
    // Example:
    fetchRawFile({ commit }) {
      // Assume you fetch raw file from an API or service and then commit the mutation
      // This is just an example of how you might use actions
      fetch('/api/getRawFileData')
        .then(response => response.json())
        .then(data => {
          commit('setRawFile', data);
        })
        .catch(error => {
          console.error('Error fetching raw file data:', error);
        });
    },
  },
  modules: {
    // You can add Vuex modules if you need to modularize your store
  },
});
