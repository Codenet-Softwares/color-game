class stringConst {
  constructor() {
    this.Admin = 'admin'; // Represents superAdmin
    this.subAdmin = 'subAdmin'; // Sub admin
    this.User = 'user'; // Regular user
    this.whiteLabel = 'whiteLabel';
    this.hyperAgent = 'hyperAgent';
    this.superAgent = 'superAgent';
    this.masterAgent = 'masterAgent';
  }
}

class apiPermissions  {
  constructor(){
    this.GAME_VIEW ='game-view',
    this.MARKET_VIEW = 'market-view',
    this.RUNNER_VIEW = 'runner-view',
    this.RESULT_ANNOUNCEMENT='result-declare'
  }
}


class statusPanelCode {
  constructor() {
    this.void = 400322;
    this.announcement = 40030;
    this.suspend = 400319;
   
  }
}

export const string = new stringConst();
export const subAdminPermissions= new apiPermissions()
export const statusPanelCodes = new statusPanelCode();

